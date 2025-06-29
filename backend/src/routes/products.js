const express = require('express');
const router = express.Router();
const { catchAsync } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = catchAsync(async (req, res, next) => {
  // TODO: Implement products retrieval with filtering, pagination, search
  res.status(200).json({
    status: 'success',
    message: 'Products endpoint - Coming soon',
    data: {
      products: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      }
    }
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = catchAsync(async (req, res, next) => {
  // TODO: Implement single product retrieval
  res.status(200).json({
    status: 'success',
    message: 'Single product endpoint - Coming soon',
    data: null
  });
});

// Routes
router.get('/', getProducts);
router.get('/:id', getProduct);

module.exports = router;