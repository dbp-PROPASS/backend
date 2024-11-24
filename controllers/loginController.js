const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

const login = async (req, res) => {
  const { email, password } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // 이메일로 사용자 조회
    const query = `
      SELECT NAME, PASSWORD 
      FROM MEMBER 
      WHERE TRIM(EMAIL) = TRIM(:email)
    `;
    const result = await connection.execute(query, { email });

    // console.log("Received Email:", email);
    // console.log("Executed Query:", query);
    // console.log("Binds:", { email });

    if (result.rows.length === 0) {
      return res.json({ success: false, message: '등록되지 않은 이메일입니다.' });
    }

    // DB 쿼리 결과에서 이름(name)과 비밀번호(dbPassword) 값을 각각 변수에 할당
    const [name, dbPassword] = result.rows[0];
    // 이름, 비밀번호의 공백을 제거
    const trimmedName = name.trim();
    const trimmedPassword = dbPassword.trim();

    // 비밀번호 비교
    if (password === trimmedPassword) {
      return res.json({ success: true, message: `${trimmedName}님 반갑습니다.` });
    } else {
      return res.json({ success: false, message: '비밀번호가 잘못되었습니다.' });
    }
  } catch (err) {
    console.error('Database Error:', err);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

module.exports = { login };
