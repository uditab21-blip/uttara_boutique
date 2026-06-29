'use client';

import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/inventory')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const interval = setInterval(() => {
      fetch('/api/dashboard/inventory')
        .then(r => r.json())
        .then(setProducts)
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock_quantity || 0)), 0);
  const lowStockItems = products.filter(p => (p.stock_quantity || 0) < 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-maroon-700">Inventory Management</h1>
        <p className="text-ethnic-muted mt-1">Track your product stock levels and pricing</p>
        <div className="h-0.5 w-24 bg-gradient-to-r from-saffron-500 to-maroon-500 mt-3 rounded-full" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value text-saffron-600">{products.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Inventory Value</span>
          <span className="stat-value text-gold-600">₹{totalValue.toLocaleString('en-IN')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Low Stock Alerts</span>
          <span className={`stat-value ${lowStockItems.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {lowStockItems.length}
          </span>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-bold text-red-700 mb-2">⚠️ Low Stock Alert</h3>
          <ul className="space-y-1">
            {lowStockItems.map(p => (
              <li key={p.id} className="text-red-600 text-sm">
                {p.name} — <strong>{p.stock_quantity || 0} left</strong> (threshold: 5)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12 text-ethnic-muted">Loading inventory...</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gold-50 border-b border-gold-100">
                  <th className="text-left p-4 font-medium text-ethnic-text">Product</th>
                  <th className="text-left p-4 font-medium text-ethnic-text">Category</th>
                  <th className="text-right p-4 font-medium text-ethnic-text">Price (₹)</th>
                  <th className="text-center p-4 font-medium text-ethnic-text">Stock</th>
                  <th className="text-right p-4 font-medium text-ethnic-text">Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.id} className={`border-b border-gray-50 ${p.stock_quantity < 5 ? 'bg-red-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4">
                      <span className="font-medium text-ethnic-text">{p.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="badge-info">{p.category}</span>
                    </td>
                    <td className="p-4 text-right">{p.price.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-8 rounded-full text-sm font-bold ${
                        p.stock_quantity < 5 ? 'bg-red-100 text-red-700' : 
                        p.stock_quantity < 10 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {p.stock_quantity || 0}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium">
                      ₹{((p.stock_quantity || 0) * p.price).toLocaleString('en-IN')}
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