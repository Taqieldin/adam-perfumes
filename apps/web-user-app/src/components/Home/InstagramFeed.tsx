import React, { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { Instagram, ExternalLink } from 'lucide-react';

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  permalink: string;
  timestamp: string;
  likesCount?: number;
  commentsCount?: number;
}

const InstagramFeed: FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Instagram posts - In production, this would fetch from Instagram API
  const mockPosts: InstagramPost[] = [
    {
      id: '1',
      imageUrl: '/images/instagram/post-1.jpg',
      caption: 'Discover the art of fragrance layering with our expert tips ✨ #AdamPerfumes #FragranceTips',
      permalink: 'https://instagram.com/p/example1',
      timestamp: '2024-01-15T10:00:00Z',
      likesCount: 245,
      commentsCount: 12
    },
    {
      id: '2',
      imageUrl: '/images/instagram/post-2.jpg',
      caption: 'New arrival alert! 🚨 Our latest collection is now available in all branches',
      permalink: 'https://instagram.com/p/example2',
      timestamp: '2024-01-14T15:30:00Z',
      likesCount: 189,
      commentsCount: 8
    },
    {
      id: '3',
      imageUrl: '/images/instagram/post-3.jpg',
      caption: 'Behind the scenes at our flagship store in Muscat 📸 #BehindTheScenes',
      permalink: 'https://instagram.com/p/example3',
      timestamp: '2024-01-13T12:15:00Z',
      likesCount: 156,
      commentsCount: 15
    },
    {
      id: '4',
      imageUrl: '/images/instagram/post-4.jpg',
      caption: 'Customer spotlight! Thank you for choosing Adam Perfumes 💜 #CustomerLove',
      permalink: 'https://instagram.com/p/example4',
      timestamp: '2024-01-12T09:45:00Z',
      likesCount: 203,
      commentsCount: 22
    },
    {
      id: '5',
      imageUrl: '/images/instagram/post-5.jpg',
      caption: 'Limited edition packaging for our premium collection 🎁 #LimitedEdition',
      permalink: 'https://instagram.com/p/example5',
      timestamp: '2024-01-11T16:20:00Z',
      likesCount: 178,
      commentsCount: 9
    },
    {
      id: '6',
      imageUrl: '/images/instagram/post-6.jpg',
      caption: 'Fragrance of the week: Discover your signature scent 🌟 #FragranceOfTheWeek',
      permalink: 'https://instagram.com/p/example6',
      timestamp: '2024-01-10T11:30:00Z',
      likesCount: 234,
      commentsCount: 18
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchInstagramPosts = async () => {
      setLoading(true);
      try {
        // In production, this would be an actual API call to Instagram
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(mockPosts);
      } catch (error) {
        console.error('Failed to fetch Instagram posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Follow Us on Instagram
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
            <Instagram size={32} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Follow Us on Instagram
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Stay connected with our latest updates, behind-the-scenes content, and fragrance inspiration
          </p>
          <a
            href="https://instagram.com/adamperfumes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            <Instagram size={20} />
            Follow @adamperfumes
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Instagram Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-instagram.jpg';
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                  <Instagram size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">View on Instagram</p>
                  {(post.likesCount || post.commentsCount) && (
                    <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                      {post.likesCount && (
                        <span>❤️ {post.likesCount}</span>
                      )}
                      {post.commentsCount && (
                        <span>💬 {post.commentsCount}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Tag us in your posts for a chance to be featured!
          </p>
          <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-mono text-sm">
            #AdamPerfumes #MySignatureScent
          </span>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;