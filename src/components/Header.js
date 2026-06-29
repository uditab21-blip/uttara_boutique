'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Read cart count from session storage
    const sessionId = localStorage.getItem('uttara_session_id');
    if (sessionId) {
      fetchCartCount(sessionId);
    } else {
      // Create a session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('uttara_session_id', newSessionId);
    }
  }, []);

  async function fetchCartCount(sessionId) {
    try {
      const res = await fetch(`/api/cart?session_id=${sessionId}`);
      const data = await res.json();
      if (data.items) {
        setCartCount(data.items.reduce((sum, item) => sum + item.quantity, 0));
      }
    } catch (e) {
      console.error('Failed to fetch cart count');
    }
  }

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = (e) => setCartCount(e.detail);
    window.addEventListener('cart-update', handleCartUpdate);
    return () => window.removeEventListener('cart-update', handleCartUpdate);
  }, []);

  return (
    <header className="bg-maroon-500 text-cream-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-gold-500 text-2xl md:text-3xl font-serif font-bold tracking-wider">
              Uttara
            </span>
            <span className="text-cream-500 text-sm md:text-base font-light italic hidden sm:inline">
              Boutique
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-cream-100 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider font-medium">
              Home
            </Link>
            <Link href="/products" className="text-cream-100 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider font-medium">
              Collection
            </Link>
            <Link href="/products?category=bridal" className="text-cream-100 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider font-medium">
              Bridal
            </Link>
            <Link href="/products?category=festival" className="text-cream-100 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider font-medium">
              Festival
            </Link>
            <Link href="/products?category=everyday" className="text-cream-100 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider font-medium">
              Everyday
            </Link>
          </nav>

          {/* Cart & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-cream-100 hover:text-gold-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-maroon-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-cream-100 hover:text-gold-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-maroon-400 pt-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-cream-100 hover:text-gold-500 px-2 py-1 text-sm uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/products" className="text-cream-100 hover:text-gold-500 px-2 py-1 text-sm uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
                Collection
              </Link>
              <Link href="/products?category=bridal" className="text-cream-100 hover:text-gold-500 px-2 py-1 text-sm uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
                Bridal
              </Link>
              <Link href="/products?category=festival" className="text-cream-100 hover:text-gold-500 px-2 py-1 text-sm uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
                Festival
              </Link>
              <Link href="/products?category=everyday" className="text-cream-100 hover:text-gold-500 px-2 py-1 text-sm uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
                Everyday
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}