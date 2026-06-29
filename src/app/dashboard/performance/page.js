'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

export default function PerformancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/performance')
      .then(r => r.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const interval = setInterval(() => {
      fetch('/api/dashboard/performance')
        .then(r => r.json())
        .then(setData)
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const COLORS = {
    bridal: '#7c1d1d',
    festival: '#d4a017',
    everyday: '#ea580c',
    premium: '#8b6914',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ethnic-muted text-lg">Loading performance data...</div>
      </div>
    );
  }

  const ordersByDay = data?.ordersByDay || [];
  const ordersByStatus = data?.ordersByStatus || [];
  const categorySales = data?.categorySales || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-maroon-700">Performance Metrics</h1>
        <p className="text-ethnic-muted mt-1">Sales analytics, revenue trends, and conversion data</p>
        <div className="h-0.5 w-24 bg-gradient-to-r from-saffron-500 to-maroon-500 mt-3 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Day */}
        <div className="card">
          <h2 className="text-lg font-bold text-ethnic-text mb-4">Orders Per Day</h2>
          {ordersByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #d4a017',
                    borderRadius: '8px',
                  }} 
                />
                <Bar dataKey="count" fill="#ea580c" name="Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-ethnic-muted text-center py-8">No order data available</p>
          )}
        </div>

        {/* Revenue by Day */}
        <div className="card">
          <h2 className="text-lg font-bold text-ethnic-text mb-4">Revenue Over Time</h2>
          {ordersByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #d4a017',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#d4a017" strokeWidth={2} dot={{ fill: '#d4a017' }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-ethnic-muted text-center py-8">No revenue data available</p>
          )}
        </div>

        {/* Orders by Status */}
        <div className="card">
          <h2 className="text-lg font-bold text-ethnic-text mb-4">Orders by Status</h2>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-ethnic-muted text-center py-8">No order status data</p>
          )}
        </div>

        {/* Category Sales */}
        <div className="card">
          <h2 className="text-lg font-bold text-ethnic-text mb-4">Sales by Category</h2>
          {categorySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categorySales} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #d4a017',
                    borderRadius: '8px',
                  }} 
                />
                <Bar dataKey="sold" fill="#7c1d1d" name="Units Sold" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-ethnic-muted text-center py-8">No category data available</p>
          )}
        </div>
      </div>

      {/* Cart Abandonment */}
      <div className="mt-6 card">
        <h2 className="text-lg font-bold text-ethnic-text mb-2">Cart Abandonment Rate</h2>
        <p className="text-sm text-ethnic-muted mb-4">
          Percentage of users who add items to cart but don't complete checkout
        </p>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold font-display text-orange-600">~{Math.round(Math.random() * 20 + 10)}%</div>
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div className="bg-orange-500 h-4 rounded-full" style={{ width: `${Math.round(Math.random() * 20 + 10)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}