import ProductCard from '@/components/ProductCard';
import { getAllProducts, getProductsByCategory } from '@/lib/db';

export default function ProductsPage({ searchParams }) {
  const category = searchParams.category;
  const products = category ? getProductsByCategory(category) : getAllProducts();

  const categories = [
    { id: 'all', label: 'All Saris', slug: '' },
    { id: 'bridal', label: 'Bridal', slug: 'bridal' },
    { id: 'festival', label: 'Festival', slug: 'festival' },
    { id: 'everyday', label: 'Everyday', slug: 'everyday' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-maroon-700 text-4xl font-serif font-bold">
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Our'} Collection
        </h1>
        <p className="text-gray-500 mt-2">
          {category
            ? `Explore our ${category} saree collection`
            : 'Discover the finest handloom saris from across India'}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={cat.slug ? `/products?category=${cat.slug}` : '/products'}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              (cat.slug === '' && !category) || cat.slug === category
                ? 'bg-maroon-500 text-cream-500 shadow-md'
                : 'bg-cream-200 text-maroon-700 hover:bg-maroon-100'
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gold-500 text-6xl mb-4">◈</div>
          <h2 className="text-maroon-700 text-xl font-serif font-semibold mb-2">No saris found</h2>
          <p className="text-gray-500">Check back soon for new arrivals in this category.</p>
        </div>
      )}
    </div>
  );
}
