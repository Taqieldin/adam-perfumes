import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchProducts, 
  fetchCategories,
  setFilters, 
  setSort,
  setPagination 
} from '../../store/slices/productsSlice';
import { MainLayout } from '../../layouts/MainLayout';
import ProductCard from '../../components/Product/ProductCard';
import ProductFilters from '../../components/Product/ProductFilters';
import ProductSort from '../../components/Product/ProductSort';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Filter, Grid, List } from 'lucide-react';

const ProductsPage: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { 
    products, 
    categories,
    filters, 
    sort, 
    pagination, 
    loading 
  } = useSelector((state: RootState) => state.products);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    // Parse URL parameters and set filters
    const urlFilters: any = {};
    Object.entries(router.query).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        if (key === 'minPrice' || key === 'maxPrice') {
          urlFilters[key] = parseFloat(value);
        } else if (key === 'inStock' || key === 'featured' || key === 'onSale') {
          urlFilters[key] = value === 'true';
        } else if (key === 'season' || key === 'occasion') {
          urlFilters[key] = Array.isArray(value) ? value : [value];
        } else {
          urlFilters[key] = value;
        }
      }
    });

    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }
  }, [router.query, dispatch]);

  useEffect(() => {
    // Fetch categories if not loaded
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    // Fetch products when filters, sort, or pagination changes
    dispatch(fetchProducts({
      filters,
      sort,
      page: pagination.page,
      limit: pagination.limit
    }));
  }, [dispatch, filters, sort, pagination.page, pagination.limit]);

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
    dispatch(setPagination({ page: 1 })); // Reset to first page
    
    // Update URL
    const query = { ...newFilters };
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === null || query[key] === '') {
        delete query[key];
      }
    });
    
    router.push({
      pathname: '/products',
      query
    }, undefined, { shallow: true });
  };

  const handleSortChange = (newSort: any) => {
    dispatch(setSort(newSort));
    dispatch(setPagination({ page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    dispatch(setFilters({}));
    router.push('/products', undefined, { shallow: true });
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Our Products
                </h1>
                <p className="text-gray-600">
                  Discover our complete collection of premium fragrances
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
                
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="md:hidden flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg"
                >
                  <Filter size={16} />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                <ProductFilters
                  filters={filters}
                  categories={categories}
                  onFiltersChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort and Results Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="text-gray-600 mb-4 sm:mb-0">
                  {loading.products ? (
                    'Loading products...'
                  ) : (
                    `Showing ${products.length} of ${pagination.total} products`
                  )}
                </div>
                
                <ProductSort
                  sort={sort}
                  onSortChange={handleSortChange}
                />
              </div>

              {/* Products Grid/List */}
              {loading.products ? (
                <div className="flex justify-center items-center py-16">
                  <LoadingSpinner size="large" />
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-6'
                  }>
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        className={viewMode === 'list' ? 'flex-row' : ''}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-12">
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Filter size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;