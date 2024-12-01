const userModel = require('../models/deleteUserModel');

exports.deleteUserController = async (req, res) => {
  try {
    const email = req.params.email; // URL에서 이메일 추출
    const deleteResult = await userModel.deleteUserModel(email);

    if (deleteResult) {
      res.json({ success: true, message: '회원탈퇴가 완료되었습니다.' });
    } else {
      res.status(404).json({ success: false, message: '해당 이메일의 회원을 찾을 수 없습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '회원탈퇴 중 오류가 발생했습니다.' });
  }
};
