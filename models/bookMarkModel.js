const { getConnection } = require('../config/dbConfig');

// 즐겨찾기 저장
async function saveBookmark(mem_id, round_id) {

    let connection;

    try {
        connection = await getConnection();
        const query = `INSERT INTO INTERESTCERT (MEM_ID, ROUND_ID) VALUES (:mem_id, :round_id)`;
       
        const result = await connection.execute(query, { mem_id, round_id });
        await connection.commit();
        console.log('삽입 쿼리 실행 결과:', result);
    } catch (err) {
        throw new Error(`즐겨찾기 저장 실패: ${err.message}`);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// 즐겨찾기 삭제
async function removeBookmark(mem_id, round_id) {
    let connection;
    try {
        connection = await getConnection();
        const query = `DELETE FROM INTERESTCERT WHERE TRIM(MEM_ID) = TRIM(:mem_id) AND TRIM(ROUND_ID) = TRIM(:round_id)`;
        const result = await connection.execute(query, { mem_id, round_id });
        await connection.commit();
        console.log('삭제된 행 수:', result.rowsAffected);
        if (result.rowsAffected === 0) {
            console.log('삭제할 데이터가 없습니다.');
        }
    } catch (err) {
        throw new Error(`즐겨찾기 삭제 실패: ${err.message}`);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// 즐겨찾기 중복 확인용 조회 구문
async function checkExistingBookmark(mem_id, round_id) {
    let connection;


    try {
        connection = await getConnection();
        const query = `SELECT * FROM INTERESTCERT WHERE TRIM(mem_id) = TRIM(:mem_id) AND TRIM(round_id) = TRIM(:round_id)`;
        const result = await connection.execute(query, { mem_id, round_id });
        return (result.rows && result.rows.length > 0);  // 존재하면 true 반환
    } catch (err) {
        throw new Error(`즐겨찾기 중복 확인 실패: ${err.message}`);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

// 이메일로 mem_id 조회
async function findMemIdByEmail(email) {
    let connection;

    try {
        connection = await getConnection();
        const query = `SELECT TRIM(MEM_ID) AS MEM_ID 
                        FROM MEMBER 
                        WHERE TRIM(LOWER(EMAIL)) = TRIM(LOWER(:email))`;

        const result = await connection.execute(query, { email });
        
        // 공백 제거 후 mem_id 반환
        const memId = result.rows[0][0].trim(); // trim()으로 공백 제거
        console.log(`처리된 mem_id: "${memId}"`); // 공백 제거된 memId를 확인
        if (memId && memId.length > 0) {
            return memId;
        } else {
            console.error('유효한 mem_id를 찾을 수 없습니다');
            return null;
        }
    } catch (err) {
        console.error('쿼리 실행 중 에러 발생:', err);
        throw new Error(`mem_id 조회 실패: ${err.message}`);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = {
    saveBookmark, 
    removeBookmark, 
    checkExistingBookmark, 
    findMemIdByEmail
};
