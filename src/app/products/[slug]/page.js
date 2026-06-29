'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
        } else {
          setError('Product not found');
        }
      } catch (e) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  async function handleAddToCart() {
    const sessionId = localStorage.getItem('uttara_session_id');
    if (!sessionId) {
      const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('uttara_session_id', newId);
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          product_id: product.id,
          quantity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAddedToCart(true);
        window.dispatchEvent(new CustomEvent('cart-update', { detail: data.cartCount }));
        setTimeout(() => setAddedToCart(false), 3000);
      }
    } catch (e) {
      console.error('Failed to add to cart');
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[3/4] skeleton rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 skeleton rounded"></div>
            <div className="h-6 w-1/4 skeleton rounded"></div>
            <div className="h-4 w-full skeleton rounded"></div>
            <div className="h-4 w-full skeleton rounded"></div>
            <div className="h-4 w-2/3 skeleton rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-maroon-700 text-2xl font-serif font-semibold mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The saree you&apos;re looking for is not available.</p>
        <Link href="/products" className="inline-flex items-center px-6 py-3 bg-maroon-500 text-cream-500 rounded-lg hover:bg-maroon-600 transition-colors">
          ← Back to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-maroon-500">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-maroon-500">Products</Link>
        <span className="mx-2">/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-maroon-500 capitalize">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-maroon-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-cream-200 shadow-lg">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-maroon-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {/* Category Badge */}
          <span className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold capitalize
            ${product.category === 'bridal' ? 'bg-gold-500 text-maroon-900' : ''}
            ${product.category === 'festival' ? 'bg-saffron-500 text-white' : ''}
            ${product.category === 'everyday' ? 'bg-cream-500 text-maroon-700' : ''}
          `}>
            {product.category}
          </span>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-maroon-700 text-3xl md:text-4xl font-serif font-bold mb-3">
            {product.name}
          </h1>

          <div className="text-3xl font-bold text-gold-600 mb-4">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </div>

          <div className="border-t border-b border-gold-200 py-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`h-3 w-3 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm text-gray-600">
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
              </span>
            </div>
            <p className="text-xs text-gray-400">Free shipping on orders above ₹5,000</p>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Quantity Selector */}
          {product.stock_quantity > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-maroon-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-maroon-500 hover:text-maroon-500 transition-colors"
                >
                  −
                </button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-maroon-500 hover:text-maroon-500 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className={`w-full py-4 rounded-lg text-lg font-semibold transition-all ${
              addedToCart
                ? 'bg-green-600 text-white'
                : product.stock_quantity === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-maroon-500 text-cream-500 hover:bg-maroon-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {addedToCart ? '✓ Added to Cart!' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Additional info */}
          <div className="mt-8 space-y-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Authentic handloom product</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Cash on delivery available</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Easy returns within 7 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
