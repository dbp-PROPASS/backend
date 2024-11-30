// communityController.js
const oracledb = require('oracledb');
const {getConnection} = require('../config/dbConfig'); // DB 설정 파일 경로

const community = async (req, res) => {
  const { category } = req.query;

  const categoryToComId = {
    it: '2',
    english: '3',
    finance: '4',
    tech: '5',
    medical: '6',
    edu: '7',
    design: '8',
    food: '9',
    architect: '10',
    national: '11',
  };
  const comId = String(categoryToComId[category]); // 명시적으로 문자열 변환  

  if (!comId) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  let connection;

  try {
    connection = await getConnection();

    const query = `
      SELECT p.POST_ID, p.POST_TITLE, p.POST_CONTENT, u.NICKNAME
      FROM COMMUNITYPOST p
      JOIN COMMUNITY c ON p.COM_ID = c.COM_ID
      JOIN MEMBER u ON p.MEM_ID = u.MEM_ID
      WHERE TRIM(p.COM_ID) = :comId
      ORDER BY p.POST_TITLE DESC
    `;
    const result = await connection.execute(query, { comId: String(comId) });

    res.json(
      result.rows.map((row) => ({
        postId: row[0],
        title: row[1],
        content: row[2],
        author: row[3], // NICKNAME을 author로 설정
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



module.exports = {community};