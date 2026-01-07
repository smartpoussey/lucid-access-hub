import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Lead, User, ClientProject, StaffClientProject, UserRole, SignupFormData } from '@/types';

// ==================== LEADS ====================

/**
 * Create a new lead (signup)
 */
export async function createLead(data: SignupFormData): Promise<string> {
  const leadData = {
    name: data.name,
    email: data.email,
    mobileNumber: data.mobileNumber,
    clinicName: data.clinicName,
    address: data.address,
    location: data.location,
    reasonForContact: data.reasonForContact,
    referralSource: data.referralSource,
    survey: {
      hasExistingWebsite: data.hasExistingWebsite,
      hasChatbot: data.hasChatbot,
      hasAIAgent: data.hasAIAgent,
      hasReceptionist: data.hasReceptionist,
      hasAutomationTools: data.hasAutomationTools,
      additionalNotes: data.additionalNotes,
    },
    status: 'pending',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
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
 * Get leads by status
 */
export async function getLeadsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Lead[]> {
  const q = query(
    collection(db, 'leads'),
    where('status', '==', status),
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
  status: 'pending' | 'approved' | 'rejected'
): Promise<void> {
  await updateDoc(doc(db, 'leads', leadId), {
    status,
    updatedAt: Timestamp.now(),
  });
}

// ==================== USERS ====================

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
    updatedAt: doc.data().updatedAt?.toDate(),
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
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as User[];
}

/**
 * Update user
 */
export async function updateUser(
  userId: string, 
  data: Partial<Omit<User, 'userId' | 'createdAt' | 'updatedAt'>>
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

// ==================== CLIENT PROJECTS ====================

/**
 * Create client project
 */
export async function createClientProject(
  clientId: string,
  projectName: string,
  description?: string
): Promise<string> {
  const projectData = {
    clientId,
    clientProjectName: projectName,
    description,
    firebaseConfig: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: '',
    },
    status: 'setup',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
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
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as ClientProject[];
}

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
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as ClientProject[];
}

/**
 * Update client project
 */
export async function updateClientProject(
  projectId: string,
  data: Partial<Omit<ClientProject, 'clientProjectId' | 'clientId' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  await updateDoc(doc(db, 'clientProjects', projectId), {
    ...data,
    updatedAt: Timestamp.now(),
  });
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
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as ClientProject;
}

// ==================== STAFF CLIENT PROJECTS ====================

/**
 * Assign staff to client project
 */
export async function assignStaffToProject(
  staffId: string,
  clientProjectId: string,
  notes?: string
): Promise<void> {
  const mappingId = `${staffId}_${clientProjectId}`;
  await addDoc(collection(db, 'staffClientProjects'), {
    staffId,
    clientProjectId,
    assignmentStatus: 'active',
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
