const express = require('express');
const { community } = require('../controllers/communityController'); // 구조 분해 할당으로 직접 가져오기
const router = express.Router();

// 게시글 조회 API
router.get('/posts', community);

module.exports = router;