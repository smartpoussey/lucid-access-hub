import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import type { User, UserRole } from '@/types';
import {
  getUserByEmail,
  updateUserLastLogin,
  createUserWithId as createUserInFirestore,
  reserveEmail,
  releaseEmail,
} from './firestore.service';

/**
 * Sign in with email and password
 */
export async function signInWithCredentials(email: string, password: string): Promise<User> {
  const emailKey = email.trim().toLowerCase();
  
  // Sign in with Firebase Auth
  try {
    await signInWithEmailAndPassword(auth, emailKey, password);
  } catch (error: any) {
    if (error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password');
    }
    throw error;
  }
  
  // Get user data from Firestore
  const user = await getUserByEmail(emailKey);
  
  if (!user) {
    await signOut(auth);
    throw new Error('User account not found');
  }
  
  if (user.status !== 'active') {
    await signOut(auth);
    throw new Error('Your account is not active. Please contact support.');
  }
  
  // Update last login
  await updateUserLastLogin(user.userId);
  
  return user;
}

/**
 * Register new user with email and password
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ userId: string; requiresEmailVerification: boolean }> {
  const emailKey = email.trim().toLowerCase();

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
    // Reserve email
    await reserveEmail(uid, emailKey);

    // Create Firestore user doc with UID as document id
    const userId = await createUserInFirestore(uid, {
      name,
      email: emailKey,
      role: 'client' as UserRole,
      status: 'pending',
    });

    await sendEmailVerification(userCredential.user);
    await signOut(auth);

    return { userId, requiresEmailVerification: true };
  } catch (error: any) {
    // Best-effort cleanup
    await Promise.allSettled([
      releaseEmail(emailKey),
    ]);

    await userCredential.user.delete();

    // Map common "permission denied" into a more helpful message
    if (error?.code === 'permission-denied') {
      throw new Error('Registration blocked by Firestore rules (missing permissions).');
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
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
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
 * Register a client from an approved lead (admin action)
 */
export async function registerClientFromLead(
  email: string,
  name: string,
  password: string
): Promise<{ userId: string }> {
  const emailKey = email.trim().toLowerCase();

  // Create Firebase Auth user
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
    // Reserve email
    await reserveEmail(uid, emailKey);

    // Create Firestore user doc with 'client' role and 'active' status
    await createUserInFirestore(uid, {
      name,
      email: emailKey,
      role: 'client' as UserRole,
      status: 'active',
    });

    // Sign out immediately (admin shouldn't be signed in as this user)
    await signOut(auth);

    return { userId: uid };
  } catch (error: any) {
    await Promise.allSettled([
      releaseEmail(emailKey),
    ]);
    await userCredential.user.delete();
    throw error;
  }
}
