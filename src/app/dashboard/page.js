'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    
    const interval = setInterval(() => {
      fetch('/api/dashboard/stats')
        .then(r => r.json())
        .then(setStats)
        .catch(() => {});
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ethnic-muted text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, color: 'text-saffron-600', link: '/dashboard/inventory' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, color: 'text-maroon-600', link: '/dashboard/orders' },
    { label: 'Revenue (₹)', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'text-gold-600', link: '/dashboard/performance' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, color: 'text-yellow-600', link: '/dashboard/orders' },
    { label: 'Delivered', value: stats?.deliveredOrders || 0, color: 'text-green-600', link: '/dashboard/orders' },
    { label: 'Low Stock Items', value: stats?.lowStock || 0, color: stats?.lowStock > 0 ? 'text-red-600' : 'text-green-600', link: '/dashboard/inventory' },
    { label: 'Abandonment Rate', value: `${stats?.abandonmentRate || 0}%`, color: 'text-orange-600', link: '/dashboard/performance' },
    { label: 'Notif. Success', value: `${stats?.notifSuccessRate || 0}%`, color: 'text-blue-600', link: '/dashboard/notifications' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-maroon-700">Dashboard Overview</h1>
        <p className="text-ethnic-muted mt-1">Welcome to Uttara Boutique — your business at a glance</p>
        <div className="h-0.5 w-24 bg-gradient-to-r from-saffron-500 to-maroon-500 mt-3 rounded-full" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.link} className="stat-card hover:shadow-lg transition-shadow">
            <span className="stat-label">{card.label}</span>
            <span className={`stat-value ${card.color}`}>{card.value}</span>
          </Link>
        ))}
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/inventory" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📦</span>
            <div>
              <h3 className="font-bold text-ethnic-text">Inventory</h3>
              <p className="text-sm text-ethnic-muted">Manage products, stock levels, and pricing</p>
            </div>
          </div>
        </Link>
        
        <Link href="/dashboard/orders" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📋</span>
            <div>
              <h3 className="font-bold text-ethnic-text">Orders</h3>
              <p className="text-sm text-ethnic-muted">Track orders, delivery status, and payments</p>
            </div>
          </div>
        </Link>
        
        <Link href="/dashboard/performance" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📈</span>
            <div>
              <h3 className="font-bold text-ethnic-text">Performance</h3>
              <p className="text-sm text-ethnic-muted">View analytics, charts, and sales data</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Site status bar */}
      <div className="mt-8 card flex items-center gap-4">
        <span className={`inline-block w-3 h-3 rounded-full ${stats?.uptime && parseFloat(stats.uptime) > 98 ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <div>
          <span className="font-medium text-ethnic-text">Site Status</span>
          <span className="text-ethnic-muted ml-2 text-sm">Uptime: {stats?.uptime || '99.9'}% | Page Load: {stats?.pageLoad || '200'}ms | 24h Visitors: {stats?.visitors || '0'}</span>
        </div>
      </div>
    </div>
  );
}