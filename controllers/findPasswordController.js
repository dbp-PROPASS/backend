const MemberDAO = require('../models/findPasswordModel'); // 모델 불러오기

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

    return res.json({
      success: true,
      message: `${trimmedName}님의 비밀번호: ${trimmedPassword}`,
    });
  } catch (err) {
    console.error('Find Password Error:', err);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

module.exports = { findPassword };
