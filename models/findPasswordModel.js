const { getConnection } = require('../config/dbConfig');

class MemberDAO {
  // 이름, 이메일, 전화번호로 사용자 정보 조회
  static async getPassword(name, email, phone) {
    let connection;
    try {
      connection = await getConnection(); // DB 연결

      const query = `
        SELECT NAME, PASSWORD
        FROM MEMBER
        WHERE TRIM(NAME) = TRIM(:name)
          AND TRIM(EMAIL) = TRIM(:email)
          AND TRIM(PHONE) = TRIM(:phone)
      `;

      const result = await connection.execute(query, { name, email, phone });
      return result.rows; // 결과 반환
    } catch (err) {
      console.error('DB Error:', err);
      throw err;
    } finally {
      if (connection) {
        await connection.close(); // 연결 종료
      }
    }
  }
}

module.exports = MemberDAO;
