const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const oracledb = require('oracledb');
const dbConfig = require('./config/dbConfig');
const loginRoutes = require('./routes/loginRoutes');  // 로그인 라우터
const deleteUserRoutes = require('./routes/deleteUserRoutes');  // 회원탈퇴 라우터
const signUpRoutes = require('./routes/signUpRoutes');  // 회원가입 라우터
const scheduleRoutes = require('./routes/scheduleRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 URL
  credentials: true // 쿠키와 자격 증명 정보를 허용
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우터 설정
app.use('/api/auth', loginRoutes);  // 로그인 관련 API
app.use('/api/account', deleteUserRoutes);  // 회원탈퇴 관련 API
app.use('/api', signUpRoutes);  // 회원가입 관련 API
app.use('/api', scheduleRoutes);

// Community Oracle DB 연결 API 추가
app.get('/api/posts', async (req, res) => {
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

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중...`);
});
