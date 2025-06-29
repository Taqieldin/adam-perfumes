# Adam Perfumes - Integrations

This directory contains all third-party integrations for the Adam Perfumes e-commerce platform. Each integration is designed to enhance the customer experience and streamline business operations.

## 🏗️ Architecture Overview

```
integrations/
├── 💳 payment-gateways/     # Stripe & Tap Payments
├── 📲 whatsapp-business/    # WhatsApp Business API
├── 🔔 firebase-functions/   # Background logic & notifications
├── 🧠 chatgpt-ai/          # AI auto-reply & product help
└── index.js                # Main integrations manager
```

## 🚀 Quick Start

```javascript
const { integrationsManager } = require('./integrations');

// Initialize all integrations
await integrationsManager.initialize();

// Process an order with all integrations
const result = await integrationsManager.processOrder({
    orderId: 'ORD-001',
    customer: {
        email: 'customer@example.com',
        phone: '+96812345678'
    },
    payment: {
        gateway: 'tap',
        data: {
            amount: 50.000,
            currency: 'OMR',
            customer: { email: 'customer@example.com' }
        }
    },
    items: [
        { name: 'Oud Royal', quantity: 1, price: 50.000 }
    ],
    total: 50.000,
    currency: 'OMR',
    notifications: { whatsapp: true }
});
```

## 💳 Payment Gateways

### Supported Gateways
- **Tap Payments**: Primary for Middle East (Oman, UAE, Saudi Arabia)
- **Stripe**: Global coverage, primary for US/Europe

### Configuration
```env
# Tap Payments
TAP_SECRET_KEY=sk_test_...
TAP_PUBLIC_KEY=pk_test_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Default gateway
DEFAULT_PAYMENT_GATEWAY=tap
```

### Usage
```javascript
const { PaymentGatewayManager } = require('./integrations');
const paymentManager = new PaymentGatewayManager();

// Create payment
const payment = await paymentManager.createPayment('tap', {
    amount: 25.500,
    currency: 'OMR',
    customer: {
        email: 'customer@example.com',
        name: 'Ahmed Al-Rashid'
    }
});

// Process refund
const refund = await paymentManager.processRefund('tap', {
    paymentId: 'ch_123456',
    amount: 25.500,
    reason: 'Customer request'
});
```

### Regional Support
- **Oman (OM)**: Tap (recommended), Stripe
- **UAE (AE)**: Tap (recommended), Stripe  
- **Saudi Arabia (SA)**: Tap (recommended), Stripe
- **United States (US)**: Stripe (recommended)
- **Global**: Stripe

## 📲 WhatsApp Business API

### Features
- Order confirmations & status updates
- Special offers & promotions
- Customer support automation
- Webhook handling for incoming messages

### Configuration
```env
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
```

### Usage
```javascript
const { WhatsAppBusinessAPI } = require('./integrations');
const whatsapp = new WhatsAppBusinessAPI(config);

// Send order notification
await whatsapp.sendOrderNotification('+96812345678', {
    orderId: 'ORD-001',
    total: 50.000,
    currency: 'OMR',
    status: 'confirmed',
    items: [{ name: 'Oud Royal', quantity: 1 }]
});

// Send special offer
await whatsapp.sendOfferNotification('+96812345678', {
    title: 'Weekend Special!',
    description: '20% off all fragrances',
    discount: 20,
    validUntil: '2024-01-31',
    shopUrl: 'https://adamperfumes.com/sale'
});
```

### Message Templates
- `order_confirmation`: New order confirmation
- `order_status_update`: Order status changes
- `special_offer`: Marketing promotions
- `welcome_message`: New customer welcome

## 🔔 Firebase Functions

### Background Functions
- **Order Status Changes**: Automatic notifications
- **New Orders**: Inventory updates & admin notifications
- **Chat Messages**: AI auto-reply triggers
- **User Registration**: Welcome messages & profile creation
- **Abandoned Carts**: Scheduled reminder campaigns

### Deployment
```bash
cd integrations/firebase-functions
npm install
firebase deploy --only functions
```

### Environment Variables
```bash
firebase functions:config:set \
  openai.api_key="your_openai_key" \
  whatsapp.access_token="your_whatsapp_token"
```

### Function Triggers
```javascript
// Firestore triggers
exports.onOrderStatusChange = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
        // Handle order status changes
    });

// Scheduled functions
exports.abandonedCartReminder = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
        // Send abandoned cart reminders
    });
```

## 🧠 ChatGPT AI Integration

### Features
- Automated FAQ responses
- Product recommendations
- Customer sentiment analysis
- Product description generation
- Smart auto-reply logic

### Configuration
```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=150
OPENAI_TEMPERATURE=0.7

# Auto-reply settings
AUTO_REPLY_ENABLED=true
AUTO_REPLY_CONFIDENCE_THRESHOLD=0.7
MAX_DAILY_AUTO_REPLIES=100
AUTO_REPLY_BUSINESS_HOURS_ONLY=false

# Business hours
BUSINESS_HOURS_START=9
BUSINESS_HOURS_END=18
BUSINESS_TIMEZONE=Asia/Muscat
```

### Usage
```javascript
const { ChatGPTAI } = require('./integrations');
const ai = new ChatGPTAI();

// Generate auto-reply
const response = await ai.generateAutoReply(
    "What perfumes do you recommend for evening wear?",
    {
        customerHistory: [/* previous orders */],
        context: 'perfume_store'
    }
);

// Get product recommendations
const recommendations = await ai.getProductRecommendations({
    gender: 'unisex',
    occasion: 'evening',
    notes: ['oud', 'rose', 'amber'],
    priceRange: '25-100 OMR'
});

// Analyze customer sentiment
const sentiment = await ai.analyzeCustomerSentiment(
    "I'm not happy with my recent order"
);
```

### FAQ Categories
- **Shipping & Delivery**: Tracking, international shipping
- **Returns & Exchanges**: Policies, process, refunds
- **Products**: Authenticity, notes, samples, storage
- **Pricing & Payments**: Methods, discounts, price matching
- **Store Information**: Hours, contact, location
- **Account & Orders**: Login, order history, profile

## 🔧 Environment Setup

### Required Environment Variables
```env
# Payment Gateways
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
TAP_SECRET_KEY=sk_test_...
TAP_PUBLIC_KEY=pk_test_...
DEFAULT_PAYMENT_GATEWAY=tap

# WhatsApp Business
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token

# OpenAI ChatGPT
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
AUTO_REPLY_ENABLED=true

# Firebase (configured via Firebase CLI)
FIREBASE_PROJECT_ID=your_project_id
```

### Installation
```bash
# Install dependencies
npm install

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Functions
cd integrations/firebase-functions
firebase init functions
```

## 📊 Monitoring & Analytics

### Integration Status
```javascript
const status = integrationsManager.getStatus();
console.log(status);
// {
//   initialized: true,
//   integrations: {
//     paymentGateways: { stripe: true, tap: true },
//     whatsapp: { configured: true, phoneNumberId: true },
//     chatGPT: { configured: true, autoReplyEnabled: true },
//     firebase: { configured: true }
//   }
// }
```

### Error Handling
All integrations include comprehensive error handling and logging:
- Payment failures are logged with transaction details
- WhatsApp API errors include message context
- ChatGPT failures fall back to predefined responses
- Firebase Functions have built-in retry mechanisms

### Performance Monitoring
- Payment processing times
- WhatsApp message delivery rates
- AI response confidence scores
- Firebase Function execution metrics

## 🔒 Security Considerations

### API Keys
- Store all API keys in environment variables
- Use different keys for development/production
- Rotate keys regularly
- Monitor API usage for anomalies

### Webhooks
- Verify webhook signatures
- Use HTTPS endpoints only
- Implement rate limiting
- Log all webhook events

### Data Privacy
- Encrypt sensitive customer data
- Comply with GDPR/local privacy laws
- Implement data retention policies
- Secure API communications

## 🚀 Deployment

### Development
```bash
# Start local development
npm run dev

# Test integrations
npm run test:integrations

# Start Firebase emulators
cd integrations/firebase-functions
firebase emulators:start
```

### Production
```bash
# Deploy Firebase Functions
firebase deploy --only functions

# Update environment variables
# (Use your deployment platform's method)

# Test production integrations
npm run test:production
```

## 📞 Support

For integration support:
- **Payment Issues**: Check gateway documentation
- **WhatsApp Issues**: Verify Business API setup
- **AI Issues**: Check OpenAI API status
- **Firebase Issues**: Check Firebase Console

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor API rate limits
- Update webhook endpoints
- Review AI response quality
- Check payment gateway fees
- Update security certificates

### Version Updates
- Test integrations after updates
- Review breaking changes
- Update documentation
- Notify team of changes

---

*This integration suite provides a complete solution for modern e-commerce operations, combining payment processing, customer communication, AI assistance, and background automation.*