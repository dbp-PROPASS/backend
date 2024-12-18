const MemberDAO = require('../models/findPasswordModel'); // 모델 불러오기
const sendPasswordEmail = require('../config/passwordEmail');

const findPassword = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    // DB에서 사용자 조회
    const user = await MemberDAO.getPassword(name, email, phone);

    if (user.length === 0) {
      return res.json({ success: false, message: '일치하는 사용자가 없습니다.' });
    }

    // 비밀번호 반환
    const [fetchedName, fetchedPassword] = user[0];
    const trimmedName = fetchedName.trim();
    const trimmedPassword = fetchedPassword.trim();

    try {
      await sendPasswordEmail(email, trimmedName, trimmedPassword); // 이메일 전송
      return res.json({
        success: true,
        message: '비밀번호가 이메일로 전송되었습니다.',
      });
    } catch (emailError) {
      console.error('Email Error:', emailError);
      return res.status(500).json({
        success: false,
        message: '이메일 전송에 실패했습니다. 다시 시도해주세요.',
      });
    }
  } catch (err) {
    console.error('비밀번호 찾기 오류:', err);
    return res.status(500).json({ success: false, message: '비밀번호를 찾던 도중 서버 오류가 발생했습니다.' });
  }
};

module.exports = { findPassword };