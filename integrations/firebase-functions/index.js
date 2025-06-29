const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

// Order status change trigger
exports.onOrderStatusChange = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        const orderId = context.params.orderId;

        // Check if status changed
        if (before.status !== after.status) {
            console.log(`Order ${orderId} status changed from ${before.status} to ${after.status}`);

            // Send push notification
            await sendOrderStatusNotification(after);

            // Send WhatsApp notification if phone number exists
            if (after.customerPhone) {
                await sendWhatsAppOrderUpdate(after);
            }

            // Log status change
            await logOrderStatusChange(orderId, before.status, after.status);
        }
    });

// New order trigger
exports.onNewOrder = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
        const orderData = snap.data();
        const orderId = context.params.orderId;

        console.log(`New order created: ${orderId}`);

        // Send confirmation notifications
        await sendOrderConfirmationNotification(orderData);

        // Update inventory
        await updateInventoryOnOrder(orderData.items);

        // Send to admin dashboard
        await notifyAdminNewOrder(orderData);
    });

// Chat message trigger
exports.onChatMessage = functions.firestore
    .document('chats/{chatId}/messages/{messageId}')
    .onCreate(async (snap, context) => {
        const messageData = snap.data();
        const chatId = context.params.chatId;

        // Auto-reply logic
        if (messageData.type === 'customer' && !messageData.isAutoReply) {
            await handleAutoReply(chatId, messageData);
        }

        // Notify support team if needed
        if (messageData.requiresSupport) {
            await notifySupportTeam(chatId, messageData);
        }
    });

// User registration trigger
exports.onUserRegistration = functions.auth.user().onCreate(async (user) => {
    console.log(`New user registered: ${user.uid}`);

    // Create user profile in Firestore
    await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        preferences: {
            notifications: true,
            marketing: true
        }
    });

    // Send welcome notification
    await sendWelcomeNotification(user);
});

// Scheduled function for abandoned cart reminders
exports.abandonedCartReminder = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
        console.log('Running abandoned cart reminder job');

        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - 24);

        const abandonedCarts = await db.collection('carts')
            .where('updatedAt', '<', cutoffTime)
            .where('items', '>', [])
            .where('reminderSent', '==', false)
            .get();

        const promises = abandonedCarts.docs.map(async (doc) => {
            const cartData = doc.data();
            await sendAbandonedCartReminder(cartData);
            
            // Mark reminder as sent
            await doc.ref.update({ reminderSent: true });
        });

        await Promise.all(promises);
        console.log(`Sent ${promises.length} abandoned cart reminders`);
    });

// Push notification functions
async function sendOrderStatusNotification(orderData) {
    if (!orderData.fcmToken) return;

    const message = {
        token: orderData.fcmToken,
        notification: {
            title: 'Order Update',
            body: `Your order #${orderData.orderId} is now ${orderData.status}`
        },
        data: {
            orderId: orderData.orderId,
            status: orderData.status,
            type: 'order_update'
        }
    };

    try {
        await messaging.send(message);
        console.log('Push notification sent successfully');
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
}

async function sendOrderConfirmationNotification(orderData) {
    if (!orderData.fcmToken) return;

    const message = {
        token: orderData.fcmToken,
        notification: {
            title: 'Order Confirmed! 🎉',
            body: `Thank you for your order #${orderData.orderId}. Total: ${orderData.currency} ${orderData.total}`
        },
        data: {
            orderId: orderData.orderId,
            type: 'order_confirmation'
        }
    };

    try {
        await messaging.send(message);
    } catch (error) {
        console.error('Error sending order confirmation:', error);
    }
}

async function sendWelcomeNotification(user) {
    // Get user's FCM token from Firestore if available
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    if (userData?.fcmToken) {
        const message = {
            token: userData.fcmToken,
            notification: {
                title: 'Welcome to Adam Perfumes! 🌹',
                body: 'Discover our luxury fragrance collection'
            },
            data: {
                type: 'welcome',
                userId: user.uid
            }
        };

        try {
            await messaging.send(message);
        } catch (error) {
            console.error('Error sending welcome notification:', error);
        }
    }
}

// WhatsApp integration
async function sendWhatsAppOrderUpdate(orderData) {
    const WhatsAppAPI = require('../whatsapp-business');
    const whatsappConfig = require('../whatsapp-business/config');
    
    const whatsapp = new WhatsAppAPI(whatsappConfig);
    
    try {
        await whatsapp.sendOrderStatusUpdate(orderData.customerPhone, {
            orderId: orderData.orderId,
            status: orderData.status,
            trackingNumber: orderData.trackingNumber,
            estimatedDelivery: orderData.estimatedDelivery
        });
    } catch (error) {
        console.error('Error sending WhatsApp update:', error);
    }
}

// Auto-reply logic
async function handleAutoReply(chatId, messageData) {
    const ChatGPTAI = require('../chatgpt-ai');
    const aiService = new ChatGPTAI();

    try {
        const response = await aiService.generateAutoReply(messageData.text, {
            context: 'perfume_store',
            customerHistory: await getCustomerHistory(messageData.userId)
        });

        if (response.shouldReply) {
            await db.collection('chats').doc(chatId).collection('messages').add({
                text: response.message,
                type: 'bot',
                isAutoReply: true,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                confidence: response.confidence
            });
        }
    } catch (error) {
        console.error('Error in auto-reply:', error);
    }
}

// Helper functions
async function updateInventoryOnOrder(items) {
    const batch = db.batch();

    items.forEach(item => {
        const productRef = db.collection('products').doc(item.productId);
        batch.update(productRef, {
            stock: admin.firestore.FieldValue.increment(-item.quantity)
        });
    });

    await batch.commit();
}

async function logOrderStatusChange(orderId, oldStatus, newStatus) {
    await db.collection('orderLogs').add({
        orderId,
        oldStatus,
        newStatus,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: 'status_change'
    });
}

async function notifyAdminNewOrder(orderData) {
    // Send notification to admin dashboard
    await db.collection('adminNotifications').add({
        type: 'new_order',
        orderId: orderData.orderId,
        customerEmail: orderData.customerEmail,
        total: orderData.total,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        read: false
    });
}

async function notifySupportTeam(chatId, messageData) {
    // Notify support team of urgent messages
    await db.collection('supportQueue').add({
        chatId,
        messageId: messageData.id,
        customerMessage: messageData.text,
        priority: messageData.priority || 'normal',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        assigned: false
    });
}

async function sendAbandonedCartReminder(cartData) {
    if (cartData.fcmToken) {
        const message = {
            token: cartData.fcmToken,
            notification: {
                title: 'Don\'t forget your cart! 🛍️',
                body: 'Complete your purchase and get your favorite fragrances'
            },
            data: {
                type: 'abandoned_cart',
                cartId: cartData.id
            }
        };

        await messaging.send(message);
    }
}

async function getCustomerHistory(userId) {
    const orders = await db.collection('orders')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();

    return orders.docs.map(doc => doc.data());
}

module.exports = {
    onOrderStatusChange: exports.onOrderStatusChange,
    onNewOrder: exports.onNewOrder,
    onChatMessage: exports.onChatMessage,
    onUserRegistration: exports.onUserRegistration,
    abandonedCartReminder: exports.abandonedCartReminder
};