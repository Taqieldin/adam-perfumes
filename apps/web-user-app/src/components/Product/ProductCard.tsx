import React, { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../../../shared/types/product';
import { RootState, AppDispatch } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { setModalOpen } from '../../store/slices/uiSlice';
import { trackProductView } from '../../store/slices/productsSlice';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickView?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({ 
  product, 
  className = '',
  showQuickView = true 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stockQuantity <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    dispatch(addToCart({
      productId: product.id,
      quantity: 1,
      variantId: product.variants?.[0]?.id
    }));
    toast.success('Added to cart');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product.id));
      toast.success('Added to wishlist');
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setModalOpen({ modal: 'productQuickView', open: true }));
    dispatch(trackProductView(product.id));
  };

  const handleProductClick = () => {
    dispatch(trackProductView(product.id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-OM', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(price);
  };

  return (
    <div className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      <Link href={`/products/${product.slug}`} onClick={handleProductClick}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            {!imageError ? (
              <Image
              src={product.images?.[0] || '/images/placeholder-product.jpg'}
              alt={typeof product.name === 'string' ? product.name : product.name.en}
                width={400}
                height={400}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.stockQuantity <= 0 && (
              <span className="bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
            {product.newArrival && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
            )}
            {product.featured && (
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full shadow-md transition-colors duration-200 ${
                isInWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
            
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 bg-white text-gray-600 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                aria-label="Quick view"
              >
                <Eye size={16} />
              </button>
            )}
          </div>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${
                product.stockQuantity > 0
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={16} />
              {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
            {typeof product.name === 'string' ? product.name : product.name.en}
          </h3>

          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>

          {/* Size/Variant Info */}
          {product.variants && product.variants.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {product.variants.length} size{product.variants.length > 1 ? 's' : ''} available
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;