const OpenAI = require('openai');

class ChatGPTAI {
    constructor(config = {}) {
        this.openai = new OpenAI({
            apiKey: config.apiKey || process.env.OPENAI_API_KEY
        });
        
        this.model = config.model || 'gpt-3.5-turbo';
        this.maxTokens = config.maxTokens || 150;
        this.temperature = config.temperature || 0.7;
        
        // Perfume store context
        this.systemPrompt = `You are an AI assistant for Adam Perfumes, a luxury fragrance store. 
        You help customers with:
        - Product recommendations based on preferences
        - Fragrance notes and descriptions
        - Order status and shipping information
        - General perfume knowledge and advice
        - Store policies and information
        
        Be helpful, professional, and knowledgeable about perfumes. 
        Keep responses concise and friendly. If you cannot help with something, 
        politely direct them to human support.`;
    }

    async generateAutoReply(userMessage, context = {}) {
        try {
            const shouldReply = this.shouldAutoReply(userMessage);
            
            if (!shouldReply.reply) {
                return {
                    shouldReply: false,
                    reason: shouldReply.reason
                };
            }

            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...this.buildContextMessages(context),
                { role: 'user', content: userMessage }
            ];

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: messages,
                max_tokens: this.maxTokens,
                temperature: this.temperature
            });

            const aiResponse = response.choices[0].message.content.trim();
            const confidence = this.calculateConfidence(userMessage, aiResponse);

            return {
                shouldReply: confidence > 0.7,
                message: aiResponse,
                confidence: confidence,
                usage: response.usage
            };

        } catch (error) {
            console.error('ChatGPT API error:', error);
            return {
                shouldReply: false,
                error: error.message
            };
        }
    }

    async getProductRecommendations(preferences, customerHistory = []) {
        try {
            const prompt = this.buildRecommendationPrompt(preferences, customerHistory);
            
            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 200,
                temperature: 0.8
            });

            return {
                recommendations: response.choices[0].message.content.trim(),
                usage: response.usage
            };

        } catch (error) {
            console.error('Product recommendation error:', error);
            throw error;
        }
    }

    async analyzeCustomerSentiment(message) {
        try {
            const prompt = `Analyze the sentiment of this customer message and categorize it:
            Message: "${message}"
            
            Provide:
            1. Sentiment (positive/neutral/negative)
            2. Urgency level (low/medium/high)
            3. Category (complaint/inquiry/compliment/order_issue/product_question)
            4. Requires human support (yes/no)
            
            Format as JSON.`;

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'user', content: prompt }
                ],
                max_tokens: 100,
                temperature: 0.3
            });

            return JSON.parse(response.choices[0].message.content.trim());

        } catch (error) {
            console.error('Sentiment analysis error:', error);
            return {
                sentiment: 'neutral',
                urgency: 'medium',
                category: 'inquiry',
                requiresHumanSupport: true
            };
        }
    }

    async generateProductDescription(productData) {
        try {
            const prompt = `Create an engaging product description for this perfume:
            
            Name: ${productData.name}
            Brand: ${productData.brand || 'Adam Perfumes'}
            Notes: ${productData.notes?.join(', ') || 'Not specified'}
            Category: ${productData.category || 'Fragrance'}
            Price: ${productData.price || 'Contact for pricing'}
            
            Write a compelling, luxurious description that highlights the fragrance profile and appeal.`;

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: 'You are a luxury perfume copywriter.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 200,
                temperature: 0.8
            });

            return response.choices[0].message.content.trim();

        } catch (error) {
            console.error('Product description generation error:', error);
            throw error;
        }
    }

    shouldAutoReply(message) {
        const lowerMessage = message.toLowerCase();
        
        // Don't auto-reply to these types of messages
        const noReplyPatterns = [
            /thank you|thanks/,
            /bye|goodbye/,
            /ok|okay/,
            /human|agent|representative/,
            /speak to someone/,
            /call me|phone/
        ];

        for (const pattern of noReplyPatterns) {
            if (pattern.test(lowerMessage)) {
                return { reply: false, reason: 'User wants human interaction or simple acknowledgment' };
            }
        }

        // Auto-reply to these types of messages
        const autoReplyPatterns = [
            /help|support/,
            /product|perfume|fragrance/,
            /recommend|suggestion/,
            /order|shipping|delivery/,
            /price|cost|how much/,
            /return|refund|exchange/,
            /hours|open|closed/,
            /location|address|store/
        ];

        for (const pattern of autoReplyPatterns) {
            if (pattern.test(lowerMessage)) {
                return { reply: true, reason: 'FAQ or product inquiry' };
            }
        }

        return { reply: false, reason: 'Message type not suitable for auto-reply' };
    }

    buildContextMessages(context) {
        const messages = [];

        if (context.customerHistory && context.customerHistory.length > 0) {
            const historyText = context.customerHistory
                .map(order => `Order ${order.orderId}: ${order.items?.map(item => item.name).join(', ')}`)
                .join('\n');
            
            messages.push({
                role: 'system',
                content: `Customer's recent orders:\n${historyText}`
            });
        }

        if (context.currentProducts) {
            messages.push({
                role: 'system',
                content: `Current featured products: ${context.currentProducts.join(', ')}`
            });
        }

        return messages;
    }

    buildRecommendationPrompt(preferences, customerHistory) {
        let prompt = 'Please recommend perfumes based on these preferences:\n';
        
        if (preferences.gender) prompt += `Gender: ${preferences.gender}\n`;
        if (preferences.occasion) prompt += `Occasion: ${preferences.occasion}\n`;
        if (preferences.notes) prompt += `Preferred notes: ${preferences.notes.join(', ')}\n`;
        if (preferences.priceRange) prompt += `Price range: ${preferences.priceRange}\n`;
        
        if (customerHistory.length > 0) {
            prompt += '\nPrevious purchases:\n';
            customerHistory.forEach(order => {
                prompt += `- ${order.items?.map(item => item.name).join(', ')}\n`;
            });
        }
        
        prompt += '\nProvide 3-5 specific recommendations with brief explanations.';
        
        return prompt;
    }

    calculateConfidence(userMessage, aiResponse) {
        // Simple confidence calculation based on message characteristics
        let confidence = 0.5;
        
        // Higher confidence for specific keywords
        const highConfidenceKeywords = ['price', 'hours', 'location', 'shipping', 'return'];
        const mediumConfidenceKeywords = ['recommend', 'help', 'product', 'fragrance'];
        
        const lowerMessage = userMessage.toLowerCase();
        
        if (highConfidenceKeywords.some(keyword => lowerMessage.includes(keyword))) {
            confidence += 0.3;
        } else if (mediumConfidenceKeywords.some(keyword => lowerMessage.includes(keyword))) {
            confidence += 0.2;
        }
        
        // Lower confidence for very short responses
        if (aiResponse.length < 50) {
            confidence -= 0.1;
        }
        
        // Higher confidence for structured responses
        if (aiResponse.includes('•') || aiResponse.includes('1.') || aiResponse.includes('-')) {
            confidence += 0.1;
        }
        
        return Math.min(Math.max(confidence, 0), 1);
    }
}

module.exports = ChatGPTAI;