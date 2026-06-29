'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/inventory', label: 'Inventory', icon: '📦' },
  { href: '/dashboard/orders', label: 'Orders', icon: '📋' },
  { href: '/dashboard/performance', label: 'Performance', icon: '📈' },
  { href: '/dashboard/site-health', label: 'Site Health', icon: '🩺' },
  { href: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated via cookie check API
    fetch('/api/dashboard/stats')
      .then(r => {
        if (r.ok) setIsAuth(true);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/dashboard/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuth(true);
        router.refresh();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Login failed. Please try again.');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ethnic-bg">
        <div className="text-ethnic-muted">Loading...</div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gold-50 via-ethnic-bg to-saffron-50">
        <div className="card max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-display text-maroon-700">
              Uttara Boutique
            </h1>
            <p className="text-gold-600 font-display italic mt-1">Owner Dashboard</p>
            <div className="h-0.5 w-16 bg-gradient-to-r from-saffron-500 to-maroon-500 mx-auto mt-4 rounded-full" />
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ethnic-text mb-1">
                Dashboard Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gold-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            
            <button type="submit" className="btn-primary w-full">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-ethnic-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gold-100 shadow-sm flex flex-col">
        <div className="p-5 border-b border-gold-100">
          <Link href="/dashboard" className="block">
            <h2 className="text-xl font-bold font-display text-maroon-700">Uttara</h2>
            <p className="text-xs text-gold-600 font-medium">Owner Dashboard</p>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gold-100">
          <Link href="/" className="sidebar-link-inactive text-sm">
            <span>🏪</span>
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}