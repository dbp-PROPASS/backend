const { getConnection } = require('../config/dbConfig');

async function getCertificateByName(certName) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT *
              FROM CERTIFICATEINFO ci
              JOIN EXAMSCHEDULE es
              ON ci.CERT_ID = es.CERT_ID 
              WHERE TRIM(CERT_NAME) = TRIM(:certName)`,
            [certName]
        );
        return result;
    } catch (err) {
      throw new Error('DB 쿼리 실행 실패:', err);
    } finally {
      if (connection) {
        try {
          await connection.close();  // DB 연결 닫기
        } catch (err) {
          console.error('DB 연결 종료 오류:', err);
        }
      }
    }
}

module.exports = { getCertificateByName };
