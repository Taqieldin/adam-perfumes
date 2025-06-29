require('dotenv').config();

const whatsappConfig = {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
    
    // Message templates
    templates: {
        orderConfirmation: 'order_confirmation',
        orderUpdate: 'order_status_update',
        specialOffer: 'special_offer',
        welcomeMessage: 'welcome_message'
    },
    
    // Default settings
    defaultLanguage: 'en',
    maxRetries: 3,
    retryDelay: 1000
};

module.exports = whatsappConfig;