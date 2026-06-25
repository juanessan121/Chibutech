import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ClipboardCheck, ArrowLeft, Search, Save, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getConvocados, registrarAsistencia } from '../services/mingaService';
import { allowTextWithPunctuation } from '../utils/validators';

export default function MingasAsistencia() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mingaId  = searchParams.get('id');
  const motivo   = searchParams.get('motivo') || '';
  const fecha    = searchParams.get('fecha')  || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [asistencia, setAsistencia] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [guardando, setGuardando]   = useState(false);

  useEffect(() => {
    if (!mingaId) return;
    setLoading(true);
    getConvocados(mingaId)
      .then(setAsistencia)
      .catch(() => toast.error('No se pudo cargar la lista de convocados.'))
      .finally(() => setLoading(false));
  }, [mingaId]);

  const pendientesCount  = asistencia.filter(u => u.estado === 'Pendiente').length;
  const totalConvocados  = asistencia.length;
  const presentesCount   = asistencia.filter(u => u.estado === 'Presente').length;
  const faltosCount      = asistencia.filter(u => u.estado === 'Faltó' || u.estado === 'Faltó (Pagado)').length;
  const justifCount      = asistencia.filter(u => u.estado === 'Justificado').length;

  const handleMarcar = (id, nuevoEstado) => {
    setAsistencia(prev => prev.map(u => u.id === id ? { ...u, estado: nuevoEstado } : u));
  };

  const handleMarcarTodos = (nuevoEstado) => {
    setAsistencia(prev => prev.map(u => u.estado === 'Pendiente' ? { ...u, estado: nuevoEstado } : u));
    toast.success(`${pendientesCount} persona(s) marcadas como "${nuevoEstado}".`);
  };

  const handleGuardar = async () => {
    if (pendientesCount > 0) {
      toast.error(`Hay ${pendientesCount} persona(s) sin marcar. Defina el estado de cada una antes de guardar.`);
      return;
    }
    setGuardando(true);
    try {
      await registrarAsistencia(mingaId, { asistencias: asistencia, cerrar_registro: true });
      toast.success('Lista registrada correctamente. Las multas han sido generadas.');
      setTimeout(() => navigate('/dashboard/mingas'), 1500);
    } catch (e) {
      toast.error('No se pudo guardar la lista. Intenta de nuevo.');
      setGuardando(false);
    }
  };

  /* ── Sin ID: estado vacío ── */
  if (!mingaId) {
    return (
      <div className="animate-fade-in pb-10">
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <div>
            <button className="btn-back" onClick={() => navigate('/dashboard/mingas')} style={{ marginBottom: '1rem' }}>
              <ArrowLeft size={18} /> Volver al Menú
            </button>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ClipboardCheck className="text-green" /> Registro de Asistencia
            </h1>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--border-color)', borderRadius: '1rem' }}>
          <AlertCircle size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto', display: 'block' }} />
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
            Para pasar lista, ve a <strong>Mingas Activas</strong> y haz clic en <strong>Tomar Lista</strong> en la minga correspondiente.
          </p>
          <button className="btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/dashboard/mingas/activas')}>
            Ir a Mingas Activas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/mingas/activas')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver a Mingas Activas
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ClipboardCheck className="text-green" /> Registro de Asistencia
          </h1>
          {(motivo || fecha) && (
            <p className="text-muted">
              {fecha && <span style={{ marginRight: '1rem' }}>📅 {fecha}</span>}
              {motivo && <span>📋 {motivo}</span>}
            </p>
          )}
        </div>
      </div>

      {/* Panel de control */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 280px' }}>
          <label className="input-label text-muted">Buscar Convocado</label>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem' }}>
            <Search size={18} className="text-muted" />
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(allowTextWithPunctuation(e.target.value))}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', width: '100%', outline: 'none', marginLeft: '0.5rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flex: '0 0 auto', flexWrap: 'wrap', alignItems: 'center' }}>
          {pendientesCount > 0 && (
            <>
              <button
                className="btn-secondary"
                onClick={() => handleMarcarTodos('Presente')}
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid #10b981', width: 'auto', fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                title={`Marcar ${pendientesCount} pendientes como Presente`}
                aria-label={`Marcar todos los ${pendientesCount} pendientes como Presente`}
              >
                <CheckCircle size={16} /> Todos Presente
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleMarcarTodos('Faltó')}
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', width: 'auto', fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                title={`Marcar ${pendientesCount} pendientes como Faltó`}
                aria-label={`Marcar todos los ${pendientesCount} pendientes como Faltó`}
              >
                <XCircle size={16} /> Todos Faltó
              </button>
            </>
          )}

          <button
            className="btn-primary"
            onClick={handleGuardar}
            disabled={pendientesCount > 0 || guardando}
            aria-label={pendientesCount > 0 ? `Faltan ${pendientesCount} por marcar` : 'Guardar lista y generar multas'}
            style={{
              background: pendientesCount > 0 ? '#4b5563' : '#10b981',
              cursor: (pendientesCount > 0 || guardando) ? 'not-allowed' : 'pointer',
              opacity: guardando ? 0.7 : 1,
            }}
            title={pendientesCount > 0 ? `${pendientesCount} persona(s) sin marcar` : 'Guardar lista y cerrar registro'}
          >
            <Save size={18} />
            {guardando ? 'Guardando...' : pendientesCount > 0 ? `${pendientesCount} sin marcar` : 'Guardar Lista'}
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      {totalConvocados > 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
              <span className="text-muted">Progreso del registro</span>
              <span style={{ fontWeight: '600', color: pendientesCount > 0 ? '#f59e0b' : '#10b981' }}>
                {totalConvocados - pendientesCount} / {totalConvocados} marcados
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${((totalConvocados - pendientesCount) / totalConvocados) * 100}%`,
                background: pendientesCount > 0 ? 'linear-gradient(90deg, #f59e0b, #10b981)' : '#10b981',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#10b981' }}>✓ {presentesCount} Presentes</span>
            <span style={{ color: '#ef4444' }}>✗ {faltosCount} Faltas</span>
            <span style={{ color: '#f59e0b' }}>⚡ {justifCount} Justificados</span>
            {pendientesCount > 0 && (
              <span style={{ color: '#94a3b8', fontWeight: '600' }}>⏳ {pendientesCount} Pendientes</span>
            )}
          </div>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Cargando convocados...
        </div>
      ) : totalConvocados === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '1rem' }}>
          <ClipboardCheck size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto', display: 'block' }} />
          <p>No hay convocados para esta minga.</p>
        </div>
      ) : (
        <div className="table-container animate-fade-in">
          {searchTerm.trim() && (
            <div style={{ padding: '0.6rem 1rem', background: 'rgba(14,165,233,0.08)', borderBottom: '1px solid rgba(14,165,233,0.2)', fontSize: '0.8rem', color: 'var(--primary)' }}>
              Resultados para "{searchTerm}" — Borra la búsqueda para ver solo pendientes.
            </div>
          )}
          <table className="data-table">
            <thead>
              <tr>
                <th>Cédula</th>
                <th>Nombres</th>
                <th>Sector</th>
                <th style={{ textAlign: 'center' }}>Estado Actual</th>
                <th style={{ textAlign: 'center' }}>Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {(searchTerm.trim()
                ? asistencia.filter(u =>
                    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (u.cedula && u.cedula.includes(searchTerm))
                  )
                : asistencia.filter(u => u.estado === 'Pendiente')
              ).map((user) => (
                <tr key={user.id}>
                  <td>{user.cedula}</td>
                  <td style={{ fontWeight: '500', color: 'var(--text-main)' }}>{user.nombre}</td>
                  <td><span className="badge badge-directive">{user.sector}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className={`badge ${
                        user.estado === 'Presente'      ? 'badge-admin'     :
                        user.estado === 'Faltó'         ? 'badge-user'      :
                        user.estado === 'Justificado'   ? 'badge-directive' :
                        user.estado === 'Faltó (Pagado)'? 'badge-directive' : ''
                      }`}
                      style={{
                        background: user.estado === 'Pendiente'     ? 'var(--border-color)' :
                                    user.estado === 'Faltó (Pagado)'? 'var(--yellow)'        : '',
                        color: user.estado === 'Faltó (Pagado)' ? '#000' : '',
                      }}
                    >
                      {user.estado}
                    </span>
                  </td>
                  <td>
                    {user.estado !== 'Faltó (Pagado)' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          title="Marcar Presente"
                          aria-label={`Marcar a ${user.nombre} como Presente`}
                          onClick={() => handleMarcar(user.id, 'Presente')}
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid #10b981', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          title="Marcar Faltó (Genera Multa)"
                          aria-label={`Marcar a ${user.nombre} como Faltó`}
                          onClick={() => handleMarcar(user.id, 'Faltó')}
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          <XCircle size={18} />
                        </button>
                        <button
                          title="Justificar Inasistencia"
                          aria-label={`Justificar inasistencia de ${user.nombre}`}
                          onClick={() => handleMarcar(user.id, 'Justificado')}
                          style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          <FileText size={18} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        Multa Cancelada
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
