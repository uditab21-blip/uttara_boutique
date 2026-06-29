/**
 * Abstract Notification Service
 * Defines the interface for notification adapters.
 */
class NotificationService {
  /**
   * Send an SMS notification
   * @param {string} to - Recipient phone number
   * @param {string} message - SMS message body
   * @returns {Promise<void>}
   */
  async sendSMS(to, message) {
    throw new Error('Method sendSMS() must be implemented');
  }

  /**
   * Send an Email notification
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} body - Email body (HTML or plain text)
   * @returns {Promise<void>}
   */
  async sendEmail(to, subject, body) {
    throw new Error('Method sendEmail() must be implemented');
  }
}

module.exports = NotificationService;
