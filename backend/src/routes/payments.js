const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateJWT } = require('../middlewares/auth');

// @desc    Create a payment intent for an order
// @route   POST /api/payments/create-payment-intent
// @access  Private
router.post(
  '/create-payment-intent',
  authenticateJWT,
  paymentController.createPaymentIntent
);

// @desc    Handle Stripe payment webhook
// @route   POST /api/payments/webhook
// @access  Public (Stripe)
// Stripe requires the raw body to verify the signature.
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleStripeWebhook
);

module.exports = router;