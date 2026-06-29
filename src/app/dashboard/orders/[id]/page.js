'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrderDetailPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/dashboard/orders?id=${params.id}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ethnic-muted text-lg">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-maroon-700 mb-4">Order Not Found</h2>
        <Link href="/dashboard/orders" className="text-saffron-600 hover:underline">Back to Orders</Link>
      </div>
    );
  }

  const statusStyles = {
    delivered: 'badge-success',
    shipped: 'badge-info',
    confirmed: 'badge-warning',
    pending: 'badge-neutral',
    cancelled: 'badge-danger',
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/orders" className="text-saffron-600 hover:underline text-sm">
          ← Back to Orders
        </Link>
        <h1 className="text-3xl font-bold font-display text-maroon-700 mt-2">
          Order {order.id}
        </h1>
        <div className="h-0.5 w-24 bg-gradient-to-r from-saffron-500 to-maroon-500 mt-3 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-ethnic-text mb-4">Order Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-ethnic-muted">Status</span>
              <span className={statusStyles[order.status]}>{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ethnic-muted">Payment</span>
              <span className={order.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}>
                {order.payment_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ethnic-muted">Total Amount</span>
              <span className="font-bold text-maroon-700">₹{(order.total_amount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ethnic-muted">Date</span>
              <span>{order.created_at || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-ethnic-text mb-4">Shipping Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-ethnic-muted">Address</span>
              <span className="text-right">{order.shipping_address || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ethnic-muted">City</span>
              <span>{order.shipping_city || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ethnic-muted">State</span>
              <span>{order.shipping_state || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ethnic-muted">Pincode</span>
              <span>{order.shipping_pincode || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card mb-6">
        <h2 className="text-lg font-bold text-ethnic-text mb-4">Order Items</h2>
        {order.items && order.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gold-50 border-b border-gold-100">
                  <th className="text-left p-3 font-medium text-ethnic-text">Product</th>
                  <th className="text-right p-3 font-medium text-ethnic-text">Qty</th>
                  <th className="text-right p-3 font-medium text-ethnic-text">Unit Price</th>
                  <th className="text-right p-3 font-medium text-ethnic-text">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50">
                    <td className="p-3">{item.product_name || item.product_id}</td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right">₹{(item.unit_price || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-medium">₹{((item.unit_price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-ethnic-muted">No items found for this order.</p>
        )}
      </div>

      {/* Delivery Tracking */}
      <div className="card">
        <h2 className="text-lg font-bold text-ethnic-text mb-4">Delivery Tracking</h2>
        {order.tracking && order.tracking.length > 0 ? (
          <div className="space-y-0">
            {order.tracking.map((t, idx) => (
              <div key={t.id} className="flex gap-4 pb-4 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    t.status === 'delivered' ? 'bg-green-500 border-green-500' :
                    t.status === 'in_transit' ? 'bg-blue-500 border-blue-500' :
                    t.status === 'pending' ? 'bg-yellow-300 border-yellow-400' :
                    'bg-gray-300 border-gray-300'
                  }`} />
                  {idx < order.tracking.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium text-ethnic-text">{t.milestone}</p>
                  <p className="text-sm text-ethnic-muted">
                    {t.location && `${t.location} — `}{t.timestamp || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ethnic-muted">No tracking information available.</p>
        )}
      </div>
    </div>
  );
}