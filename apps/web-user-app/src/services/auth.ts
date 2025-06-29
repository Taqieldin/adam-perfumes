import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User as UserType, UserRole, Language, CustomerSegment } from '../../../shared/types/user';
import apiService from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  language?: Language;
}

export interface PhoneAuthData {
  phoneNumber: string;
  recaptchaVerifier: RecaptchaVerifier;
}

class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Email/Password Authentication
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      // Update last login in backend
      await this.updateLastLogin(userCredential.user.uid);
      
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      // Create user document in Firestore
      await this.createUserDocument(userCredential.user, data);

      // Create user in backend database
      await this.createBackendUser(userCredential.user, data);

      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Social Authentication
  async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user exists in backend, if not create
      await this.ensureBackendUser(userCredential.user);
      
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async loginWithFacebook(): Promise<User> {
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope('email');
      
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user exists in backend, if not create
      await this.ensureBackendUser(userCredential.user);
      
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Phone Authentication
  async setupRecaptcha(elementId: string): Promise<RecaptchaVerifier> {
    if (typeof window === 'undefined') {
      throw new Error('Recaptcha can only be used in browser environment');
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {
        console.log('Recaptcha verified');
      },
    });

    return this.recaptchaVerifier;
  }

  async sendPhoneVerification(phoneNumber: string): Promise<ConfirmationResult> {
    if (!this.recaptchaVerifier) {
      throw new Error('Recaptcha not initialized');
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );
      return confirmationResult;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async verifyPhoneCode(confirmationResult: ConfirmationResult, code: string): Promise<User> {
    try {
      const userCredential = await confirmationResult.confirm(code);
      
      // Check if user exists in backend, if not create
      await this.ensureBackendUser(userCredential.user);
      
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Change Password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No authenticated user');
    }

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Helper Methods
  private async createUserDocument(user: User, data: RegisterData): Promise<void> {
    const userDoc = {
      uid: user.uid,
      email: user.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      language: data.language || Language.EN,
      role: UserRole.CUSTOMER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
  }

  private async createBackendUser(user: User, data: RegisterData): Promise<void> {
    const userData: Partial<UserType> = {
      firebaseUid: user.uid,
      email: user.email!,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      language: data.language || Language.EN,
      role: UserRole.CUSTOMER,
      isActive: true,
      emailVerified: user.emailVerified,
      phoneVerified: false,
      twoFactorEnabled: false,
      loginCount: 1,
      walletBalance: 0,
      loyaltyPoints: 0,
      fcmTokens: [],
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
          whatsapp: false,
        },
        marketing: {
          email: true,
          push: true,
          sms: false,
          whatsapp: false,
        },
        theme: 'light',
        currency: 'OMR',
      },
      metadata: {},
      totalSpent: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      customerSegment: CustomerSegment.NEW,
      permissions: [],
    };

    await apiService.post('/users', userData);
  }

  private async ensureBackendUser(user: User): Promise<void> {
    try {
      // Check if user exists in backend
      await apiService.get(`/users/firebase/${user.uid}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // User doesn't exist, create them
        const names = user.displayName?.split(' ') || ['', ''];
        const userData: Partial<UserType> = {
          firebaseUid: user.uid,
          email: user.email!,
          firstName: names[0] || 'User',
          lastName: names.slice(1).join(' ') || '',
          phone: user.phoneNumber || null,
          language: Language.EN,
          role: UserRole.CUSTOMER,
          isActive: true,
          emailVerified: user.emailVerified,
          phoneVerified: !!user.phoneNumber,
          twoFactorEnabled: false,
          loginCount: 1,
          walletBalance: 0,
          loyaltyPoints: 0,
          fcmTokens: [],
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false,
              whatsapp: false,
            },
            marketing: {
              email: true,
              push: true,
              sms: false,
              whatsapp: false,
            },
            theme: 'light',
            currency: 'OMR',
          },
          metadata: {},
          totalSpent: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          customerSegment: CustomerSegment.NEW,
          permissions: [],
        };

        await apiService.post('/users', userData);
      }
    }
  }

  private async updateLastLogin(uid: string): Promise<void> {
    try {
      await apiService.patch(`/users/firebase/${uid}`, {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      });
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completion.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled.';
      default:
        return 'An error occurred during authentication.';
    }
  }

  // Get current user data
  async getCurrentUserData(): Promise<UserType | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const userData = await apiService.get<UserType>(`/users/firebase/${user.uid}`);
      return userData;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  // Update FCM token
  async updateFCMToken(token: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await apiService.patch(`/users/firebase/${user.uid}/fcm-token`, { token });
    } catch (error) {
      console.error('Failed to update FCM token:', error);
    }
  }
}

export const authService = new AuthService();
export default authService;