// User Roles
export type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT';

// User Status
export type UserStatus = 'active' | 'pending' | 'disabled';

// Assignment Status
export type AssignmentStatus = 'active' | 'inactive' | 'pending';

// User interface
export interface User {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Lead interface (pre-registration)
export interface Lead {
  leadId: string;
  name: string;
  email: string;
  mobileNumber: string;
  clinicName: string;
  address: string;
  location: string;
  reasonForContact: string;
  referralSource: ReferralSource;
  survey: LeadSurvey;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export type ReferralSource = 
  | 'google_search'
  | 'social_media'
  | 'referral'
  | 'advertisement'
  | 'conference'
  | 'other';

export interface LeadSurvey {
  hasExistingWebsite: boolean;
  hasChatbot: boolean;
  hasAIAgent: boolean;
  hasReceptionist: boolean;
  hasAutomationTools: boolean;
  additionalNotes?: string;
}

// Client Project (Multi-tenant)
export interface ClientProject {
  clientProjectId: string;
  clientId: string;
  clientProjectName: string;
  description?: string;
  firebaseConfig: FirebaseProjectConfig;
  status: 'active' | 'inactive' | 'setup';
  createdAt: Date;
  updatedAt: Date;
}

export interface FirebaseProjectConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Staff-Client Project Mapping
export interface StaffClientProject {
  staffId: string;
  clientProjectId: string;
  assignmentStatus: AssignmentStatus;
  notes?: string;
  assignedAt: Date;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  mobileNumber: string;
  clinicName: string;
  address: string;
  location: string;
  reasonForContact: string;
  referralSource: ReferralSource;
  hasExistingWebsite: boolean;
  hasChatbot: boolean;
  hasAIAgent: boolean;
  hasReceptionist: boolean;
  hasAutomationTools: boolean;
  additionalNotes?: string;
}

// Auth Context Types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
