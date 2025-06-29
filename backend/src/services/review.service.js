const { Review, User } = require('../models');

class ReviewService {
  /**
   * Get all reviews for a specific product.
   * @param {string} productId - The ID of the product.
   * @returns {Promise<Review[]>}
   */
  async getReviewsByProductId(productId) {
    const reviews = await Review.findAll({
      where: { productId, isApproved: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return reviews;
  }

  /**
   * Create a new review for a product.
   * @param {object} reviewData - The review data.
   * @param {string} reviewData.userId - The ID of the user submitting the review.
   * @param {string} reviewData.productId - The ID of the product being reviewed.
   * @param {number} reviewData.rating - The rating given to the product (1-5).
   * @param {string} [reviewData.comment] - The review comment.
   * @returns {Promise<Review>}
   */
  async createReview(reviewData) {
    const review = await Review.create(reviewData);
    return review;
  }
}

module.exports = ReviewService;
