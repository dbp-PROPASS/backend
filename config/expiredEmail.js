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

const sendExpirationEmail = async (email, name, certificateName, expirationDate) => {
  const mailOptions = {
    from: NODEMAILER_USER,
    to: email,
    subject: "[PROPASS] 자격증 만료 예정 알림", 
    html: `
      <h1>안녕하세요, ${name}님</h1>
      <p>귀하의 ${certificateName} 자격증이 ${expirationDate}일에 만료됩니다.</p>
      <p>만료 일정을 확인하고 자격증 갱신을 고려해 주세요.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`${email}에게 자격증 만료 알림 전송 완료`);
  } catch (error) {
    console.error("이메일 전송 에러:", error);
    throw new Error("Failed to send expiration email");
  }
};

module.exports = sendExpirationEmail;
