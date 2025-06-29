import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchFeaturedProducts, 
  fetchTrendingProducts, 
  fetchNewArrivals, 
  fetchBestSellers,
  fetchSaleProducts 
} from '../../store/slices/productsSlice';
import { MainLayout } from '../../layouts/MainLayout';
import HeroSection from '../../components/Home/HeroSection';
import ProductSection from '../../components/Home/ProductSection';
import CategorySection from '../../components/Home/CategorySection';
import PromotionBanner from '../../components/Home/PromotionBanner';
import NewsletterSection from '../../components/Home/NewsletterSection';
import InstagramFeed from '../../components/Home/InstagramFeed';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const HomePage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    featuredProducts,
    trendingProducts,
    newArrivals,
    bestSellers,
    saleProducts,
    loading
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    // Fetch all home page data
    dispatch(fetchFeaturedProducts(8));
    dispatch(fetchTrendingProducts(8));
    dispatch(fetchNewArrivals(8));
    dispatch(fetchBestSellers(8));
    dispatch(fetchSaleProducts(8));
  }, [dispatch]);

  const isLoading = loading.featured || loading.trending || loading.newArrivals || loading.bestSellers;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Section */}
        <CategorySection />

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <ProductSection
            title="Featured Products"
            subtitle="Discover our handpicked selection of premium fragrances"
            products={featuredProducts}
            viewAllLink="/products?featured=true"
          />
        )}

        {/* Promotion Banner */}
        <PromotionBanner />

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <ProductSection
            title="New Arrivals"
            subtitle="Be the first to experience our latest fragrances"
            products={newArrivals}
            viewAllLink="/products?newArrival=true"
          />
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <ProductSection
            title="Best Sellers"
            subtitle="Customer favorites that never go out of style"
            products={bestSellers}
            viewAllLink="/products?bestSeller=true"
          />
        )}

        {/* Trending Products */}
        {trendingProducts.length > 0 && (
          <ProductSection
            title="Trending Now"
            subtitle="What's popular this season"
            products={trendingProducts}
            viewAllLink="/products?trending=true"
          />
        )}

        {/* Sale Products */}
        {saleProducts.length > 0 && (
          <ProductSection
            title="Special Offers"
            subtitle="Limited time deals you don't want to miss"
            products={saleProducts}
            viewAllLink="/products?onSale=true"
            highlight={true}
          />
        )}

        {/* Instagram Feed */}
        <InstagramFeed />

        {/* Newsletter Section */}
        <NewsletterSection />
      </div>
    </MainLayout>
  );
};

export default HomePage;