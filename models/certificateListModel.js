// models/certificateModel.js
const { getConnection } = require('../config/dbConfig');

async function getCertificates() {
  let connection;
  try {
    connection = await getConnection();  // DB 연결 풀에서 연결 가져오기
    const result = await connection.execute(
      `SELECT *
       FROM CERTIFICATEINFO ci
       JOIN EXAMSCHEDULE es
       ON ci.CERT_ID = es.CERT_ID`
    );
    return result;  // 쿼리 결과 반환
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

module.exports = { getCertificates };
