// routes/certificateRoutes.js
const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/ownCertificateController');

// 자격증 목록 조회
router.get('/ownCertificate', certificateController.getCertificates);

// 자격증 추가
router.post('/ownAddCertificate', certificateController.addCertificate);

// 자격증 수정
router.put('/ownUpdateCertificate/:id', certificateController.updateCertificate);

// 자격증 삭제
router.delete('/ownDelCertificate', certificateController.deleteCertificate);

module.exports = router;
