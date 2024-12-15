const { getConnection } = require('../config/dbConfig');

// 카테고리별 추천 자격증 조회
exports.getCertsByCategory = async (category) => {
  const query = `
    SELECT ci.cert_name
    FROM interestcert i
    JOIN examschedule e ON i.round_id = e.round_id
    JOIN certificateInfo ci ON e.cert_id = ci.cert_id
    WHERE ci.category = :category
    GROUP BY ci.cert_name
    ORDER BY COUNT(i.round_id) DESC
    FETCH FIRST 5 ROWS ONLY
  `;
  
  let connection;
  try {
    connection = await getConnection();
    console.log('Database connected successfully');
    const result = await connection.execute(query, { category });
    console.log('Query executed successfully for category:', category);
    console.log('category recommendations result:', result);
    console.log('Query result:', result.rows);
    return result.rows;  // 결과 반환
  } catch (err) {
    console.error('Error occurred while executing query:', err.message);
    throw new Error('Failed to execute query: ' + err.message);
  } finally {
    if (connection) {
      console.log('Closing database connection');
      await connection.close();  // 연결 종료
    }
  }
};

// 연령대별 추천 자격증 조회
exports.getCertsByAgeGroup = async (age_group) => {
  let connection;
  try {
    connection = await getConnection();
    console.log('Database connected successfully');
    
    const query = `
        SELECT ci.cert_name
        FROM member m
        JOIN interestcert i ON TRIM(m.mem_id) = TRIM(i.mem_id)
        JOIN examschedule e ON i.round_id = e.round_id
        JOIN certificateInfo ci ON e.cert_id = ci.cert_id
        WHERE TRIM(m.age_group) = :age_group
        GROUP BY ci.cert_name
        ORDER BY COUNT(i.round_id) DESC
        FETCH FIRST 5 ROWS ONLY
    `;

    const result = await connection.execute(query, { age_group: age_group });
    console.log('Query executed successfully for age group:', age_group);
    console.log('Age group recommendations result:', result);
    console.log('Query result:', result.rows); // 디버깅용 로그
    return result.rows; // 올바르게 반환
  } catch (error) {
    console.error('Error fetching age group recommendations:', error);
    throw error; // 오류를 상위 호출로 전달
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Connection closed');
      } catch (closeError) {
        console.error('Error closing the connection:', closeError);
      }
    }
  }
};
