const express = require('express');
const router = express.Router();
const accountController = require('../controllers/deleteUserController');

// 회원 탈퇴
router.delete('/:email', accountController.deleteUserController);

module.exports = router;
