const axios = require('axios');

class WhatsAppBusinessAPI {
    constructor(config) {
        this.accessToken = config.accessToken;
        this.phoneNumberId = config.phoneNumberId;
        this.businessAccountId = config.businessAccountId;
        this.baseURL = 'https://graph.facebook.com/v18.0';
    }

    async sendMessage(to, message) {
        try {
            const response = await axios.post(
                `${this.baseURL}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'text',
                    text: { body: message }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('WhatsApp message send error:', error.response?.data || error.message);
            throw error;
        }
    }

    async sendTemplateMessage(to, templateName, parameters = []) {
        try {
            const response = await axios.post(
                `${this.baseURL}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'template',
                    template: {
                        name: templateName,
                        language: { code: 'en' },
                        components: parameters.length > 0 ? [{
                            type: 'body',
                            parameters: parameters.map(param => ({ type: 'text', text: param }))
                        }] : []
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('WhatsApp template message error:', error.response?.data || error.message);
            throw error;
        }
    }

    async sendOrderNotification(customerPhone, orderDetails) {
        const message = `🛍️ Order Confirmation\n\n` +
            `Order ID: ${orderDetails.orderId}\n` +
            `Total: ${orderDetails.currency} ${orderDetails.total}\n` +
            `Status: ${orderDetails.status}\n\n` +
            `Items:\n${orderDetails.items.map(item => `• ${item.name} x${item.quantity}`).join('\n')}\n\n` +
            `Thank you for shopping with Adam Perfumes! 🌟`;

        return await this.sendMessage(customerPhone, message);
    }

    async sendOfferNotification(customerPhone, offerDetails) {
        const message = `🎉 Special Offer Just for You!\n\n` +
            `${offerDetails.title}\n` +
            `${offerDetails.description}\n\n` +
            `💰 Discount: ${offerDetails.discount}%\n` +
            `⏰ Valid until: ${offerDetails.validUntil}\n` +
            `🔗 Shop now: ${offerDetails.shopUrl}\n\n` +
            `Adam Perfumes - Luxury Scents 🌹`;

        return await this.sendMessage(customerPhone, message);
    }

    async sendOrderStatusUpdate(customerPhone, orderUpdate) {
        const statusEmojis = {
            'processing': '⏳',
            'shipped': '🚚',
            'delivered': '✅',
            'cancelled': '❌'
        };

        const message = `${statusEmojis[orderUpdate.status]} Order Update\n\n` +
            `Order ID: ${orderUpdate.orderId}\n` +
            `Status: ${orderUpdate.status.toUpperCase()}\n` +
            `${orderUpdate.trackingNumber ? `Tracking: ${orderUpdate.trackingNumber}\n` : ''}` +
            `${orderUpdate.estimatedDelivery ? `Est. Delivery: ${orderUpdate.estimatedDelivery}\n` : ''}\n` +
            `Thank you for your patience! 💫`;

        return await this.sendMessage(customerPhone, message);
    }
}

module.exports = WhatsAppBusinessAPI;