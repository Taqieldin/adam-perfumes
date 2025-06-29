import React, { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Discover Your Signature Scent',
    subtitle: 'Premium Fragrances Collection',
    description: 'Explore our exclusive collection of luxury perfumes crafted for the modern individual.',
    image: '/images/hero/hero-1.jpg',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    backgroundColor: 'bg-gradient-to-r from-purple-900 to-indigo-900'
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Fresh & Captivating',
    description: 'Be the first to experience our latest fragrance additions.',
    image: '/images/hero/hero-2.jpg',
    ctaText: 'Explore New',
    ctaLink: '/products?newArrival=true',
    backgroundColor: 'bg-gradient-to-r from-rose-900 to-pink-900'
  },
  {
    id: '3',
    title: 'Limited Edition',
    subtitle: 'Exclusive Collection',
    description: 'Rare and unique fragrances available for a limited time only.',
    image: '/images/hero/hero-3.jpg',
    ctaText: 'Shop Limited',
    ctaLink: '/products?featured=true',
    backgroundColor: 'bg-gradient-to-r from-amber-900 to-orange-900'
  }
];

const HeroSection: FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${currentSlideData.backgroundColor} transition-all duration-1000`}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${currentSlideData.image})`,
            filter: 'brightness(0.7)'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="space-y-6 text-white">
              <div className="space-y-2">
                <p className="text-lg font-medium text-yellow-300 uppercase tracking-wider">
                  {currentSlideData.subtitle}
                </p>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  {currentSlideData.title}
                </h1>
              </div>
              
              <p className="text-xl text-gray-200 leading-relaxed">
                {currentSlideData.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href={currentSlideData.ctaLink}>
                  <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
                    {currentSlideData.ctaText}
                  </button>
                </Link>
                <Link href="/products">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300">
                    View Collection
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20 z-20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ 
            width: isAutoPlaying ? `${((currentSlide + 1) / heroSlides.length) * 100}%` : '0%'
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;