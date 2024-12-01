const express = require('express');
const router = express.Router();
const certificateInfoController = require('../controllers/certificateInfoController');

// GET: 특정 자격증의 상세 정보를 가져오기
router.get('/:certName', certificateInfoController.getCertificateInfo);


module.exports = router;
