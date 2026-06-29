import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-200">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-maroon-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Category badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
          ${product.category === 'bridal' ? 'bg-gold-500 text-maroon-900' : ''}
          ${product.category === 'festival' ? 'bg-saffron-500 text-white' : ''}
          ${product.category === 'everyday' ? 'bg-cream-500 text-maroon-700' : ''}
        `}>
          {product.category}
        </span>

        {/* Stock indicator */}
        {product.stock_quantity <= 2 && product.stock_quantity > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
            Only {product.stock_quantity} left
          </span>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-maroon-700 font-serif font-semibold text-lg mb-1 group-hover:text-maroon-500 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-maroon-600 font-bold text-lg">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-400">
            {product.stock_quantity > 0 ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>
    </Link>
  );
}