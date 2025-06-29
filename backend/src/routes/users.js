const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middlewares/auth');

// All routes in this file are protected and require authentication
router.use(authenticateJWT);

// Profile routes
router.route('/me')
  .get(userController.getProfile)
  .patch(userController.updateProfile);

// Theme preference route
router.patch('/me/theme', userController.updateThemePreference);

// Address routes
router.route('/me/addresses')
  .get(userController.getAddresses)
  .post(userController.addAddress);

router.route('/me/addresses/:id')
  .put(userController.updateAddress)
  .delete(userController.deleteAddress);

// Order routes
router.get('/me/orders', userController.getOrders);

// Loyalty points routes
router.get('/me/loyalty-points', userController.getLoyaltyPoints);

// Preferences routes
router.route('/me/preferences')
  .get(userController.getPreferences)
  .put(userController.updatePreferences);

module.exports = router;