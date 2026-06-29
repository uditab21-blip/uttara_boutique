import { NextResponse } from 'next/server';
import {
  getCartItems,
  clearCart,
  createCustomer,
  createOrder,
  addOrderItem,
  updateStock,
  addTrackingMilestone,
  logNotification,
} from '@/lib/db';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, customer } = body;

    if (!session_id || !customer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const items = getCartItems(session_id);
    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const customerId = createCustomer(
      customer.name, customer.email, customer.phone,
      customer.address, customer.city, customer.state, customer.pincode
    );

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = createOrder(
      customerId, totalAmount,
      customer.address, customer.city, customer.state, customer.pincode, ''
    );

    for (const item of items) {
      addOrderItem(orderId, item.product_id, item.quantity, item.price);
      updateStock(item.product_id, item.quantity);
    }

    const origin = process.env.NEXT_PUBLIC_BASE_URL ||
      (request.headers.get('x-forwarded-host')
        ? `https://${request.headers.get('x-forwarded-host')}`
        : `http://${request.headers.get('host') || 'localhost:3000'}`);

    try {
      const session = await createCheckoutSession({
        items: items.map(item => ({
          name: item.name,
          image_url: item.image_url,
          unit_price: item.price,
          quantity: item.quantity,
        })),
        customerEmail: customer.email,
        customerName: customer.name,
        orderId,
        successUrl: `${origin}/orders/${orderId}`,
        cancelUrl: `${origin}/checkout?cancelled=true`,
      });

      addTrackingMilestone(orderId, 'Order Placed', 'pending', '', 'Order confirmed and payment being processed');
      logNotification(orderId, 'email', customer.email, `Order #${orderId.slice(-8).toUpperCase()} confirmed!`, 'pending');
      if (customer.phone) {
        logNotification(orderId, 'sms', customer.phone, `Order #${orderId.slice(-8).toUpperCase()} confirmed! Track at ${origin}/orders/${orderId}`, 'pending');
      }

      clearCart(session_id);
      return NextResponse.json({ url: session.url, order_id: orderId });
    } catch (stripeError) {
      console.error('Stripe session creation failed, falling back to direct order:', stripeError.message);
      return NextResponse.json({
        order_id: orderId,
        note: 'Payment processing unavailable. Order created successfully.'
      });
    }
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
  }
}
