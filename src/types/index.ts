// User roles enum
export type UserRole = 'admin' | 'staff' | 'client';

// Lead status enum
export type LeadStatus = 'pending' | 'contacted' | 'approved' | 'rejected';

// Assignment status enum
export type AssignmentStatus = 'active' | 'paused' | 'completed';

// Staff role in project
export type StaffProjectRole = 'primary' | 'secondary' | 'support';

export type AppEnvironment = 'development' | 'staging' | 'production';

// Access level for admin/staff
export type AccessLevel = 'full' | 'limited' | 'readonly';

// User Status
export type UserStatus = 'active' | 'pending' | 'disabled';

// Project Assignment Status
export type ProjectAssignmentStatus = 'active' | 'paused' | 'completed';

// Project Type
export type ProjectType = 'website' | 'chatbot' | 'ai-agent' | 'appointments' | 'marketing';

// Lead form data
export interface LeadFormData {
  name: string;
  email: string;
  mobile: string;
  businessName: string;
  address: string;
  city: string;
  reasonForApproaching: string;
  source: string;
  status: string;
}

// Survey form data
export interface SurveyFormData {
  hasWebsite: boolean;
  hasChatbot: boolean;
  hasAiAgent: boolean;
  hasReceptionist: boolean;
  additionalNotes?: string;
}

// Lead interface
export interface Lead {
  leadId: string;
  name: string;
  email: string;
  mobile: string;
  businessName: string;
  address: string;
  city: string;
  reasonForApproaching: string;
  source: string;
  hasWebsite: boolean;
  hasChatbot: boolean;
  hasAiAgent: boolean;
  hasReceptionist: boolean;
  additionalNotes?: string;
  status: LeadStatus;
  createdAt: Date;
}

// User interface
export interface User {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
}

// Registration form data types
export interface AdminRegistrationData {
  name: string;
  email: string;
  role: string;
  status: string;
  mobile: string;
  department: string;
  accessLevel: AccessLevel;
  backupEmail: string;
}

// Admin interface
export interface Admin {
  adminId: string;
  employeeId: string;
  mobile: string;
  department: string;
  accessLevel: AccessLevel;
  backupEmail: string;
}

// Client registration data
export interface ClientRegistrationData {
  name: string;
  email: string;
  role: string;
  status: string;
  mobile: string;
  businessName: string;
  address: string;
  city: string;
  handlingWebsite: boolean;
  handlingChatbot: boolean;
  handlingAiAgent: boolean;
  handlingAppointments: boolean;
  handlingMarketing: boolean;
  additionalNotes?: string;
}

// Client interface
export interface Client {
  clientId: string;
  mobile: string;
  businessName: string;
  address: string;
  city: string;
  handlingWebsite: boolean;
  handlingChatbot: boolean;
  handlingAiAgent: boolean;
  handlingAppointments: boolean;
  handlingMarketing: boolean;
  additionalNotes?: string;
  createdAt: Date;
}

export interface ClientProjectRegistrationData {
  clientId: string;
  appName: string;
  appEnv: AppEnvironment;
  projectName: string;
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// Client Project (Multi-tenant)
export interface ClientProject {
  clientProjectId: string;
  clientId: string;
  appName: string;
  appEnv: AppEnvironment;
  projectName: string;
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  createdAt: Date;
}

export interface StaffRegistrationData {
  name: string;
  email: string;
  role: string;
  status: string;
  mobile: string;
  department: string;
  accessLevel: AccessLevel;
  position?: string;
}

// Staff interface
export interface Staff {
  staffId: string;
  employeeId: string;
  mobile: string;
  department: string;
  accessLevel: AccessLevel;
  position?: string;
}

// Staff-Client Project Mapping
export interface StaffClientProject {
  staffId: string;
  clientProjectId: string;
  projectType: ProjectType;
  projectStatus: ProjectAssignmentStatus;
  staffRole: StaffProjectRole;
  assignedAt: Date;
  notes?: string;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  mobile: string;
  source: string;
  city: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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
