import { API_URLS } from '../config/api';
import {
  Certificate,
  Course,
  CourseProgressSummary,
  Payment,
} from '../types/platform';

async function requestJson<T>(
  url: string,
  init?: RequestInit,
  token?: string,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Error HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const platformApi = {
  login(payload: { email: string; password: string }) {
    return requestJson<{ accessToken?: string; token?: string; userId?: string; id?: string }>(
      `${API_URLS.auth}/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  },
  register(payload: { name?: string; email: string; password: string }) {
    return requestJson<{ accessToken?: string; token?: string; id?: string }>(
      `${API_URLS.auth}/auth/register`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
  },
  getCourses(): Promise<Course[]> {
    return requestJson<Course[]>(`${API_URLS.courses}/courses`);
  },
  createCourse(
    payload: { title: string; description?: string; price?: number },
    token?: string,
  ): Promise<Course> {
    return requestJson<Course>(
      `${API_URLS.courses}/courses`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
  getCourseProgress(studentId: string, courseId: string): Promise<CourseProgressSummary> {
    return requestJson<CourseProgressSummary>(
      `${API_URLS.progress}/progress/students/${studentId}/courses/${courseId}`,
    );
  },
  markLessonCompleted(payload: {
    studentId: string;
    courseId: string;
    lessonId: string;
    completed?: boolean;
  }) {
    return requestJson(`${API_URLS.progress}/progress/lessons`, {
      method: 'POST',
      body: JSON.stringify({ ...payload, completed: payload.completed ?? true }),
    });
  },
  getCertificatesByStudent(studentId: string): Promise<Certificate[]> {
    return requestJson<Certificate[]>(
      `${API_URLS.certificates}/certificates/students/${studentId}`,
    );
  },
  getPaymentsByStudent(studentId: string): Promise<Payment[]> {
    return requestJson<Payment[]>(
      `${API_URLS.payments}/payments/students/${studentId}`,
    );
  },
  createPayment(
    payload: {
      studentId: string;
      courseId: string;
      amount: number;
      currency: string;
      paymentMethod?: string;
    },
    token?: string,
  ): Promise<Payment> {
    return requestJson<Payment>(
      `${API_URLS.payments}/payments`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};
