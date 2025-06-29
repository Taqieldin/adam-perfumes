import React, { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import productService from '../../services/product.service';
import reviewService from '../../services/review.service';
import { MainLayout } from '../../layouts/MainLayout';
import { addItemToCart } from '../../store/cartSlice';
import { Product } from '@shared/types/product';
import { Review } from '@shared/types/review';

// --- Type Definitions ---
type ReviewFormData = {
  rating: number;
  comment: string;
};

// --- Fetchers ---
const productFetcher = (_: string, id: string): Promise<Product> => productService.getProductById(id);
const reviewsFetcher = (url: string): Promise<Review[]> => reviewService.getReviews(url.split('/')[2]);

// --- Validation Schema ---
const reviewSchema = yup.object().shape({
  rating: yup.number().min(1, 'Rating is required').max(5).required(),
  comment: yup.string().required('Comment is required').min(10, 'Comment must be at least 10 characters'),
});

// --- Sub-components ---
const StarRating: FC<{ rating: number; setRating?: (rating: number) => void }> = ({ rating, setRating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          type="button"
          key={starValue}
          className={`text-3xl ${starValue <= rating ? 'text-black' : 'text-gray-300'} transition-colors`}
          onClick={() => setRating && setRating(starValue)}
          disabled={!setRating}
        >
          &#9733;
        </button>
      );
    })}
  </div>
);

const ReviewCard: FC<{ review: Review }> = ({ review }) => (
  <div className="border-b border-gray-200 py-4">
    <div className="flex items-center mb-2">
      <p className="font-bold mr-4">{review.user?.firstName || 'Anonymous'}</p>
      <StarRating rating={review.rating} />
    </div>
    <p className="text-gray-700 mb-1">{review.comment}</p>
    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
  </div>
);

// --- Main Component ---
const ProductDetailPage: FC = () => {
  const router = useRouter();
  const { id: productId } = router.query;
  const dispatch = useDispatch();
  const { mutate } = useSWRConfig();

  const [rating, setRating] = useState(0);

  const { data: product, error: productError } = useSWR<Product>(
    productId ? [`/products/${productId}`, productId as string] : null,
    productFetcher
  );
  const { data: reviews, error: reviewsError } = useSWR<Review[]>(
    productId ? `/products/${productId}/reviews` : null,
    reviewsFetcher
  );

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema),
  });

  useEffect(() => {
    setValue('rating', rating, { shouldValidate: true });
  }, [rating, setValue]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addItemToCart(product));
    toast.success(`${product.name.en} added to cart!`);
  };

  const onReviewSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    if (!productId || typeof productId !== 'string') return;
    try {
      await reviewService.createReview(productId, data);
      toast.success('Review submitted successfully! It will appear after approval.');
      reset();
      setRating(0);
      mutate(`/products/${productId}/reviews`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review.');
    }
  };

  if (productError) return <MainLayout><div className="text-center text-red-500 p-8">Failed to load product details.</div></MainLayout>;
  if (!product) return <MainLayout><div className="text-center p-8">Loading...</div></MainLayout>;

  const imageUrl = product.images?.[0]?.url || '/placeholder.png';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Image src={imageUrl} alt={product.name.en} layout="fill" objectFit="contain" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">{product.name.en}</h1>
            <p className="text-gray-600 mb-6">{product.description.en}</p>
            <p className="text-3xl font-bold mb-6">{product.currency} {product.price.toFixed(2)}</p>
            <button
              onClick={handleAddToCart}
              className="bg-black text-white font-bold py-3 px-8 rounded hover:bg-gray-800 transition-colors self-start"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Customer Reviews</h2>
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleSubmit(onReviewSubmit)}>
                <div className="mb-4">
                  <label className="block font-medium mb-2">Your Rating</label>
                  <StarRating rating={rating} setRating={setRating} />
                  <input type="hidden" {...register('rating')} />
                  {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block font-medium mb-2">Your Review</label>
                  <textarea
                    id="comment"
                    {...register('comment')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={4}
                  />
                  {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white font-bold py-2 px-6 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            <div>
              {reviewsError && <div className="text-center text-red-500">Failed to load reviews.</div>}
              {!reviews && !reviewsError && <div className="text-center">Loading reviews...</div>}
              {reviews && reviews.length === 0 && <div className="text-center text-gray-500">No reviews yet. Be the first to write one!</div>}
              {reviews && reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
