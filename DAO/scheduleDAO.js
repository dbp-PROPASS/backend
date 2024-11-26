const { getConnection } = require('../config/dbConfig'); // DB 설정 파일 경로

class ScheduleDAO {
  static async loadOwnCertifi(email) {
    let connection;
    try {
      // DB 연결
      connection = await getConnection();

      // 1. 이메일로 사용자 ID 조회
      const userQuery = `
        SELECT MEM_ID
        FROM MEMBER
        WHERE TRIM(EMAIL) = TRIM(:email)
      `;
      const userResult = await connection.execute(userQuery, [email]);

      if (!userResult.rows.length) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      const [memId] = userResult.rows[0]; //사용자 id
      const trimmedMemId = memId.trim(); // 공백 제거
      console.log("Received memId:", trimmedMemId);

      // 2. 사용자 ID로 OWNCERTIFICATE 데이터 조회
      const certQuery = `
        SELECT ACQISITION_DATE, CERT_ID
        FROM OWNCERTIFICATE
        WHERE TRIM(MEM_ID) = TRIM(:memId)
      `;
      const certResult = await connection.execute(certQuery, [trimmedMemId]);

      if (!certResult.rows.length) {
        console.log('보유 자격증이 없습니다.');
        return []; // 보유 자격증이 없으면 빈 배열 반환
      }

      console.log("CERTIFICATE Rows:", certResult.rows);

      // 3. 모든 자격증 정보를 한 번에 가져오기
      const certIds = certResult.rows.map(row => row[1].trim()); // CERT_ID 리스트 생성(각 행 두번째 요소 추출)
      console.log("CerNameRows:", certIds);
      
      // 바인딩 변수 생성
      const placeholders = certIds.map((_, index) => `:certId${index}`).join(', ');
      const params = certIds.reduce((acc, certId, index) => {
        acc[`certId${index}`] = certId;
        return acc;
      }, {});

      const nameQuery = `
      SELECT CERT_ID, CERT_NAME
      FROM CERTIFICATEINFO
      WHERE TRIM(CERT_ID) IN (${placeholders})
      `;  
      console.log("Generated Query:", nameQuery);
      console.log("Query Parameters:", params);

      const nameResult = await connection.execute(nameQuery, params);

      console.log("CERTIFICATEINFO Rows:", nameResult.rows);

      // CERT_ID -> CERT_NAME 매핑
      const certNameMap = new Map();
      nameResult.rows.forEach(([certId, certName]) => {
      certNameMap.set(certId.trim(), certName.trim());
      });
      
      console.log("CERT_ID to CERT_NAME mapping:", Array.from(certNameMap.entries()));


      // 4. OWNCERTIFICATE 데이터와 CERTIFICATEINFO 데이터를 매핑
      const schedules = certResult.rows.map(([acquisitionDate, certId]) => {
        const certName = certNameMap.get(certId.trim()) || '알 수 없는 자격증';
        return {
          certName,
          date: acquisitionDate.trim(),
          type: 'expired'
        };
      });

      console.log('Schedules to be returned:', schedules);

      return schedules; // 프론트엔드로 반환할 데이터
    } catch (err) {
      console.error('DB 오류:', err.message);
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}

module.exports = ScheduleDAO;
