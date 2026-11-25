export interface Lesson {
  id: string;
  title: string;
  content?: string;
  order?: number;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons?: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  price?: number;
  modules?: CourseModule[];
}

export interface CourseProgressSummary {
  studentId: string;
  courseId: string;
  completedLessons: number;
  trackedLessons: number;
}

export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  certificateCode: string;
  recipientName?: string;
  courseTitle?: string;
  issuedAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number | string;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'FAILED';
  paymentMethod?: string;
  createdAt: string;
}
