const db = require('../db');
const ConsoleNotificationService = require('./ConsoleNotificationService');

// In a real app, this would be determined by environment variables
const service = new ConsoleNotificationService();

/**
 * Notification Manager
 * Handles sending notifications and logging them to the database.
 */
class NotificationManager {
  /**
   * Send order confirmation notification
   * @param {string} orderId 
   */
  static async sendOrderConfirmation(orderId) {
    const order = await db.getOrderById(orderId);
    if (!order) return;

    const customer = await db.getCustomerById(order.customer_id);
    if (!customer) return;

    const amount = db.formatINR(order.total_amount);
    
    // SMS
    const smsMessage = `Uttara Boutique: Order ${orderId} confirmed! Total: ${amount}. We'll notify you when it's shipped.`;
    try {
      await service.sendSMS(customer.phone, smsMessage);
      db.logNotification(orderId, 'sms', customer.phone, smsMessage, 'sent');
    } catch (err) {
      db.logNotification(orderId, 'sms', customer.phone, smsMessage, 'failed');
      console.error('Failed to send SMS confirmation:', err);
    }

    // Email
    const emailSubject = `Order Confirmation - ${orderId}`;
    const emailBody = `
      <h1>Thank you for your order!</h1>
      <p>Your order <strong>${orderId}</strong> has been received and is being processed.</p>
      <p>Total Amount: ${amount}</p>
      <p>We will notify you once your package is shipped.</p>
    `;
    try {
      await service.sendEmail(customer.email, emailSubject, emailBody);
      db.logNotification(orderId, 'email', customer.email, emailBody, 'sent', emailSubject);
    } catch (err) {
      db.logNotification(orderId, 'email', customer.email, emailBody, 'failed', emailSubject);
      console.error('Failed to send Email confirmation:', err);
    }
  }

  /**
   * Send shipping notification
   * @param {string} orderId 
   * @param {string} trackingId 
   */
  static async sendShippingUpdate(orderId, trackingId) {
    const order = await db.getOrderById(orderId);
    if (!order) return;

    const customer = await db.getCustomerById(order.customer_id);
    if (!customer) return;

    // SMS
    const smsMessage = `Uttara Boutique: Your order ${orderId} has been shipped! Tracking ID: ${trackingId}. Track here: /orders/${orderId}/track`;
    try {
      await service.sendSMS(customer.phone, smsMessage);
      db.logNotification(orderId, 'sms', customer.phone, smsMessage, 'sent');
    } catch (err) {
      db.logNotification(orderId, 'sms', customer.phone, smsMessage, 'failed');
    }

    // Email
    const emailSubject = `Shipping Update - Order ${orderId}`;
    const emailBody = `
      <h1>Your order has shipped!</h1>
      <p>Order <strong>${orderId}</strong> is on its way.</p>
      <p>Tracking ID: <strong>${trackingId}</strong></p>
      <p>You can track your order on our website.</p>
    `;
    try {
      await service.sendEmail(customer.email, emailSubject, emailBody);
      db.logNotification(orderId, 'email', customer.email, emailBody, 'sent', emailSubject);
    } catch (err) {
      db.logNotification(orderId, 'email', customer.email, emailBody, 'failed', emailSubject);
    }
  }

  /**
   * Send delivery confirmation
   * @param {string} orderId 
   */
  static async sendDeliveryConfirmation(orderId) {
    const order = await db.getOrderById(orderId);
    if (!order) return;

    const customer = await db.getCustomerById(order.customer_id);
    if (!customer) return;

    // SMS
    const smsMessage = `Uttara Boutique: Your order ${orderId} has been delivered. We hope you love your new sari!`;
    try {
      await service.sendSMS(customer.phone, smsMessage);
      db.logNotification(orderId, 'sms', customer.phone, smsMessage, 'sent');
    } catch (err) {
      db.logNotification(orderId, 'sms', customer.phone, smsMessage, 'failed');
    }

    // Email
    const emailSubject = `Order Delivered - ${orderId}`;
    const emailBody = `
      <h1>Your order has been delivered!</h1>
      <p>Order <strong>${orderId}</strong> has been successfully delivered.</p>
      <p>We hope you love your new sari! Thank you for shopping with Uttara Boutique.</p>
    `;
    try {
      await service.sendEmail(customer.email, emailSubject, emailBody);
      db.logNotification(orderId, 'email', customer.email, emailBody, 'sent', emailSubject);
    } catch (err) {
      db.logNotification(orderId, 'email', customer.email, emailBody, 'failed', emailSubject);
    }
  }

  /**
   * Manual notification trigger
   */
  static async sendManualNotification(orderId, type, recipient, message, subject = '') {
    try {
      if (type === 'sms') {
        await service.sendSMS(recipient, message);
      } else {
        await service.sendEmail(recipient, subject || 'Update from Uttara Boutique', message);
      }
      db.logNotification(orderId, type, recipient, message, 'sent', subject);
    } catch (err) {
      db.logNotification(orderId, type, recipient, message, 'failed', subject);
      throw err;
    }
  }
}

module.exports = NotificationManager;
