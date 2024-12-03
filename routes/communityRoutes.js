// communityRoutes.js
const express = require('express');
const { community, addComment } = require('../controllers/communityController'); // 구조 분해 할당으로 직접 가져오기
const router = express.Router();

// 게시글 조회 API
router.get('/posts', community);

// 댓글 작성 API
router.post('/posts/:postId/comments', addComment);

module.exports = router;