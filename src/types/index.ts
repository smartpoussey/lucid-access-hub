// User Roles
export type UserRole = 'admin' | 'staff' | 'client' | 'lead';

// User Status
export type UserStatus = 'active' | 'pending' | 'disabled';

// Project Assignment Status
export type ProjectAssignmentStatus = 'active' | 'paused' | 'completed';

// Staff Project Role
export type StaffProjectRole = 'primary' | 'secondary' | 'support';

// Lead interface (pre-registration)
export interface Lead {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  country: string;
  createdAt: Date;
}

// User interface
export interface User {
  userId: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Client interface
export interface Client {
  clientId: string;
  clientName: string;
  createdAt: Date;
}

// Client Project (Multi-tenant)
export interface ClientProject {
  clientProjectId: string;
  clientId: string;
  projectName: string;
  apiKey: string;
  authDomain: string;
  firebaseProjectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  createdAt: Date;
}

// Staff interface
export interface Staff {
  staffId: string;
  staffName: string;
  createdAt: Date;
}

// Staff-Client Project Mapping
export interface StaffClientProject {
  staffId: string;
  clientProjectId: string;
  assignmentStatus: ProjectAssignmentStatus;
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
  phone: string;
  source: string;
  country: string;
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
