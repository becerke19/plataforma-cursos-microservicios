export const API_URLS = {
  auth: import.meta.env.VITE_AUTH_URL || 'http://localhost:3001',
  courses: import.meta.env.VITE_COURSES_URL || 'http://localhost:3002',
  progress: import.meta.env.VITE_PROGRESS_URL || 'http://localhost:3003',
  certificates: import.meta.env.VITE_CERTIFICATES_URL || 'http://localhost:3004',
  payments: import.meta.env.VITE_PAYMENTS_URL || 'http://localhost:3005',
} as const;
