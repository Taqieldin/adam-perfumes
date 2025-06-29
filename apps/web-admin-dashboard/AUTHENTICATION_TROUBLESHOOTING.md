# Authentication Troubleshooting Guide

## Common Authentication Issues and Solutions

### 1. Firebase Configuration Issues

**Problem**: "An error occurred during authentication"
**Possible Causes**:
- Invalid Firebase API key
- Incorrect Firebase project configuration
- Network connectivity issues
- Firebase emulator conflicts

**Solutions**:

#### Check Environment Variables
Ensure your `.env.local` file has the correct Firebase configuration:
```env
VITE_FIREBASE_API_KEY=AIzaSyDc1sGwWQlUIyrkfHUMghq9vhQJqYsoqeU
VITE_FIREBASE_AUTH_DOMAIN=adamperfumes-om.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=adamperfumes-om
VITE_FIREBASE_STORAGE_BUCKET=adamperfumes-om.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=326861616985
VITE_FIREBASE_APP_ID=1:326861616985:web:f632bbf9a80193612efe48
VITE_USE_FIREBASE_EMULATOR=false
```

#### Disable Firebase Emulators
If you're getting emulator connection errors, ensure emulators are disabled:
```env
VITE_USE_FIREBASE_EMULATOR=false
```

### 2. Network and CORS Issues

**Problem**: Network request failed or CORS errors
**Solutions**:
- Check your internet connection
- Verify Firebase project is active
- Ensure the domain is authorized in Firebase Console

### 3. Invalid Credentials

**Problem**: "Invalid email or password"
**Solutions**:
- Verify the email and password are correct
- Check if the user account exists in Firebase Auth
- Ensure the user has admin privileges

### 4. User Permission Issues

**Problem**: "Insufficient permissions to access admin dashboard"
**Solutions**:
- Verify the user has admin role in the database
- Check user permissions in the backend
- Ensure the user role is one of: 'admin', 'super_admin', 'branch_manager'

## Testing Authentication

### 1. Test with Demo Credentials
Use the demo credentials provided in the login form:
- **Super Admin**: admin@adamperfumes.com / admin123
- **Branch Manager**: manager@adamperfumes.com / manager123
- **Staff**: staff@adamperfumes.com / staff123

### 2. Check Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `adamperfumes-om`
3. Navigate to Authentication > Users
4. Verify the test users exist

### 3. Test API Connection
Open browser developer tools and check:
1. Network tab for failed requests
2. Console for JavaScript errors
3. Application tab for stored tokens

## Debug Steps

### 1. Enable Debug Mode
Add to your `.env.local`:
```env
VITE_DEBUG=true
```

### 2. Check Browser Console
Look for error messages in the browser console:
- Firebase initialization errors
- Network request failures
- Authentication state changes

### 3. Verify Firebase Project Status
1. Check Firebase project billing status
2. Verify Authentication is enabled
3. Check authorized domains include `localhost`

### 4. Test Backend Connection
Verify the backend API is running and accessible:
```bash
curl http://localhost:3001/api/health
```

## Common Error Messages and Solutions

### "Firebase: Error (auth/invalid-api-key)"
- **Cause**: Invalid or missing Firebase API key
- **Solution**: Check `VITE_FIREBASE_API_KEY` in `.env.local`

### "Firebase: Error (auth/network-request-failed)"
- **Cause**: Network connectivity issues
- **Solution**: Check internet connection and Firebase project status

### "Firebase: Error (auth/user-not-found)"
- **Cause**: User doesn't exist in Firebase Auth
- **Solution**: Create user in Firebase Console or use demo credentials

### "Firebase: Error (auth/wrong-password)"
- **Cause**: Incorrect password
- **Solution**: Use correct password or reset password

### "Insufficient permissions to access admin dashboard"
- **Cause**: User doesn't have admin role
- **Solution**: Update user role in database or use admin account

## Quick Fix Commands

### Reset Environment
```bash
# Remove node_modules and reinstall
rm -rf node_modules
pnpm install

# Clear browser cache and localStorage
# Open DevTools > Application > Storage > Clear storage
```

### Restart Development Server
```bash
cd apps/web-admin-dashboard
pnpm run dev
```

### Check Firebase Connection
```javascript
// Run in browser console
import { auth } from './src/services/firebase';
console.log('Auth instance:', auth);
console.log('Current user:', auth.currentUser);
```

## Contact Support

If the issue persists:
1. Check the browser console for specific error messages
2. Verify all environment variables are set correctly
3. Test with demo credentials
4. Contact the development team with:
   - Error message details
   - Browser and OS information
   - Steps to reproduce the issue

## Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Project Documentation](./README.md)