import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { platformApi } from '../services/platformApi';
import { Certificate, Course, CourseProgressSummary, Payment } from '../types/platform';

const DEFAULT_STUDENT_ID = '2b1499bd-affe-42a6-a9c7-a955af65ee84';
const DEFAULT_COURSE_ID = '1e8160ee-7b91-4c58-97d6-c58ef095ec44';

interface PlatformContextValue {
  darkMode: boolean;
  toggleDarkMode: () => void;
  studentId: string;
  setStudentId: (id: string) => void;
  courseId: string;
  setCourseId: (id: string) => void;
  token: string;
  setToken: (token: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  courses: Course[];
  progress: CourseProgressSummary | null;
  certificates: Certificate[];
  payments: Payment[];
  statusMessage: string;
  setStatusMessage: (msg: string) => void;
  loading: boolean;
  syncAll: (overrideStudentId?: string, overrideCourseId?: string) => Promise<void>;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('pf_dark_mode') === 'true';
  });
  const [studentId, setStudentIdState] = useState<string>(() => {
    return localStorage.getItem('pf_student_id') || DEFAULT_STUDENT_ID;
  });
  const [courseId, setCourseIdState] = useState<string>(() => {
    return localStorage.getItem('pf_course_id') || DEFAULT_COURSE_ID;
  });
  const [token, setTokenState] = useState<string>(() => {
    return localStorage.getItem('pf_token') || '';
  });
  const [userEmail, setUserEmailState] = useState<string>(() => {
    return localStorage.getItem('pf_user_email') || '';
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<CourseProgressSummary | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    'Listo para sincronizar con los microservicios (3001-3005).',
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('pf_dark_mode', String(darkMode));
  }, [darkMode]);

  const setStudentId = useCallback((id: string) => {
    setStudentIdState(id);
    localStorage.setItem('pf_student_id', id);
  }, []);

  const setCourseId = useCallback((id: string) => {
    setCourseIdState(id);
    localStorage.setItem('pf_course_id', id);
  }, []);

  const setToken = useCallback((newToken: string) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('pf_token', newToken);
    } else {
      localStorage.removeItem('pf_token');
    }
  }, []);

  const setUserEmail = useCallback((email: string) => {
    setUserEmailState(email);
    if (email) {
      localStorage.setItem('pf_user_email', email);
    } else {
      localStorage.removeItem('pf_user_email');
    }
  }, []);

  const syncAll = useCallback(
    async (overrideStudentId?: string, overrideCourseId?: string) => {
      const targetStudent = (overrideStudentId ?? studentId).trim();
      const targetCourse = (overrideCourseId ?? courseId).trim();
      setLoading(true);
      setStatusMessage('Consultando microservicios...');

      try {
        const [coursesData, progressData, certsData, paymentsData] = await Promise.allSettled([
          platformApi.getCourses(),
          targetStudent && targetCourse
            ? platformApi.getCourseProgress(targetStudent, targetCourse)
            : Promise.reject(new Error('Falta Student ID o Course ID')),
          targetStudent
            ? platformApi.getCertificatesByStudent(targetStudent)
            : Promise.reject(new Error('Falta Student ID')),
          targetStudent
            ? platformApi.getPaymentsByStudent(targetStudent)
            : Promise.reject(new Error('Falta Student ID')),
        ]);

        if (coursesData.status === 'fulfilled') setCourses(coursesData.value);
        if (progressData.status === 'fulfilled') setProgress(progressData.value);
        if (certsData.status === 'fulfilled') {
          const raw = certsData.value as unknown as { value?: Certificate[] } | Certificate[];
          setCertificates(Array.isArray(raw) ? raw : raw.value ?? []);
        }
        if (paymentsData.status === 'fulfilled') setPayments(paymentsData.value);

        const failed = [coursesData, progressData, certsData, paymentsData].filter(
          (r) => r.status === 'rejected',
        ).length;

        setStatusMessage(
          failed === 0
            ? 'Datos sincronizados desde los microservicios.'
            : `Sincronización parcial: ${4 - failed}/4 consultas completadas.`,
        );
      } catch (err) {
        setStatusMessage(err instanceof Error ? err.message : 'Error al sincronizar.');
      } finally {
        setLoading(false);
      }
    },
    [studentId, courseId],
  );

  return (
    <PlatformContext.Provider
      value={{
        darkMode,
        toggleDarkMode: () => setDarkMode((prev) => !prev),
        studentId,
        setStudentId,
        courseId,
        setCourseId,
        token,
        setToken,
        userEmail,
        setUserEmail,
        courses,
        progress,
        certificates,
        payments,
        statusMessage,
        setStatusMessage,
        loading,
        syncAll,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform debe usarse dentro de PlatformProvider');
  return ctx;
}
