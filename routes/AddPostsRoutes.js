// routes/AddPostsRoutes.js

const express = require('express');
const router = express.Router();
const { addPost } = require('../controllers/AddPostsController');

// 게시글 추가 라우팅
router.post('/addPost', addPost);

module.exports = router;
