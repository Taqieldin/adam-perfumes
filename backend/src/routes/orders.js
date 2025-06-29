const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateJWT } = require('../middlewares/auth');

// All order routes are protected
router.use(authenticateJWT);

router.route('/')
  .get(orderController.getOrders)
  .post(orderController.createOrder);

router.route('/:id')
  .get(orderController.getOrder);

router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;