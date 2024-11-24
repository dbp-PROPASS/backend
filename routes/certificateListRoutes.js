const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateListController');

// GET: 모든 데이터를 가져오기
router.get('/', certificateController.getCertificateList);

module.exports = router;