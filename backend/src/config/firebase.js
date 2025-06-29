const admin = require('firebase-admin');
const path = require('path');
const logger = require('../utils/logger');

let firebaseApp = null;
let db = null;
let auth = null;
let storage = null;
let messaging = null;

// Initialize Firebase Admin SDK
async function initializeFirebase() {
  try {
    // Check if Firebase is already initialized
    if (firebaseApp) {
      logger.info('Firebase already initialized');
      return firebaseApp;
    }

    // Firebase service account configuration
    let credential;
    
    // Try to use service account file first, fallback to environment variables
    try {
      const serviceAccountPath = path.join(__dirname, '../firebase/adamperfumes-om-firebase-adminsdk.json');
      if (require('fs').existsSync(serviceAccountPath)) {
        credential = admin.credential.cert(serviceAccountPath);
        logger.info('Using Firebase service account file');
      } else {
        throw new Error('Service account file not found');
      }
    } catch (error) {
      logger.warn('Service account file not found, using environment variables');
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
      };
      credential = admin.credential.cert(serviceAccount);
    }

    // Initialize Firebase Admin
    firebaseApp = admin.initializeApp({
      credential: credential,
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID || 'adamperfumes-om'}-default-rtdb.firebaseio.com`,
      storageBucket: `${process.env.FIREBASE_PROJECT_ID || 'adamperfumes-om'}.firebasestorage.app`
    });

    // Initialize services
    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();
    messaging = admin.messaging();

    // Configure Firestore settings
    db.settings({
      timestampsInSnapshots: true
    });

    logger.info('🔥 Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    logger.error('❌ Failed to initialize Firebase:', error);
    throw error;
  }
}

// Get Firestore database instance
function getFirestore() {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return db;
}

// Get Firebase Auth instance
function getAuth() {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
}

// Get Firebase Storage instance
function getStorage() {
  if (!storage) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return storage;
}

// Get Firebase Messaging instance
function getMessaging() {
  if (!messaging) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return messaging;
}

// Verify Firebase ID token
async function verifyIdToken(idToken) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Error verifying Firebase ID token:', error);
    throw error;
  }
}

// Send push notification
async function sendPushNotification(tokens, notification, data = {}) {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      tokens: Array.isArray(tokens) ? tokens : [tokens]
    };

    const response = await messaging.sendMulticast(message);
    
    logger.info(`Push notification sent successfully. Success: ${response.successCount}, Failed: ${response.failureCount}`);
    
    return response;
  } catch (error) {
    logger.error('Error sending push notification:', error);
    throw error;
  }
}

// Send notification to topic
async function sendTopicNotification(topic, notification, data = {}) {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      topic: topic
    };

    const response = await messaging.send(message);
    logger.info(`Topic notification sent successfully: ${response}`);
    
    return response;
  } catch (error) {
    logger.error('Error sending topic notification:', error);
    throw error;
  }
}

// Subscribe user to topic
async function subscribeToTopic(tokens, topic) {
  try {
    const response = await messaging.subscribeToTopic(tokens, topic);
    logger.info(`Successfully subscribed to topic ${topic}: ${response.successCount} tokens`);
    return response;
  } catch (error) {
    logger.error('Error subscribing to topic:', error);
    throw error;
  }
}

// Unsubscribe user from topic
async function unsubscribeFromTopic(tokens, topic) {
  try {
    const response = await messaging.unsubscribeFromTopic(tokens, topic);
    logger.info(`Successfully unsubscribed from topic ${topic}: ${response.successCount} tokens`);
    return response;
  } catch (error) {
    logger.error('Error unsubscribing from topic:', error);
    throw error;
  }
}

// Upload file to Firebase Storage
async function uploadFile(file, path) {
  try {
    const bucket = storage.bucket();
    const fileUpload = bucket.file(path);
    
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', async () => {
        try {
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;
          resolve(publicUrl);
        } catch (error) {
          reject(error);
        }
      });
      stream.end(file.buffer);
    });
  } catch (error) {
    logger.error('Error uploading file to Firebase Storage:', error);
    throw error;
  }
}

// Delete file from Firebase Storage
async function deleteFile(path) {
  try {
    const bucket = storage.bucket();
    await bucket.file(path).delete();
    logger.info(`File deleted successfully: ${path}`);
  } catch (error) {
    logger.error('Error deleting file from Firebase Storage:', error);
    throw error;
  }
}

// Firestore helper functions
const firestoreHelpers = {
  // Add document
  async addDocument(collection, data) {
    try {
      const docRef = await db.collection(collection).add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      logger.error(`Error adding document to ${collection}:`, error);
      throw error;
    }
  },

  // Get document by ID
  async getDocument(collection, id) {
    try {
      const doc = await db.collection(collection).doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      logger.error(`Error getting document from ${collection}:`, error);
      throw error;
    }
  },

  // Update document
  async updateDocument(collection, id, data) {
    try {
      await db.collection(collection).doc(id).update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      logger.error(`Error updating document in ${collection}:`, error);
      throw error;
    }
  },

  // Delete document
  async deleteDocument(collection, id) {
    try {
      await db.collection(collection).doc(id).delete();
    } catch (error) {
      logger.error(`Error deleting document from ${collection}:`, error);
      throw error;
    }
  },

  // Query documents
  async queryDocuments(collection, queries = []) {
    try {
      let query = db.collection(collection);
      
      queries.forEach(({ field, operator, value }) => {
        query = query.where(field, operator, value);
      });

      const snapshot = await query.get();
      const documents = [];
      
      snapshot.forEach(doc => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error) {
      logger.error(`Error querying documents from ${collection}:`, error);
      throw error;
    }
  }
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getAuth,
  getStorage,
  getMessaging,
  verifyIdToken,
  sendPushNotification,
  sendTopicNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  uploadFile,
  deleteFile,
  firestoreHelpers,
  admin
};