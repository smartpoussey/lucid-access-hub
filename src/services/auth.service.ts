import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { User, UserRole } from '@/types';

const googleProvider = new GoogleAuthProvider();

// Email link action code settings
const actionCodeSettings = {
  url: window.location.origin + '/complete-signup',
  handleCodeInApp: true,
};

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userData = await getUserData(userCredential.user.uid);
  
  if (!userData) {
    throw new Error('User data not found');
  }
  
  if (userData.status !== 'active') {
    await signOut(auth);
    throw new Error('Your account is not active. Please contact support.');
  }
  
  return userData;
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const userData = await getUserData(result.user.uid);
  
  if (!userData) {
    // User authenticated but not in our system
    await signOut(auth);
    throw new Error('Account not found. Please contact your administrator.');
  }
  
  if (userData.status !== 'active') {
    await signOut(auth);
    throw new Error('Your account is not active. Please contact support.');
  }
  
  return userData;
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Send password setup email link (for first-time users)
 */
export async function sendPasswordSetupEmail(email: string): Promise<void> {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  // Store email for later retrieval
  window.localStorage.setItem('emailForSignIn', email);
}

/**
 * Check if current URL is a sign-in email link
 */
export function isEmailSignInLink(url: string): boolean {
  return isSignInWithEmailLink(auth, url);
}

/**
 * Complete sign-in with email link
 */
export async function completeEmailLinkSignIn(email: string, url: string): Promise<User> {
  const result = await signInWithEmailLink(auth, email, url);
  window.localStorage.removeItem('emailForSignIn');
  
  const userData = await getUserData(result.user.uid);
  if (!userData) {
    throw new Error('User data not found');
  }
  
  // Update user status to active if pending
  if (userData.status === 'pending') {
    await updateDoc(doc(db, 'users', result.user.uid), {
      status: 'active',
      updatedAt: new Date(),
    });
    userData.status = 'active';
  }
  
  return userData;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Get user data from Firestore
 */
export async function getUserData(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  
  if (!userDoc.exists()) {
    return null;
  }
  
  const data = userDoc.data();
  return {
    userId: userDoc.id,
    email: data.email,
    name: data.name,
    role: data.role as UserRole,
    status: data.status,
    avatarUrl: data.avatarUrl,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Create user in Firestore (admin use)
 */
export async function createUserRecord(
  userId: string,
  email: string,
  name: string,
  role: UserRole
): Promise<void> {
  await setDoc(doc(db, 'users', userId), {
    email,
    name,
    role,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

/**
 * Subscribe to auth state changes
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
