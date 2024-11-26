const scheduleDAO = require('../DAO/scheduleDAO');

exports.viewSchedule = async (email, req, res) => {
  try {
    const schedules = await scheduleDAO.loadOwnCertifi(email); // DAO 호출
    res.status(200).json(schedules); // 스케줄 반환
  } catch (err) {
    console.error('스케줄 조회 오류:', err.message);
    res.status(500).json({ message: '서버 오류' });
  }
};
