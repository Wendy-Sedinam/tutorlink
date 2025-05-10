import type { Student, Tutor, Booking, AppNotification, ChatMessage } from '@/types';
import { AVAILABLE_SUBJECTS } from './constants';


export const mockStudents: Student[] = [
  {
    id: 'student1',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    role: 'student',
    avatarUrl: 'https://picsum.photos/seed/student1/200/200',
    bio: 'Eager to learn calculus and creative writing. I prefer visual explanations and practical examples. Also interested in counseling support.',
    learningPreferences: 'Visual learning, practical examples, interactive sessions.',
    subjectInterests: ['Calculus', 'Creative Writing', 'History', 'Counseling'],
  },
  {
    id: 'student2',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    role: 'student',
    avatarUrl: 'https://picsum.photos/seed/student2/200/200',
    bio: 'Looking for help with Physics and programming. I like a structured approach.',
    learningPreferences: 'Structured lessons, hands-on coding, regular quizzes.',
    subjectInterests: ['Physics', 'Python', 'Computer Science'],
  },
];

export const mockTutors: Tutor[] = [
  {
    id: 'tutor1',
    name: 'Dr. Elara Vance',
    email: 'elara.vance@example.com',
    role: 'tutor',
    avatarUrl: 'https://picsum.photos/seed/tutor1/200/200',
    bio: 'PhD in Mathematics with 10 years of teaching experience. I make complex topics easy to understand. Also offer academic counseling.',
    headline: 'PhD Math Tutor & Academic Counselor',
    subjectMatterExpertise: ['Calculus', 'Algebra', 'Statistics', 'Differential Equations', 'Counseling'],
    descriptionOfExpertise: 'I specialize in advanced mathematics, including calculus, linear algebra, and statistics. My goal is to help students build a strong foundational understanding and problem-solving skills. I also provide academic counseling to help students navigate their studies.',
    teachingStyle: 'Patient, concept-focused, with real-world applications.',
    availability: [
      { day: 'Monday', timeSlots: ['10:00-12:00', '14:00-16:00'] },
      { day: 'Wednesday', timeSlots: ['09:00-11:00', '13:00-15:00'] },
    ],
    overallRating: 4.9,
    reviewsCount: 120,
    yearsOfExperience: 10,
    assignedStudentIds: ['student1'], // Assign student1 to tutor1
  },
  {
    id: 'tutor2',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    role: 'tutor',
    avatarUrl: 'https://picsum.photos/seed/tutor2/200/200',
    bio: 'Software engineer and coding mentor. Passionate about Python, JavaScript, and Web Development.',
    headline: 'Coding Mentor - Python, JavaScript, Web Dev',
    subjectMatterExpertise: ['Python', 'JavaScript', 'React', 'Computer Science'],
    descriptionOfExpertise: 'I am a full-stack developer with expertise in Python and JavaScript frameworks like React and Node.js. I enjoy teaching data structures and algorithms, and helping students build cool projects.',
    teachingStyle: 'Hands-on, project-based learning, encouraging experimentation.',
    availability: [
      { day: 'Tuesday', timeSlots: ['18:00-21:00'] },
      { day: 'Thursday', timeSlots: ['18:00-21:00'] },
      { day: 'Saturday', timeSlots: ['10:00-14:00'] },
    ],
    overallRating: 4.7,
    reviewsCount: 85,
    yearsOfExperience: 5,
    assignedStudentIds: ['student2'], // Assign student2 to tutor2
  },
  {
    id: 'tutor3',
    name: 'Sophia Lorenza',
    email: 'sophia.lorenza@example.com',
    role: 'tutor',
    avatarUrl: 'https://picsum.photos/seed/tutor3/200/200',
    bio: 'Literature enthusiast and experienced writing coach. Specializing in essay writing, literary analysis, and creative writing. Offers guidance and counseling for academic stress.',
    headline: 'Writing Coach & Student Counselor',
    subjectMatterExpertise: ['Essay Writing', 'Literature', 'Creative Writing', 'Grammar', 'Counseling'],
    descriptionOfExpertise: 'I help students unlock their potential in writing. From structuring compelling essays to analyzing complex literary texts and fostering creative expression, I provide tailored guidance. I also offer counseling sessions for students needing support with academic stress and study habits.',
    teachingStyle: 'Encouraging, feedback-oriented, focusing on critical thinking and clarity.',
    availability: [
      { day: 'Monday', timeSlots: ['15:00-18:00'] },
      { day: 'Friday', timeSlots: ['10:00-13:00'] },
    ],
    overallRating: 4.8,
    reviewsCount: 92,
    yearsOfExperience: 7,
    assignedStudentIds: [],
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking1',
    studentId: 'student1',
    studentName: 'Alice Wonderland',
    tutorId: 'tutor1',
    tutorName: 'Dr. Elara Vance',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    durationMinutes: 60,
    reasonForSession: 'Calculus Problem Solving', // Changed from subject
    status: 'confirmed',
    meetingLink: 'https://meet.example.com/calculus-session',
  },
  {
    id: 'booking2',
    studentId: 'student2',
    studentName: 'Bob The Builder',
    tutorId: 'tutor2',
    tutorName: 'Marcus Chen',
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    durationMinutes: 90,
    reasonForSession: 'Python Project Help', // Changed from subject
    status: 'pending',
  },
  {
    id: 'booking3',
    studentId: 'student1',
    studentName: 'Alice Wonderland',
    tutorId: 'tutor3',
    tutorName: 'Sophia Lorenza',
    dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    durationMinutes: 45,
    reasonForSession: 'Counseling for Academic Stress', // Changed from subject
    status: 'completed',
  },
];

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif1',
    userId: 'student1',
    title: 'Meeting Reminder',
    message: 'Your calculus session with Dr. Elara Vance is tomorrow at 10:00 AM.',
    type: 'reminder',
    createdAt: new Date().toISOString(),
    read: false,
    link: '/bookings#booking1',
  },
  {
    id: 'notif2',
    userId: 'tutor2',
    title: 'New Session Request', // Changed title for clarity
    message: 'Bob The Builder has requested a Python Project Help session.',
    type: 'booking_request', // Changed type
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    link: '/bookings#booking2',
  },
  {
    id: 'notif3',
    userId: 'student1',
    title: 'New Tutor Match!',
    message: 'We found a great match for your history interest: Prof. Armitage.',
    type: 'match_update',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: false,
    link: '/tutors/tutor3', 
  },
];

// Helper function to get a user (student or tutor) by ID
export const getMockUserById = (userId: string): Student | Tutor | undefined => {
  return mockStudents.find(s => s.id === userId) || mockTutors.find(t => t.id === userId);
};

export const generateChatId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_');
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg1',
    chatId: generateChatId('student1', 'tutor1'),
    senderId: 'student1',
    receiverId: 'tutor1',
    text: 'Hi Dr. Vance, I had a quick question about our upcoming session.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: true,
  },
  {
    id: 'msg2',
    chatId: generateChatId('student1', 'tutor1'),
    senderId: 'tutor1',
    receiverId: 'student1',
    text: 'Hello Alice, I\'m here to help. What\'s your question?',
    timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString(), // 1.9 hours ago
    read: true,
  },
  {
    id: 'msg3',
    chatId: generateChatId('student1', 'tutor1'),
    senderId: 'student1',
    receiverId: 'tutor1',
    text: 'Should I prepare anything specific for the calculus problem-solving session?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    read: false, // Tutor hasn't read this yet
  },
  {
    id: 'msg4',
    chatId: generateChatId('student2', 'tutor2'),
    senderId: 'student2',
    receiverId: 'tutor2',
    text: 'Hey Marcus, I\'m a bit stuck on the Python project. Can we look at the file I sent?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    read: false, // Tutor hasn't read
  }
];
