const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// 로그인 요청 처리
router.post('/login', loginController.login);

module.exports = router;