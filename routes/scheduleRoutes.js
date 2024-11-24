const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/ScheduleController'); // 대소문자 일치

// 쿠키에서 rememberEmail 값을 읽고 ScheduleController로 전달
router.post('/schedule', (req, res) => {
  const rememberEmail = req.cookies.rememberEmail; // 쿠키에서 rememberEmail 읽기

  if (!rememberEmail) {
    return res.status(401).json({ message: '로그인 정보가 없습니다.' });
  }

  // ScheduleController에 rememberEmail 전달
  scheduleController.viewSchedule(rememberEmail, req, res);
});

module.exports = router;
