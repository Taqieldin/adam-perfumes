const { catchAsync } = require('../middlewares/errorHandler');
const ReviewService = require('../services/review.service');

const reviewService = new ReviewService();

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getReviews = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const reviews = await reviewService.getReviewsByProductId(productId);
  res.status(200).json({
    status: 'success',
    data: reviews,
  });
});

// @desc    Create a new review for a product
// @route   POST /api/products/:productId/reviews
// @access  Private (requires authentication)
exports.createReview = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id; // Assuming req.user is populated by auth middleware

  const reviewData = {
    productId,
    userId,
    rating,
    comment,
  };

  const review = await reviewService.createReview(reviewData);

  res.status(201).json({
    status: 'success',
    data: review,
  });
});
