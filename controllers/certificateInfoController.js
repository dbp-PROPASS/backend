const certificateInfoModel = require('../models/certificateInfoModel');

async function getCertificateInfo(req, res) {
    try {
        const certName = decodeURIComponent(req.params.certName); // URL 디코딩 추가
        console.log("컨트롤러에서 디코딩 certName:", certName); // 디버깅 로그

        const result = await certificateInfoModel.getCertificateByName(certName);
        const columnNames = result.metaData.map(col => col.name); // 메타데이터에서 열 이름 추출

        // 각 row의 데이터 처리 (null 값 처리)
        const formattedData = result.rows.map(row => {
            const rowObject = {};
            row.forEach((value, index) => {
                rowObject[columnNames[index]] = value ? value.toString().trim() : null; // 열 이름과 값을 매핑
            });
            return rowObject;
        });

        if (!result || result.rows.length === 0) {
            return res.status(404).json({ error: 'Certificate not found' });
        }
        if (!result.metaData || !Array.isArray(result.metaData)) {
            return res.status(500).json({ error: 'Invalid data format received from database' });
        }

        res.json(formattedData[0]); // 단일 객체 반환
    } catch (err) {
        console.error('DB 연결 실패:', err);
        res.status(500).json({ error: 'Server error', details: err.message, stack: err.stack });
    }
}



module.exports = { getCertificateInfo };
