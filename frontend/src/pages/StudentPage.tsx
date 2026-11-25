import { FormEvent, useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { platformApi } from '../services/platformApi';

const LESSONS = [
  { id: 'lesson-01-intro', title: '1. Bienvenida y panorama del curso', duration: '08:15' },
  { id: 'lesson-02-setup', title: '2. Configuración y práctica guiada', duration: '14:40' },
  { id: 'lesson-03-events', title: '3. Cierre, evaluación y certificado', duration: '11:20' },
];

export function StudentPage() {
  const {
    studentId,
    setStudentId,
    courseId,
    courses,
    progress,
    certificates,
    payments,
    syncAll,
    setStatusMessage,
  } = usePlatform();

  const [selectedLessonId, setSelectedLessonId] = useState(LESSONS[0].id);
  const [savingLesson, setSavingLesson] = useState(false);

  const activeCourse = courses.find((c) => c.id === courseId);
  const currentLesson = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];

  const completedCount = progress?.completedLessons ?? 0;
  const totalCount = Math.max(progress?.trackedLessons ?? LESSONS.length, 1);
  const percentage = Math.min(100, Math.round((completedCount / totalCount) * 100));

  async function handleCompleteLesson(e: FormEvent) {
    e.preventDefault();
    if (!studentId.trim() || !courseId.trim()) {
      setStatusMessage('Falta identificar al alumno o el curso.');
      return;
    }

    setSavingLesson(true);
    try {
      await platformApi.markLessonCompleted({
        studentId: studentId.trim(),
        courseId: courseId.trim(),
        lessonId: currentLesson.id,
        completed: true,
      });
      setStatusMessage(`Lección completada: ${currentLesson.title}`);
      await syncAll(studentId.trim(), courseId.trim());
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'No se pudo guardar el avance.');
    } finally {
      setSavingLesson(false);
    }
  }

  return (
    <section className="grid-main-side">
      <article className="card">
        <div className="video-stage">
          <div className="row-gap" style={{ justifyContent: 'space-between' }}>
            <span className="pill">{activeCourse?.title || 'Curso en video'}</span>
            <span className="pill warm">{currentLesson.duration}</span>
          </div>

          <div className="row-gap" style={{ gap: '16px' }}>
            <div className="play-circle">▶</div>
            <div>
              <h2 style={{ color: '#FFFFFF', margin: 0 }}>{currentLesson.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.78)', margin: '4px 0 0', fontSize: '0.88rem' }}>
                Reproducción lista · Marca la clase como completada al terminar.
              </p>
            </div>
          </div>

          <div className="video-controls">
            <span>HD 1080p</span>
            <div className="scrubber">
              <span />
            </div>
            <span>{currentLesson.duration}</span>
          </div>
        </div>

        <div className="lesson-list">
          {LESSONS.map((lesson) => {
            const active = lesson.id === currentLesson.id;
            return (
              <button
                key={lesson.id}
                type="button"
                className={active ? 'lesson-row active' : 'lesson-row'}
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <div>
                  <strong>{lesson.title}</strong>
                  <div className="muted">{lesson.duration}</div>
                </div>
                <span className="pill">{active ? 'Reproduciendo' : 'Clase'}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleCompleteLesson} className="form-grid" style={{ marginTop: '16px' }}>
          <label>
            Alumno (ID)
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
          </label>
          <button type="submit" className="primary" disabled={savingLesson}>
            {savingLesson ? 'Guardando avance...' : 'Marcar lección como completada'}
          </button>
        </form>
      </article>

      <div className="form-grid" style={{ gap: '20px', alignContent: 'start' }}>
        <article className="card">
          <div className="card-header">
            <div>
              <h2>Tu progreso</h2>
              <p className="muted">
                {completedCount} de {totalCount} lecciones completadas
              </p>
            </div>
            <span className="pill">{percentage}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percentage}%` }} />
          </div>
        </article>

        <article className="card">
          <h2>Certificados ({certificates.length})</h2>
          {certificates.length === 0 ? (
            <p className="muted" style={{ marginTop: '8px' }}>
              Completa el curso para desbloquear tu certificado.
            </p>
          ) : (
            <div className="form-grid" style={{ marginTop: '12px' }}>
              {certificates.map((cert) => (
                <div key={cert.id} className="cert-diploma">
                  <div className="cert-header">
                    <span className="pill">Certificado válido</span>
                    <span className="cert-code">{cert.certificateCode}</span>
                  </div>
                  <strong>{cert.courseTitle || 'Curso completado'}</strong>
                  <p className="muted" style={{ marginTop: '4px' }}>
                    Emitido el {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card">
          <h2>Pagos ({payments.length})</h2>
          {payments.length === 0 ? (
            <p className="muted" style={{ marginTop: '8px' }}>
              Sin pagos registrados aún.
            </p>
          ) : (
            <div className="form-grid" style={{ marginTop: '12px' }}>
              {payments.map((pay) => (
                <div key={pay.id} className="activity-row">
                  <strong>
                    {pay.amount} {pay.currency}
                  </strong>
                  <span className="pill">{pay.status}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
