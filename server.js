const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const dbConfig = require('./dbConfig');

const app = express();
app.use(cors()); // React와 Node 간 CORS 문제 해결
app.use(express.json());

// API: 분야별 데이터 조회
app.get('/api/posts', async (req, res) => {
  const { category } = req.query; // React에서 보낸 category 파라미터

  const categoryToComId = {
    it: '2',
    english: '3',
    finance: '4',
  };
  const comId = categoryToComId[category]; // category에 해당하는 COM_ID 매핑

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
      WHERE p.COM_ID = :comId
      ORDER BY p.POST_ID DESC
    `;

    const result = await connection.execute(query, { comId });

    // 데이터를 프론트엔드에 반환
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

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
