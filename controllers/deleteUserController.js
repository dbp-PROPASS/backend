// 더미 데이터 (실제 프로젝트에서는 DB를 사용)
const users = [
    { id: 1, email: "test@example.com", password: "1234" },
    { id: 2, email: "user@example.com", password: "abcd" }
  ];
  
  // 회원 탈퇴 처리 함수
  const deleteUser = (req, res) => {
    const { email } = req.body;
    const userIndex = users.findIndex((u) => u.email === email);
  
    if (userIndex !== -1) {
      users.splice(userIndex, 1);  // 배열에서 사용자 삭제
      return res.json({ success: true, message: "회원 탈퇴가 완료되었습니다." });
    } else {
      return res.json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }
  };
  
  module.exports = { deleteUser };
  