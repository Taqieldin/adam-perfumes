const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getReviews)
  .post(authenticateJWT, reviewController.createReview);

module.exports = router;
