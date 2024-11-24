const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

async function getCertificateList(req, res) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    // console.log('DB 연결 성공');  // DB 연결 성공 여부 확인

    const result = await connection.execute(
      `SELECT *
       FROM CERTIFICATEINFO ci 
       JOIN EXAMSCHEDULE es 
       ON ci.CERT_ID = es.CERT_ID`
    );

    // console.log('DB Result0:', result.rows); // 확인

    const columnNames = result.metaData.map(col => col.name); 
    const formattedData = result.rows.map(row => {
      const rowObject = {};
      row.forEach((value, index) => {
        rowObject[columnNames[index]] = value.toString().trim(); 
      });
      return rowObject;
    });

    // console.log('DB Real Result:', formattedData); // 확인
    res.json(formattedData); // 쿼리 결과 반환

  } catch (err) {
    console.error('DB 연결 실패:', err);
    res.status(500).send(err.message); 
  } finally {
    if (connection) {
      try {
        await connection.close();
        // console.log('DB 연결 종료');
      } catch (err) {
        console.error('DB 연결 종료 오류:', err); 
      }
    }
  }
}

module.exports = {
    getCertificateList
};
