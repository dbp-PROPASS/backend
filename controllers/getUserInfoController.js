const { getUserByEmail } = require('../models/editProfileModel'); // 모델 가져오기

const getUserInfo = async (req, res) => {
  const { email } = req.params;

  try {
    const rows = await getUserByEmail(email);

    if (rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = rows[0]; // 첫 번째 결과
    res.json({
      name: user[0],
      password: user[1],
      email: user[2],
      phone: user[3],
      age_group: user[4],
      interests: user[5],
      notification: user[6],
    });
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    res.status(500).json({ message: '사용자 정보를 불러오는 데 실패했습니다.' });
  }
};

module.exports = { getUserInfo };
