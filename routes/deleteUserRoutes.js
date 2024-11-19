const express = require("express");
const router = express.Router();
const deleteUserController = require("../controllers/deleteUserController");

// 회원 탈퇴 요청 처리
router.delete("/:email", deleteUserController.deleteUser);

module.exports = router;