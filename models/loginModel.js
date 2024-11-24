const { getConnection } = require('../config/dbConfig');

class MemberDAO {
  // 이메일로 사용자 정보 조회
  static async getUserByEmail(email) {
    let connection;
    try {
    connection = await getConnection();  // DB 연결 풀에서 연결 가져오기

      const query = `
        SELECT NAME, PASSWORD 
        FROM MEMBER 
        WHERE TRIM(EMAIL) = TRIM(:email)
      `;

      const result = await connection.execute(query, { email });

      return result.rows; // 결과를 반환 (컨트롤러에서 처리)
    } catch (err) {
      console.error('DB Error:', err);
      throw err; // 오류는 호출한 컨트롤러에서 처리
    } finally {
      if (connection) {
        await connection.close(); // DB 연결 종료
      }
    }
  }
}

module.exports = MemberDAO;
