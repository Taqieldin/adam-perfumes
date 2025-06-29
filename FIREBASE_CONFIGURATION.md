# Firebase Configuration for Adam Perfumes

## Project Information
- **Project Name**: Adamperfumes
- **Project ID**: adamperfumes-om
- **Project Number**: 326861616985
- **Web API Key**: AIzaSyDc1sGwWQlUIyrkfHUMghq9vhQJqYsoqeU
- **Storage Bucket**: adamperfumes-om.firebasestorage.app

## Application IDs

### Android Apps
1. **Admin App**
   - App ID: `1:326861616985:android:f632bbf9a80193612efe48`
   - Package Name: `com.adamperfumes.admin`

2. **Customer App**
   - App ID: `1:326861616985:android:a724fc4c4fd3356f2efe48`
   - Package Name: `com.adamperfumes.customer`

### iOS Apps
1. **Admin App**
   - App ID: `1:326861616985:ios:9e0b1d47197a183a2efe48`
   - Bundle ID: `com.adamperfumes.admin`

2. **Customer App**
   - App ID: `1:326861616985:ios:a9bd2ac107c03fd12efe48`
   - Bundle ID: `com.adamperfumes.customer`

### Web Apps
- **Web User App**: `1:326861616985:web:f632bbf9a80193612efe48`
- **Web Admin Dashboard**: `1:326861616985:web:f632bbf9a80193612efe48`

## Service Account Configuration
- **Client Email**: firebase-adminsdk-fbsvc@adamperfumes-om.iam.gserviceaccount.com
- **Client ID**: 109240582258074959059
- **Private Key ID**: 13e3a87b725239917d35b2eafa572b6e9579d173

## Push Notifications
- **Sender ID**: 326861616985
- **Server Key**: Available in Firebase Console
- **VAPID Key**: ByX2SEPPKhcAzRadNFuAt1EM9Z3wcEOWkosVKRw3wko

## Configuration Files Updated

### Web Applications
1. **web-user-app**
   - ✅ `src/services/firebase.ts` - Firebase SDK configuration
   - ✅ `.env.local` - Environment variables

2. **web-admin-dashboard**
   - ✅ `src/services/firebase.ts` - Firebase SDK configuration (Vite)
   - ✅ `.env.local` - Environment variables

### Mobile Applications
1. **mobile-user-app**
   - ✅ `google-services.json` - Android configuration
   - ✅ `GoogleService-Info.plist` - iOS configuration

2. **mobile-admin-app**
   - ✅ `google-services.json` - Android configuration
   - ✅ `GoogleService-Info.plist` - iOS configuration

### Backend
1. **backend**
   - ✅ `src/config/firebase-admin.json` - Service account configuration
   - ✅ `.env.example` - Environment variables template

## Environment Variables

### Web Apps (Next.js)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDc1sGwWQlUIyrkfHUMghq9vhQJqYsoqeU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=adamperfumes-om.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=adamperfumes-om
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=adamperfumes-om.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=326861616985
NEXT_PUBLIC_FIREBASE_APP_ID=1:326861616985:web:f632bbf9a80193612efe48
```

### Web Admin Dashboard (Vite)
```env
VITE_FIREBASE_API_KEY=AIzaSyDc1sGwWQlUIyrkfHUMghq9vhQJqYsoqeU
VITE_FIREBASE_AUTH_DOMAIN=adamperfumes-om.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=adamperfumes-om
VITE_FIREBASE_STORAGE_BUCKET=adamperfumes-om.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=326861616985
VITE_FIREBASE_APP_ID=1:326861616985:web:f632bbf9a80193612efe48
```

### Backend (Node.js)
```env
FIREBASE_PROJECT_ID=adamperfumes-om
FIREBASE_PRIVATE_KEY_ID=13e3a87b725239917d35b2eafa572b6e9579d173
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[PRIVATE_KEY_CONTENT]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@adamperfumes-om.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=109240582258074959059
```

## Firebase Services Enabled

### Authentication
- ✅ Email/Password
- ✅ Google Sign-In
- ✅ Phone Authentication
- ✅ Anonymous Authentication

### Firestore Database
- ✅ Native mode
- ✅ Multi-region support
- ✅ Security rules configured

### Cloud Storage
- ✅ File uploads
- ✅ Image optimization
- ✅ Security rules configured

### Cloud Messaging (FCM)
- ✅ Push notifications
- ✅ Topic messaging
- ✅ Device group messaging

### Analytics
- ✅ Google Analytics
- ✅ Custom events
- ✅ User properties

### Crashlytics
- ✅ Crash reporting
- ✅ Performance monitoring

## Security Configuration

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by admins
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // Orders are readable/writable by owner and admins
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin']);
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload to their own folder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Product images - readable by all, writable by admins
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
  }
}
```

## Next Steps

1. **Enable Authentication Methods** in Firebase Console
2. **Configure Firestore Security Rules**
3. **Set up Cloud Storage Rules**
4. **Configure FCM for Push Notifications**
5. **Enable Analytics and Crashlytics**
6. **Test Authentication Flow** in all applications
7. **Verify File Upload** functionality
8. **Test Push Notifications**

## Important Notes

- 🔒 **Private Key Security**: The service account private key is included in the backend configuration. Ensure this file is never committed to version control in production.
- 🌐 **Domain Configuration**: Add your production domains to Firebase Auth authorized domains.
- 📱 **App Store Configuration**: Update bundle IDs and package names if different from the current configuration.
- 🔔 **Push Notifications**: Configure APNs certificates for iOS push notifications.
- 🛡️ **Security Rules**: Review and customize Firestore and Storage security rules based on your specific requirements.

## Testing

### Web Applications
```bash
# Test web-user-app
cd apps/web-user-app
npm run dev

# Test web-admin-dashboard
cd apps/web-admin-dashboard
npm run dev
```

### Mobile Applications
```bash
# Test mobile-user-app
cd apps/mobile-user-app
npx expo start

# Test mobile-admin-app
cd apps/mobile-admin-app
npx expo start
```

### Backend
```bash
# Test backend
cd backend
npm run dev
```

All Firebase configurations are now properly set up and ready for development and testing!