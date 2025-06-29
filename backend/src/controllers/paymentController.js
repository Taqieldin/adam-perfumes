const { catchAsync } = require('../middlewares/errorHandler');
const PaymentService = require('../services/paymentService');
const OrderService = require('../services/orderService');
const AppError = require('../utils/appError');

const paymentService = new PaymentService();
const orderService = new OrderService();

// @desc    Create a payment intent for an order
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  if (!orderId) {
    return next(new AppError('Order ID is required.', 400));
  }

  const order = await orderService.getOrderById(orderId, req.user);

  if (!order) {
    return next(new AppError('Order not found.', 404));
  }

  // Amount should be in the smallest currency unit (e.g., cents)
  const amount = Math.round(order.totalAmount * 100);

  const paymentIntent = await paymentService.createPaymentIntent(
    amount,
    order.currency.toLowerCase(),
    { order_id: order.id, user_id: req.user.id }
  );

  res.status(200).json({
    status: 'success',
    clientSecret: paymentIntent.client_secret,
  });
});

// @desc    Handle Stripe webhook events
// @route   POST /api/payments/webhook
// @access  Public
exports.handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret) {
      throw new AppError('Stripe webhook secret or signature is missing.', 400);
    }
    event = paymentService.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error(`Stripe webhook signature error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.order_id;
      const transactionId = paymentIntent.id;
      logger.info(`PaymentIntent succeeded for order: ${orderId}`);
      try {
        await orderService.handleSuccessfulPayment(orderId, transactionId);
      } catch (error) {
        // If this fails, we have a critical issue. Log it for manual intervention.
        logger.error(`CRITICAL: Failed to update order ${orderId} after successful payment webhook.`, error);
        // Still return 200 to Stripe to prevent retries for this event.
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      const failedOrderId = failedPaymentIntent.metadata.order_id;
      logger.warn(`PaymentIntent failed for order: ${failedOrderId}`);
      try {
        await orderService.updateOrderStatus(failedOrderId, 'failed');
      } catch (error) {
        logger.error(`Failed to update order ${failedOrderId} status to 'failed' after payment failure webhook.`, error);
      }
      break;

    default:
      logger.info(`Unhandled Stripe event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
