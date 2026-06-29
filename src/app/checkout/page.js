'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    const sessionId = localStorage.getItem('uttara_session_id');
    if (!sessionId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/cart?session_id=${sessionId}`);
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (e) {
      console.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validate form
    for (const key of ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode']) {
      if (!form[key].trim()) {
        setError(`Please enter your ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`);
        setSubmitting(false);
        return;
      }
    }

    const sessionId = localStorage.getItem('uttara_session_id');
    if (!sessionId) {
      setError('Session expired. Please add items to cart again.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          customer: form,
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.order_id) {
        // Fallback: direct to order page
        router.push(`/orders/${data.order_id}`);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (e) {
      setError('Failed to process checkout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total >= 5000 ? 0 : 199;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-maroon-700 text-3xl font-serif font-bold mb-8">Checkout</h1>
        <div className="h-64 skeleton rounded-lg"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-maroon-700 text-2xl font-serif font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to your cart before checking out.</p>
        <Link href="/products" className="inline-flex items-center px-6 py-3 bg-maroon-500 text-cream-500 rounded-lg hover:bg-maroon-600">
          Browse Collection →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-maroon-700 text-3xl font-serif font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gold-100 p-6">
            <h2 className="text-maroon-700 text-xl font-serif font-semibold mb-6">Shipping Details</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Your full name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="email@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="+91 98765 43210" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="House/Flat No., Street, Landmark" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="City" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input type="text" name="state" value={form.state} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="State" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input type="text" name="pincode" value={form.pincode} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="6-digit pincode" maxLength={6} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full py-3 bg-maroon-500 text-cream-500 rounded-lg font-semibold hover:bg-maroon-600 transition-colors shadow-md disabled:opacity-50"
            >
              {submitting ? 'Processing...' : `Pay ₹${(total + shipping).toLocaleString('en-IN')}`}
            </button>

            <p className="mt-3 text-xs text-gray-400 text-center">
              Secured by Stripe. Your payment information is encrypted.
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gold-100 p-6 sticky top-8">
            <h2 className="text-maroon-700 text-lg font-serif font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-16 rounded-md overflow-hidden bg-cream-200 flex-shrink-0">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-grow text-sm">
                    <p className="text-maroon-700 font-medium">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-gold-600 font-semibold">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gold-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="border-t border-gold-100 pt-2 flex justify-between text-lg">
                <span className="text-maroon-700 font-semibold">Total</span>
                <span className="text-maroon-700 font-bold">₹{(total + shipping).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
