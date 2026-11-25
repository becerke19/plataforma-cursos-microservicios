import { useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { CatalogPage } from './pages/CatalogPage';
import { InstructorPage } from './pages/InstructorPage';
import { StudentPage } from './pages/StudentPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';

function PageHeading() {
  const { pathname } = useLocation();
  if (pathname === '/alumno') {
    return {
      title: 'Aula del Alumno',
      subtitle: 'Reproduce tus clases, registra tu progreso y descarga tu certificado.',
    };
  }
  if (pathname === '/verificar') {
    return {
      title: 'Verificación de Certificados',
      subtitle: 'Valida la autenticidad de cada diploma emitido al completar un curso.',
    };
  }
  if (pathname === '/instructor') {
    return {
      title: 'Estudio del Profesor',
      subtitle: 'Publica nuevos cursos en video y supervisa el avance y cobros de tus alumnos.',
    };
  }
  return {
    title: 'Catálogo e Inscripciones',
    subtitle: 'Explora los cursos disponibles y gestiona pagos sin hojas de cálculo.',
  };
}

function Shell() {
  const {
    darkMode,
    toggleDarkMode,
    statusMessage,
    loading,
    syncAll,
    courses,
    progress,
    certificates,
    payments,
  } = usePlatform();

  const heading = PageHeading();
  const totalIncome = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  useEffect(() => {
    syncAll();
  }, [syncAll]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-logo">A</div>
            <div>
              <span className="brand-title">AulaNatural</span>
              <span className="brand-sub">Cursos & Certificados</span>
            </div>
          </div>

          <nav className="side-nav" style={{ marginTop: '24px' }}>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
            >
              <span>Cursos y Pagos</span>
            </NavLink>
            <NavLink
              to="/alumno"
              className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
            >
              <span>Mi Aula (Alumno)</span>
            </NavLink>
            <NavLink
              to="/verificar"
              className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
            >
              <span>Certificados</span>
            </NavLink>
            <NavLink
              to="/instructor"
              className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
            >
              <span>Panel Profesor</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="muted" style={{ fontSize: '0.8rem' }}>
            <span className="live-dot" />
            {statusMessage}
          </div>
          <button type="button" onClick={toggleDarkMode}>
            {darkMode ? 'Modo claro natural' : 'Modo oscuro'}
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="top-header">
          <div>
            <h1>{heading.title}</h1>
            <p className="muted">{heading.subtitle}</p>
          </div>
          <button type="button" className="primary" onClick={() => syncAll()} disabled={loading}>
            {loading ? 'Sincronizando...' : 'Sincronizar ahora'}
          </button>
        </header>

        <section className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Cursos disponibles</div>
            <div className="kpi-value">{courses.length}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Lecciones completadas</div>
            <div className="kpi-value">
              {progress ? `${progress.completedLessons} / ${progress.trackedLessons}` : '0'}
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Certificados emitidos</div>
            <div className="kpi-value">{certificates.length}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Cobros registrados</div>
            <div className="kpi-value">${totalIncome.toFixed(2)}</div>
          </div>
        </section>

        <main>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/alumno" element={<StudentPage />} />
            <Route path="/verificar" element={<VerifyCertificatePage />} />
            <Route path="/instructor" element={<InstructorPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </PlatformProvider>
  );
}

export default App;
