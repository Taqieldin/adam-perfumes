const express = require('express');
const crypto = require('crypto');
const whatsappConfig = require('./config');

class WhatsAppWebhook {
    constructor() {
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // Webhook verification
        this.router.get('/webhook', (req, res) => {
            const mode = req.query['hub.mode'];
            const token = req.query['hub.verify_token'];
            const challenge = req.query['hub.challenge'];

            if (mode === 'subscribe' && token === whatsappConfig.webhookVerifyToken) {
                console.log('WhatsApp webhook verified successfully');
                res.status(200).send(challenge);
            } else {
                console.error('WhatsApp webhook verification failed');
                res.sendStatus(403);
            }
        });

        // Webhook message handler
        this.router.post('/webhook', (req, res) => {
            try {
                const body = req.body;

                if (body.object === 'whatsapp_business_account') {
                    body.entry?.forEach(entry => {
                        entry.changes?.forEach(change => {
                            if (change.field === 'messages') {
                                this.handleIncomingMessage(change.value);
                            }
                        });
                    });
                }

                res.status(200).send('EVENT_RECEIVED');
            } catch (error) {
                console.error('Webhook processing error:', error);
                res.status(500).send('Internal Server Error');
            }
        });
    }

    handleIncomingMessage(messageData) {
        const messages = messageData.messages;
        const contacts = messageData.contacts;

        if (messages && messages.length > 0) {
            messages.forEach(message => {
                const contact = contacts?.find(c => c.wa_id === message.from);
                
                console.log('Incoming WhatsApp message:', {
                    from: message.from,
                    contactName: contact?.profile?.name,
                    messageType: message.type,
                    timestamp: message.timestamp
                });

                // Handle different message types
                switch (message.type) {
                    case 'text':
                        this.handleTextMessage(message, contact);
                        break;
                    case 'button':
                        this.handleButtonMessage(message, contact);
                        break;
                    case 'interactive':
                        this.handleInteractiveMessage(message, contact);
                        break;
                    default:
                        console.log('Unhandled message type:', message.type);
                }
            });
        }
    }

    handleTextMessage(message, contact) {
        const text = message.text.body.toLowerCase();
        
        // Auto-reply logic for common queries
        if (text.includes('order') || text.includes('status')) {
            // Trigger order status check
            this.triggerOrderStatusCheck(message.from);
        } else if (text.includes('catalog') || text.includes('products')) {
            // Send catalog
            this.sendCatalogInfo(message.from);
        } else if (text.includes('help') || text.includes('support')) {
            // Send help information
            this.sendHelpInfo(message.from);
        }
    }

    handleButtonMessage(message, contact) {
        const buttonPayload = message.button.payload;
        console.log('Button clicked:', buttonPayload);
        
        // Handle button interactions
        switch (buttonPayload) {
            case 'view_order':
                this.triggerOrderStatusCheck(message.from);
                break;
            case 'browse_catalog':
                this.sendCatalogInfo(message.from);
                break;
            case 'contact_support':
                this.sendSupportContact(message.from);
                break;
        }
    }

    handleInteractiveMessage(message, contact) {
        if (message.interactive.type === 'list_reply') {
            const listReply = message.interactive.list_reply;
            console.log('List item selected:', listReply.id);
            
            // Handle list selections
            this.handleListSelection(message.from, listReply.id);
        }
    }

    triggerOrderStatusCheck(phoneNumber) {
        // This would integrate with your order management system
        console.log('Triggering order status check for:', phoneNumber);
        // Implementation would query database and send status update
    }

    sendCatalogInfo(phoneNumber) {
        console.log('Sending catalog info to:', phoneNumber);
        // Implementation would send product catalog
    }

    sendHelpInfo(phoneNumber) {
        console.log('Sending help info to:', phoneNumber);
        // Implementation would send help/FAQ information
    }

    sendSupportContact(phoneNumber) {
        console.log('Sending support contact to:', phoneNumber);
        // Implementation would send support contact details
    }

    handleListSelection(phoneNumber, selectionId) {
        console.log('Handling list selection:', selectionId, 'for:', phoneNumber);
        // Implementation would handle specific list item selections
    }

    getRouter() {
        return this.router;
    }
}

module.exports = WhatsAppWebhook;