const ExpiredCertificateDAO = require('../models/expiredCertificateModel'); // DB 모델
const sendExpirationEmail = require('../config/expiredEmail'); // 이메일 전송 함수

const sendExpirationNotifications = async () => {
  try {
    // 만료 예정 자격증 데이터 조회
    const certificates = await ExpiredCertificateDAO.getExpiringCertificates();

    // 만료 예정 자격증에 대해 이메일 전송
    for (const certificate of certificates) {
      const [email, name, certificateName, acquisitionDate] = certificate;
      const expirationDate = new Date(acquisitionDate);

      expirationDate.setHours(expirationDate.getHours() + 9); // KST로 변환
      await sendExpirationEmail(email, name, certificateName, expirationDate.toISOString().split('T')[0]);
      
      console.log(`${expirationDate.toISOString().split('T')[0]}일에 자격증 만료`);
    }

    console.log('모든 만료 예정 자격증 알림 이메일 발송 완료.');
  } catch (err) {
    console.error('만료 예정 자격증 알림 이메일 발송 오류:', err);
  }
};

module.exports = { sendExpirationNotifications };
