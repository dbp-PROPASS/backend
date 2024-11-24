const oracledb = require('oracledb');

// Oracle Client 설정 (필요한 경우 추가 설정)
oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_6' }); // Instant Client 경로 설정

const dbConfig = {
  user: 'dbp240107',            // Oracle DB 사용자 이름
  password: '81140',            // 비밀번호
  connectString: 'dblab.dongduk.ac.kr:1521/orclpdb' // 호스트:포트/서비스이름
};

module.exports = dbConfig;
