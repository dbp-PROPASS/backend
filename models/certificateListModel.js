// models/certificateModel.js
const { getConnection } = require('../config/dbConfig');

async function getCertificates() {
  let connection;
  try {
    connection = await getConnection();  
    if (!connection) {
      throw new Error('Failed to establish DB connection');
    }
    const result = await connection.execute(
      `SELECT *
        FROM CERTIFICATEINFO ci
        JOIN EXAMSCHEDULE es
          ON ci.CERT_ID = es.CERT_ID
        WHERE TO_NUMBER(TRIM(es.ROUND_ID)) = (
          SELECT MAX(TO_NUMBER(TRIM(es2.ROUND_ID)))
            FROM EXAMSCHEDULE es2
            WHERE es2.CERT_ID = ci.CERT_ID
        )
        ORDER BY ci.CERT_NAME
      `
    );
    return result;
  } catch (err) {
    console.error('DB 쿼리 실행 실패:', err);
    throw new Error('DB 쿼리 실행 실패:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('DB 연결 종료 오류:', err);
      }
    }
  }
}

module.exports = { getCertificates };
