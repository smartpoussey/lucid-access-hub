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
  createUserWithId as createUserInFirestore,
  reserveUsername,
  reserveEmail,
  releaseUsername,
  releaseEmail,
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
  const usernameKey = username.trim().toLowerCase();
  const user = await getUserByUsername(usernameKey);
  
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
  const usernameKey = username.trim().toLowerCase();
  const emailKey = email.trim().toLowerCase();

  // Hash password for Firestore storage
  const passwordHash = await hashPassword(password);

  // Create Firebase Auth user (signs the user in)
  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(auth, emailKey, password);
  } catch (error: any) {
    if (error?.code === 'auth/email-already-in-use') {
      throw new Error('Email is already registered');
    }
    throw error;
  }

  const uid = userCredential.user.uid;

  try {
    // Reserve username + email without requiring any reads
    await reserveUsername(uid, usernameKey);
    await reserveEmail(uid, emailKey);

    // Create Firestore user doc with UID as document id
    const userId = await createUserInFirestore(uid, {
      username: usernameKey,
      email: emailKey,
      passwordHash,
      role: 'client' as UserRole,
      status: 'pending',
    });

    await sendEmailVerification(userCredential.user);
    await signOut(auth);

    return { userId, requiresEmailVerification: true };
  } catch (error: any) {
    // Best-effort cleanup
    await Promise.allSettled([
      releaseUsername(usernameKey),
      releaseEmail(emailKey),
    ]);

    await userCredential.user.delete();

    // Map common "permission denied" into a more helpful message
    if (error?.code === 'permission-denied') {
      throw new Error('Registration blocked by Firestore rules (missing permissions).');
    }

    // If the username/email docs already exist, setDoc becomes an update and is denied by rules.
    // Treat that as "already taken".
    if (error?.code === 'permission-denied') {
      throw new Error('Username or email is already taken');
    }

    throw error;
  }
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
