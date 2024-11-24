const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

class ScheduleDAO {
  static async loadScheduleData(email) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);

      // 1. 이메일로 사용자 ID 조회
      const userQuery = `
        SELECT MEM_ID
        FROM MEMBER
        WHERE TRIM(EMAIL) = TRIM(:email)
      `;
      const userResult = await connection.execute(userQuery, [email]);
      console.log("Received Email:", email);

      const [memId] = userResult.rows[0];
      const trimmedMemId = memId.trim();
      console.log("Received memId:", trimmedMemId)
      if (!trimmedMemId) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // 2. 사용자 ID로 OWNCERTIFICATE 데이터 조회
      const certQuery = `
        SELECT ACQISITION_DATE, CERT_ID
        FROM OWNCERTIFICATE
        WHERE TRIM(MEM_ID) = TRIM(:memId)
      `;
      const certResult = await connection.execute(certQuery, [trimmedMemId]);

      const schedules = [];

      for (const cert of certResult.rows) {
        const [ACQISITION_DATE, CERT_ID] = cert;
        const trimmedCERT_ID = CERT_ID.trim();
        
        console.log("Received CERT_ID:", trimmedCERT_ID);
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
