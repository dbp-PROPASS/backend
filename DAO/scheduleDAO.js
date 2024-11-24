const oracledb = require('oracledb');

class ScheduleDAO {
  static async loadScheduleData(email) {
    let connection;
    try {
      connection = await oracledb.getConnection();

      // 1. 이메일로 사용자 ID 조회
      const userQuery = `
        SELECT MEM_ID FROM MEMBER
        WHERE EMAIL = :email
      `;
      const userResult = await connection.execute(userQuery, [email]);
      const memId = userResult.rows[0]?.MEM_ID;
      if (!memId) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // 2. 사용자 ID로 OWNCERTIFICATE 데이터 조회
      const certQuery = `
        SELECT ACQISITION_DATE, CERT_ID
        FROM OWNCERTIFICATE
        WHERE MEM_ID = :memId
      `;
      const certResult = await connection.execute(certQuery, [memId]);

      const schedules = [];
      for (const cert of certResult.rows) {
        const { CERT_ID } = cert;

        // 3. CERT_ID로 CERT_NAME 데이터 조회
        const nameQuery = `
          SELECT CERT_NAME
          FROM CERTIFICATEINFO  
          WHERE CERT_ID = :certId
        `;
        const nameResult = await connection.execute(nameQuery, [CERT_ID]);
        const certName = nameResult.rows[0]?.CERT_NAME;

        for (const exam of examResult.rows) {
          schedules.push({
            certName: CERT_NAME,
            date: exam.EXAM_DATE,
            type: '만료일',
          });
        }
      }

      return schedules; // 필요한 형식으로 반환
    } catch (err) {
      console.error('DB 오류:', err.message);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}

module.exports = ScheduleDAO;
