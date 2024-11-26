const oracledb = require('oracledb');
const {getConnection} = require('../config/dbConfig'); // DB 설정 파일 경로

const community = async (req, res) => {
  const { category } = req.query;

  const categoryToComId = {
    it: '2',
    english: '3',
    finance: '4',
  };
  const comId = String(categoryToComId[category]); // 명시적으로 문자열 변환  

  if (!comId) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  let connection;

  try {
    connection = await getConnection();

    const query = `
      SELECT p.POST_ID, p.POST_TITLE, p.POST_CONTENT, p.MEM_ID
      FROM COMMUNITYPOST p
      JOIN COMMUNITY c ON p.COM_ID = c.COM_ID
      WHERE TRIM(p.COM_ID) = :comId
      ORDER BY p.POST_ID DESC
    `;
    const result = await connection.execute(query, { comId: String(comId) });

    res.json(
      result.rows.map((row) => ({
        postId: row[0],
        title: row[1],
        content: row[2],
        author: row[3], // MEM_ID를 author로 매핑
      }))
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};


// 게시글 작성 함수

const createPost = async (req, res) => {
  const { title, content, author, category } = req.body;

  const categoryToComId = {
    it: '2',
    english: '3',
    finance: '4',
  };
  const comId = String(categoryToComId[category]); // 카테고리를 COM_ID로 매핑

  if (!title || !content || !author || !comId) {
    console.error('Invalid request data:', { title, content, author, category });
    return res.status(400).json({ error: 'All fields are required' });
  }

  let connection;

  try {
    connection = await getConnection();

    const query = `
      INSERT INTO COMMUNITYPOST (POST_ID, POST_TITLE, POST_CONTENT, MEM_ID, COM_ID, CREATED_AT)
      VALUES (COMMUNITYPOST_SEQ.NEXTVAL, :title, :content, :author, :comId, SYSDATE)
    `;
    console.log('Executing query with:', { title, content, author, comId });

    await connection.execute(query, { title, content, author, comId });
    await connection.commit(); // 수동 커밋

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};


module.exports = {community, createPost};
