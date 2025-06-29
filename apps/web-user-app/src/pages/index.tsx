import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import HeroSection from '../components/Home/HeroSection';
import PromotionBanner from '../components/Home/PromotionBanner';
import CategorySection from '../components/Home/CategorySection';
import ProductSection from '../components/Home/ProductSection';
import InstagramFeed from '../components/Home/InstagramFeed';
import NewsletterSection from '../components/Home/NewsletterSection';
import { Product } from '@shared/types/product';
import { ProductService } from '../services/products';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productService = new ProductService();
        const products = await productService.getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <MainLayout>
      <HeroSection />
      <PromotionBanner />
      <CategorySection />
      <ProductSection title="Featured Products" products={featuredProducts} />
      <InstagramFeed />
      <NewsletterSection />
    </MainLayout>
  );
};

export default HomePage;
