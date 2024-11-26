const express = require('express');
const { community, createPost } = require('../controllers/communityController'); // 구조 분해 할당으로 직접 가져오기
const router = express.Router();

// 게시글 조회 API
router.get('/posts', community);

// 게시글 작성 API
router.post('/create', createPost);  // communityController가 아니라 직접 createPost 사용

module.exports = router;
