const db = require('../db');
const NotificationManager = require('../notifications');

const MILESTONES = [
  'placed',
  'confirmed',
  'packed',
  'shipped',
  'in_transit',
  'out_for_delivery',
  'delivered'
];

/**
 * Tracking Manager
 * Handles order tracking milestones and status transitions.
 */
class TrackingManager {
  /**
   * Get tracking history for an order
   */
  static async getTracking(orderId) {
    return await db.getTrackingByOrderId(orderId);
  }

  /**
   * Update tracking milestone
   */
  static async updateMilestone(orderId, milestone, location = '', notes = '') {
    if (!MILESTONES.includes(milestone) && milestone !== 'cancelled') {
      throw new Error(`Invalid milestone: ${milestone}`);
    }

    // Add milestone record
    let milestoneStatus = 'pending';
    if (milestone === 'delivered') {
      milestoneStatus = 'delivered';
    } else if (['shipped', 'in_transit', 'out_for_delivery'].includes(milestone)) {
      milestoneStatus = 'in_transit';
    }
    
    await db.addTrackingMilestone(orderId, milestone, milestoneStatus, location, notes);

    // Update order status based on milestone
    let orderStatus = milestone;
    if (milestone === 'out_for_delivery' || milestone === 'in_transit' || milestone === 'shipped') {
      orderStatus = 'shipped';
    } else if (milestone === 'packed') {
      orderStatus = 'processing';
    } else if (milestone === 'placed' || milestone === 'confirmed') {
      orderStatus = 'pending';
    }

    await db.updateOrderStatus(orderId, orderStatus);

    // Trigger auto-notifications
    if (milestone === 'shipped') {
      // In a real app, trackingId would come from the 3PL or be provided by the admin
      const trackingId = `TRK${Date.now().toString().slice(-8)}`;
      await NotificationManager.sendShippingUpdate(orderId, trackingId);
    } else if (milestone === 'delivered') {
      await NotificationManager.sendDeliveryConfirmation(orderId);
    } else if (milestone === 'confirmed') {
      // We might want to send confirmation on 'confirmed' too if not sent on 'placed'
      await NotificationManager.sendOrderConfirmation(orderId);
    }

    return { success: true, milestone };
  }

  /**
   * Cancel an order
   */
  static async cancelOrder(orderId, reason = '') {
    await db.addTrackingMilestone(orderId, 'cancelled', 'failed', '', reason);
    await db.updateOrderStatus(orderId, 'cancelled');
    
    // Notify customer
    const order = await db.getOrderById(orderId);
    if (order) {
      const customer = await db.getCustomerById(order.customer_id);
      if (customer) {
        const message = `Uttara Boutique: Your order ${orderId} has been cancelled. ${reason}`;
        await NotificationManager.sendManualNotification(orderId, 'sms', customer.phone, message);
      }
    }
  }
}

module.exports = TrackingManager;
module.exports.MILESTONES = MILESTONES;
