require('dotenv').config();

const chatGPTConfig = {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 150,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    
    // Auto-reply settings
    autoReply: {
        enabled: process.env.AUTO_REPLY_ENABLED === 'true',
        confidenceThreshold: parseFloat(process.env.AUTO_REPLY_CONFIDENCE_THRESHOLD) || 0.7,
        maxDailyReplies: parseInt(process.env.MAX_DAILY_AUTO_REPLIES) || 100,
        businessHoursOnly: process.env.AUTO_REPLY_BUSINESS_HOURS_ONLY === 'true'
    },
    
    // Business hours (24-hour format)
    businessHours: {
        start: parseInt(process.env.BUSINESS_HOURS_START) || 9,
        end: parseInt(process.env.BUSINESS_HOURS_END) || 18,
        timezone: process.env.BUSINESS_TIMEZONE || 'UTC'
    },
    
    // Fallback responses
    fallbackResponses: {
        error: "I apologize, but I'm having trouble processing your request right now. Please contact our support team for immediate assistance.",
        lowConfidence: "I want to make sure I give you the best answer. Let me connect you with one of our fragrance experts who can help you better.",
        businessHours: "Thank you for your message! Our team will respond during business hours (9 AM - 6 PM). For urgent matters, please call our support line."
    },
    
    // Product categories for better recommendations
    productCategories: {
        men: ['cologne', 'eau de toilette', 'aftershave', 'masculine'],
        women: ['perfume', 'eau de parfum', 'feminine', 'floral'],
        unisex: ['unisex', 'neutral', 'fresh', 'citrus'],
        occasions: ['daily', 'evening', 'special', 'office', 'date', 'formal']
    }
};

module.exports = chatGPTConfig;