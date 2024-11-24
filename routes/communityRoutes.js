const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig'); // DB 설정 파일 경로

const router = express.Router();

// 게시글 조회 API
router.get('/posts', async (req, res) => {
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
    connection = await oracledb.getConnection(dbConfig);

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
});

module.exports = router;
