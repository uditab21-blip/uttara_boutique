# Uttara Boutique - API Documentation

## Dashboard API

All endpoints prefixed with `/api/dashboard/`. Returns JSON.

### GET /api/dashboard/stats
Returns overview KPIs:
```json
{
  "totalProducts": 8,
  "totalOrders": 10,
  "totalRevenue": 162500,
  "pendingOrders": 2,
  "deliveredOrders": 3,
  "abandonmentRate": "28.6",
  "lowStock": 4,
  "notifSuccessRate": "70.0",
  "uptime": "99.8",
  "pageLoad": "245",
  "visitors": "342"
}
```

### GET /api/dashboard/inventory
Returns all products with stock info.

### GET /api/dashboard/orders
Returns all orders. Optional `?id=ord_001` for single order with items & tracking.

### GET /api/dashboard/notifications
Returns all notification records.

### GET /api/dashboard/performance
Returns:
- `ordersByDay` - Orders count and revenue grouped by date
- `ordersByStatus` - Order count by status
- `categorySales` - Units sold by product category

### GET /api/dashboard/site-health
Returns site health metrics.

### POST /api/dashboard/login
Authenticate with password. Body: `{ "password": "..." }`.
Returns `{ "success": true }` with cookie on success.

## Storefront API

### GET /api/products
Returns product catalog.

### GET /api/products/[slug]
Returns single product by slug.

### POST /api/cart
Cart operations.

### POST /api/checkout
Checkout and Stripe payment processing.

### GET /api/orders/[id]
Returns order by ID.