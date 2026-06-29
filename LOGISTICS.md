# Uttara Boutique - Logistics & Notifications

## Notification System

The notification system is built with a modular architecture using the Adapter pattern. This allows us to easily swap SMS and Email providers.

### Architecture

- `NotificationService`: Abstract base class defining the interface.
- `ConsoleNotificationService`: Implementation for development that logs to console.
- `NotificationManager`: High-level manager that handles business logic for different types of notifications (Order Confirmation, Shipping Update, Delivery Confirmation).

To add a new provider (e.g., Twilio for SMS or SendGrid for Email), create a new class extending `NotificationService` and update the initialization in `src/lib/notifications/index.js`.

## Delivery Tracking

Tracking is managed by the `TrackingManager`, which handles milestone transitions and automatically triggers relevant notifications.

### Milestones

1. `placed`: Order received.
2. `confirmed`: Order verified and accepted.
3. `packed`: Items packaged and ready for pickup.
4. `shipped`: Handed over to courier (Triggers Shipping SMS/Email).
5. `in_transit`: Package moving through courier network.
6. `out_for_delivery`: Package with local delivery agent.
7. `delivered`: Package received by customer (Triggers Delivery SMS/Email).

### 3PL Integration (Future)

The current implementation is designed to be "3PL-Ready". When we integrate with partners like Shadowfax, DHL, or BlueDart:

1. Create a `TrackingAdapter` interface.
2. Implement specific adapters for each partner.
3. The `TrackingManager` will use these adapters to:
   - Create shipments via partner APIs.
   - Poll for tracking updates or receive webhooks.
   - Update our internal `delivery_tracking` table based on external status changes.

## Database Schema

- `delivery_tracking`: Stores milestone history for each order.
- `notification_log`: Logs every notification attempt (SMS/Email), including status (sent/failed).
