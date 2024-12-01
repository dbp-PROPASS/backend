const bookmarkModel = require('../models/bookMarkModel');

// 즐겨찾기 저장
async function saveBookmark(req, res) {
    const { mem_id, round_id } = req.body;
    
    if (!mem_id || !round_id) {
        console.error('필수 필드가 누락되었습니다:', { mem_id, round_id });
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 중복 체크
        const existingBookmark = await bookmarkModel.checkExistingBookmark(mem_id, round_id);
        console.log('중복 체크 결과:', existingBookmark);
        if (existingBookmark) {
            return res.status(400).json({ message: '이미 즐겨찾기가 존재합니다.' });
        }

        // 저장
        
        await bookmarkModel.saveBookmark(mem_id, round_id);
        res.status(200).json({ message: '즐겨찾기가 저장되었습니다.' });
    } catch (err) {
        console.error('즐겨찾기 저장 실패:', err);
        res.status(500).json({ error: 'Failed to save bookmark', details: err.message });
    }
}

// 즐겨찾기 삭제
async function removeBookmark(req, res) {
    const { mem_id, round_id } = req.query;

    if (!mem_id || !round_id) {
        console.error('삭제 관련 필수 필드가 누락되었습니다:', { mem_id, round_id });
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await bookmarkModel.removeBookmark(mem_id, round_id);
        res.status(200).json({ message: '즐겨찾기가 삭제되었습니다.' });
    } catch (err) {
        console.error('즐겨찾기 삭제 실패:', err);
        res.status(500).json({ error: 'Failed to remove bookmark', details: err.message });
    }
}

// 즐겨찾기 중복 확인
async function checkBookmark(req, res) {
    const { mem_id, round_id } = req.query;

    try {
        const exists = await bookmarkModel.checkExistingBookmark(mem_id, round_id);
        res.status(200).json({ exists });
    } catch (err) {
        console.error('즐겨찾기 중복 확인 실패:', err);
        res.status(500).json({ error: 'Failed to check bookmark', details: err.message });
    }
}

// 이메일로 mem_id 조회
async function getMemId(req, res) {
    const { email } = req.query;

    
    const decodedEmail = decodeURIComponent(email); // 디코딩 처리
    
    if (!email) {
        console.error('이메일이 누락되었습니다.');
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        const decodedEmail = decodeURIComponent(email); // 디코딩 처리
        
        const memId = await bookmarkModel.findMemIdByEmail(decodedEmail); // 모델에서 이메일로 mem_id 조회
        if (!memId) {
            console.error('User not found for email:', email, '디코딩된 email:', decodedEmail);
            return res.status(404).json({ error: 'User not found', email: decodedEmail });
        } else {
            res.status(200).json({ mem_id: memId });
        }
    } catch (err) {
        console.error('mem_id 조회 실패:', err);
        res.status(500).json({ error: 'Failed to retrieve mem_id', details: err.message });
    }
}

module.exports = {
    saveBookmark,
    removeBookmark,
    checkBookmark,
    getMemId
};
