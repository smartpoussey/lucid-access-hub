import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import type {
  User,
  UserRole,
  UserStatus,
  Lead,
  LeadStatus,
  Client,
  ClientProject,
} from '@/types';

/* -------------------------------------------------------------------------- */
/*                                   LEADS                                    */
/* -------------------------------------------------------------------------- */

export async function createLead(input: Omit<Lead, 'leadId' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'leads'));

  await setDoc(ref, {
    ...input,
    leadId: ref.id,
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

export async function getAllLeads(): Promise<Lead[]> {
  const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => {
    const data = d.data();

    return {
      leadId: data.leadId,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      businessName: data.businessName,
      address: data.address,
      city: data.city,
      reasonForApproaching: data.reasonForApproaching,
      source: data.source,
      hasWebsite: data.hasWebsite,
      hasChatbot: data.hasChatbot,
      hasAiAgent: data.hasAiAgent,
      hasReceptionist: data.hasReceptionist,
      additionalNotes: data.additionalNotes ?? undefined,
      status: data.status as LeadStatus,
      createdAt: data.createdAt?.toDate(),
    };
  });
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  const ref = doc(db, 'leads', leadId);
  await updateDoc(ref, { status });
}

export async function getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
  const q = query(
    collection(db, 'leads'),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      leadId: data.leadId,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      businessName: data.businessName,
      address: data.address,
      city: data.city,
      reasonForApproaching: data.reasonForApproaching,
      source: data.source,
      hasWebsite: data.hasWebsite,
      hasChatbot: data.hasChatbot,
      hasAiAgent: data.hasAiAgent,
      hasReceptionist: data.hasReceptionist,
      additionalNotes: data.additionalNotes ?? undefined,
      status: data.status as LeadStatus,
      createdAt: data.createdAt?.toDate(),
    };
  });
}

/* -------------------------------------------------------------------------- */
/*                                    USERS                                   */
/* -------------------------------------------------------------------------- */

export async function getUserById(userId: string): Promise<User | null> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    userId,
    email: data.email,
    name: data.name,
    role: data.role as UserRole,
    status: data.status as UserStatus,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    avatarUrl: data.avatarUrl ?? undefined,
  };
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<void> {
  const ref = doc(db, 'users', userId);

  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function getAllUsers(): Promise<User[]> {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => {
    const data = d.data();

    return {
      userId: d.id,
      email: data.email,
      name: data.name,
      role: data.role as UserRole,
      status: data.status as UserStatus,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      avatarUrl: data.avatarUrl ?? undefined,
    };
  });
}

export async function getUsersByRole(role: UserRole): Promise<User[]> {
  const q = query(
    collection(db, 'users'),
    where('role', '==', role),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      userId: d.id,
      email: data.email,
      name: data.name,
      role: data.role as UserRole,
      status: data.status as UserStatus,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      avatarUrl: data.avatarUrl ?? undefined,
    };
  });
}

/* -------------------------------------------------------------------------- */
/*                                   CLIENTS                                  */
/* -------------------------------------------------------------------------- */

export async function getClientById(clientId: string): Promise<Client | null> {
  const ref = doc(db, 'clients', clientId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    clientId,
    mobile: data.mobile,
    businessName: data.businessName,
    address: data.address,
    city: data.city,
    handlingWebsite: data.handlingWebsite,
    handlingChatbot: data.handlingChatbot,
    handlingAiAgent: data.handlingAiAgent,
    handlingAppointments: data.handlingAppointments,
    handlingMarketing: data.handlingMarketing,
    additionalNotes: data.additionalNotes ?? undefined,
    createdAt: data.createdAt?.toDate(),
  };
}

/* -------------------------------------------------------------------------- */
/*                              CLIENT PROJECTS                               */
/* -------------------------------------------------------------------------- */

export async function getClientProjectsByClientId(clientId: string): Promise<ClientProject[]> {
  const q = query(
    collection(db, 'clientProjects'),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => {
    const data = d.data();

    return {
      clientProjectId: data.clientProjectId,
      clientId: data.clientId,
      appName: data.appName,
      appEnv: data.appEnv,
      projectName: data.projectName,
      apiKey: data.apiKey,
      authDomain: data.authDomain,
      projectId: data.projectId,
      storageBucket: data.storageBucket,
      messagingSenderId: data.messagingSenderId,
      appId: data.appId,
      measurementId: data.measurementId,
      createdAt: data.createdAt?.toDate(),
    };
  });
}

/* -------------------------------------------------------------------------- */
/*                               ADMIN HELPERS                                */
/* -------------------------------------------------------------------------- */

export async function getAllClientProjects(): Promise<ClientProject[]> {
  const q = query(collection(db, 'clientProjects'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => {
    const data = d.data();

    return {
      clientProjectId: data.clientProjectId,
      clientId: data.clientId,
      appName: data.appName,
      appEnv: data.appEnv,
      projectName: data.projectName,
      apiKey: data.apiKey,
      authDomain: data.authDomain,
      projectId: data.projectId,
      storageBucket: data.storageBucket,
      messagingSenderId: data.messagingSenderId,
      appId: data.appId,
      measurementId: data.measurementId,
      createdAt: data.createdAt?.toDate(),
    };
  });
}

export async function getLeadsCount(): Promise<number> {
  const snapshot = await getDocs(collection(db, 'leads'));
  return snapshot.size;
}

export async function getUsersCount(): Promise<number> {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.size;
}

export async function getProjectsCount(): Promise<number> {
  const snapshot = await getDocs(collection(db, 'clientProjects'));
  return snapshot.size;
}
