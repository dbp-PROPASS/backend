const { getConnection } = require('../config/dbConfig');

async function getCertificateByName(certName) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT *
              FROM (
                SELECT *
                FROM CERTIFICATEINFO ci
                LEFT JOIN EXAMSCHEDULE es
                  ON ci.CERT_ID = es.CERT_ID
                WHERE TRIM(ci.CERT_NAME) = TRIM(:certName)
                ORDER BY es.ROUND_ID DESC
              )
              WHERE ROWNUM <= 5
              `,
            [certName]
        );

        // result.rows에는 데이터가 담겨있고,
        // result.metaData는 컬럼 정보가 담겨 있습니다.
        // console.log('모델에서 받아온 result값입니다요', result.rows); // rows만 로그 출력

        // 메타데이터가 있으면 열 이름을 추출하여 반환
        const columnNames = result.metaData ? result.metaData.map(col => col.name) : [];

        // 반환할 객체를 추가하여 데이터와 메타데이터 반환
        return { 
            latestRound: result.rows[0], 
            allRounds: result.rows, 
            columnNames: columnNames // 열 이름을 포함하여 반환
        };
    } catch (err) {
        throw new Error('DB 쿼리 실행 실패:', err);
    } finally {
        if (connection) {
            try {
                await connection.close();  // DB 연결 닫기
            } catch (err) {
                console.error('DB 연결 종료 오류:', err);
            }
        }
    }
}

module.exports = { getCertificateByName };
