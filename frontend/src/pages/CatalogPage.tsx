import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { platformApi } from '../services/platformApi';

export function CatalogPage() {
  const {
    courses,
    courseId,
    setCourseId,
    studentId,
    setStudentId,
    token,
    syncAll,
    setStatusMessage,
  } = usePlatform();

  const [selectedCourseId, setSelectedCourseId] = useState(courseId);
  const [amount, setAmount] = useState('299');
  const [currency, setCurrency] = useState('MXN');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [submitting, setSubmitting] = useState(false);

  const activeCourse = courses.find((c) => c.id === courseId) || courses[0];

  async function handlePaymentSubmit(e: FormEvent) {
    e.preventDefault();
    const targetCourse = selectedCourseId || courseId;
    if (!studentId.trim() || !targetCourse.trim()) {
      setStatusMessage('Indica el alumno y selecciona un curso.');
      return;
    }

    setSubmitting(true);
    try {
      await platformApi.createPayment(
        {
          studentId: studentId.trim(),
          courseId: targetCourse.trim(),
          amount: Number(amount) || 0,
          currency: currency.trim() || 'MXN',
          paymentMethod,
        },
        token || undefined,
      );
      setCourseId(targetCourse.trim());
      setStatusMessage('Pago registrado y alumno inscrito al curso.');
      await syncAll(studentId.trim(), targetCourse.trim());
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'No se pudo registrar el pago.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="hero-banner">
        <div>
          <span className="pill">Curso activo</span>
          <h2>{activeCourse ? activeCourse.title : 'Tus cursos listos para enseñar'}</h2>
          <p className="muted">
            {activeCourse?.description ||
              'Centraliza ventas, seguimiento de clases y emisión de certificados en una experiencia limpia.'}
          </p>
        </div>
        <Link className="btn-link primary" to="/alumno">
          Abrir aula del alumno
        </Link>
      </section>

      <section className="grid-main-side">
        <article className="card">
          <div className="card-header">
            <div>
              <h2>Cursos disponibles</h2>
              <p className="muted">Selecciona con qué curso deseas trabajar.</p>
            </div>
            <span className="pill">{courses.length} cursos</span>
          </div>

          {courses.length === 0 ? (
            <p className="muted">Aún no hay cursos cargados. Pulsa "Sincronizar ahora".</p>
          ) : (
            <div className="course-cards">
              {courses.map((course) => {
                const isSelected = course.id === courseId;
                return (
                  <div
                    key={course.id}
                    className={isSelected ? 'course-tile selected' : 'course-tile'}
                  >
                    <div className="course-cover">
                      <span className="pill">{isSelected ? 'En uso' : 'Video'}</span>
                      <span className="price-tag">
                        {typeof course.price === 'number' ? `$${course.price}` : 'Incluido'}
                      </span>
                    </div>
                    <div className="course-body">
                      <strong>{course.title}</strong>
                      <p className="muted">
                        {course.description || 'Lecciones en video con progreso y certificado.'}
                      </p>
                    </div>
                    <div className="course-actions">
                      <button
                        type="button"
                        className={isSelected ? 'primary' : ''}
                        style={{ flex: 1 }}
                        onClick={() => {
                          setCourseId(course.id);
                          setSelectedCourseId(course.id);
                          setStatusMessage(`Curso activo: ${course.title}`);
                        }}
                      >
                        {isSelected ? 'Seleccionado' : 'Seleccionar'}
                      </button>
                      <Link className="btn-link" to="/alumno">
                        Ver clase
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <article className="card">
          <div className="card-header">
            <div>
              <h2>Registrar cobro</h2>
              <p className="muted">Vincula un pago a un alumno sin hojas de cálculo.</p>
            </div>
            <span className="pill warm">Pagos</span>
          </div>

          <form onSubmit={handlePaymentSubmit} className="form-grid">
            <label>
              Alumno (ID)
              <input value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
            </label>
            <label>
              Curso
              <select
                value={selectedCourseId || courseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                {courses.length > 0 ? (
                  courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))
                ) : (
                  <option value={courseId}>Curso actual</option>
                )}
              </select>
            </label>
            <div className="grid-2">
              <label>
                Monto
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </label>
              <label>
                Moneda
                <input value={currency} onChange={(e) => setCurrency(e.target.value)} required />
              </label>
            </div>
            <label>
              Método de pago
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="CARD">Tarjeta</option>
                <option value="TRANSFER">Transferencia</option>
                <option value="CASH">Efectivo</option>
              </select>
            </label>
            <button type="submit" className="primary" disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar pago'}
            </button>
          </form>
        </article>
      </section>
    </>
  );
}
