import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import type { User, UserRole } from '@/types';
import { 
  getUserByUsername, 
  updateUserLastLogin, 
  createUser as createUserInFirestore,
  isUsernameAvailable,
  isEmailAvailable,
} from './firestore.service';

// Simple hash function for password (in production, use bcrypt on backend)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against stored hash
 */
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === storedHash;
}

/**
 * Sign in with username and password (custom auth against Firestore)
 */
export async function signInWithCredentials(username: string, password: string): Promise<User> {
  const user = await getUserByUsername(username);
  
  if (!user) {
    throw new Error('Invalid username or password');
  }
  
  const isValidPassword = await verifyPassword(password, user.passwordHash);
  
  if (!isValidPassword) {
    throw new Error('Invalid username or password');
  }
  
  if (user.status !== 'active') {
    throw new Error('Your account is not active. Please contact support.');
  }
  
  // Update last login
  await updateUserLastLogin(user.userId);
  
  return user;
}

/**
 * Register new user with username, email, and password
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ userId: string; requiresEmailVerification: boolean }> {
  // Check if username is available
  const usernameAvailable = await isUsernameAvailable(username);
  if (!usernameAvailable) {
    throw new Error('Username is already taken');
  }
  
  // Check if email is available
  const emailAvailable = await isEmailAvailable(email);
  if (!emailAvailable) {
    throw new Error('Email is already registered');
  }
  
  // Hash password for Firestore storage FIRST (before any async operations that might interfere)
  const passwordHash = await hashPassword(password);
  
  // Create user in Firestore with pending status
  const userId = await createUserInFirestore({
    username,
    email,
    passwordHash,
    role: 'client' as UserRole, // Default role for new registrations
    status: 'pending',
  });
  
  // Create Firebase Auth user for email verification
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Send email verification
  await sendEmailVerification(userCredential.user);
  
  // Sign out from Firebase Auth (we use custom auth)
  await signOut(auth);
  
  return { userId, requiresEmailVerification: true };
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Get user data from session storage
 */
export function getStoredUser(): User | null {
  const stored = sessionStorage.getItem('lucidence_user');
  if (!stored) return null;
  
  try {
    const user = JSON.parse(stored);
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Store user in session storage
 */
export function storeUser(user: User): void {
  sessionStorage.setItem('lucidence_user', JSON.stringify(user));
}

/**
 * Clear stored user
 */
export function clearStoredUser(): void {
  sessionStorage.removeItem('lucidence_user');
}

/**
 * Subscribe to auth state changes (for Firebase Auth)
 */
export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current Firebase user
 */
export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Hash password utility (exported for admin use)
 */
export { hashPassword };
