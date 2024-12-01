const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { NODEMAILER_USER, NODEMAILER_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: "naver",
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
});

const sendPasswordEmail = async (email, name, password) => {
  const mailOptions = {
    from: NODEMAILER_USER,
    to: email,
    subject: "[PROPASS] 비밀번호 찾기 결과", // 메일 제목
    html: `
    <h1>안녕하세요, ${name}님</h1><br>
    <p>요청하신 비밀번호는 다음과 같습니다</p><br>
    <h3><p><strong>${password}</strong></p></h3><br>
    <p>본 이메일은 자동으로 발송된 메일입니다.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`${email}에게 비밀번호 전송`);
  } catch (error) {
    console.error("이메일 전송 에러:", error);
    throw new Error("Failed to send password email");
  }
};

module.exports = sendPasswordEmail;
