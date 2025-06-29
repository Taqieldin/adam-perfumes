import React, { FC } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../../../shared/types/product';
import ProductCard from '../Product/ProductCard';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  highlight?: boolean;
  className?: string;
}

const ProductSection: FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  viewAllLink,
  highlight = false,
  className = ''
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 ${highlight ? 'bg-gradient-to-r from-rose-50 to-pink-50' : 'bg-white'} ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            highlight ? 'text-rose-900' : 'text-gray-900'
          }`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-lg max-w-2xl mx-auto ${
              highlight ? 'text-rose-700' : 'text-gray-600'
            }`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              className={highlight ? 'border-rose-200 hover:border-rose-300' : ''}
            />
          ))}
        </div>

        {/* View All Button */}
        {viewAllLink && (
          <div className="text-center">
            <Link href={viewAllLink}>
              <button className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                highlight 
                  ? 'bg-rose-600 text-white hover:bg-rose-700' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
                View All {title}
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;