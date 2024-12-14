const certificateInfoModel = require('../models/certificateInfoModel');

async function getCertificateInfo(req, res) {
    try {
        const certName = decodeURIComponent(req.params.certName);
        // console.log("컨트롤러에서 디코딩 certName:", certName);

        const result = await certificateInfoModel.getCertificateByName(certName);

        const columnNames = result.columnNames; // 열 이름을 메타데이터에서 가져옴

        // 배열인지 객체인지 검사하여 다르게 처리
        let formattedData = [];
        if (Array.isArray(result.allRounds)) {
            // 배열 처리 (리눅스 마스터와 같은 경우)
            formattedData = result.allRounds.map(row => {
                const rowObject = {};
                row.forEach((value, index) => {
                    rowObject[columnNames[index]] = value ? value.toString().trim() : null;
                });
                return rowObject;
            });
        } else {
            // 객체 처리 (정보처리와 같은 경우)
            const rowObject = {};
            result.allRounds.forEach((value, index) => {
                rowObject[columnNames[index]] = value ? value.toString().trim() : null;
            });
            formattedData.push(rowObject);
        }
        console.log('총 쿼리 결과:', formattedData);

        return res.json(formattedData); // 데이터 반환 시 'return' 추가
    } catch (err) {
        console.error('DB 연결 실패:', err);
        // 오류가 발생한 경우 한 번만 응답
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Server error', details: err.message, stack: err.stack });
        }
    }
}





module.exports = { getCertificateInfo };
