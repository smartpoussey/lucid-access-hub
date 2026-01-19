// Dashboard data types for client project dashboard

export interface Contact {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  patientId: number;
  patientType: 'new' | 'existing';
  createdAt: Date;
  updatedAt: Date;
}

export interface Interaction {
  id: string;
  patientId: number;
  patientType: 'new' | 'existing';
  queryType: 'Booking' | 'Inquiry' | 'Follow-up' | 'Other';
  queryStatus: string;
  transcript: string;
  callDay: string;
  callHour: number;
  callTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalPatients: number;
  newPatientsToday: number;
  existingPatients: number;
  appointmentsToday: number;
}

export interface ChartDataPoint {
  name: string;
  new: number;
  existing: number;
}

export interface PieChartDataPoint {
  name: string;
  value: number;
  fill: string;
}

export interface PatientRow {
  id: string;
  name: string;
  phone: string;
  patientType: 'new' | 'existing';
  queryStatus: string;
  urgency: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export type DashboardPage = 'dashboard' | 'appointments' | 'patients' | 'reports' | 'settings';
