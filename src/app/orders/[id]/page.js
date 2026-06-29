'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          setItems(data.items || []);
          setTracking(data.tracking || []);
        } else {
          setError('Order not found');
        }
      } catch (e) {
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-8 w-1/2 skeleton rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-32 skeleton rounded-lg"></div>
          <div className="h-32 skeleton rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-maroon-700 text-2xl font-serif font-semibold mb-4">Order Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn&apos;t find this order.</p>
        <Link href="/products" className="inline-flex items-center px-6 py-3 bg-maroon-500 text-cream-500 rounded-lg hover:bg-maroon-600">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-saffron-100 text-saffron-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const paymentColors = {
    unpaid: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h2 className="text-green-800 text-xl font-semibold">Thank you for your order!</h2>
        <p className="text-green-600 text-sm mt-1">We&apos;ll send you updates via email and SMS.</p>
      </div>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gold-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-maroon-700 text-2xl font-serif font-bold mb-2">Order #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-gray-500 text-sm">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentColors[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
              {order.payment_status === 'paid' ? 'Paid' : order.payment_status === 'unpaid' ? 'Unpaid' : 'Refunded'}
            </span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-cream-100 rounded-lg">
          <h3 className="text-maroon-700 font-semibold mb-2">Shipping Address</h3>
          <p className="text-gray-600 text-sm">
            {order.shipping_address}<br />
            {order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-500 text-sm">Total Amount</span>
          <span className="text-maroon-700 text-2xl font-bold">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gold-100 p-6 mb-6">
        <h2 className="text-maroon-700 text-xl font-serif font-semibold mb-4">Items</h2>
        <div className="divide-y divide-gold-100">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-3">
              <div className="w-16 h-20 rounded-md overflow-hidden bg-cream-200 flex-shrink-0">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-grow">
                <Link href={`/products/${item.slug}`} className="text-maroon-700 font-medium hover:text-maroon-500">
                  {item.name}
                </Link>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500 text-sm">Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString('en-IN')}</span>
                  <span className="font-semibold">₹{Number(item.quantity * item.unit_price).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Tracking */}
      <div className="bg-white rounded-lg shadow-sm border border-gold-100 p-6">
        <h2 className="text-maroon-700 text-xl font-serif font-semibold mb-6">Delivery Tracking</h2>

        {tracking.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2">📦</div>
            <p>No tracking updates yet. We&apos;ll notify you when your order ships.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {tracking.map((entry, index) => (
              <div key={entry.id} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    entry.status === 'delivered' ? 'bg-green-500 border-green-500' :
                    entry.status === 'in_transit' ? 'bg-blue-500 border-blue-500' :
                    entry.status === 'failed' ? 'bg-red-500 border-red-500' :
                    'bg-gray-300 border-gray-300'
                  }`} />
                  {index < tracking.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200" />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-6 ${index === tracking.length - 1 ? '' : ''}`}>
                  <p className="text-maroon-700 font-medium">{entry.milestone}</p>
                  <p className="text-gray-500 text-sm">{entry.location}</p>
                  <p className="text-gray-400 text-xs">{new Date(entry.timestamp).toLocaleString('en-IN')}</p>
                  {entry.notes && <p className="text-gray-500 text-sm mt-1">{entry.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <Link href="/products" className="inline-flex items-center px-6 py-3 bg-maroon-500 text-cream-500 rounded-lg hover:bg-maroon-600 transition-colors">
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}
