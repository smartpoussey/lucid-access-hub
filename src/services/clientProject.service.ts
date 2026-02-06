import { FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore';
import type { ClientProject } from '@/types';

import {
  initializeClientProjectApp,
  getClientProjectFirestore as getFirestoreFromConfig,
  deleteClientProjectApp,
} from '@/config/firebase';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface ClientProjectFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/* -------------------------------------------------------------------------- */
/*                          CONFIG TRANSFORMATION                              */
/* -------------------------------------------------------------------------- */

export function projectToFirebaseConfig(
  project: ClientProject
): ClientProjectFirebaseConfig {
  return {
    apiKey: project.apiKey,
    authDomain: project.authDomain,
    projectId: project.projectId.trim(),
    storageBucket: project.storageBucket,
    messagingSenderId: project.messagingSenderId,
    appId: project.appId,
    measurementId: project.measurementId,
  };
}

/* -------------------------------------------------------------------------- */
/*                          FIREBASE INITIALIZATION                            */
/* -------------------------------------------------------------------------- */

/**
 * Initialize Firebase for a client project.
 * Delegates responsibility to firebase.ts
 */
export function initializeClientProjectFirebase(
  clientProjectId: string,
  config: ClientProjectFirebaseConfig
): FirebaseApp {
  return initializeClientProjectApp(clientProjectId, config);
}

/* -------------------------------------------------------------------------- */
/*                              FIRESTORE ACCESS                               */
/* -------------------------------------------------------------------------- */

export function getClientProjectFirestore(
  clientProjectId: string
): Firestore {
  const db = getFirestoreFromConfig(clientProjectId);

  if (!db) {
    throw new Error(
      `Firebase not initialized for project: ${clientProjectId}`
    );
  }

  return db;
}

/* -------------------------------------------------------------------------- */
/*                              DATA FETCHING                                  */
/* -------------------------------------------------------------------------- */

export async function getClientProjectCollectionDocs(
  clientProjectId: string,
  collectionName: string
): Promise<{ id: string; data: Record<string, unknown> }[]> {
  const db = getClientProjectFirestore(clientProjectId);

  const snap = await getDocs(collection(db, collectionName));

  return snap.docs.map(doc => ({
    id: doc.id,
    data: doc.data() as Record<string, unknown>,
  }));
}

/**
 * Firestore client SDK cannot list collections dynamically
 */
export async function listClientProjectCollections(project: ClientProject): Promise<string[]> {
  return [
    `${project.projectName}_Contacts`,
    `${project.projectName}_Interactions`,
  ];
}

/* -------------------------------------------------------------------------- */
/*                                CLEANUP                                      */
/* -------------------------------------------------------------------------- */

export async function deleteClientProjectFirebase(
  clientProjectId: string
): Promise<void> {
  await deleteClientProjectApp(clientProjectId);
}
