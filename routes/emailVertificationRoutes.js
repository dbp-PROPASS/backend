const express = require("express");
const { sendEmail } = require("../config/email");

const router = express.Router();

let verificationCode = null; // 임시 저장소

// 이메일 인증 코드 발송 API
router.post("/send-code", async (req, res) => {
  const { email } = req.body;

  try {
    verificationCode = await sendEmail(email);
    res.status(200).json({ message: "인증 코드가 이메일로 발송되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "이메일 발송에 실패했습니다.", error });
  }
});

// 인증 코드 검증 API
router.post("/verify-code", (req, res) => {
  const { code } = req.body;

  if (code === verificationCode) {
    verificationCode = null; // 인증 후 코드 초기화
    res.status(200).json({ message: "인증 성공!" });
  } else {
    res.status(400).json({ message: "인증코드가 일치하지 않습니다." });
  }
});

module.exports = router;
