import { FormEvent, useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { platformApi } from '../services/platformApi';

export function InstructorPage() {
  const {
    token,
    setToken,
    userEmail,
    setUserEmail,
    studentId,
    courses,
    progress,
    certificates,
    payments,
    syncAll,
    setStatusMessage,
  } = usePlatform();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('499');
  const [courseLoading, setCourseLoading] = useState(false);

  async function handleAuthSubmit(e: FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res =
        authMode === 'login'
          ? await platformApi.login({ email: email.trim(), password })
          : await platformApi.register({
              name: name.trim() || undefined,
              email: email.trim(),
              password,
            });

      const receivedToken = res.accessToken || res.token || '';
      if (receivedToken) {
        setToken(receivedToken);
      }
      setUserEmail(email.trim());
      setStatusMessage(
        authMode === 'login' ? 'Sesión iniciada.' : 'Cuenta creada correctamente.',
      );
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Error de acceso.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleCreateCourse(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setStatusMessage('Escribe el nombre del curso.');
      return;
    }

    setCourseLoading(true);
    try {
      await platformApi.createCourse(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          price: Number(price) || 0,
        },
        token || undefined,
      );
      setTitle('');
      setDescription('');
      setStatusMessage('Curso publicado en el catálogo.');
      await syncAll();
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'No se pudo publicar el curso.');
    } finally {
      setCourseLoading(false);
    }
  }

  const totalRevenue = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  return (
    <section className="grid-2">
      <article className="card">
        <div className="card-header">
          <div>
            <h2>Nuevo curso en video</h2>
            <p className="muted">Publica un curso y hazlo disponible de inmediato.</p>
          </div>
          <span className="pill">Catálogo</span>
        </div>

        <form onSubmit={handleCreateCourse} className="form-grid">
          <label>
            Nombre del curso
            <input
              placeholder="Ej. Taller Práctico de Finanzas Personales"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Descripción
            <input
              placeholder="Resumen claro para tus alumnos"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Precio
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <button type="submit" className="primary" disabled={courseLoading}>
            {courseLoading ? 'Publicando...' : 'Publicar curso'}
          </button>
        </form>

        <div className="divider" />
        <p className="muted">
          Alumno monitoreado ({studentId.slice(0, 8)}...): <strong>{courses.length}</strong> cursos
          · <strong>{progress?.completedLessons ?? 0}</strong> clases vistas ·{' '}
          <strong>{certificates.length}</strong> certificados ·{' '}
          <strong>${totalRevenue.toFixed(2)}</strong> en cobros.
        </p>
      </article>

      <article className="card">
        <div className="card-header">
          <div>
            <h2>Acceso del profesor</h2>
            <p className="muted">
              {token ? `Sesión activa (${userEmail || 'profesor'})` : 'Inicia sesión o crea tu cuenta.'}
            </p>
          </div>
          <span className="pill warm">{token ? 'Conectado' : 'Invitado'}</span>
        </div>

        <div className="row-gap" style={{ marginBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={authMode === 'login' ? 'primary' : ''}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={authMode === 'register' ? 'primary' : ''}
          >
            Crear cuenta
          </button>
          {token && (
            <button
              type="button"
              onClick={() => {
                setToken('');
                setStatusMessage('Sesión cerrada.');
              }}
            >
              Salir
            </button>
          )}
        </div>

        <form onSubmit={handleAuthSubmit} className="form-grid">
          {authMode === 'register' && (
            <label>
              Nombre
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          )}
          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="primary" disabled={authLoading}>
            {authLoading
              ? 'Procesando...'
              : authMode === 'login'
                ? 'Entrar al estudio'
                : 'Crear cuenta'}
          </button>
        </form>
      </article>
    </section>
  );
}
