// AddPostsModel.js
const { getConnection } = require('../config/dbConfig');

// 게시글 데이터를 DB에 삽입
const insertPost = async (postData) => { // 함수명 수정
  const { title, content, author, comId } = postData;
  const query = `
    INSERT INTO COMMUNITYPOST (POST_ID, POST_TITLE, POST_CONTENT, MEM_ID, COM_ID)
    VALUES (COMMUNITYPOST_SEQ.NEXTVAL, :title, :content, :author, :comId)
  `;
  const binds = {
    title, 
    content, 
    author, 
    comId
  };

  let connection;

  try {
    connection = await getConnection();
    console.log('DB Connection successful');
    await connection.execute(query, binds, { autoCommit: true });
    console.log('Insert query executed successfully');
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Database insertion failed: ' + err.message); // 오류 메시지 상세화
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

module.exports = { insertPost };
