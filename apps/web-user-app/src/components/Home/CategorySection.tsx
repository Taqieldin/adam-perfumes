import React, { FC, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchCategories } from '../../store/slices/productsSlice';

const CategorySection: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Featured categories for home page
  const featuredCategories = categories.slice(0, 6);

  if (loading.categories || featuredCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the perfect fragrance for every occasion and personality
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredCategories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?categoryId=${category.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                {/* Category Image */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={category.image || '/images/placeholder-category.jpg'}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Category Info */}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors">
                    {category.name}
                  </h3>
                  {category.productCount && (
                    <p className="text-sm text-gray-500 mt-1">
                      {category.productCount} products
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-8">
          <Link href="/categories">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300">
              View All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;