import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Main Lucidence Authentication Firebase Config
// Uses environment variables from .env file
const mainFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID",
};

// Initialize main Firebase app (use existing if already initialized)
let mainApp: FirebaseApp;
try {
  mainApp = getApp();
} catch {
  mainApp = initializeApp(mainFirebaseConfig);
}

export const auth: Auth = getAuth(mainApp);
export const db: Firestore = getFirestore(mainApp);

// Store for dynamically initialized client project Firebase apps
const clientApps: Map<string, FirebaseApp> = new Map();

// Client project Firebase config interface
export interface ClientFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Initialize a Firebase app for a specific client project
 * This allows multi-tenant architecture where each client has their own Firebase
 */
export function initializeClientProjectApp(
  projectId: string, 
  config: ClientFirebaseConfig
): FirebaseApp {
  // Check if already initialized
  if (clientApps.has(projectId)) {
    return clientApps.get(projectId)!;
  }

  // Check if this app name already exists in Firebase
  const existingApp = getApps().find(app => app.name === projectId);
  if (existingApp) {
    clientApps.set(projectId, existingApp);
    return existingApp;
  }

  // Initialize new app with unique name
  const app = initializeApp(config, projectId);
  clientApps.set(projectId, app);
  return app;
}

/**
 * Get a client project's Firebase app
 */
export function getClientProjectApp(projectId: string): FirebaseApp | undefined {
  return clientApps.get(projectId);
}

/**
 * Get Firestore for a client project
 */
export function getClientProjectFirestore(projectId: string): Firestore | undefined {
  const app = clientApps.get(projectId);
  return app ? getFirestore(app) : undefined;
}

/**
 * Get Auth for a client project
 */
export function getClientProjectAuth(projectId: string): Auth | undefined {
  const app = clientApps.get(projectId);
  return app ? getAuth(app) : undefined;
}

/**
 * Cleanup a client project's Firebase app
 */
export async function deleteClientProjectApp(projectId: string): Promise<void> {
  const app = clientApps.get(projectId);
  if (app) {
    // Note: Firebase v9+ doesn't have a direct deleteApp, 
    // but we can remove from our map
    clientApps.delete(projectId);
  }
}

export { mainApp };
