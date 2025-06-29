/** @typedef {import('@shared/types/review').Review} Review */

import api from '../utils/api';

/**
 * Fetches reviews for a given product.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<Review[]>}
 */
const getReviews = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error.response?.data || error;
  }
};

/**
 * Creates a new review for a given product.
 * @param {string} productId - The ID of the product.
 * @param {Partial<Review>} reviewData - The data for the new review.
 * @returns {Promise<Review>}
 */
const createReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error.response?.data || error;
  }
};

const reviewService = {
  getReviews,
  createReview,
};

export default reviewService;
