const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const loginRoutes = require('./routes/loginRoutes');  
const deleteUserRoutes = require('./routes/deleteUserRoutes');
const signUpRoutes = require('./routes/signUpRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const communityRoutes = require('./routes/communityRoutes'); // 추가된 라우터

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
app.use('/api/auth', loginRoutes); // 로그인 관련 API
app.use('/api/account', deleteUserRoutes);  // 회원탈퇴 관련 API
app.use('/api', signUpRoutes);  // 회원가입 관련 API
app.use('/api', scheduleRoutes);
app.use('/api', communityRoutes); // Community API 추가

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중...`);
});
