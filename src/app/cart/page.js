'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

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

  async function handleUpdateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    const sessionId = localStorage.getItem('uttara_session_id');
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, item_id: itemId, quantity: newQuantity }),
      });
      await loadCart();
    } catch (e) {
      console.error('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  }

  async function handleRemove(itemId) {
    setUpdating(itemId);
    const sessionId = localStorage.getItem('uttara_session_id');
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, item_id: itemId }),
      });
      await loadCart();
      const totalCount = cartItems.reduce((sum, item) => sum + (item.id === itemId ? 0 : item.quantity), 0);
      window.dispatchEvent(new CustomEvent('cart-update', { detail: totalCount }));
    } catch (e) {
      console.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-maroon-700 text-3xl font-serif font-bold mb-8">Your Cart</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 skeleton rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-maroon-700 text-3xl font-serif font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gold-500 text-6xl mb-4">🛒</div>
          <h2 className="text-maroon-700 text-xl font-serif font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Explore our collection and add your favorite saris.</p>
          <Link href="/products" className="inline-flex items-center px-6 py-3 bg-maroon-500 text-cream-500 rounded-lg hover:bg-maroon-600 transition-colors">
            Browse Collection →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gold-100 p-4 flex gap-4">
                {/* Product Image */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-md overflow-hidden bg-cream-200 flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-grow flex flex-col">
                  <Link href={`/products/${item.slug}`} className="text-maroon-700 font-semibold hover:text-maroon-500">
                    {item.name}
                  </Link>
                  <span className="text-gold-600 font-semibold mt-1">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-maroon-500 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="font-medium w-6 text-center">
                        {updating === item.id ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-maroon-500 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={updating === item.id}
                      className="text-red-400 hover:text-red-600 text-sm disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right flex-shrink-0">
                  <div className="text-maroon-700 font-bold">
                    ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gold-100 p-6 h-fit">
            <h2 className="text-maroon-700 text-xl font-serif font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">{total >= 5000 ? 'FREE' : '₹199'}</span>
              </div>
              <div className="border-t border-gold-100 pt-3 flex justify-between text-lg">
                <span className="text-maroon-700 font-semibold">Total</span>
                <span className="text-maroon-700 font-bold">
                  ₹{(total + (total >= 5000 ? 0 : 199)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 w-full block text-center py-3 bg-maroon-500 text-cream-500 rounded-lg font-semibold hover:bg-maroon-600 transition-colors shadow-md"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="mt-3 w-full block text-center py-2 text-maroon-500 hover:text-maroon-600 text-sm"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
