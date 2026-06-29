const NotificationService = require('./NotificationService');

/**
 * Console Implementation of Notification Service
 * Logs notifications to the console for development/testing.
 */
class ConsoleNotificationService extends NotificationService {
  async sendSMS(to, message) {
    console.log('--- SMS NOTIFICATION ---');
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log('------------------------');
  }

  async sendEmail(to, subject, body) {
    console.log('--- EMAIL NOTIFICATION ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('--------------------------');
  }
}

module.exports = ConsoleNotificationService;
