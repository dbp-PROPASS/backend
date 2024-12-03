const { getConnection } = require('../config/dbConfig');

// 게시글 데이터를 DB에 삽입
const insertPost = async (postData) => {
  const { title, content, author, comId } = postData;

  const insertPostQuery = `
    INSERT INTO COMMUNITYPOST (POST_ID, POST_TITLE, POST_CONTENT, MEM_ID, COM_ID)
    VALUES (POSTING_SEQ.NEXTVAL, :title, :content, 
      (SELECT MEM_ID FROM MEMBER WHERE TRIM(EMAIL) = TRIM(:author)), :comId)
  `;

  let connection;

  try {
    connection = await getConnection();
    console.log('DB Connection successful');

    // 게시글 데이터 삽입 (author로 MEM_ID를 찾고 바로 삽입)
    const binds = {
      title, // 클라이언트에서 받은 title
      content, // 클라이언트에서 받은 content
      author, // 클라이언트에서 받은 author (이메일)
      comId // 클라이언트에서 받은 comId
    };

    await connection.execute(insertPostQuery, binds, { autoCommit: true });
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