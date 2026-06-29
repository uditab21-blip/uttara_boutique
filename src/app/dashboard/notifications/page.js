'use client';

import { useState, useEffect } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/notifications')
      .then(r => r.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const interval = setInterval(() => {
      fetch('/api/dashboard/notifications')
        .then(r => r.json())
        .then(setNotifications)
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const delivered = notifications.filter(n => n.status === 'delivered').length;
  const failed = notifications.filter(n => n.status === 'failed').length;
  const pending = notifications.filter(n => n.status === 'pending').length;
  const total = notifications.length;
  const successRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-maroon-700">Notifications Log</h1>
        <p className="text-ethnic-muted mt-1">Track SMS and email notification delivery</p>
        <div className="h-0.5 w-24 bg-gradient-to-r from-saffron-500 to-maroon-500 mt-3 rounded-full" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <div className="stat-card">
          <span className="stat-label">Total Sent</span>
          <span className="stat-value text-saffron-600">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Delivered</span>
          <span className="stat-value text-green-600">{delivered}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Failed</span>
          <span className={`stat-value ${failed > 0 ? 'text-red-600' : 'text-green-600'}`}>{failed}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value text-yellow-600">{pending}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Success Rate</span>
          <span className={`stat-value ${parseFloat(successRate) > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
            {successRate}%
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ethnic-muted">Loading notifications...</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gold-50 border-b border-gold-100">
                  <th className="text-left p-4 font-medium text-ethnic-text">ID</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Type</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Recipient</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Subject</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Status</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Created</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Delivered</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n, idx) => (
                  <tr key={n.id} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4 font-mono text-xs">{n.id}</td>
                    <td className="p-4">
                      <span className={`badge ${n.type === 'email' ? 'badge-info' : 'badge-success'}`}>
                        {n.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{n.recipient}</td>
                    <td className="p-4 text-sm max-w-xs truncate">{n.subject || '-'}</td>
                    <td className="p-4">
                      <span className={`badge ${
                        n.status === 'delivered' ? 'badge-success' : 
                        n.status === 'failed' ? 'badge-danger' : 
                        'badge-warning'
                      }`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ethnic-muted">{n.created_at || 'N/A'}</td>
                    <td className="p-4 text-sm text-ethnic-muted">{n.delivered_at || '-'}</td>
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