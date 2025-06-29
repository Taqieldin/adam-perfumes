class FAQHandler {
    constructor() {
        this.faqs = {
            // Shipping & Delivery
            shipping: {
                keywords: ['shipping', 'delivery', 'ship', 'deliver', 'how long', 'when will'],
                responses: {
                    default: "We offer free shipping on orders over $50. Standard delivery takes 3-5 business days, and express delivery takes 1-2 business days. You'll receive a tracking number once your order ships.",
                    international: "International shipping is available to most countries. Delivery times vary by location (7-14 business days). Customs fees may apply.",
                    tracking: "You can track your order using the tracking number sent to your email, or check your account dashboard for real-time updates."
                }
            },

            // Returns & Exchanges
            returns: {
                keywords: ['return', 'exchange', 'refund', 'money back', 'not satisfied'],
                responses: {
                    default: "We offer a 30-day return policy for unopened items in original packaging. Opened fragrances can be exchanged within 14 days if you're not completely satisfied.",
                    process: "To initiate a return, contact our support team or use your account dashboard. We'll provide a prepaid return label for your convenience.",
                    refund: "Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method."
                }
            },

            // Product Information
            products: {
                keywords: ['fragrance', 'perfume', 'cologne', 'scent', 'notes', 'ingredients', 'authentic'],
                responses: {
                    authentic: "All our fragrances are 100% authentic and sourced directly from authorized distributors and brand partners.",
                    notes: "Each product page includes detailed fragrance notes (top, middle, base) and descriptions to help you choose the perfect scent.",
                    samples: "We offer sample sets and discovery kits so you can try fragrances before committing to a full bottle.",
                    storage: "Store your fragrances in a cool, dry place away from direct sunlight to maintain their quality and longevity."
                }
            },

            // Pricing & Payments
            pricing: {
                keywords: ['price', 'cost', 'how much', 'payment', 'discount', 'sale', 'coupon'],
                responses: {
                    default: "Our prices are competitive and we regularly offer promotions. Sign up for our newsletter to receive exclusive discounts and early access to sales.",
                    payment: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted.",
                    priceMatch: "We offer price matching on identical products from authorized retailers. Contact us with the competitor's price for verification."
                }
            },

            // Store Information
            store: {
                keywords: ['hours', 'location', 'address', 'phone', 'contact', 'visit', 'store'],
                responses: {
                    hours: "Our online store is available 24/7. Customer support is available Monday-Friday 9 AM - 6 PM EST.",
                    contact: "You can reach us via live chat, email at support@adamperfumes.com, or phone at 1-800-PERFUME.",
                    location: "We're primarily an online retailer, but we have a showroom by appointment. Contact us to schedule a visit."
                }
            },

            // Account & Orders
            account: {
                keywords: ['account', 'login', 'password', 'order status', 'order history', 'profile'],
                responses: {
                    login: "Having trouble logging in? Use the 'Forgot Password' link or contact support. We can help reset your account access.",
                    orders: "View your order history and track current orders in your account dashboard. You'll also receive email updates for all order changes.",
                    profile: "Update your profile, shipping addresses, and preferences in your account settings for a personalized shopping experience."
                }
            }
        };
    }

    findBestMatch(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;

        for (const [category, faqData] of Object.entries(this.faqs)) {
            const score = this.calculateMatchScore(lowerMessage, faqData.keywords);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = { category, faqData, score };
            }
        }

        return bestMatch && bestMatch.score > 0.3 ? bestMatch : null;
    }

    calculateMatchScore(message, keywords) {
        let score = 0;
        const messageWords = message.split(/\s+/);
        
        for (const keyword of keywords) {
            if (message.includes(keyword.toLowerCase())) {
                // Exact phrase match gets higher score
                score += 0.8;
            } else {
                // Check for partial word matches
                const keywordWords = keyword.split(/\s+/);
                const matchingWords = keywordWords.filter(word => 
                    messageWords.some(msgWord => msgWord.includes(word.toLowerCase()))
                );
                score += (matchingWords.length / keywordWords.length) * 0.4;
            }
        }

        return Math.min(score, 1.0);
    }

    getResponse(category, subcategory = 'default') {
        const faqData = this.faqs[category];
        if (!faqData) return null;

        return faqData.responses[subcategory] || faqData.responses.default;
    }

    getContextualResponse(userMessage) {
        const match = this.findBestMatch(userMessage);
        if (!match) return null;

        const { category, score } = match;
        const lowerMessage = userMessage.toLowerCase();

        // Determine subcategory based on message content
        let subcategory = 'default';

        switch (category) {
            case 'shipping':
                if (lowerMessage.includes('international') || lowerMessage.includes('overseas')) {
                    subcategory = 'international';
                } else if (lowerMessage.includes('track') || lowerMessage.includes('tracking')) {
                    subcategory = 'tracking';
                }
                break;

            case 'returns':
                if (lowerMessage.includes('how to') || lowerMessage.includes('process')) {
                    subcategory = 'process';
                } else if (lowerMessage.includes('refund') || lowerMessage.includes('money back')) {
                    subcategory = 'refund';
                }
                break;

            case 'products':
                if (lowerMessage.includes('authentic') || lowerMessage.includes('real') || lowerMessage.includes('fake')) {
                    subcategory = 'authentic';
                } else if (lowerMessage.includes('notes') || lowerMessage.includes('ingredients')) {
                    subcategory = 'notes';
                } else if (lowerMessage.includes('sample') || lowerMessage.includes('try')) {
                    subcategory = 'samples';
                } else if (lowerMessage.includes('store') || lowerMessage.includes('keep')) {
                    subcategory = 'storage';
                }
                break;

            case 'pricing':
                if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
                    subcategory = 'payment';
                } else if (lowerMessage.includes('match') || lowerMessage.includes('competitor')) {
                    subcategory = 'priceMatch';
                }
                break;

            case 'store':
                if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('closed')) {
                    subcategory = 'hours';
                } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
                    subcategory = 'contact';
                } else if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('visit')) {
                    subcategory = 'location';
                }
                break;

            case 'account':
                if (lowerMessage.includes('login') || lowerMessage.includes('password')) {
                    subcategory = 'login';
                } else if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('history'))) {
                    subcategory = 'orders';
                } else if (lowerMessage.includes('profile') || lowerMessage.includes('settings')) {
                    subcategory = 'profile';
                }
                break;
        }

        return {
            response: this.getResponse(category, subcategory),
            category,
            subcategory,
            confidence: score
        };
    }

    getAllFAQs() {
        const allFAQs = [];
        
        for (const [category, faqData] of Object.entries(this.faqs)) {
            for (const [subcategory, response] of Object.entries(faqData.responses)) {
                allFAQs.push({
                    category,
                    subcategory,
                    keywords: faqData.keywords,
                    response
                });
            }
        }
        
        return allFAQs;
    }
}

module.exports = FAQHandler;