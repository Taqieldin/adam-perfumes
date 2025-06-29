# Firebase Configuration Summary - Adam Perfumes

## 🔥 Project Information
- **Project Name**: Adamperfumes
- **Project ID**: `adamperfumes-om`
- **Project Number**: `326861616985`
- **Storage Bucket**: `adamperfumes-om.firebasestorage.app`

## 🔑 API Keys
- **Web API Key**: `AIzaSyDc1sGwWQlUIyrkfHUMghq9vhQJqYsoqeU`
- **iOS API Key**: `AIzaSyAogQOGoje18ztqfqnoZDxj-ttCbr8Ji58`

## 📱 Mobile App Configurations

### Android Applications

#### Customer App
- **App ID**: `1:326861616985:android:a724fc4c4fd3356f2efe48`
- **Package Name**: `com.adamperfumes.customer`
- **OAuth Client ID**: `326861616985-dp9j6jkkukppguml9r1r33so4liqto3m.apps.googleusercontent.com`

#### Admin App
- **App ID**: `1:326861616985:android:f632bbf9a80193612efe48`
- **Package Name**: `com.adamperfumes.admin`
- **OAuth Client ID**: `326861616985-dp9j6jkkukppguml9r1r33so4liqto3m.apps.googleusercontent.com`

### iOS Applications

#### Customer App
- **App ID**: `1:326861616985:ios:a9bd2ac107c03fd12efe48`
- **Bundle ID**: `com.adamperfumes.customer`
- **OAuth Client ID**: `326861616985-btlbnmq72umkqnm2ca5n2dgbgbq3l5bh.apps.googleusercontent.com`

#### Admin App
- **App ID**: `1:326861616985:ios:9e0b1d47197a183a2efe48`
- **Bundle ID**: `com.adamperfumes.admin`
- **OAuth Client ID**: `326861616985-btlbnmq72umkqnm2ca5n2dgbgbq3l5bh.apps.googleusercontent.com`

## 🔐 OAuth Client IDs Summary

### iOS Client ID
- **ID**: `326861616985-btlbnmq72umkqnm2ca5n2dgbgbq3l5bh.apps.googleusercontent.com`
- **Reversed ID**: `com.googleusercontent.apps.326861616985-btlbnmq72umkqnm2ca5n2dgbgbq3l5bh`
- **Used for**: iOS apps and web applications

### Android Client ID
- **ID**: `326861616985-dp9j6jkkukppguml9r1r33so4liqto3m.apps.googleusercontent.com`
- **Used for**: Android apps

## 📄 Configuration Files Status

### ✅ Files Created/Updated:

1. **Backend Service Account**
   - `backend/firebase/adamperfumes-om-firebase-adminsdk.json`

2. **Android Configuration Files**
   - `apps/mobile-user-app/google-services.json`
   - `apps/mobile-admin-app/google-services.json`

3. **iOS Configuration Files**
   - `apps/mobile-user-app/GoogleService-Info.plist`
   - `apps/mobile-admin-app/GoogleService-Info.plist`

4. **Environment Files**
   - `.env.example` (updated with OAuth client IDs)
   - `backend/.env.example`
   - `apps/web-user-app/.env.example`
   - `apps/web-admin-dashboard/.env.example`

## 🔧 Key Configuration Updates

### OAuth Client Configuration
The configuration now properly includes:
- **iOS Client ID** for iOS apps and web authentication
- **Android Client ID** for Android apps
- Cross-platform OAuth client references in google-services.json

### Service Account Details
- **Email**: `firebase-adminsdk-fbsvc@adamperfumes-om.iam.gserviceaccount.com`
- **Client ID**: `109240582258074959059`
- **Private Key ID**: `13e3a87b725239917d35b2eafa572b6e9579d173`

## 🚀 Next Steps for Firebase Console

### 1. Enable Authentication Methods
```
Firebase Console > Authentication > Sign-in method
```
- ✅ Email/Password
- ✅ Google (use the OAuth client IDs above)
- ✅ Facebook
- ✅ Apple (iOS only)
- ✅ Phone Number

### 2. Configure Firestore Database
```
Firebase Console > Firestore Database
```
- Create database in production mode
- Set up security rules (see FIREBASE_SETUP.md)
- Create initial collections

### 3. Set up Storage
```
Firebase Console > Storage
```
- Initialize Cloud Storage
- Configure security rules
- Set up folder structure

### 4. Enable Cloud Messaging
```
Firebase Console > Cloud Messaging
```
- No additional setup required
- FCM is automatically configured with the apps

### 5. Enable Analytics
```
Firebase Console > Analytics
```
- Enable Google Analytics
- Link to Google Analytics account
- Configure conversion events

## 🔒 Security Considerations

### OAuth Client Security
- iOS Client ID is used for web and iOS authentication
- Android Client ID is separate for Android apps
- Both are properly configured in the respective platform files

### API Key Security
- Web API key is public (safe for client-side use)
- iOS API key is embedded in the app bundle
- Service account private key is server-side only

## 📋 Verification Checklist

### Configuration Files
- [x] google-services.json files have correct OAuth client IDs
- [x] GoogleService-Info.plist files have correct bundle IDs
- [x] Service account JSON is properly placed
- [x] Environment variables are updated

### Firebase Console Setup
- [ ] Authentication methods enabled
- [ ] Firestore database created
- [ ] Storage initialized
- [ ] Cloud Messaging configured
- [ ] Analytics enabled

### Testing
- [ ] Test Google Sign-In on web
- [ ] Test Google Sign-In on Android
- [ ] Test Google Sign-In on iOS
- [ ] Verify push notifications
- [ ] Test file uploads to Storage

## 🆘 Troubleshooting

### Common Issues

#### Google Sign-In Not Working
1. Verify OAuth client IDs match in Firebase Console
2. Check SHA-1 fingerprints for Android (if required)
3. Ensure bundle IDs match exactly

#### Push Notifications Not Received
1. Verify FCM token generation
2. Check device notification permissions
3. Verify server key configuration

#### File Upload Failures
1. Check Storage security rules
2. Verify file size limits
3. Ensure proper authentication

## 📞 Support Resources

- **Firebase Console**: https://console.firebase.google.com/project/adamperfumes-om
- **Firebase Documentation**: https://firebase.google.com/docs
- **Google Cloud Console**: https://console.cloud.google.com/

---

## ✅ Status: FULLY CONFIGURED

All Firebase configuration files have been updated with the correct OAuth client IDs and app identifiers. The project is ready for Firebase service enablement and testing.

**Last Updated**: [Current Date]
**Configuration Version**: 2.0