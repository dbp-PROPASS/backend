require('./cronJob');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const loginRoutes = require('./routes/loginRoutes');  
const deleteUserRoutes = require('./routes/deleteUserRoutes');
const signUpRoutes = require('./routes/signUpRoutes');
const AddPostsRoutes = require('./routes/AddPostsRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const communityRoutes = require('./routes/communityRoutes');
const certificateListRouter = require('./routes/certificateListRoutes');
const certificateInfoRoutes = require('./routes/certificateInfoRoutes');
const findPasswordRoutes = require('./routes/findPasswordRoutes');
const editProfileRoutes = require('./routes/editProfileRoutes'); 
const bookmarkRoutes = require('./routes/bookMarkRoutes');
const emailRoutes = require('./routes/emailVertificationRoutes');
const ownCertificateRoutes = require('./routes/ownCertificateRoutes');
const certRecoRoutes = require("./routes/certRecoRoutes"); // 자격증 추천

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
app.use('/api', AddPostsRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api', communityRoutes); // Community API 추가
app.use('/api/certificate', certificateListRouter);
app.use('/api/certificate', certificateInfoRoutes);
app.use('/api/password', findPasswordRoutes);
app.use('/api/users', editProfileRoutes);
app.use('/api/bookmark', bookmarkRoutes);
app.use('/api/email', emailRoutes);
app.use('/api', ownCertificateRoutes);
app.use("/api", certRecoRoutes); // 자격증 추천

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중...`);
});
