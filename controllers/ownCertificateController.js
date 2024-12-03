// controllers/certificateController.js
const Certificate = require('../models/ownCertificateModel');

async function getCertificates(req, res) {
  const { mem_id } = req.query;
  try {
      const certificates = await Certificate.findOwnedCertificate(mem_id);
      // 자격증 정보를 JSON 형태로 응답
      res.status(200).json({ certificates });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}

// 자격증 추가
const addCertificate = async (req, res) => {
  try {
    const { MEM_ID, ACQISITION_DATE, C_EXAM_DATE, C_CERT_NAME, OWN_INFO } = req.body;

    // DB 삽입 함수 호출
    await Certificate.saveOwnedCertificate(MEM_ID, ACQISITION_DATE, C_EXAM_DATE, C_CERT_NAME, OWN_INFO);

    // 성공적인 응답
    res.status(201).json({ message: '자격증 추가 성공' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '자격증 추가 실패' });
  }
};


// 자격증 수정
const updateCertificate = async (req, res) => {
  try {
    const { id, category, passDate, validityPeriod, remarks } = req.body;
 

    // 수정된 매핑에 맞춰서 업데이트 함수 호출
    const updatedCertificate = await Certificate.updateOwnedCertificate(
      id, 
      category,         // category는 CERT_NAME으로 매핑됨
      passDate,         // passDate는 exam_date로 매핑됨
      validityPeriod,   // validityPeriod는 acquisition_date으로 매핑됨
      remarks           // remarks는 own_info로 매핑됨
    );

    if (!updatedCertificate) {
      return res.status(404).json({ message: '자격증을 찾을 수 없습니다.' });
    }
    res.json(updatedCertificate);
  } catch (error) {
    res.status(400).json({ message: '자격증 수정 실패' });
  }
};


// 자격증 삭제
const deleteCertificate = async (req, res) => {
  const { ids } = req.body; // body에서 ids 배열을 받음


  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'IDS 배열이 잘못 들어옴.' });
  }

  try {
    // 여러 자격증을 삭제 처리
    await Promise.all(ids.map(async (id) => {
      const deletedCertificate = await Certificate.removeOwnedCertificate(id);
      if (!deletedCertificate) {
        throw new Error(`자격증 ID ${id}를 찾을 수 없습니다.`);
      }
    }));

    res.status(204).send(); // 삭제 성공
  } catch (error) {
    console.error('삭제 실패:', error);
    res.status(400).json({ message: `자격증 삭제 실패: ${error.message}` });
  }
};

module.exports = {
  getCertificates,
  addCertificate,
  updateCertificate,
  deleteCertificate,
};
