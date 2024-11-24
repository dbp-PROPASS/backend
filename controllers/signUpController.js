//const bcrypt = require('bcrypt');
const { insertMember } = require('../models/signUpModel');

// 랜덤 닉네임 생성 함수
const generateRandomNickname = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let nickname = '';
  for (let i = 0; i < 6; i++) {
    nickname += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nickname;
};  

// 회원가입 처리
const signUp = async (req, res) => {
  let { name, email, password, age_group, phone, interests, notification } = req.body;

  // 입력값 trim 처리
  name = name ? name.trim() : '';
  email = email ? email.trim() : '';
  password = password ? password.trim() : '';
  age_group = age_group ? age_group.trim() : '';
  phone = phone ? phone.trim() : '';
  interests = interests ? interests.trim() : '';
  notification = notification ? notification.trim() : '';

  // 닉네임 기본값 생성
  const nickname = req.body.nickname || generateRandomNickname();

  // 입력값 검증
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: '필수 입력 필드를 확인하세요.' });
  }

  try {
    // const hashedPassword = await bcrypt.hash(password, 10);  // 비밀번호 암호화

    // 회원 데이터 생성
    const memberData = {
      name,
      nickname,
      email,
      //password: hashedPassword,
      password,
      age_group,
      phone,
      interests,
      notification
    };

    // DB에 데이터 삽입
    await insertMember(memberData);
    res.status(201).json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
  }
};

module.exports = { signUp };
