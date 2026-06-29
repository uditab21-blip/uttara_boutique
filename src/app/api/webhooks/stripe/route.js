import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderStatus, addTrackingMilestone, logNotification } from '@/lib/db';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (endpointSecret) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
      event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } else {
      event = JSON.parse(rawBody);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        updateOrderStatus(orderId, 'confirmed', 'paid');
        console.log(`Order ${orderId} confirmed and payment received`);

        addTrackingMilestone(orderId, 'Payment Confirmed', 'in_transit', '', 'Payment received. Order is being prepared.');
        logNotification(orderId, 'email', session.customer_email || '',
          `Payment confirmed for Order #${orderId.slice(-8).toUpperCase()}`, 'sent');
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      if (orderId) {
        updateOrderStatus(orderId, 'cancelled', 'unpaid');
        console.log(`Order ${orderId} cancelled due to payment timeout`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
