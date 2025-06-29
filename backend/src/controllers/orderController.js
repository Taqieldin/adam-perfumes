const { catchAsync } = require('../middlewares/errorHandler');
const OrderService = require('../services/orderService');

const orderService = new OrderService();

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await orderService.getOrdersForUser(req.user.id);
  res.status(200).json({
    status: 'success',
    count: orders.length,
    data: orders
  });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  res.status(201).json({
    status: 'success',
    data: order,
  });
});

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await orderService.getOrderById(req.params.id, req.user);
  res.status(200).json({
    status: 'success',
    data: order,
  });
});

// @desc    Cancel an order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await orderService.cancelOrder(req.params.id, req.user);
  res.status(200).json({
    status: 'success',
    data: order,
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Admin
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const result = await orderService.getAllOrders(req.query);
  res.status(200).json({
    status: 'success',
    ...result,
  });
});

// @desc    Update order status (Admin)
// @route   PATCH /api/admin/orders/:id/status
// @access  Admin
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(req.params.id, status);
  res.status(200).json({
    status: 'success',
    data: order,
  });
});
