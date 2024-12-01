const { getConnection } = require('../config/dbConfig');

exports.deleteUserModel = async (email) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `DELETE FROM MEMBER WHERE TRIM(EMAIL) = TRIM(:email)`;
    const result = await connection.execute(query, [email], { autoCommit: true });

    return result.rowsAffected > 0; // 삭제된 행이 있으면 true 반환
  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};
