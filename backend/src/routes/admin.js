const express = require('express');
const router = express.Router();
const { catchAsync } = require('../middlewares/errorHandler');
const { authenticateJWT, requireAdmin } = require('../middlewares/auth');
const orderController = require('../controllers/orderController');

// Protect all admin routes
router.use(authenticateJWT, requireAdmin);

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboard = catchAsync(async (req, res, next) => {
  // TODO: Implement admin dashboard data
  res.status(200).json({
    status: 'success',
    message: 'Admin dashboard endpoint - Coming soon',
    data: {
      stats: {
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0
      }
    }
  });
});

// @desc    Manage products
// @route   GET /api/admin/products
// @access  Private (Admin only)
const manageProducts = catchAsync(async (req, res, next) => {
  // TODO: Implement admin product management
  res.status(200).json({
    status: 'success',
    message: 'Admin product management endpoint - Coming soon',
    data: []
  });
});

// Routes
router.get('/dashboard', getDashboard);
router.get('/products', manageProducts);
router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;