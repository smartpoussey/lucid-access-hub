import { initializeApp, FirebaseApp, getApps, deleteApp } from 'firebase/app';
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore';
import type { ClientProject } from '@/types';

// Store for dynamically initialized client project Firebase apps
const clientApps: Map<string, FirebaseApp> = new Map();

export interface ClientProjectFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Convert ClientProject to Firebase config
 */
export function projectToFirebaseConfig(project: ClientProject): ClientProjectFirebaseConfig {
  return {
    apiKey: project.apiKey,
    authDomain: project.authDomain,
    projectId: project.projectId,
    storageBucket: project.storageBucket,
    messagingSenderId: project.messagingSenderId,
    appId: project.appId,
    measurementId: project.measurementId,
  };
}

/**
 * Initialize a Firebase app for a specific client project
 * Uses the clientProjectId as the unique app name
 */
export function initializeClientProjectFirebase(
  clientProjectId: string,
  config: ClientProjectFirebaseConfig
): FirebaseApp {
  // Check if already initialized in our map
  if (clientApps.has(clientProjectId)) {
    return clientApps.get(clientProjectId)!;
  }

  // Check if this app name already exists in Firebase
  const existingApp = getApps().find(app => app.name === clientProjectId);
  if (existingApp) {
    clientApps.set(clientProjectId, existingApp);
    return existingApp;
  }

  // Initialize new app with unique name
  const app = initializeApp(config, clientProjectId);
  clientApps.set(clientProjectId, app);
  return app;
}

/**
 * Get a client project's Firebase app
 */
export function getClientProjectApp(clientProjectId: string): FirebaseApp | undefined {
  return clientApps.get(clientProjectId);
}

/**
 * Get Firestore instance for a client project
 */
export function getClientProjectFirestore(clientProjectId: string): Firestore | undefined {
  const app = clientApps.get(clientProjectId);
  return app ? getFirestore(app) : undefined;
}

/**
 * Cleanup a client project's Firebase app
 */
export async function deleteClientProjectFirebase(clientProjectId: string): Promise<void> {
  const app = clientApps.get(clientProjectId);
  if (app) {
    try {
      await deleteApp(app);
    } catch (error) {
      console.warn('Error deleting Firebase app:', error);
    }
    clientApps.delete(clientProjectId);
  }
}

/**
 * Cleanup all client project Firebase apps
 */
export async function deleteAllClientProjectApps(): Promise<void> {
  const deletePromises = Array.from(clientApps.keys()).map(id => 
    deleteClientProjectFirebase(id)
  );
  await Promise.all(deletePromises);
}

/**
 * List all collection names in a client project's Firestore
 * Note: This requires the client project's Firestore to have proper security rules
 */
export async function listClientProjectCollections(
  clientProjectId: string,
  config: ClientProjectFirebaseConfig
): Promise<string[]> {
  try {
    // Initialize the Firebase app for this project
    const app = initializeClientProjectFirebase(clientProjectId, config);
    const db = getFirestore(app);
    
    // Unfortunately, listing collections in Firestore is not directly supported
    // from the client SDK. We need to use a known list or check specific collections.
    // For now, we'll try to access common collection names and see which exist.
    
    // Alternative approach: If you know the possible collection names, check them
    const knownCollections = [
      'users',
      'leads',
      'clients',
      'projects',
      'tasks',
      'messages',
      'notifications',
      'settings',
      'analytics',
      'logs',
      'orders',
      'products',
      'categories',
      'documents',
      'files',
      'comments',
      'reviews',
      'appointments',
      'bookings',
      'invoices',
      'payments',
    ];
    
    const existingCollections: string[] = [];
    
    // Check each collection - if we can get docs (even empty), it exists
    await Promise.all(
      knownCollections.map(async (collName) => {
        try {
          const collRef = collection(db, collName);
          const snapshot = await getDocs(collRef);
          // If we got here without error, collection is accessible
          existingCollections.push(collName);
        } catch (error) {
          // Collection doesn't exist or not accessible - skip
        }
      })
    );
    
    return existingCollections.sort();
  } catch (error) {
    console.error('Error listing collections:', error);
    throw new Error('Failed to connect to project Firebase');
  }
}

/**
 * Get documents from a specific collection in a client project
 */
export async function getClientProjectCollectionDocs(
  clientProjectId: string,
  collectionName: string
): Promise<{ id: string; data: Record<string, unknown> }[]> {
  const db = getClientProjectFirestore(clientProjectId);
  if (!db) {
    throw new Error('Client project Firebase not initialized');
  }
  
  try {
    const collRef = collection(db, collectionName);
    const snapshot = await getDocs(collRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data() as Record<string, unknown>,
    }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    throw new Error(`Failed to fetch collection: ${collectionName}`);
  }
}
