import { execSync } from 'child_process';

export function queryDb(sql) {
  try {
    const result = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      timeout: 30000,
    });
    return JSON.parse(result);
  } catch (error) {
    console.error('DB query error:', error.message);
    return [];
  }
}

export function getDashboardStats() {
  const totalProducts = queryDb("SELECT COUNT(*) as count FROM products")[0]?.count || 0;
  const totalOrders = queryDb("SELECT COUNT(*) as count FROM orders")[0]?.count || 0;
  const totalRevenue = queryDb("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status IN ('paid', 'refunded')")[0]?.total || 0;
  
  const pendingOrders = queryDb("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'")[0]?.count || 0;
  const deliveredOrders = queryDb("SELECT COUNT(*) as count FROM orders WHERE status = 'delivered'")[0]?.count || 0;
  
  const cartStats = queryDb(`
    SELECT 
      COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
      COUNT(CASE WHEN status = 'abandoned' THEN 1 END) as abandoned,
      COUNT(*) as total_carts
    FROM carts
  `)[0] || { converted: 0, abandoned: 0, total_carts: 0 };
  
  const abandonmentRate = cartStats.total_carts > 0 
    ? ((cartStats.abandoned / cartStats.total_carts) * 100).toFixed(1)
    : '0.0';

  const lowStock = queryDb("SELECT COUNT(*) as count FROM products WHERE stock_quantity < 5")[0]?.count || 0;

  const notificationsDelivered = queryDb("SELECT COUNT(*) as count FROM notifications WHERE status = 'delivered'")[0]?.count || 0;
  const notificationsFailed = queryDb("SELECT COUNT(*) as count FROM notifications WHERE status = 'failed'")[0]?.count || 0;
  const notificationsPending = queryDb("SELECT COUNT(*) as count FROM notifications WHERE status = 'pending'")[0]?.count || 0;
  const totalNotifs = notificationsDelivered + notificationsFailed + notificationsPending;
  const notifSuccessRate = totalNotifs > 0 ? ((notificationsDelivered / totalNotifs) * 100).toFixed(1) : '0.0';

  const uptime = queryDb("SELECT value FROM site_health WHERE metric = 'uptime' ORDER BY recorded_at DESC LIMIT 1")[0]?.value || '99.9';
  const pageLoad = queryDb("SELECT value FROM site_health WHERE metric = 'page_load_ms' ORDER BY recorded_at DESC LIMIT 1")[0]?.value || '200';
  const visitors = queryDb("SELECT value FROM site_health WHERE metric = 'visitors_24h' ORDER BY recorded_at DESC LIMIT 1")[0]?.value || '0';

  return {
    totalProducts,
    totalOrders,
    totalRevenue,
    pendingOrders,
    deliveredOrders,
    abandonmentRate,
    lowStock,
    notifSuccessRate,
    uptime,
    pageLoad,
    visitors,
  };
}

export function getProducts() {
  return queryDb("SELECT * FROM products ORDER BY name");
}

export function getOrders() {
  return queryDb("SELECT * FROM orders ORDER BY created_at DESC");
}

export function getOrderById(id) {
  const orders = queryDb(`SELECT * FROM orders WHERE id = '${id}'`);
  if (orders.length === 0) return null;
  const order = orders[0];
  order.items = queryDb(`SELECT oi.*, p.name as product_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = '${id}'`);
  order.tracking = queryDb(`SELECT * FROM delivery_tracking WHERE order_id = '${id}' ORDER BY timestamp`);
  return order;
}

export function getNotifications() {
  return queryDb("SELECT * FROM notifications ORDER BY created_at DESC");
}

export function getDeliveryTracking() {
  return queryDb("SELECT * FROM delivery_tracking ORDER BY timestamp DESC");
}

export function getSiteHealth() {
  return queryDb("SELECT * FROM site_health ORDER BY recorded_at DESC");
}

export function getPerformanceData() {
  const ordersByDay = queryDb(`
    SELECT DATE(created_at) as day, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue
    FROM orders 
    GROUP BY DATE(created_at) 
    ORDER BY day
  `);
  
  const ordersByStatus = queryDb(`
    SELECT status, COUNT(*) as count 
    FROM orders 
    GROUP BY status
  `);
  
  const categorySales = queryDb(`
    SELECT p.category, COUNT(*) as sold
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.category
  `);

  return { ordersByDay, ordersByStatus, categorySales };
}
// ─── Storefront Helpers ────────────────────────────────────

export function getAllProducts() {
  return queryDb("SELECT * FROM products ORDER BY created_at DESC");
}

export function getProductsByCategory(category) {
  return queryDb(`SELECT * FROM products WHERE category = '${category.replace(/'/g, "''")}' ORDER BY created_at DESC`);
}

export function getProductBySlug(slug) {
  const results = queryDb(`SELECT * FROM products WHERE slug = '${slug.replace(/'/g, "''")}' LIMIT 1`);
  return results.length > 0 ? results[0] : null;
}

export function getProductById(id) {
  const results = queryDb(`SELECT * FROM products WHERE id = '${id.replace(/'/g, "''")}' LIMIT 1`);
  return results.length > 0 ? results[0] : null;
}

export function updateStock(productId, quantity) {
  queryDb(`UPDATE products SET stock_quantity = stock_quantity - ${quantity} WHERE id = '${productId.replace(/'/g, "''")}'`);
}

export function getCartItems(sessionId) {
  return queryDb(
    `SELECT ci.*, p.name, p.price, p.image_url, p.slug 
     FROM cart_items ci 
     JOIN products p ON ci.product_id = p.id 
     WHERE ci.session_id = '${sessionId.replace(/'/g, "''")}' 
     ORDER BY ci.created_at DESC`
  );
}

export function addCartItem(sessionId, productId, quantity = 1) {
  const existing = queryDb(
    `SELECT * FROM cart_items WHERE session_id = '${sessionId.replace(/'/g, "''")}' AND product_id = '${productId.replace(/'/g, "''")}' LIMIT 1`
  );
  if (existing.length > 0) {
    return queryDb(
      `UPDATE cart_items SET quantity = quantity + ${quantity} WHERE session_id = '${sessionId.replace(/'/g, "''")}' AND product_id = '${productId.replace(/'/g, "''")}'`
    );
  }
  const id = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return queryDb(
    `INSERT INTO cart_items (id, session_id, product_id, quantity) VALUES ('${id}', '${sessionId.replace(/'/g, "''")}', '${productId.replace(/'/g, "''")}', ${quantity})`
  );
}

export function updateCartItemQuantity(itemId, quantity) {
  return queryDb(`UPDATE cart_items SET quantity = ${quantity} WHERE id = '${itemId.replace(/'/g, "''")}'`);
}

export function removeCartItem(itemId) {
  return queryDb(`DELETE FROM cart_items WHERE id = '${itemId.replace(/'/g, "''")}'`);
}

export function clearCart(sessionId) {
  return queryDb(`DELETE FROM cart_items WHERE session_id = '${sessionId.replace(/'/g, "''")}'`);
}

export function createCustomer(name, email, phone, address, city, state, pincode) {
  const id = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  queryDb(
    `INSERT INTO customers (id, name, email, phone, address, city, state, pincode) VALUES ('${id}', '${name.replace(/'/g, "''")}', '${email.replace(/'/g, "''")}', '${(phone || '').replace(/'/g, "''")}', '${(address || '').replace(/'/g, "''")}', '${(city || '').replace(/'/g, "''")}', '${(state || '').replace(/'/g, "''")}', '${(pincode || '').replace(/'/g, "''")}')`
  );
  return id;
}

export function getCustomerById(id) {
  const results = queryDb(`SELECT * FROM customers WHERE id = '${id.replace(/'/g, "''")}' LIMIT 1`);
  return results.length > 0 ? results[0] : null;
}

export function createOrder(customerId, totalAmount, shippingAddress, shippingCity, shippingState, shippingPincode, stripeSessionId) {
  const id = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  queryDb(
    `INSERT INTO orders (id, customer_id, total_amount, shipping_address, shipping_city, shipping_state, shipping_pincode, stripe_session_id) VALUES ('${id}', '${customerId.replace(/'/g, "''")}', ${totalAmount}, '${(shippingAddress || '').replace(/'/g, "''")}', '${(shippingCity || '').replace(/'/g, "''")}', '${(shippingState || '').replace(/'/g, "''")}', '${(shippingPincode || '').replace(/'/g, "''")}', '${(stripeSessionId || '').replace(/'/g, "''")}')`
  );
  return id;
}

export function addOrderItem(orderId, productId, quantity, unitPrice) {
  const id = `oi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  queryDb(
    `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES ('${id}', '${orderId.replace(/'/g, "''")}', '${productId.replace(/'/g, "''")}', ${quantity}, ${unitPrice})`
  );
}

export function getOrderBySessionId(sessionId) {
  const results = queryDb(
    `SELECT * FROM orders WHERE stripe_session_id = '${sessionId.replace(/'/g, "''")}' LIMIT 1`
  );
  return results.length > 0 ? results[0] : null;
}

export function getOrderItems(orderId) {
  return queryDb(
    `SELECT oi.*, p.name, p.image_url, p.slug 
     FROM order_items oi 
     JOIN products p ON oi.product_id = p.id 
     WHERE oi.order_id = '${orderId.replace(/'/g, "''")}'`
  );
}

export function updateOrderStatus(orderId, status, paymentStatus) {
  let sql = `UPDATE orders SET status = '${status.replace(/'/g, "''")}'`;
  if (paymentStatus) {
    sql += `, payment_status = '${paymentStatus.replace(/'/g, "''")}'`;
  }
  sql += ` WHERE id = '${orderId.replace(/'/g, "''")}'`;
  return queryDb(sql);
}

export function getTrackingByOrderId(orderId) {
  return queryDb(
    `SELECT * FROM delivery_tracking WHERE order_id = '${orderId.replace(/'/g, "''")}' ORDER BY timestamp ASC`
  );
}

export function addTrackingMilestone(orderId, milestone, status, location, notes) {
  const id = `trk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  queryDb(
    `INSERT INTO delivery_tracking (id, order_id, milestone, status, location, notes) VALUES ('${id}', '${orderId.replace(/'/g, "''")}', '${milestone.replace(/'/g, "''")}', '${status.replace(/'/g, "''")}', '${(location || '').replace(/'/g, "''")}', '${(notes || '').replace(/'/g, "''")}')`
  );
}

export function logNotification(orderId, type, recipient, message, status, subject = '') {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const sentAtValue = status === 'sent' ? "datetime('now')" : 'NULL';
  
  // Log to notification_log (documented in SCHEMA.md)
  queryDb(
    `INSERT INTO notification_log (id, order_id, type, recipient, message, status, sent_at) VALUES ('${id}', '${orderId.replace(/'/g, "''")}', '${type.replace(/'/g, "''")}', '${recipient.replace(/'/g, "''")}', '${(message || '').replace(/'/g, "''")}', '${status.replace(/'/g, "''")}', ${sentAtValue})`
  );

  // Log to notifications (used by dashboard stats)
  const deliveredAtValue = status === 'sent' ? "datetime('now')" : 'NULL';
  queryDb(
    `INSERT INTO notifications (id, order_id, type, recipient, subject, message, status, delivered_at) VALUES ('${id}', '${orderId.replace(/'/g, "''")}', '${type.replace(/'/g, "''")}', '${recipient.replace(/'/g, "''")}', '${(subject || '').replace(/'/g, "''")}', '${(message || '').replace(/'/g, "''")}', '${status === 'sent' ? 'delivered' : 'failed'}', ${deliveredAtValue})`
  );
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
