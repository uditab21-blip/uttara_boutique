const Stripe = require('stripe');

// Initialize Stripe - uses platform managed keys
// In production, set via environment variables
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

/**
 * Create a Stripe Checkout Session
 */
async function createCheckoutSession({ items, customerEmail, customerName, orderId, successUrl, cancelUrl }) {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.name,
        images: item.image_url ? [item.image_url] : [],
      },
      unit_amount: item.unit_price, // Already in paise (smallest currency unit for INR)
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      order_id: orderId,
    },
    // Support future multi-currency by making currency configurable
    // currency: 'inr', // Already set per price_data
  });

  return session;
}

/**
 * Construct Stripe webhook event from raw body and signature
 */
function constructWebhookEvent(rawBody, signature, endpointSecret) {
  return stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
}

/**
 * Retrieve a Stripe session
 */
async function retrieveSession(sessionId) {
  return stripe.checkout.sessions.retrieve(sessionId);
}

module.exports = {
  stripe,
  createCheckoutSession,
  constructWebhookEvent,
  retrieveSession,
};