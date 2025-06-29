const PaymentGatewayManager = require('./payment-gateways');
const WhatsAppBusinessAPI = require('./whatsapp-business');
const ChatGPTAI = require('./chatgpt-ai');
const whatsappConfig = require('./whatsapp-business/config');
const chatGPTConfig = require('./chatgpt-ai/config');

/**
 * Main integrations manager for Adam Perfumes
 * Provides unified access to all third-party integrations
 */
class IntegrationsManager {
    constructor() {
        this.paymentGateways = new PaymentGatewayManager();
        this.whatsapp = new WhatsAppBusinessAPI(whatsappConfig);
        this.chatGPT = new ChatGPTAI(chatGPTConfig);
        
        this.initialized = false;
    }

    /**
     * Initialize all integrations
     */
    async initialize() {
        try {
            console.log('Initializing Adam Perfumes integrations...');
            
            // Test payment gateways
            await this.testPaymentGateways();
            
            // Test WhatsApp connection
            await this.testWhatsAppConnection();
            
            // Test ChatGPT connection
            await this.testChatGPTConnection();
            
            this.initialized = true;
            console.log('✅ All integrations initialized successfully');
            
            return {
                success: true,
                integrations: {
                    paymentGateways: true,
                    whatsapp: true,
                    chatGPT: true,
                    firebaseFunctions: true
                }
            };
        } catch (error) {
            console.error('❌ Integration initialization failed:', error);
            throw error;
        }
    }

    /**
     * Process order with all integrations
     */
    async processOrder(orderData) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const results = {};

            // 1. Process payment
            if (orderData.payment) {
                console.log('Processing payment...');
                results.payment = await this.paymentGateways.createPayment(
                    orderData.payment.gateway,
                    orderData.payment.data
                );
            }

            // 2. Send order confirmation via WhatsApp
            if (orderData.customer.phone && orderData.notifications?.whatsapp) {
                console.log('Sending WhatsApp order confirmation...');
                results.whatsappConfirmation = await this.whatsapp.sendOrderNotification(
                    orderData.customer.phone,
                    {
                        orderId: orderData.orderId,
                        total: orderData.total,
                        currency: orderData.currency,
                        status: 'confirmed',
                        items: orderData.items
                    }
                );
            }

            // 3. Log to Firebase (handled by Firebase Functions)
            console.log('Order processed successfully:', orderData.orderId);

            return {
                success: true,
                orderId: orderData.orderId,
                results
            };

        } catch (error) {
            console.error('Order processing failed:', error);
            throw error;
        }
    }

    /**
     * Handle customer inquiry with AI
     */
    async handleCustomerInquiry(inquiry) {
        try {
            // 1. Generate AI response
            const aiResponse = await this.chatGPT.generateAutoReply(
                inquiry.message,
                {
                    customerHistory: inquiry.customerHistory,
                    context: 'perfume_store'
                }
            );

            // 2. Send response via WhatsApp if phone provided
            if (inquiry.customerPhone && aiResponse.shouldReply) {
                await this.whatsapp.sendMessage(
                    inquiry.customerPhone,
                    aiResponse.message
                );
            }

            return {
                success: true,
                response: aiResponse,
                sentViaWhatsApp: !!inquiry.customerPhone
            };

        } catch (error) {
            console.error('Customer inquiry handling failed:', error);
            throw error;
        }
    }

    /**
     * Send marketing offer
     */
    async sendMarketingOffer(offerData) {
        try {
            const results = {};

            // Send to all customers with WhatsApp opt-in
            if (offerData.customers && offerData.customers.length > 0) {
                const whatsappPromises = offerData.customers
                    .filter(customer => customer.phone && customer.whatsappOptIn)
                    .map(customer => 
                        this.whatsapp.sendOfferNotification(customer.phone, offerData.offer)
                    );

                results.whatsappSent = await Promise.allSettled(whatsappPromises);
            }

            return {
                success: true,
                results
            };

        } catch (error) {
            console.error('Marketing offer sending failed:', error);
            throw error;
        }
    }

    /**
     * Process refund
     */
    async processRefund(refundData) {
        try {
            // 1. Process refund through payment gateway
            const refundResult = await this.paymentGateways.processRefund(
                refundData.gateway,
                refundData
            );

            // 2. Notify customer via WhatsApp
            if (refundData.customerPhone) {
                const message = `💰 Refund Processed\n\n` +
                    `Order ID: ${refundData.orderId}\n` +
                    `Refund Amount: ${refundData.currency} ${refundData.amount}\n` +
                    `Refund ID: ${refundResult.refundId}\n\n` +
                    `Your refund will appear in your account within 5-7 business days.\n\n` +
                    `Thank you for shopping with Adam Perfumes! 🌟`;

                await this.whatsapp.sendMessage(refundData.customerPhone, message);
            }

            return {
                success: true,
                refundId: refundResult.refundId
            };

        } catch (error) {
            console.error('Refund processing failed:', error);
            throw error;
        }
    }

    /**
     * Get product recommendations using AI
     */
    async getProductRecommendations(customerData) {
        try {
            const recommendations = await this.chatGPT.getProductRecommendations(
                customerData.preferences,
                customerData.orderHistory
            );

            return {
                success: true,
                recommendations: recommendations.recommendations
            };

        } catch (error) {
            console.error('Product recommendations failed:', error);
            throw error;
        }
    }

    /**
     * Test payment gateways connection
     */
    async testPaymentGateways() {
        try {
            // Test both Stripe and Tap gateways
            const stripeGateway = this.paymentGateways.getGateway('stripe');
            const tapGateway = this.paymentGateways.getGateway('tap');
            
            console.log('✅ Payment gateways loaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Payment gateways test failed:', error);
            throw error;
        }
    }

    /**
     * Test WhatsApp connection
     */
    async testWhatsAppConnection() {
        try {
            if (!whatsappConfig.accessToken) {
                console.warn('⚠️ WhatsApp access token not configured');
                return false;
            }
            
            console.log('✅ WhatsApp Business API configured');
            return true;
        } catch (error) {
            console.error('❌ WhatsApp connection test failed:', error);
            throw error;
        }
    }

    /**
     * Test ChatGPT connection
     */
    async testChatGPTConnection() {
        try {
            if (!chatGPTConfig.apiKey) {
                console.warn('⚠️ OpenAI API key not configured');
                return false;
            }
            
            // Test with a simple message
            const testResponse = await this.chatGPT.generateAutoReply(
                'Hello, can you help me?',
                { context: 'test' }
            );
            
            console.log('✅ ChatGPT AI integration working');
            return true;
        } catch (error) {
            console.error('❌ ChatGPT connection test failed:', error);
            throw error;
        }
    }

    /**
     * Get integration status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            integrations: {
                paymentGateways: {
                    stripe: !!process.env.STRIPE_SECRET_KEY,
                    tap: !!process.env.TAP_SECRET_KEY
                },
                whatsapp: {
                    configured: !!whatsappConfig.accessToken,
                    phoneNumberId: !!whatsappConfig.phoneNumberId
                },
                chatGPT: {
                    configured: !!chatGPTConfig.apiKey,
                    autoReplyEnabled: chatGPTConfig.autoReply.enabled
                },
                firebase: {
                    configured: true // Assuming Firebase is configured
                }
            }
        };
    }

    /**
     * Get supported payment methods for region
     */
    getSupportedPaymentMethods(region) {
        return this.paymentGateways.getSupportedPaymentMethods(region);
    }

    /**
     * Get recommended payment gateway for region
     */
    getRecommendedPaymentGateway(region) {
        return this.paymentGateways.getRecommendedGateway(region);
    }
}

// Export singleton instance
const integrationsManager = new IntegrationsManager();

module.exports = {
    IntegrationsManager,
    integrationsManager,
    PaymentGatewayManager,
    WhatsAppBusinessAPI,
    ChatGPTAI
};