import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { 
  Lead, 
  User, 
  Client,
  Staff,
  ClientProject, 
  StaffClientProject, 
  UserRole, 
  SignupFormData 
} from '@/types';

// ==================== LEADS ====================

/**
 * Create a new lead (signup)
 */
export async function createLead(data: SignupFormData): Promise<string> {
  const leadData = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    source: data.source,
    country: data.country,
    status: 'pending',
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'leads'), leadData);
  return docRef.id;
}

/**
 * Get all leads (admin)
 */
export async function getAllLeads(): Promise<Lead[]> {
  const q = query(
    collection(db, 'leads'),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    leadId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Lead[];
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
  leadId: string, 
  status: 'pending' | 'contacted' | 'approved' | 'rejected',
  notes?: string
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: Timestamp.now(),
  };
  if (notes !== undefined) {
    updateData.notes = notes;
  }
  await updateDoc(doc(db, 'leads', leadId), updateData);
}

/**
 * Get leads count by status
 */
export async function getLeadsCountByStatus(): Promise<Record<string, number>> {
  const snapshot = await getDocs(collection(db, 'leads'));
  const counts: Record<string, number> = { pending: 0, contacted: 0, approved: 0, rejected: 0, total: 0 };
  
  snapshot.docs.forEach(doc => {
    const status = doc.data().status || 'pending';
    counts[status] = (counts[status] || 0) + 1;
    counts.total += 1;
  });
  
  return counts;
}

/**
 * Delete lead
 */
export async function deleteLead(leadId: string): Promise<void> {
  await deleteDoc(doc(db, 'leads', leadId));
}

// ==================== USERS ====================

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const q = query(
    collection(db, 'users'),
    where('username', '==', username)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return {
    userId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    lastLoginAt: doc.data().lastLoginAt?.toDate(),
  } as User;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(
    collection(db, 'users'),
    where('email', '==', email)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return {
    userId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    lastLoginAt: doc.data().lastLoginAt?.toDate(),
  } as User;
}

/**
 * Check if username exists
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const user = await getUserByUsername(username);
  return user === null;
}

/**
 * Check if email exists
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  const user = await getUserByEmail(email);
  return user === null;
}

/**
 * Reserve a username (use a normalized key, e.g. lowercase)
 *
 * Uses collection: usernames/{usernameKey}
 */
export async function reserveUsername(userId: string, usernameKey: string): Promise<void> {
  await setDoc(doc(db, 'usernames', usernameKey), {
    userId,
    username: usernameKey,
    createdAt: Timestamp.now(),
  });
}

export async function releaseUsername(usernameKey: string): Promise<void> {
  await deleteDoc(doc(db, 'usernames', usernameKey));
}

/**
 * Reserve an email (use a normalized key, e.g. lowercase)
 *
 * Uses collection: emails/{emailKey}
 */
export async function reserveEmail(userId: string, emailKey: string): Promise<void> {
  await setDoc(doc(db, 'emails', emailKey), {
    userId,
    email: emailKey,
    createdAt: Timestamp.now(),
  });
}

export async function releaseEmail(emailKey: string): Promise<void> {
  await deleteDoc(doc(db, 'emails', emailKey));
}

/**
 * Create new user with a specific document id (recommended: Firebase Auth UID)
 */
export async function createUserWithId(
  userId: string,
  data: {
    username: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    status: 'active' | 'pending' | 'disabled';
  }
): Promise<string> {
  const userData = {
    username: data.username,
    email: data.email,
    passwordHash: data.passwordHash,
    role: data.role,
    status: data.status,
    createdAt: Timestamp.now(),
  };

  await setDoc(doc(db, 'users', userId), userData);
  return userId;
}

/**
 * Create new user (auto id)
 */
export async function createUser(data: {
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: 'active' | 'pending' | 'disabled';
}): Promise<string> {
  const userData = {
    username: data.username,
    email: data.email,
    passwordHash: data.passwordHash,
    role: data.role,
    status: data.status,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'users'), userData);
  return docRef.id;
}

/**
 * Update user last login
 */
export async function updateUserLastLogin(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    lastLoginAt: Timestamp.now(),
  });
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  const q = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    userId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    lastLoginAt: doc.data().lastLoginAt?.toDate(),
  })) as User[];
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: UserRole): Promise<User[]> {
  const q = query(
    collection(db, 'users'),
    where('role', '==', role),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    userId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    lastLoginAt: doc.data().lastLoginAt?.toDate(),
  })) as User[];
}

/**
 * Update user
 */
export async function updateUser(
  userId: string, 
  data: Partial<Omit<User, 'userId' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, 'users', userId), data);
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId));
}

// ==================== CLIENTS ====================

/**
 * Create client
 */
export async function createClient(clientId: string, clientName: string): Promise<void> {
  await updateDoc(doc(db, 'clients', clientId), {
    clientName,
    createdAt: Timestamp.now(),
  });
}

/**
 * Get client by ID
 */
export async function getClient(clientId: string): Promise<Client | null> {
  const docSnap = await getDoc(doc(db, 'clients', clientId));
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    clientId: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
  } as Client;
}

// ==================== STAFF ====================

/**
 * Create staff
 */
export async function createStaff(staffId: string, staffName: string): Promise<void> {
  await updateDoc(doc(db, 'staff', staffId), {
    staffName,
    createdAt: Timestamp.now(),
  });
}

/**
 * Get staff by ID
 */
export async function getStaff(staffId: string): Promise<Staff | null> {
  const docSnap = await getDoc(doc(db, 'staff', staffId));
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    staffId: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
  } as Staff;
}

// ==================== CLIENT PROJECTS ====================

/**
 * Create client project
 */
export async function createClientProject(
  clientId: string,
  projectName: string,
  firebaseConfig?: {
    apiKey?: string;
    authDomain?: string;
    firebaseProjectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  }
): Promise<string> {
  const projectData = {
    clientId,
    projectName,
    apiKey: firebaseConfig?.apiKey || '',
    authDomain: firebaseConfig?.authDomain || '',
    firebaseProjectId: firebaseConfig?.firebaseProjectId || '',
    storageBucket: firebaseConfig?.storageBucket || '',
    messagingSenderId: firebaseConfig?.messagingSenderId || '',
    appId: firebaseConfig?.appId || '',
    measurementId: firebaseConfig?.measurementId || '',
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'clientProjects'), projectData);
  return docRef.id;
}

/**
 * Get client projects for a client
 */
export async function getClientProjects(clientId: string): Promise<ClientProject[]> {
  const q = query(
    collection(db, 'clientProjects'),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    clientProjectId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as ClientProject[];
}

// Alias for getClientProjects - used by useClientProjects hook
export const getClientProjectsByClientId = getClientProjects;

/**
 * Get all client projects (admin)
 */
export async function getAllClientProjects(): Promise<ClientProject[]> {
  const q = query(
    collection(db, 'clientProjects'),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    clientProjectId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as ClientProject[];
}

/**
 * Update client project
 */
export async function updateClientProject(
  projectId: string,
  data: Partial<Omit<ClientProject, 'clientProjectId' | 'clientId' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, 'clientProjects', projectId), data);
}

/**
 * Get single client project
 */
export async function getClientProject(projectId: string): Promise<ClientProject | null> {
  const docSnap = await getDoc(doc(db, 'clientProjects', projectId));
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    clientProjectId: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
  } as ClientProject;
}

// ==================== STAFF CLIENT PROJECTS ====================

/**
 * Assign staff to client project
 */
export async function assignStaffToProject(
  staffId: string,
  clientProjectId: string,
  staffRole: 'primary' | 'secondary' | 'support',
  notes?: string
): Promise<void> {
  await addDoc(collection(db, 'staffClientProjects'), {
    staffId,
    clientProjectId,
    assignmentStatus: 'active',
    staffRole,
    notes,
    assignedAt: Timestamp.now(),
  });
}

/**
 * Get staff assignments
 */
export async function getStaffAssignments(staffId: string): Promise<StaffClientProject[]> {
  const q = query(
    collection(db, 'staffClientProjects'),
    where('staffId', '==', staffId),
    where('assignmentStatus', '==', 'active')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    assignedAt: doc.data().assignedAt?.toDate(),
  })) as StaffClientProject[];
}

/**
 * Get project staff
 */
export async function getProjectStaff(clientProjectId: string): Promise<StaffClientProject[]> {
  const q = query(
    collection(db, 'staffClientProjects'),
    where('clientProjectId', '==', clientProjectId),
    where('assignmentStatus', '==', 'active')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    assignedAt: doc.data().assignedAt?.toDate(),
  })) as StaffClientProject[];
}

/**
 * Update staff assignment
 */
export async function updateStaffAssignment(
  staffId: string,
  clientProjectId: string,
  data: Partial<Omit<StaffClientProject, 'staffId' | 'clientProjectId' | 'assignedAt'>>
): Promise<void> {
  const q = query(
    collection(db, 'staffClientProjects'),
    where('staffId', '==', staffId),
    where('clientProjectId', '==', clientProjectId)
  );
  
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    await updateDoc(snapshot.docs[0].ref, data);
  }
}
