'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Timeless Elegance',
      subtitle: 'Discover our curated bridal collection',
      cta: 'Explore Bridal',
      link: '/products?category=bridal',
      bg: 'from-maroon-800 via-maroon-600 to-maroon-900',
    },
    {
      title: 'Festival Splendor',
      subtitle: 'Celebrate in style with handpicked festive sarees',
      cta: 'Shop Festival',
      link: '/products?category=festival',
      bg: 'from-saffron-700 via-saffron-500 to-saffron-800',
    },
    {
      title: 'Everyday Grace',
      subtitle: 'Effortless style for your daily elegance',
      cta: 'View Everyday',
      link: '/products?category=everyday',
      bg: 'from-gold-700 via-gold-500 to-gold-800',
    },
  ];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${slides[currentSlide].bg} transition-all duration-700`}>
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-ethnic-pattern"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center md:text-left md:max-w-2xl">
          <h1 className="text-cream-500 text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          <p className="text-cream-200 text-lg md:text-xl mb-8 animate-slide-up">
            {slides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href={slides[currentSlide].link}
              className="inline-flex items-center justify-center px-8 py-3 bg-gold-500 text-maroon-900 font-semibold rounded-lg hover:bg-gold-600 transition-colors shadow-lg"
            >
              {slides[currentSlide].cta}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-cream-500 text-cream-500 font-semibold rounded-lg hover:bg-cream-500 hover:text-maroon-800 transition-colors"
            >
              View All Saris
            </Link>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-gold-500' : 'w-2 bg-cream-300 bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}