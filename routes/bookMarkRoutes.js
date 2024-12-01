const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookMarkController');

// 즐겨찾기 저장 (POST 요청)
router.post('/addBookmark', bookmarkController.saveBookmark);

// 즐겨찾기 삭제 (DELETE 요청)
router.delete('/deleteBookmark', bookmarkController.removeBookmark);

// 즐겨찾기 상태 확인 (GET 요청)
router.get('/', bookmarkController.checkBookmark);

//이메일 이용해서 mem_id 찾기
router.get('/getMemId', bookmarkController.getMemId);

module.exports = router;
