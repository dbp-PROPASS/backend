const { insertPost } = require('../models/AddPostsModel'); // 수정된 함수명으로 import

// 게시글 작성 처리
const addPost = async (req, res) => {
  console.log('addPost 요청이 들어왔습니다:', req.body); // 로그 추가
  let { title, content, author, comId } = req.body;

  // 입력값 trim 처리
  title = title ? title.trim() : '';
  content = content ? content.trim() : '';
  author = author ? author.trim() : '';
  comId = comId ? comId.trim() : '';

  // 입력값 검증
  if (!title || !author || !comId) {
    return res.status(400).json({ success: false, message: '필수 입력 필드를 확인하세요.' });
  }

  try {
    // 게시글 데이터 생성
    const postData = {
      title,
      content,
      author,
      comId
    };

    // DB에 데이터 삽입
    await insertPost(postData); // 모델의 insertPost 함수 호출
    res.status(201).json({ success: true, message: '게시글 작성이 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '게시글 작성 중 오류가 발생했습니다.' });
  }
};

module.exports = { addPost };