# Uttara Boutique - Database Schema

## Tables

### products
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Product ID (e.g., prod_001) |
| name | TEXT | Product name |
| slug | TEXT (UNIQUE) | URL slug |
| description | TEXT | Product description |
| price | INTEGER | Price in INR |
| category | TEXT | Category (dhakai-jamdani, baluchari, tant, gorod) — Bengali handloom categories |
| image_url | TEXT | Product image URL |
| stock_quantity | INTEGER (default: 0) | Current stock level |
| created_at | TEXT | ISO datetime |

### orders
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Order ID (e.g., ord_001) |
| customer_id | TEXT | Customer identifier |
| total_amount | INTEGER | Total amount in INR |
| status | TEXT | pending/confirmed/shipped/delivered/cancelled |
| payment_status | TEXT | unpaid/paid/refunded |
| shipping_address | TEXT | Shipping address |
| shipping_city | TEXT | City |
| shipping_state | TEXT | State |
| shipping_pincode | TEXT | Pincode |
| stripe_session_id | TEXT | Stripe session ID |
| created_at | TEXT | ISO datetime |

### order_items
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Item ID |
| order_id | TEXT (FK) | Reference to orders.id |
| product_id | TEXT (FK) | Reference to products.id |
| quantity | INTEGER | Quantity ordered |
| unit_price | INTEGER | Price per unit |

### carts
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Cart ID |
| session_id | TEXT | Session identifier |
| product_id | TEXT (FK) | Reference to products.id |
| quantity | INTEGER (default: 1) | Quantity |
| status | TEXT | active/abandoned/converted |
| created_at | TEXT | ISO datetime |
| updated_at | TEXT | ISO datetime |

### notifications
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Notification ID |
| order_id | TEXT (FK) | Reference to orders.id |
| type | TEXT | sms/email |
| recipient | TEXT | Email or phone number |
| subject | TEXT | Email subject |
| message | TEXT | Notification content |
| status | TEXT | pending/delivered/failed |
| created_at | TEXT | ISO datetime |
| delivered_at | TEXT | ISO datetime when delivered |

### delivery_tracking
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Tracking ID |
| order_id | TEXT (FK) | Reference to orders.id |
| milestone | TEXT | Milestone name (e.g., Order Confirmed, Shipped, Delivered) |
| status | TEXT | pending/in_transit/delivered/failed |
| location | TEXT | Location/city |
| timestamp | TEXT | ISO datetime |
| notes | TEXT | Optional notes |

### site_health
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Health record ID |
| metric | TEXT | Metric name (uptime, page_load_ms, visitors_24h, etc.) |
| value | TEXT | Metric value |
| recorded_at | TEXT | ISO datetime |

## Dashboard API Endpoints

All endpoints are under `/api/dashboard/` and return JSON.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard/stats` | GET | Overview statistics |
| `/api/dashboard/inventory` | GET | All products with stock |
| `/api/dashboard/orders` | GET | All orders (optional ?id= for single order) |
| `/api/dashboard/notifications` | GET | All notification records |
| `/api/dashboard/performance` | GET | Orders by day, status, and category |
| `/api/dashboard/site-health` | GET | Site health metrics |
| `/api/dashboard/login` | POST | Simple password auth |

## Dashboard Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview with KPI cards |
| `/dashboard/inventory` | Product stock table with low-stock alerts |
| `/dashboard/orders` | Orders list |
| `/dashboard/orders/[id]` | Order detail with items & tracking |
| `/dashboard/performance` | Charts (orders/day, revenue, status pie, category) |
| `/dashboard/site-health` | Site status and metrics |
| `/dashboard/notifications` | Notification log table |

## Auth

Simple password protection via env var `DASHBOARD_PASSWORD` (default: `uttara2026`).
Login at `/dashboard` — cookie-based session lasts 8 hours.

## Theme Colors (Tailwind)

- `saffron-*`: Primary accent (#f97316 range)
- `maroon-*`: Deep reds (#7c1d1d range)
- `gold-*`: Gold accents (#d4a017 range)
- `ethnic-*`: Backgrounds and text (#fdf6f0, #2d1b0e)