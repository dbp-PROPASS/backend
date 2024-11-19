const users = require('../data');

const login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    return res.json({ success: true, message: "로그인 성공!" });
  } else {
    return res.json({ success: false, message: "이메일 또는 비밀번호가 잘못되었습니다." });
  }
};

module.exports = { login };