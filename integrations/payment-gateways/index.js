const StripePaymentGateway = require('./stripe');
const TapPaymentGateway = require('./tap');
const logger = require('../../backend/src/utils/logger');

class PaymentGatewayManager {
  constructor() {
    this.gateways = {
      stripe: new StripePaymentGateway(),
      tap: new TapPaymentGateway()
    };
    this.defaultGateway = process.env.DEFAULT_PAYMENT_GATEWAY || 'tap'; // Tap for Middle East
  }

  /**
   * Get payment gateway instance
   */
  getGateway(gatewayName = null) {
    const gateway = gatewayName || this.defaultGateway;
    
    if (!this.gateways[gateway]) {
      throw new Error(`Payment gateway '${gateway}' not supported`);
    }
    
    return this.gateways[gateway];
  }

  /**
   * Create payment based on gateway
   */
  async createPayment(gatewayName, paymentData) {
    try {
      const gateway = this.getGateway(gatewayName);
      
      logger.info('Creating payment', {
        gateway: gatewayName,
        amount: paymentData.amount,
        currency: paymentData.currency
      });

      let result;
      
      switch (gatewayName) {
        case 'stripe':
          result = await gateway.createPaymentIntent(
            paymentData.amount,
            paymentData.currency,
            paymentData.metadata
          );
          break;
        case 'tap':
          result = await gateway.createCharge(
            paymentData.amount,
            paymentData.currency,
            paymentData.customer,
            paymentData.source,
            paymentData.metadata
          );
          break;
        default:
          throw new Error(`Payment creation not implemented for gateway: ${gatewayName}`);
      }

      logger.info('Payment created successfully', {
        gateway: gatewayName,
        paymentId: result.paymentIntentId || result.chargeId
      });

      return result;
    } catch (error) {
      logger.error('Payment creation failed', {
        gateway: gatewayName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Process refund based on gateway
   */
  async processRefund(gatewayName, refundData) {
    try {
      const gateway = this.getGateway(gatewayName);
      
      logger.info('Processing refund', {
        gateway: gatewayName,
        paymentId: refundData.paymentId,
        amount: refundData.amount
      });

      let result;
      
      switch (gatewayName) {
        case 'stripe':
          result = await gateway.createRefund(
            refundData.paymentId,
            refundData.amount,
            refundData.reason
          );
          break;
        case 'tap':
          result = await gateway.createRefund(
            refundData.paymentId,
            refundData.amount,
            refundData.reason,
            refundData.metadata
          );
          break;
        default:
          throw new Error(`Refund processing not implemented for gateway: ${gatewayName}`);
      }

      logger.info('Refund processed successfully', {
        gateway: gatewayName,
        refundId: result.refundId
      });

      return result;
    } catch (error) {
      logger.error('Refund processing failed', {
        gateway: gatewayName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle webhook based on gateway
   */
  async handleWebhook(gatewayName, body, signature = null) {
    try {
      const gateway = this.getGateway(gatewayName);
      
      logger.info('Handling webhook', {
        gateway: gatewayName
      });

      let result;
      
      switch (gatewayName) {
        case 'stripe':
          result = await gateway.handleWebhook(body, signature);
          break;
        case 'tap':
          result = await gateway.handleWebhook(body);
          break;
        default:
          throw new Error(`Webhook handling not implemented for gateway: ${gatewayName}`);
      }

      logger.info('Webhook handled successfully', {
        gateway: gatewayName
      });

      return result;
    } catch (error) {
      logger.error('Webhook handling failed', {
        gateway: gatewayName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Create customer based on gateway
   */
  async createCustomer(gatewayName, customerData) {
    try {
      const gateway = this.getGateway(gatewayName);
      
      logger.info('Creating customer', {
        gateway: gatewayName,
        email: customerData.email
      });

      let result;
      
      switch (gatewayName) {
        case 'stripe':
          result = await gateway.createCustomer(
            customerData.email,
            customerData.name,
            customerData.phone,
            customerData.metadata
          );
          break;
        case 'tap':
          result = await gateway.createCustomer(customerData);
          break;
        default:
          throw new Error(`Customer creation not implemented for gateway: ${gatewayName}`);
      }

      logger.info('Customer created successfully', {
        gateway: gatewayName,
        customerId: result.customerId
      });

      return result;
    } catch (error) {
      logger.error('Customer creation failed', {
        gateway: gatewayName,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get supported payment methods for a region
   */
  getSupportedPaymentMethods(region = 'OM') {
    const methods = {
      OM: { // Oman
        gateways: ['tap', 'stripe'],
        methods: ['card', 'wallet', 'bank_transfer'],
        currencies: ['OMR', 'USD', 'AED']
      },
      AE: { // UAE
        gateways: ['tap', 'stripe'],
        methods: ['card', 'wallet', 'bank_transfer'],
        currencies: ['AED', 'USD', 'OMR']
      },
      SA: { // Saudi Arabia
        gateways: ['tap', 'stripe'],
        methods: ['card', 'wallet', 'bank_transfer'],
        currencies: ['SAR', 'USD']
      },
      US: { // United States
        gateways: ['stripe'],
        methods: ['card', 'wallet', 'bank_transfer'],
        currencies: ['USD']
      },
      DEFAULT: {
        gateways: ['stripe'],
        methods: ['card'],
        currencies: ['USD']
      }
    };

    return methods[region] || methods.DEFAULT;
  }

  /**
   * Get recommended gateway for region
   */
  getRecommendedGateway(region = 'OM') {
    const recommendations = {
      OM: 'tap', // Oman - Tap is popular in Middle East
      AE: 'tap', // UAE
      SA: 'tap', // Saudi Arabia
      KW: 'tap', // Kuwait
      QA: 'tap', // Qatar
      BH: 'tap', // Bahrain
      US: 'stripe', // United States
      CA: 'stripe', // Canada
      GB: 'stripe', // United Kingdom
      DEFAULT: 'stripe'
    };

    return recommendations[region] || recommendations.DEFAULT;
  }

  /**
   * Validate payment data
   */
  validatePaymentData(paymentData) {
    const required = ['amount', 'currency', 'customer'];
    const missing = required.filter(field => !paymentData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required payment data: ${missing.join(', ')}`);
    }

    if (paymentData.amount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }

    if (!paymentData.customer.email) {
      throw new Error('Customer email is required');
    }

    return true;
  }

  /**
   * Format amount for gateway
   */
  formatAmount(amount, currency, gateway) {
    // Some gateways require amounts in cents, others in decimal
    const centsCurrencies = ['USD', 'EUR', 'GBP'];
    const shouldUseCents = gateway === 'stripe' && centsCurrencies.includes(currency);
    
    return shouldUseCents ? Math.round(amount * 100) : parseFloat(amount).toFixed(3);
  }
}

module.exports = PaymentGatewayManager;