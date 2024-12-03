const { getConnection } = require('../config/dbConfig');

// 자격증 보유 정보 삽입
async function saveOwnedCertificate(mem_id, acquisition_date, exam_date, cert_name, own_info) {
    let connection;
    try {
        connection = await getConnection();
        const query = `
            INSERT INTO OWNCERTIFICATE (MEM_ID, ACQISITION_DATE, C_EXAM_DATE, C_CERT_NAME, OWN_INFO)
            VALUES (:mem_id, :acquisition_date, :exam_date, :cert_name, :own_info)
        `;
        await connection.execute(query, { mem_id, acquisition_date, exam_date, cert_name, own_info });
        await connection.commit();
    } catch (err) {
        throw new Error(`자격증 보유 정보 삽입 실패: ${err.message}`);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// 자격증 보유 정보 삭제
async function removeOwnedCertificate(owned_cert_id) { // 모델 수정
    if (!owned_cert_id) throw new Error('자격증 ID가 없습니다.'); 
    let connection;
    try {
      connection = await getConnection();
      const query = `DELETE FROM OWNCERTIFICATE WHERE TRIM(OWNED_CERT_ID) = TRIM(:owned_cert_id)`;
      const result = await connection.execute(query, { owned_cert_id });
      await connection.commit();
      return result.rowsAffected > 0; // 삭제된 항목이 있으면 true 반환
    } catch (err) {
      throw new Error(`자격증 보유 정보 삭제 실패: ${err.message}`);
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  

// 자격증 보유 정보 수정
async function updateOwnedCertificate(owned_cert_id, category, passDate, validityPeriod, remarks) {
    let connection;

    try {
        connection = await getConnection();
        const query = `
            UPDATE OWNCERTIFICATE
            SET 
                C_CERT_NAME = :category,         -- category는 CERT_NAME으로 사용
                C_EXAM_DATE = :passDate,         -- passDate는 exam_date로 사용
                ACQISITION_DATE = :validityPeriod,   -- validityPeriod는 acquisition_date으로 사용
                OWN_INFO = :remarks              -- remarks는 own_info로 사용
            WHERE TRIM(OWNED_CERT_ID) = TRIM(:owned_cert_id)
        `;

        // 쿼리 실행
        const result = await connection.execute(query, {
            owned_cert_id,    // 자격증 ID
            category,         // category (CERT_NAME)
            passDate,         // passDate (exam_date)
            validityPeriod,   // validityPeriod (acquisition_date)
            remarks           // remarks (own_info)
        });

        await connection.commit();
        return result; // 수정된 데이터 반환
    } catch (err) {
        throw new Error(`자격증 보유 정보 수정 실패: ${err.message}`);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function findOwnedCertificate(mem_id) {
    let connection;
    try {
        connection = await getConnection();
        const query = `SELECT * FROM OWNCERTIFICATE WHERE TRIM(MEM_ID) = TRIM(:mem_id)`;
        const result = await connection.execute(query, [mem_id]);

        // rows 데이터를 JSON 형태로 변환
        const certificates = result.rows.map(row => {
            return result.metaData.reduce((acc, meta, index) => {
                acc[meta.name] = row[index];
                return acc;
            }, {});
        });

        return certificates;
    } catch (err) {
        throw new Error(`자격증 보유 정보 조회 실패: ${err.message}`);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = {
    saveOwnedCertificate,
    removeOwnedCertificate,
    updateOwnedCertificate,
    findOwnedCertificate
};
