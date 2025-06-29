import React, { FC } from 'react';
import Link from 'next/link';
import { Gift, Truck, Shield, Headphones } from 'lucide-react';

const PromotionBanner: FC = () => {
  const features = [
    {
      icon: <Truck size={24} />,
      title: 'Free Delivery',
      description: 'On orders over 20 OMR'
    },
    {
      icon: <Shield size={24} />,
      title: 'Authentic Products',
      description: '100% genuine fragrances'
    },
    {
      icon: <Gift size={24} />,
      title: 'Gift Wrapping',
      description: 'Complimentary service'
    },
    {
      icon: <Headphones size={24} />,
      title: '24/7 Support',
      description: 'Expert fragrance advice'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Main Promotion Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Special Offer: Up to 30% Off
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Discover luxury fragrances at unbeatable prices. Limited time offer on selected items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products?onSale=true">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                  Shop Sale Items
                </button>
              </Link>
              <Link href="/gift-cards">
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
                  Buy Gift Cards
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;