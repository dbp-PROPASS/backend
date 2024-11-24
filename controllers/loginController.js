const MemberDAO = require('../models/loginModel'); // 모델 불러오기

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 모델에서 사용자 정보 가져오기
    const user = await MemberDAO.getUserByEmail(email);

    // 사용자 정보가 없으면 에러 응답
    if (user.length === 0) {
      return res.json({ success: false, message: '등록되지 않은 이메일입니다.' });
    }

    // DB 쿼리 결과에서 이름(name)과 비밀번호(dbPassword) 값을 각각 변수에 할당
    const [name, dbPassword] = user[0];
    const trimmedName = name.trim();
    const trimmedPassword = dbPassword.trim();

    // 비밀번호 비교
    if (password === trimmedPassword) {
      return res.json({ success: true, message: `${trimmedName}님 반갑습니다.` });
    } else {
      return res.json({ success: false, message: '비밀번호가 잘못되었습니다.' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

module.exports = { login };
