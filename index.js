const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRoutes = require('./routes/loginRoutes');  // 로그인 라우터
const deleteUserRoutes = require('./routes/deleteUserRoutes');  // 회원탈퇴 라우터

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', loginRoutes);  // 로그인 관련 API
app.use('/api/account', deleteUserRoutes);  // 회원탈퇴 관련 API

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중...`);
});