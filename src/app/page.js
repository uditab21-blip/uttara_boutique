import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getProductsByCategory } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  let jamdaniProducts = [];
  let baluchariProducts = [];
  let tantProducts = [];
  
  try {
    jamdaniProducts = getProductsByCategory('dhakai-jamdani').slice(0, 3);
    baluchariProducts = getProductsByCategory('baluchari').slice(0, 3);
    tantProducts = getProductsByCategory('tant').slice(0, 3);
  } catch (e) {
    console.error('Failed to load products:', e);
  }

  return (
    <>
      <HeroBanner />

      {/* Trust Strip */}
      <div className="bg-maroon-50 border-y border-gold-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-gold-500 text-2xl mb-1">✦</div>
              <p className="text-maroon-700 text-sm font-medium">Handpicked Quality</p>
            </div>
            <div className="text-center">
              <div className="text-gold-500 text-2xl mb-1">✦</div>
              <p className="text-maroon-700 text-sm font-medium">Pan-India Delivery</p>
            </div>
            <div className="text-center">
              <div className="text-gold-500 text-2xl mb-1">✦</div>
              <p className="text-maroon-700 text-sm font-medium">Authentic Bengal Weaves</p>
            </div>
            <div className="text-center">
              <div className="text-gold-500 text-2xl mb-1">✦</div>
              <p className="text-maroon-700 text-sm font-medium">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dhakai Jamdani Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-maroon-700 text-3xl font-serif font-bold">Dhakai Jamdani</h2>
            <p className="text-gray-500 mt-1">Sheer muslin woven with celestial patterns</p>
          </div>
          <Link href="/products?category=dhakai-jamdani" className="text-gold-600 hover:text-gold-700 font-medium text-sm uppercase tracking-wider hidden sm:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jamdaniProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Baluchari Section */}
      <section className="bg-cream-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-maroon-700 text-3xl font-serif font-bold">Baluchari Silk</h2>
              <p className="text-gray-500 mt-1">Story-woven silk from the looms of Murshidabad</p>
            </div>
            <Link href="/products?category=baluchari" className="text-gold-600 hover:text-gold-700 font-medium text-sm uppercase tracking-wider hidden sm:block">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {baluchariProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Tant Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-maroon-700 text-3xl font-serif font-bold">Bengali Tant</h2>
            <p className="text-gray-500 mt-1">Lightweight cotton for everyday elegance</p>
          </div>
          <Link href="/products?category=tant" className="text-gold-600 hover:text-gold-700 font-medium text-sm uppercase tracking-wider hidden sm:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tantProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-maroon-700 to-maroon-500 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-cream-500 text-3xl font-serif font-bold mb-4">
            Join the Uttara Family
          </h2>
          <p className="text-cream-300 mb-8">
            Subscribe for exclusive previews of new collections, weaving stories, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-lg bg-cream-500 text-maroon-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button className="px-6 py-3 bg-gold-500 text-maroon-900 font-semibold rounded-lg hover:bg-gold-600 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}