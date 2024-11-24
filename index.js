const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', loginRoutes);  // 로그인 관련 API
app.use('/api/account', deleteUserRoutes);  // 회원탈퇴 관련 API
app.use('/api', signUpRoutes);  // 회원가입 관련 API
app.use('/api/schedule', scheduleRoutes);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중...`);
});