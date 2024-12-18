// controllers/certificateListController.js
const certificateModel = require('../models/certificateListModel');

async function getCertificateList(req, res) {
  try {
    const result = await certificateModel.getCertificates();  // 모델을 통해 DB에서 데이터 가져오기
    const columnNames = result.metaData.map(col => col.name);  // 메타데이터에서 열 이름 추출
    const formattedData = result.rows.map(row => {
      const rowObject = {};
      row.forEach((value, index) => {
          // value가 null 또는 undefined일 경우 빈 문자열로 처리
          const safeValue = value != null ? value.toString().trim() : '';  // null 체크 후 toString 호출

          // 열 이름과 값을 매핑
          rowObject[columnNames[index]] = safeValue;
      });
      return rowObject;
    });

    res.json(formattedData);  // 쿼리 결과 반환
  } catch (err) {
    console.error('DB 연결 실패:', err);
    res.status(500).send(err.message);  // 에러 처리
  }
}

module.exports = { getCertificateList };
