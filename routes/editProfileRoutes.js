const express = require('express');
const { getUserInfo } = require('../controllers/getUserInfoController'); // 컨트롤러 가져오기
const { updateUser } = require('../controllers/updateUserController'); // 컨트롤러 가져오기

const router = express.Router();

router.get('/:email', getUserInfo);
router.put('/:email', updateUser);

module.exports = router;
