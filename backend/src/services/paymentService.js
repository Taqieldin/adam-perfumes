const Stripe = require('stripe');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

class PaymentService {
  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      logger.warn('STRIPE_SECRET_KEY is not set. Payment functionality will be disabled.');
      this.stripe = null;
    } else {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
  }

  /**
   * Create a Stripe Payment Intent.
   * @param {number} amount - The amount to charge, in the smallest currency unit (e.g., cents).
   * @param {string} currency - The currency code (e.g., 'usd', 'omr').
   * @param {object} metadata - An object to store additional information.
   * @returns {Promise<object>}
   */
  async createPaymentIntent(amount, currency, metadata = {}) {
    if (!this.stripe) {
      throw new AppError('Payment service is not configured.', 500);
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
        payment_method_types: ['card'],
      });

      return paymentIntent;
    } catch (error) {
      logger.error('Error creating Stripe Payment Intent:', error);
      throw new AppError('Failed to create payment intent.', 500);
    }
  }
}

module.exports = PaymentService;
