import { FormEvent, useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { platformApi } from '../services/platformApi';
import { Certificate } from '../types/platform';

export function VerifyCertificatePage() {
  const { studentId, certificates, setStatusMessage } = usePlatform();
  const [queryStudentId, setQueryStudentId] = useState(studentId);
  const [codeFilter, setCodeFilter] = useState('');
  const [results, setResults] = useState<Certificate[]>(certificates);
  const [searching, setSearching] = useState(false);

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    if (!queryStudentId.trim()) {
      setStatusMessage('Ingresa el identificador del alumno para consultar.');
      return;
    }

    setSearching(true);
    try {
      const data = await platformApi.getCertificatesByStudent(queryStudentId.trim());
      const list = Array.isArray(data)
        ? data
        : (data as unknown as { value?: Certificate[] }).value ?? [];

      const normalizedCode = codeFilter.trim().toLowerCase();
      const filtered = normalizedCode
        ? list.filter((item) => item.certificateCode.toLowerCase().includes(normalizedCode))
        : list;

      setResults(filtered);
      setStatusMessage(
        filtered.length > 0
          ? `Se encontraron ${filtered.length} certificado(s).`
          : 'No se encontraron certificados con ese código.',
      );
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Error al consultar certificados.');
    } finally {
      setSearching(false);
    }
  }

  const displayed = results.length > 0 || codeFilter.trim() ? results : certificates;

  return (
    <section className="grid-main-side">
      <article className="card">
        <div className="card-header">
          <div>
            <h2>Consultar autenticidad</h2>
            <p className="muted">Confirma diplomas emitidos sin hojas de cálculo.</p>
          </div>
          <span className="pill">Validación</span>
        </div>

        <form onSubmit={handleVerify} className="form-grid">
          <label>
            Alumno (ID)
            <input
              value={queryStudentId}
              onChange={(e) => setQueryStudentId(e.target.value)}
              required
            />
          </label>
          <label>
            Folio del certificado (opcional)
            <input
              placeholder="Ej. CERT-MWWNY641-B8AEEB94"
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
            />
          </label>
          <button type="submit" className="primary" disabled={searching}>
            {searching ? 'Verificando...' : 'Verificar certificado'}
          </button>
        </form>
      </article>

      <article className="card">
        <div className="card-header">
          <div>
            <h2>Diplomas emitidos</h2>
            <p className="muted">Credenciales verificadas en el sistema.</p>
          </div>
          <span className="pill">{displayed.length}</span>
        </div>

        {displayed.length === 0 ? (
          <p className="muted">No hay certificados para mostrar.</p>
        ) : (
          <div className="form-grid">
            {displayed.map((cert) => (
              <div key={cert.id} className="cert-diploma">
                <div className="cert-header">
                  <span className="pill">Verificado</span>
                  <span className="cert-code">{cert.certificateCode}</span>
                </div>
                <strong style={{ fontSize: '1.05rem' }}>
                  {cert.courseTitle || 'Curso completado'}
                </strong>
                <p className="muted" style={{ marginTop: '6px' }}>
                  Emitido el {new Date(cert.issuedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
