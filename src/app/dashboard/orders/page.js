'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const statusStyles = {
  delivered: 'badge-success',
  shipped: 'badge-info',
  confirmed: 'badge-warning',
  pending: 'badge-neutral',
  cancelled: 'badge-danger',
};

const paymentStyles = {
  paid: 'badge-success',
  unpaid: 'badge-warning',
  refunded: 'badge-info',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/orders')
      .then(r => r.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const interval = setInterval(() => {
      fetch('/api/dashboard/orders')
        .then(r => r.json())
        .then(setOrders)
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-maroon-700">Orders Management</h1>
        <p className="text-ethnic-muted mt-1">Track customer orders, payments, and delivery status</p>
        <div className="h-0.5 w-24 bg-gradient-to-r from-saffron-500 to-maroon-500 mt-3 rounded-full" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value text-saffron-600">{orders.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value text-yellow-600">{orders.filter(o => o.status === 'pending').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Shipped/In Transit</span>
          <span className="stat-value text-blue-600">{orders.filter(o => o.status === 'shipped' || o.status === 'confirmed').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Delivered</span>
          <span className="stat-value text-green-600">{orders.filter(o => o.status === 'delivered').length}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ethnic-muted">Loading orders...</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gold-50 border-b border-gold-100">
                  <th className="text-left p-4 font-medium text-ethnic-text">Order ID</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Customer</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Status</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Payment</th>
                  <th className="text-right p-4 font-medium text-ethnic-text">Total (₹)</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Date</th>
                  <th className="text-center p-4 font-medium text-ethnic-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4 font-mono text-sm">{order.id}</td>
                    <td className="p-4">
                      <span className="font-medium text-ethnic-text">{order.customer_id || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <span className={statusStyles[order.status] || 'badge-neutral'}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={paymentStyles[order.payment_status] || 'badge-neutral'}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium">
                      ₹{(order.total_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-sm text-ethnic-muted">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        href={`/dashboard/orders/${order.id}`}
                        className="text-saffron-600 hover:text-saffron-800 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}