const cron = require('node-cron');
const { sendExpirationNotifications } = require('./controllers/expiredCertificateController');

cron.schedule('1 0 * * *', async () => {
  try {
    await sendExpirationNotifications();
    console.log('자격증 만료 예정 알림 작업 완료.');
  } catch (error) {
    console.error('자격증 만료 알림 작업 중 오류 발생:', error);
  }
});
