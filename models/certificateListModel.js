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
      `
      SELECT *
      FROM (
        SELECT 
          ci.CERT_NAME, 
          ci.CERT_ID, 
          ci.CERT_ORG,     
          ci.CATEGORY, 
          ci.PRACTICAL_PASS_RATE,
          ci.WRITTEN_PASS_RATE ,    
          ci.PRACTICAL_FEE, 
          ci.WRITTEN_FEE,
          es.ROUND_ID, 
          es.EXAM_TYPE,
          es.RECEPTION_START_DATE, 
          es.RECEPTION_FINISH_DATE, 
          es.RESULT_DATE, 
          es.EXAM_START_DATE,
          es.EXAM_END_DATE,
          ROW_NUMBER() OVER (PARTITION BY ci.CERT_ID ORDER BY TO_NUMBER(TRIM(es.ROUND_ID)) DESC) AS rn
        FROM CERTIFICATEINFO ci
        JOIN EXAMSCHEDULE es
          ON ci.CERT_ID = es.CERT_ID   
        )
        WHERE rn = 1
        ORDER BY CERT_NAME
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
