const { getConnection } = require('../config/dbConfig'); // DB 설정 파일 경로

class ScheduleDAO {
  static async loadSchedule(email) {
    let connection;
    try {
      connection = await getConnection();

      const memId = await ScheduleDAO.getMemberIdByEmail(email, connection);
      if (!memId) throw new Error('사용자를 찾을 수 없습니다.');

      const ownSchedules = await ScheduleDAO.loadOwnCertifi(memId, connection);
      const interestSchedules = await ScheduleDAO.loadInterestCertifi(memId, connection);

      return [...ownSchedules, ...interestSchedules];
    } catch (err) {
      console.error('DB 오류:', err.message);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  static async getMemberIdByEmail(email, connection) {
    const query = `
      SELECT MEM_ID
      FROM MEMBER
      WHERE TRIM(EMAIL) = TRIM(:email)
    `;
    const result = await connection.execute(query, [email]);
    return result.rows.length ? result.rows[0][0].trim() : null;
  }

  static async loadOwnCertifi(memId, connection) {
    const certQuery = `
      SELECT ACQISITION_DATE, C_CERT_NAME
      FROM OWNCERTIFICATE
      WHERE TRIM(MEM_ID) = TRIM(:memId)
    `;
    const certResult = await connection.execute(certQuery, [memId]);
  
    if (!certResult.rows.length) {
      console.log('보유 자격증이 없습니다.');
      return [];
    }
  
    const schedules = certResult.rows.map(([acquisitionDate, certName]) => ({
      certName: certName?.trim() || '알 수 없는 자격증',
      date: acquisitionDate?.trim(),
      type: 'expired',
    }));
  
    return schedules;
  }
  

  static async loadInterestCertifi(memId, connection) {
    const roundQuery = `
      SELECT ROUND_ID
      FROM INTERESTCERT
      WHERE TRIM(MEM_ID) = TRIM(:memId)
    `;
    const roundResult = await connection.execute(roundQuery, [memId]);
  
    if (!roundResult.rows.length) {
      console.log('관심 자격증이 없습니다.');
      return [];
    }
  
    const roundIds = roundResult.rows.map(row => row[0]?.trim());
    if (!roundIds.length) return [];
  
    const examQuery = `
      SELECT ROUND_ID, RECEPTION_START_DATE, RECEPTION_FINISH_DATE, RESULT_DATE, EXAM_START_DATE, EXAM_END_DATE, CERT_ID, EXAM_TYPE
      FROM EXAMSCHEDULE
      WHERE TRIM(ROUND_ID) IN (${roundIds.map((_, index) => `:roundId${index}`).join(', ')})
    `;
    const examResult = await connection.execute(
      examQuery,
      roundIds.reduce((acc, id, index) => ({ ...acc, [`roundId${index}`]: id }), {})
    );
  
    if (!examResult.rows.length) {
      console.log('해당 회차 시험 스케줄이 없습니다.');
      return [];
    }
  
    const certIds = examResult.rows.map(row => row[6]?.trim());
    const certNameMap = await ScheduleDAO.getCertificateNames(certIds, connection);
  
    const schedules = [];
    examResult.rows.forEach(row => {
      const [roundId, startDate, finishDate, resultDate, examStartDate, examEndDate, certId, examType] = row;
      const certNameBase = certNameMap.get(certId?.trim()) || '알 수 없는 자격증';
      const certName = `${roundId?.trim().slice(-4) || '알 수 없는 회차'}회 ${certNameBase}`;
  
      if (examType === '필기') {
        schedules.push({ certName, date: startDate?.trim(), type: 'writtenReceiveStart' });
        schedules.push({ certName, date: finishDate?.trim(), type: 'writtenReceiveEnd' });
        schedules.push({ certName, date: resultDate?.trim(), type: 'writtenResults' });
        schedules.push({ certName, date: examStartDate?.trim(), type: 'writtenExamStart' });
        schedules.push({ certName, date: examEndDate?.trim(), type: 'writtenExamEnd' });
      } else if (examType === '실기') {
        schedules.push({ certName, date: startDate?.trim(), type: 'practicalReceiveStart' });
        schedules.push({ certName, date: finishDate?.trim(), type: 'practicalReceiveEnd' });
        schedules.push({ certName, date: resultDate?.trim(), type: 'practicalResults' });
        schedules.push({ certName, date: examStartDate?.trim(), type: 'practicalExamStart' });
        schedules.push({ certName, date: examEndDate?.trim(), type: 'practicalExamEnd' });
      } else {
        console.warn(`알 수 없는 시험 타입: ${examType}`);
      }
    });

    return schedules;
  }

  static async getCertificateNames(certIds, connection) {
    if (!certIds.length) return new Map();

    const certQuery = `
      SELECT CERT_ID, CERT_NAME
      FROM CERTIFICATEINFO
      WHERE TRIM(CERT_ID) IN (${certIds.map((_, index) => `:certId${index}`).join(', ')})
    `;
    const certResult = await connection.execute(
      certQuery,
      certIds.reduce((acc, id, index) => ({ ...acc, [`certId${index}`]: id }), {})
    );

    const certNameMap = new Map();
    certResult.rows.forEach(([certId, certName]) => {
      certNameMap.set(certId?.trim(), certName?.trim());
    });

    return certNameMap;
  }
}

module.exports = ScheduleDAO;
