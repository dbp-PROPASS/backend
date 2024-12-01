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

// 렌덤 code 생성하는 함수
const generateRandomNumber = (n) => {
  let code = "";
  for (let i = 0; i < n; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

const sendEmail = async (email) => {
  const code = generateRandomNumber(6); // 6자리 인증 코드 생성
  const mailOptions = {
    from: NODEMAILER_USER,
    to: email,
    subject: "[PROPASS] 회원가입 인증 코드", // 메일 제목
    html: `
    <h1>본 메일은 [PROPASS] 이메일 인증을 위해 발송된 메일입니다.</h1><br>
    <p>아래의 인증 코드를 입력해주세요.</p>
    <p>가입을 환영합니다. :)</p><br>
    <p><strong>인증 코드: ${code}</strong></p>
    `, // 메일 내용
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    return code; // 생성한 인증 코드를 반환
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmail };