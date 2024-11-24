const oracledb = require('oracledb');

// DB 연결 풀을 하나만 생성하여 여러 요청에서 공유
let pool;

oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_6' });

async function getConnection() {
  if (!pool) {
    pool = await oracledb.createPool({
      user: 'dbp240107',
      password: '81140',
      connectString: 'dblab.dongduk.ac.kr:1521/orclpdb'
    });
    console.log('Oracle DB 연결 풀 생성 완료!');
  }
  return pool.getConnection();
}

module.exports = { getConnection };
