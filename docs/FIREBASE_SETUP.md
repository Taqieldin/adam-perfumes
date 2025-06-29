# Firebase Setup Guide for Adam-Perfumes

This guide will help you configure Firebase for the Adam-Perfumes e-commerce ecosystem.

## 🔥 Firebase Project Configuration

### Project Details
- **Project Name**: Adamperfumes
- **Project ID**: `adamperfumes-om`
- **Project Number**: `326861616985`
- **Web API Key**: `AIzaSyDc1sGwWQlUIyrkfHUMghq9vhQJqYsoqeU`
- **Storage Bucket**: `adamperfumes-om.firebasestorage.app`

## 📱 Mobile App Configurations

### Android Apps

#### Customer App
- **App ID**: `1:326861616985:android:a724fc4c4fd3356f2efe48`
- **Package Name**: `com.adamperfumes.customer`

#### Admin App
- **App ID**: `1:326861616985:android:f632bbf9a80193612efe48`
- **Package Name**: `com.adamperfumes.admin`

### iOS Apps

#### Customer App
- **App ID**: `1:326861616985:ios:a9bd2ac107c03fd12efe48`
- **Bundle ID**: `com.adamperfumes.customer`

#### Admin App
- **App ID**: `1:326861616985:ios:9e0b1d47197a183a2efe48`
- **Bundle ID**: `com.adamperfumes.admin`

## 🔧 Required Firebase Services

### 1. Authentication
Enable the following sign-in methods:
- ✅ Email/Password
- ✅ Google
- ✅ Facebook
- ✅ Apple (for iOS)
- ✅ Phone Number (SMS)

### 2. Firestore Database
- Create database in production mode
- Set up security rules for users, products, orders
- Configure indexes for optimal performance

### 3. Storage
- Set up storage buckets for:
  - Product images
  - User profile pictures
  - Document uploads
  - Video content

### 4. Cloud Messaging (FCM)
- Configure push notifications
- Set up topics for:
  - Order updates
  - Promotional offers
  - New product alerts
  - Admin notifications

### 5. Analytics
- Enable Google Analytics
- Set up conversion tracking
- Configure custom events

## 🔐 Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by admins only
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
    
    // Categories are readable by all, writable by admins
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // Chat messages
    match /chats/{chatId} {
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
    // Product images - readable by all, writable by admins
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
    
    // User profile pictures - readable by all, writable by owner
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Order documents - readable/writable by owner and admins
    match /orders/{orderId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        (firestore.get(/databases/(default)/documents/orders/$(orderId)).data.userId == request.auth.uid ||
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin']);
    }
  }
}
```

## 🔑 Service Account Configuration

The service account is already configured with the following details:
- **Email**: `firebase-adminsdk-fbsvc@adamperfumes-om.iam.gserviceaccount.com`
- **Client ID**: `109240582258074959059`
- **Private Key ID**: `13e3a87b725239917d35b2eafa572b6e9579d173`

## 📋 Setup Checklist

### Initial Setup
- [x] Firebase project created
- [x] Android apps registered
- [x] iOS apps registered
- [x] Service account configured
- [x] Configuration files generated

### Services Configuration
- [ ] Enable Authentication methods
- [ ] Create Firestore database
- [ ] Set up Storage buckets
- [ ] Configure Cloud Messaging
- [ ] Enable Analytics
- [ ] Set up security rules

### Testing
- [ ] Test authentication flows
- [ ] Verify database operations
- [ ] Test file uploads
- [ ] Confirm push notifications
- [ ] Validate analytics tracking

## 🚀 Environment Configuration

### Backend (.env)
```env
FIREBASE_PROJECT_ID=adamperfumes-om
FIREBASE_PRIVATE_KEY_ID=13e3a87b725239917d35b2eafa572b6e9579d173
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[PRIVATE_KEY]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@adamperfumes-om.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=109240582258074959059
```

### Web Apps (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDc1sGwWQlUIyrkfHUMghq9vhQJqYsoqeU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=adamperfumes-om.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=adamperfumes-om
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=adamperfumes-om.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=326861616985
```

### Mobile Apps
- Configuration files are already placed in the correct locations
- `google-services.json` for Android
- `GoogleService-Info.plist` for iOS

## 🔧 Advanced Configuration

### Cloud Functions (Optional)
Set up Cloud Functions for:
- Order processing automation
- Email notifications
- Data validation
- Background tasks

### Extensions
Consider installing Firebase Extensions for:
- Image resizing
- Email sending
- Payment processing
- Search functionality

## 📊 Monitoring & Analytics

### Performance Monitoring
- Enable Performance Monitoring for mobile apps
- Set up custom traces for critical user journeys
- Monitor app startup time and network requests

### Crashlytics
- Enable Crashlytics for crash reporting
- Set up custom logs for debugging
- Configure alerts for critical issues

## 🔒 Security Best Practices

1. **Regular Security Reviews**
   - Review and update security rules monthly
   - Monitor authentication logs
   - Check for suspicious activities

2. **Data Protection**
   - Encrypt sensitive data
   - Implement proper data retention policies
   - Regular security audits

3. **Access Control**
   - Use least privilege principle
   - Regular review of user permissions
   - Implement role-based access control

## 🆘 Troubleshooting

### Common Issues

#### Authentication Problems
- Verify API keys are correct
- Check domain authorization
- Ensure proper OAuth configuration

#### Database Connection Issues
- Verify security rules
- Check network connectivity
- Validate service account permissions

#### Storage Upload Failures
- Check storage rules
- Verify file size limits
- Ensure proper CORS configuration

### Support Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

---

## ✅ Status: CONFIGURED

Firebase is now properly configured for the Adam-Perfumes project. All configuration files are in place and ready for development.

**Next Steps**: Enable required services in Firebase Console and test the integration.