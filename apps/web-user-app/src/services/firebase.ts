import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDc1sGwWQlUIyrkfHUMghq9vhQJqYsoqeU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "adamperfumes-om.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "adamperfumes-om",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "adamperfumes-om.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "326861616985",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:326861616985:web:f632bbf9a80193612efe48"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize messaging for push notifications (only in browser)
let messaging: any = null;
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase messaging not available:', error);
  }
}

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    // Only connect if not already connected
    if (!auth.config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
    // @ts-ignore
    if (!db._delegate._databaseId.projectId.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    // @ts-ignore
    if (!storage._delegate._host.includes('localhost')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  } catch (error) {
    console.warn('Firebase emulator connection failed:', error);
  }
}

// Push notification functions
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

export const onMessageListener = () => {
  if (!messaging) return Promise.resolve();
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export { messaging };
export default app;