const axios = require('axios');
const logger = require('../../backend/src/utils/logger');

class TapPaymentGateway {
  constructor() {
    this.apiKey = process.env.TAP_SECRET_KEY;
    this.baseURL = process.env.TAP_BASE_URL || 'https://api.tap.company/v2';
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Create a charge for payment
   */
  async createCharge(amount, currency = 'OMR', customer, source, metadata = {}) {
    try {
      const chargeData = {
        amount: parseFloat(amount).toFixed(3),
        currency: currency.toUpperCase(),
        customer: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: {
            country_code: '968',
            number: customer.phone?.replace(/^\+968/, '') || ''
          }
        },
        source: {
          id: source.id || 'src_card'
        },
        redirect: {
          url: `${process.env.FRONTEND_URL}/payment/callback`
        },
        post: {
          url: `${process.env.BACKEND_URL}/api/payments/tap/webhook`
        },
        metadata: {
          ...metadata,
          source: 'adam-perfumes-app'
        },
        description: `Adam Perfumes Order - ${metadata.orderId || 'N/A'}`,
        reference: {
          transaction: metadata.orderId || `AP-${Date.now()}`,
          order: metadata.orderId || `ORDER-${Date.now()}`
        }
      };

      const response = await axios.post(`${this.baseURL}/charges`, chargeData, {
        headers: this.headers
      });

      logger.info('Tap charge created', {
        chargeId: response.data.id,
        amount,
        currency,
        status: response.data.status
      });

      return {
        success: true,
        chargeId: response.data.id,
        status: response.data.status,
        redirectUrl: response.data.transaction?.url,
        charge: response.data
      };
    } catch (error) {
      logger.error('Tap charge creation failed', error.response?.data || error.message);
      throw new Error(`Charge creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Retrieve a charge
   */
  async getCharge(chargeId) {
    try {
      const response = await axios.get(`${this.baseURL}/charges/${chargeId}`, {
        headers: this.headers
      });

      return {
        success: true,
        charge: response.data
      };
    } catch (error) {
      logger.error('Tap charge retrieval failed', error.response?.data || error.message);
      throw new Error(`Charge retrieval failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a customer
   */
  async createCustomer(customerData) {
    try {
      const tapCustomer = {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        email: customerData.email,
        phone: {
          country_code: '968',
          number: customerData.phone?.replace(/^\+968/, '') || ''
        },
        description: `Adam Perfumes Customer - ${customerData.email}`,
        metadata: {
          userId: customerData.id,
          source: 'adam-perfumes-app'
        }
      };

      const response = await axios.post(`${this.baseURL}/customers`, tapCustomer, {
        headers: this.headers
      });

      logger.info('Tap customer created', {
        customerId: response.data.id,
        email: customerData.email
      });

      return {
        success: true,
        customerId: response.data.id,
        customer: response.data
      };
    } catch (error) {
      logger.error('Tap customer creation failed', error.response?.data || error.message);
      throw new Error(`Customer creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Retrieve a customer
   */
  async getCustomer(customerId) {
    try {
      const response = await axios.get(`${this.baseURL}/customers/${customerId}`, {
        headers: this.headers
      });

      return {
        success: true,
        customer: response.data
      };
    } catch (error) {
      logger.error('Tap customer retrieval failed', error.response?.data || error.message);
      throw new Error(`Customer retrieval failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a refund
   */
  async createRefund(chargeId, amount = null, reason = 'requested_by_customer', metadata = {}) {
    try {
      const refundData = {
        charge_id: chargeId,
        reason,
        metadata: {
          ...metadata,
          source: 'adam-perfumes-app'
        }
      };

      if (amount) {
        refundData.amount = parseFloat(amount).toFixed(3);
      }

      const response = await axios.post(`${this.baseURL}/refunds`, refundData, {
        headers: this.headers
      });

      logger.info('Tap refund created', {
        refundId: response.data.id,
        chargeId,
        amount: response.data.amount
      });

      return {
        success: true,
        refundId: response.data.id,
        amount: response.data.amount,
        status: response.data.status,
        refund: response.data
      };
    } catch (error) {
      logger.error('Tap refund creation failed', error.response?.data || error.message);
      throw new Error(`Refund creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(body) {
    try {
      const event = body;
      
      logger.info('Tap webhook received', {
        eventType: event.object,
        chargeId: event.id
      });

      switch (event.object) {
        case 'charge':
          if (event.status === 'CAPTURED') {
            await this.handlePaymentSucceeded(event);
          } else if (event.status === 'FAILED') {
            await this.handlePaymentFailed(event);
          }
          break;
        default:
          logger.info(`Unhandled Tap event type: ${event.object}`);
      }

      return { success: true, event };
    } catch (error) {
      logger.error('Tap webhook handling failed', error);
      throw new Error(`Webhook handling failed: ${error.message}`);
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSucceeded(charge) {
    try {
      logger.info('Tap payment succeeded', {
        chargeId: charge.id,
        amount: charge.amount,
        currency: charge.currency
      });

      // TODO: Update order status in database
      // const orderId = charge.metadata?.orderId;
      // await updateOrderStatus(orderId, 'paid');

      return { success: true };
    } catch (error) {
      logger.error('Error handling Tap payment success', error);
      throw error;
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(charge) {
    try {
      logger.warn('Tap payment failed', {
        chargeId: charge.id,
        response: charge.response
      });

      // TODO: Update order status in database
      // const orderId = charge.metadata?.orderId;
      // await updateOrderStatus(orderId, 'payment_failed');

      return { success: true };
    } catch (error) {
      logger.error('Error handling Tap payment failure', error);
      throw error;
    }
  }

  /**
   * Create a card token
   */
  async createCardToken(cardData) {
    try {
      const tokenData = {
        card: {
          number: cardData.number,
          exp_month: cardData.expMonth,
          exp_year: cardData.expYear,
          cvc: cardData.cvc,
          name: cardData.name
        }
      };

      const response = await axios.post(`${this.baseURL}/tokens`, tokenData, {
        headers: this.headers
      });

      return {
        success: true,
        tokenId: response.data.id,
        token: response.data
      };
    } catch (error) {
      logger.error('Tap card token creation failed', error.response?.data || error.message);
      throw new Error(`Card token creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Save card for customer
   */
  async saveCard(customerId, tokenId) {
    try {
      const cardData = {
        source: tokenId
      };

      const response = await axios.post(`${this.baseURL}/customers/${customerId}/cards`, cardData, {
        headers: this.headers
      });

      return {
        success: true,
        cardId: response.data.id,
        card: response.data
      };
    } catch (error) {
      logger.error('Tap card save failed', error.response?.data || error.message);
      throw new Error(`Card save failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get customer cards
   */
  async getCustomerCards(customerId) {
    try {
      const response = await axios.get(`${this.baseURL}/customers/${customerId}/cards`, {
        headers: this.headers
      });

      return {
        success: true,
        cards: response.data.cards || []
      };
    } catch (error) {
      logger.error('Tap customer cards retrieval failed', error.response?.data || error.message);
      throw new Error(`Customer cards retrieval failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Delete customer card
   */
  async deleteCard(customerId, cardId) {
    try {
      await axios.delete(`${this.baseURL}/customers/${customerId}/cards/${cardId}`, {
        headers: this.headers
      });

      return { success: true };
    } catch (error) {
      logger.error('Tap card deletion failed', error.response?.data || error.message);
      throw new Error(`Card deletion failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = TapPaymentGateway;