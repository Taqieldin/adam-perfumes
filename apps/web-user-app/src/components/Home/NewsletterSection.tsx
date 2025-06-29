import React, { FC, useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsletterSection: FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    try {
      // TODO: Implement newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setIsSubscribed(true);
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
              <Mail size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Be the first to know about new arrivals, exclusive offers, and fragrance tips from our experts.
            </p>
          </div>

          {/* Newsletter Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isSubscribing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 text-green-400 mb-4">
                <CheckCircle size={24} />
                <span className="text-lg font-semibold">Successfully Subscribed!</span>
              </div>
              <p className="text-gray-300">
                Thank you for joining our newsletter. You'll receive our latest updates soon.
              </p>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-800">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Exclusive Offers</h3>
              <p className="text-gray-400 text-sm">
                Get access to subscriber-only discounts and early sales
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">New Arrivals</h3>
              <p className="text-gray-400 text-sm">
                Be the first to discover our latest fragrance collections
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Expert Tips</h3>
              <p className="text-gray-400 text-sm">
                Learn about fragrance layering, storage, and selection
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;