export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor';
  avatarUrl?: string;
  bio?: string;
}

export interface Student extends User {
  role: 'student';
  learningPreferences?: string;
  subjectInterests?: string[]; // e.g. ["Math", "Physics", "Literature"]
}

export interface Tutor extends User {
  role: 'tutor';
  headline?: string; // e.g., "Expert Math Tutor for High School Students"
  subjectMatterExpertise?: string[]; // Detailed list of expertise for matching and display, e.g. ["Calculus", "Algebra", "Counseling"]
  descriptionOfExpertise?: string; // A paragraph form description for AI tag suggestion
  teachingStyle?: string; // e.g. "Patient and visual", "Interactive problem solving"
  availability?: { day: string; timeSlots: string[] }[]; // e.g. [{ day: "Monday", timeSlots: ["10:00-11:00", "14:00-15:00"] }]
  overallRating?: number; // 0-5
  reviewsCount?: number;
  yearsOfExperience?: number;
  assignedStudentIds?: string[]; // Added for automatic student assignment
}

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  dateTime: string; // ISO string format for date and time
  durationMinutes: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  meetingLink?: string; // e.g. Zoom or Google Meet link
  notes?: string; // Optional notes from student
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'confirmation' | 'match_update' | 'generic' | 'booking_request' | 'booking_confirmed';
  createdAt: string; // ISO string format
  read: boolean;
  link?: string; // Optional link to navigate to, e.g. a booking or profile
}

export interface CompatibilityScoreInfo {
  score: number; // 0-1 (represents 0-100%)
  justification: string;
}

export interface ChatMessage {
  id: string;
  chatId: string; // Format: sortedUserIds.join('_') e.g., "student1_tutor1"
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string; // ISO string
  read: boolean;
}

export interface Conversation {
  chatId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  otherUserRole: 'student' | 'tutor';
  lastMessage?: ChatMessage;
  unreadCount: number;
}

