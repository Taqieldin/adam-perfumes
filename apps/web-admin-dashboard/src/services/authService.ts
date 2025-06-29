import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User
} from 'firebase/auth';
import { auth } from './firebase';
import { User as UserType } from '../../../shared/types/user';
import apiService from './apiService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
}

class AuthService {
  // Get current user
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  // Get current user data from API
  async getCurrentUserData(): Promise<UserType | null> {
    try {
      return await apiService.get<UserType>('/auth/me');
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  // Login with email and password
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      // Get ID token and send to backend for verification
      const idToken = await userCredential.user.getIdToken();
      await apiService.post('/auth/verify-token', { idToken });
      
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      // Clear any stored tokens
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    } catch (error: any) {
      throw new Error('Failed to logout');
    }
  }

  // Update user profile
  async updateProfile(data: UpdateProfileData): Promise<UserType> {
    try {
      return await apiService.put<UserType>('/auth/profile', data);
    } catch (error: any) {
      throw new Error('Failed to update profile');
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Check if user has permission
  hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission) || userPermissions.includes('super_admin');
  }

  // Check if user has any of the required permissions
  hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some(permission => this.hasPermission(userPermissions, permission));
  }

  // Check if user has admin role
  isAdmin(userRole: string): boolean {
    return ['admin', 'super_admin', 'branch_manager'].includes(userRole);
  }

  // Get user's accessible branches
  async getAccessibleBranches(): Promise<string[]> {
    try {
      const response = await apiService.get<{ branchIds: string[] }>('/auth/accessible-branches');
      return response.branchIds;
    } catch (error) {
      console.error('Failed to get accessible branches:', error);
      return [];
    }
  }

  // Get error message from Firebase error code
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/requires-recent-login':
        return 'Please log in again to perform this action';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed. Please contact support';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-api-key':
        return 'Invalid API key. Please contact support';
      case 'auth/app-deleted':
        return 'Firebase app has been deleted. Please contact support';
      case 'auth/app-not-authorized':
        return 'App not authorized. Please contact support';
      case 'auth/argument-error':
        return 'Invalid arguments provided';
      case 'auth/invalid-user-token':
        return 'User token is invalid. Please log in again';
      case 'auth/user-token-expired':
        return 'User session has expired. Please log in again';
      case 'auth/null-user':
        return 'No user is currently signed in';
      case 'auth/tenant-id-mismatch':
        return 'Tenant ID mismatch. Please contact support';
      default:
        console.error('Unknown auth error:', errorCode);
        return 'An error occurred during authentication. Please try again';
    }
  }

  // Setup auth state listener
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get ID token
  async getIdToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Failed to get ID token:', error);
      return null;
    }
  }

  // Refresh ID token
  async refreshToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken(true);
      }
      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;