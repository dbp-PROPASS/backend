const { getConnection } = require('../config/dbConfig'); 

class ExpiredCertificateDAO {
  static async getExpiringCertificates() {
    let connection;
    try {
      connection = await getConnection(); // DB 연결

      const today = new Date();
      console.log(`${today}: 오늘날짜`);

      const expirationDate = new Date(today);
      expirationDate.setDate(today.getDate() + 7); 
      
      expirationDate.setHours(expirationDate.getHours() + 9); 
      console.log(`${expirationDate.toISOString().split('T')[0]}일에 자격증 만료`);

      // 날짜 비교 쿼리
      const query = `
        SELECT c.EMAIL, c.NAME, o.C_CERT_NAME, o.ACQISITION_DATE
        FROM OWNCERTIFICATE o
        JOIN MEMBER c ON o.mem_id = c.mem_id
        WHERE TO_DATE(o.ACQISITION_DATE, 'YYYY/MM/DD') = TO_DATE(:expirationDate, 'YYYY/MM/DD')
        AND c.NOTIFICATION = 'Y'
      `;

      const result = await connection.execute(query, {
        expirationDate: expirationDate.toISOString().split('T')[0],
      });

      return result.rows; 
    } catch (err) {
      console.error("DB 조회 에러:", err);
      throw err;
    } finally {
      if (connection) {
        await connection.close(); 
      }
    }
  }
}

module.exports = ExpiredCertificateDAO;