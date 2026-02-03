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
  Admin,
  ClientProject, 
  StaffClientProject, 
  UserRole, 
  SignupFormData,
  LeadStatus,
  UserStatus,
  AccessLevel,
} from '@/types';

// ==================== LEADS ====================

/**
 * Create a new lead (signup)
 */
export async function createLead(data: SignupFormData): Promise<string> {
  const leadData = {
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    businessName: '',
    address: '',
    city: data.city,
    reasonForApproaching: '',
    source: data.source,
    hasWebsite: false,
    hasChatbot: false,
    hasAiAgent: false,
    hasReceptionist: false,
    status: 'pending' as LeadStatus,
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
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      leadId: doc.id,
      name: data.name || '',
      email: data.email || '',
      mobile: data.mobile || data.phone || '',
      businessName: data.businessName || '',
      address: data.address || '',
      city: data.city || data.country || '',
      reasonForApproaching: data.reasonForApproaching || '',
      source: data.source || '',
      hasWebsite: data.hasWebsite || false,
      hasChatbot: data.hasChatbot || false,
      hasAiAgent: data.hasAiAgent || false,
      hasReceptionist: data.hasReceptionist || false,
      additionalNotes: data.additionalNotes || data.notes,
      status: data.status || 'pending',
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Lead;
  });
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
  leadId: string, 
  status: LeadStatus,
  notes?: string
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: Timestamp.now(),
  };
  if (notes !== undefined) {
    updateData.additionalNotes = notes;
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
  
  const docData = snapshot.docs[0];
  const data = docData.data();
  return {
    userId: docData.id,
    email: data.email || '',
    name: data.name || data.username || '',
    role: data.role || 'client',
    status: data.status || 'pending',
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    avatarUrl: data.avatarUrl,
  } as User;
}

/**
 * Check if email exists
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  const user = await getUserByEmail(email);
  return user === null;
}

/**
 * Reserve an email (use a normalized key, e.g. lowercase)
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
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  }
): Promise<string> {
  const now = Timestamp.now();
  const userData = {
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'users', userId), userData);
  return userId;
}

/**
 * Create new user (auto id)
 */
export async function createUser(data: {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}): Promise<string> {
  const now = Timestamp.now();
  const userData = {
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    createdAt: now,
    updatedAt: now,
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
    updatedAt: Timestamp.now(),
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
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      userId: docSnap.id,
      email: data.email || '',
      name: data.name || data.username || '',
      role: data.role || 'client',
      status: data.status || 'pending',
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      avatarUrl: data.avatarUrl,
    } as User;
  });
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
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      userId: docSnap.id,
      email: data.email || '',
      name: data.name || data.username || '',
      role: data.role || 'client',
      status: data.status || 'pending',
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      avatarUrl: data.avatarUrl,
    } as User;
  });
}

/**
 * Update user
 */
export async function updateUser(
  userId: string, 
  data: Partial<Omit<User, 'userId' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId));
}

// ==================== ADMINS ====================

/**
 * Create admin profile
 */
export async function createAdmin(adminId: string, data: Omit<Admin, 'adminId'>): Promise<void> {
  await setDoc(doc(db, 'admins', adminId), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

/**
 * Get admin by ID
 */
export async function getAdmin(adminId: string): Promise<Admin | null> {
  const docSnap = await getDoc(doc(db, 'admins', adminId));
  
  if (!docSnap.exists()) {
    return null;
  }
  
  const data = docSnap.data();
  return {
    adminId: docSnap.id,
    employeeId: data.employeeId || '',
    mobile: data.mobile || '',
    department: data.department || '',
    accessLevel: data.accessLevel || 'readonly',
    backupEmail: data.backupEmail || '',
  } as Admin;
}

// ==================== CLIENTS ====================

/**
 * Create client profile
 */
export async function createClient(clientId: string, data: Omit<Client, 'clientId' | 'createdAt'>): Promise<void> {
  await setDoc(doc(db, 'clients', clientId), {
    ...data,
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
  
  const data = docSnap.data();
  return {
    clientId: docSnap.id,
    mobile: data.mobile || '',
    businessName: data.businessName || data.clientName || '',
    address: data.address || '',
    city: data.city || '',
    handlingWebsite: data.handlingWebsite || false,
    handlingChatbot: data.handlingChatbot || false,
    handlingAiAgent: data.handlingAiAgent || false,
    handlingAppointments: data.handlingAppointments || false,
    handlingMarketing: data.handlingMarketing || false,
    additionalNotes: data.additionalNotes,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Client;
}

// ==================== STAFF ====================

/**
 * Create staff profile
 */
export async function createStaff(staffId: string, data: Omit<Staff, 'staffId'>): Promise<void> {
  await setDoc(doc(db, 'staff', staffId), {
    ...data,
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
  
  const data = docSnap.data();
  return {
    staffId: docSnap.id,
    employeeId: data.employeeId || '',
    mobile: data.mobile || '',
    department: data.department || '',
    accessLevel: data.accessLevel || 'readonly',
    position: data.position,
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
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  }
): Promise<string> {
  const projectData = {
    clientId,
    projectName,
    appName: projectName,
    appEnv: 'development',
    apiKey: firebaseConfig?.apiKey || '',
    authDomain: firebaseConfig?.authDomain || '',
    projectId: firebaseConfig?.projectId || '',
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
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      clientProjectId: docSnap.id,
      clientId: data.clientId,
      appName: data.appName || data.projectName || '',
      appEnv: data.appEnv || 'development',
      projectName: data.projectName || '',
      apiKey: data.apiKey || '',
      authDomain: data.authDomain || '',
      projectId: data.projectId || data.firebaseProjectId || '',
      storageBucket: data.storageBucket || '',
      messagingSenderId: data.messagingSenderId || '',
      appId: data.appId || '',
      measurementId: data.measurementId || '',
      createdAt: data.createdAt?.toDate() || new Date(),
    } as ClientProject;
  });
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
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      clientProjectId: docSnap.id,
      clientId: data.clientId,
      appName: data.appName || data.projectName || '',
      appEnv: data.appEnv || 'development',
      projectName: data.projectName || '',
      apiKey: data.apiKey || '',
      authDomain: data.authDomain || '',
      projectId: data.projectId || data.firebaseProjectId || '',
      storageBucket: data.storageBucket || '',
      messagingSenderId: data.messagingSenderId || '',
      appId: data.appId || '',
      measurementId: data.measurementId || '',
      createdAt: data.createdAt?.toDate() || new Date(),
    } as ClientProject;
  });
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
  
  const data = docSnap.data();
  return {
    clientProjectId: docSnap.id,
    clientId: data.clientId,
    appName: data.appName || data.projectName || '',
    appEnv: data.appEnv || 'development',
    projectName: data.projectName || '',
    apiKey: data.apiKey || '',
    authDomain: data.authDomain || '',
    projectId: data.projectId || data.firebaseProjectId || '',
    storageBucket: data.storageBucket || '',
    messagingSenderId: data.messagingSenderId || '',
    appId: data.appId || '',
    measurementId: data.measurementId || '',
    createdAt: data.createdAt?.toDate() || new Date(),
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
  projectType: 'website' | 'chatbot' | 'ai-agent' | 'appointments' | 'marketing',
  notes?: string
): Promise<void> {
  await addDoc(collection(db, 'staffClientProjects'), {
    staffId,
    clientProjectId,
    projectType,
    projectStatus: 'active',
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
    where('projectStatus', '==', 'active')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      staffId: data.staffId,
      clientProjectId: data.clientProjectId,
      projectType: data.projectType || 'website',
      projectStatus: data.projectStatus || data.assignmentStatus || 'active',
      staffRole: data.staffRole || 'support',
      assignedAt: data.assignedAt?.toDate() || new Date(),
      notes: data.notes,
    } as StaffClientProject;
  });
}

/**
 * Get project staff
 */
export async function getProjectStaff(clientProjectId: string): Promise<StaffClientProject[]> {
  const q = query(
    collection(db, 'staffClientProjects'),
    where('clientProjectId', '==', clientProjectId),
    where('projectStatus', '==', 'active')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      staffId: data.staffId,
      clientProjectId: data.clientProjectId,
      projectType: data.projectType || 'website',
      projectStatus: data.projectStatus || data.assignmentStatus || 'active',
      staffRole: data.staffRole || 'support',
      assignedAt: data.assignedAt?.toDate() || new Date(),
      notes: data.notes,
    } as StaffClientProject;
  });
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
