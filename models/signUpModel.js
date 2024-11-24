const {getConnection} = require('../config/dbConfig');

// 회원 데이터를 DB에 삽입
const insertMember = async (memberData) => {
  const { name, nickname, email, password, age_group, phone, interests, notification } = memberData;
  const query = `
    INSERT INTO MEMBER (MEM_ID, NAME, NICKNAME, EMAIL, PASSWORD, AGE_GROUP, PHONE, INTERESTS, NOTIFICATION)
    VALUES (MEMBER_SEQ.NEXTVAL, :name, :nickname, :email, :password, :age_group, :phone, :interests, :notification)
  `;
  const binds = {
    name,
    nickname,
    email,
    password,
    age_group,
    phone,
    interests,
    notification: notification || 'N' // 기본값 N
  };

  let connection;

  try {
    connection = await getConnection();
    console.log('DB Connection successful');
    await connection.execute(query, binds, { autoCommit: true });
    console.log('Insert query executed successfully');
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Database insertion failed: ' + err.message);  // 오류 메시지를 더 상세하게 출력
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

module.exports = { insertMember };
