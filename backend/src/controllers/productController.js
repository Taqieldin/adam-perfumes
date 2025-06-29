const { catchAsync } = require('../middlewares/errorHandler');
const ProductService = require('../services/productService');

const productService = new ProductService();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = catchAsync(async (req, res, next) => {
  const data = await productService.getProducts(req.query);
  res.status(200).json({
    status: 'success',
    ...data
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = catchAsync(async (req, res, next) => {
  // If user is authenticated, req.user.id will be available from auth middleware
  const product = await productService.getProductById(req.params.id, req.user?.id);
  res.status(200).json({
    status: 'success',
    data: product
  });
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await productService.createProduct(req.body, req.user.id);
  res.status(201).json({
    status: 'success',
    data: product
  });
});

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Admin
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.user.id);
  res.status(200).json({
    status: 'success',
    data: product
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const result = await productService.deleteProduct(req.params.id, req.user.id);
  res.status(200).json({
    status: 'success',
    data: result
  });
});
