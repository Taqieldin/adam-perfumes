const Stripe = require('stripe');
const logger = require('../../backend/src/utils/logger');

class StripePaymentGateway {
  constructor() {
    this.stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  /**
   * Create a payment intent for card payments
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          ...metadata,
          source: 'adam-perfumes-app'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      logger.info('Stripe payment intent created', {
        paymentIntentId: paymentIntent.id,
        amount,
        currency
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      };
    } catch (error) {
      logger.error('Stripe payment intent creation failed', error);
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  /**
   * Confirm a payment intent
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      logger.info('Stripe payment intent confirmed', {
        paymentIntentId,
        status: paymentIntent.status
      });

      return {
        success: true,
        status: paymentIntent.status,
        paymentIntent
      };
    } catch (error) {
      logger.error('Stripe payment confirmation failed', error);
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }

  /**
   * Create a customer
   */
  async createCustomer(email, name, phone = null, metadata = {}) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        phone,
        metadata: {
          ...metadata,
          source: 'adam-perfumes-app'
        }
      });

      logger.info('Stripe customer created', {
        customerId: customer.id,
        email
      });

      return {
        success: true,
        customerId: customer.id,
        customer
      };
    } catch (error) {
      logger.error('Stripe customer creation failed', error);
      throw new Error(`Customer creation failed: ${error.message}`);
    }
  }

  /**
   * Retrieve a customer
   */
  async getCustomer(customerId) {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return {
        success: true,
        customer
      };
    } catch (error) {
      logger.error('Stripe customer retrieval failed', error);
      throw new Error(`Customer retrieval failed: ${error.message}`);
    }
  }

  /**
   * Create a refund
   */
  async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.stripe.refunds.create(refundData);

      logger.info('Stripe refund created', {
        refundId: refund.id,
        paymentIntentId,
        amount: refund.amount / 100
      });

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        refund
      };
    } catch (error) {
      logger.error('Stripe refund creation failed', error);
      throw new Error(`Refund creation failed: ${error.message}`);
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(body, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.webhookSecret
      );

      logger.info('Stripe webhook received', {
        eventType: event.type,
        eventId: event.id
      });

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'charge.dispute.created':
          await this.handleChargeDispute(event.data.object);
          break;
        default:
          logger.info(`Unhandled Stripe event type: ${event.type}`);
      }

      return { success: true, event };
    } catch (error) {
      logger.error('Stripe webhook handling failed', error);
      throw new Error(`Webhook handling failed: ${error.message}`);
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSucceeded(paymentIntent) {
    try {
      logger.info('Payment succeeded', {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      });

      // TODO: Update order status in database
      // const orderId = paymentIntent.metadata.orderId;
      // await updateOrderStatus(orderId, 'paid');

      return { success: true };
    } catch (error) {
      logger.error('Error handling payment success', error);
      throw error;
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(paymentIntent) {
    try {
      logger.warn('Payment failed', {
        paymentIntentId: paymentIntent.id,
        lastPaymentError: paymentIntent.last_payment_error
      });

      // TODO: Update order status in database
      // const orderId = paymentIntent.metadata.orderId;
      // await updateOrderStatus(orderId, 'payment_failed');

      return { success: true };
    } catch (error) {
      logger.error('Error handling payment failure', error);
      throw error;
    }
  }

  /**
   * Handle charge dispute
   */
  async handleChargeDispute(dispute) {
    try {
      logger.warn('Charge dispute created', {
        disputeId: dispute.id,
        amount: dispute.amount / 100,
        reason: dispute.reason
      });

      // TODO: Notify admin about dispute
      // await notifyAdminAboutDispute(dispute);

      return { success: true };
    } catch (error) {
      logger.error('Error handling charge dispute', error);
      throw error;
    }
  }

  /**
   * Get payment methods for a customer
   */
  async getPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return {
        success: true,
        paymentMethods: paymentMethods.data
      };
    } catch (error) {
      logger.error('Error retrieving payment methods', error);
      throw new Error(`Payment methods retrieval failed: ${error.message}`);
    }
  }

  /**
   * Attach payment method to customer
   */
  async attachPaymentMethod(paymentMethodId, customerId) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      return {
        success: true,
        paymentMethod
      };
    } catch (error) {
      logger.error('Error attaching payment method', error);
      throw new Error(`Payment method attachment failed: ${error.message}`);
    }
  }

  /**
   * Detach payment method from customer
   */
  async detachPaymentMethod(paymentMethodId) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.detach(paymentMethodId);

      return {
        success: true,
        paymentMethod
      };
    } catch (error) {
      logger.error('Error detaching payment method', error);
      throw new Error(`Payment method detachment failed: ${error.message}`);
    }
  }
}

module.exports = StripePaymentGateway;