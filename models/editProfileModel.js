const { getConnection } = require('../config/dbConfig'); // DB 연결 가져오기

exports.getUserByEmail = async (email) => {
  let connection;
  try {
    connection = await getConnection(); // DB 연결
    const query = `
      SELECT 
        TRIM(NAME) AS NAME,
        TRIM(PASSWORD) AS PASSWORD,
        TRIM(EMAIL) AS EMAIL,
        TRIM(PHONE) AS PHONE,
        TRIM(AGE_GROUP) AS AGE_GROUP,
        TRIM(INTERESTS) AS INTERESTS,
        TRIM(NOTIFICATION) AS NOTIFICATION
      FROM MEMBER
      WHERE TRIM(EMAIL) = TRIM(:email)
    `;
    const result = await connection.execute(query, [email.trim()]);

    return result.rows;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw new Error('DB 조회 실패');
  } finally {
    if (connection) {
      await connection.close(); // 연결 해제
    }
  }
};

exports.userUpdate = async (email, userData) => {
  let connection;
  try {
    connection = await getConnection(); // DB 연결

    const query = `
      UPDATE MEMBER
      SET 
        NAME = TRIM(:name),
        PASSWORD = TRIM(:password),
        PHONE = TRIM(:phone),
        AGE_GROUP = TRIM(:age_group),
        INTERESTS = TRIM(:interests),
        NOTIFICATION = TRIM(:notification)
      WHERE TRIM(EMAIL) = TRIM(:email)
    `;

    const binds = {
      name: userData.name ? userData.name.trim() : null,
      password: userData.password ? userData.password.trim() : null,
      phone: userData.phone ? userData.phone.trim() : null,
      age_group: userData.age_group ? userData.age_group.trim() : null,
      interests: userData.interests ? userData.interests.trim() : null,
      notification: userData.notification? userData.notification.trim() : 'N',
      email: email.trim(),
    };

    const result = await connection.execute(query, binds, { autoCommit: true }); // 실행 및 커밋

    return result.rowsAffected; // 수정된 행 수 반환
  } catch (error) {
    console.error('회원 정보 수정 실패:', error);
    throw new Error('DB 수정 실패');
  } finally {
    if (connection) {
      await connection.close(); // 연결 해제
    }
  }
};

