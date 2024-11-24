const express = require('express');
const { signUp } = require('../controllers/signUpController');

const router = express.Router();

// 회원가입 라우트
router.post('/signup', signUp);

module.exports = router;
