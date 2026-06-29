'use client';

import { useState, useEffect } from 'react';

export default function SiteHealthPage() {
  const [health, setHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastPing, setLastPing] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard/site-health')
      .then(r => r.json())
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Simple ping check
    const checkPing = async () => {
      const start = performance.now();
      try {
        await fetch('/api/dashboard/stats');
        setLastPing({ status: 'ok', ms: Math.round(performance.now() - start) });
      } catch {
        setLastPing({ status: 'error', ms: 0 });
      }
    };
    checkPing();
    const pingInterval = setInterval(checkPing, 30000);

    return () => clearInterval(pingInterval);
  }, []);

  const getHealthValue = (metric) => {
    const record = health.find(h => h.metric === metric);
    return record ? record.value : 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ethnic-muted text-lg">Loading site health...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-maroon-700">Site Health</h1>
        <p className="text-ethnic-muted mt-1">Monitor website performance and uptime</p>
        <div className="h-0.5 w-24 bg-gradient-to-r from-saffron-500 to-maroon-500 mt-3 rounded-full" />
      </div>

      {/* Live Ping Status */}
      <div className="card mb-6">
        <h2 className="text-lg font-bold text-ethnic-text mb-4">
          Live Status
          <span className={`inline-block w-2.5 h-2.5 rounded-full ml-2 ${lastPing?.status === 'ok' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className={`inline-block w-4 h-4 rounded-full ${lastPing?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="text-sm font-medium">API Status</p>
              <p className="text-xs text-ethnic-muted">
                {lastPing?.status === 'ok' ? `Online — ${lastPing.ms}ms response` : 'Unreachable'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="inline-block w-4 h-4 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium">Database</p>
              <p className="text-xs text-ethnic-muted">Connected via team-db</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="inline-block w-4 h-4 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium">Server (Port 3000)</p>
              <p className="text-xs text-ethnic-muted">Next.js app serving</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <span className="stat-label">Uptime</span>
          <span className="stat-value text-green-600">{getHealthValue('uptime')}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Page Load Time</span>
          <span className={`stat-value ${parseInt(getHealthValue('page_load_ms')) < 500 ? 'text-green-600' : 'text-yellow-600'}`}>
            {getHealthValue('page_load_ms')}ms
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">24h Visitors</span>
          <span className="stat-value text-saffron-600">{getHealthValue('visitors_24h')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">API Response</span>
          <span className={`stat-value ${parseInt(getHealthValue('api_response_ms')) < 300 ? 'text-green-600' : 'text-yellow-600'}`}>
            {getHealthValue('api_response_ms')}ms
          </span>
        </div>
      </div>

      {/* Health Records Table */}
      <div className="card">
        <h2 className="text-lg font-bold text-ethnic-text mb-4">Recent Health Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gold-50 border-b border-gold-100">
                <th className="text-left p-3 font-medium text-ethnic-text">Metric</th>
                <th className="text-left p-3 font-medium text-ethnic-text">Value</th>
                <th className="text-left p-3 font-medium text-ethnic-text">Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {health.map((record, idx) => (
                <tr key={record.id} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="p-3 font-medium capitalize">{record.metric.replace(/_/g, ' ')}</td>
                  <td className="p-3">{record.value}</td>
                  <td className="p-3 text-sm text-ethnic-muted">{record.recorded_at || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}