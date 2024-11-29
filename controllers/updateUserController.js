const { userUpdate } = require('../models/editProfileModel'); // 모델 가져오기

// 회원 정보 수정 API
exports.updateUser = async (req, res) => {
  const { email } = req.params;
  const { name, password, phone, age_group, interests, notification } = req.body;

  try {
    const rowsAffected = await userUpdate(email, {
      name,
      password,
      phone,
      age_group,
      interests,
      notification,
    });

    if (rowsAffected === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '회원 정보가 성공적으로 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '회원 정보 수정 실패', error: err.message });
  }
};
