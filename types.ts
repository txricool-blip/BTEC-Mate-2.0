export enum UserRole {
  STUDENT = 'student',
  CR = 'cr',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  rollNumber: string;
  fullName: string;
  department: string;
  batch: string;
  level: number;
  term: number;
  role: UserRole;
  profileImageUrl?: string;
  phoneNumber?: string;
  attendancePercent: number;
  cgpa: number;
  failedSubjects?: string[];
}

export interface Note {
  id: string;
  userRoll: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderRoll: string;
  senderName: string;
  content: string;
  timestamp: string;
  batchId: string; // Messages are grouped by batch
  isSystem?: boolean;
}

export interface PDFResource {
  id: string;
  level: number;
  term: number;
  department: string;
  subjectName: string;
  driveLink: string;
  addedBy: string;
}

// Navigation Types
export enum NavTab {
  HOME = 'home',
  CHAT = 'chat',
  RESOURCES = 'resources',
  NOTES = 'notes',
  PROFILE = 'profile'
}