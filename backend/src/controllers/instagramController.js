const { catchAsync } = require('../middlewares/errorHandler');
const InstagramService = require('../services/instagramService');

const instagramService = new InstagramService();

// @desc    Get latest Instagram posts
// @route   GET /api/instagram/posts
// @access  Public
exports.getLatestPosts = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 9;
  const posts = await instagramService.getLatestPosts(parseInt(limit, 10));

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});
