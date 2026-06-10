import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, ClipboardCheck, History, ArrowRight, Users, Zap, X, Calendar, RotateCcw, Ban, MapPin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import bgProgramarMinga from '../assets/bg_programar_minga.png';
import bgTomarAsistencia from '../assets/bg_tomar_asistencia.png';
import bgHistorialMingas from '../assets/bg_historial_mingas.png';
import bgMingas from '../assets/bg_mingas.png';
import { getMingas, actualizarMinga } from '../services/mingaService';

const ESTADO_STYLE = {
  'Programada':   { color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)',  border: 'rgba(14,165,233,0.4)'  },
  'En Ejecución': { color: '#10b981', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)'  },
  'Pospuesta':    { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)'  },
  'Suspendida':   { color: '#eab308', bg: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.4)'   },
};

const ACCION_CONFIG = {
  posponer:  { titulo: 'Posponer Minga',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.35)', necesitaFecha: true,  confirmText: 'Marcar como Pospuesta' },
  cancelar:  { titulo: 'Cancelar Minga',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.35)',  necesitaFecha: false, confirmText: 'Confirmar Cancelación' },
  reactivar: { titulo: 'Reactivar Minga', color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)', necesitaFecha: true,  confirmText: 'Reprogramar y Activar' },
};

const ESTADOS_ACTIVOS = new Set(['Programada', 'En Ejecución', 'Pospuesta', 'Suspendida']);

function EstadoBadge({ estado }) {
  const s = ESTADO_STYLE[estado] || ESTADO_STYLE['Programada'];
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.7rem', borderRadius: '999px',
      fontSize: '0.78rem', fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{estado}</span>
  );
}

export default function MingasMenu() {
  const navigate = useNavigate();

  const [mingasActivas, setMingasActivas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  // Acción modal
  const [accionModal, setAccionModal] = useState(null); // { minga, tipo }
  const [accionFecha, setAccionFecha] = useState('');
  const [accionObs, setAccionObs]   = useState('');
  const [guardando, setGuardando]   = useState(false);

  const cargarActivas = () => {
    setCargando(true);
    getMingas()
      .then(todas => setMingasActivas(todas.filter(m => ESTADOS_ACTIVOS.has(m.estado))))
      .catch(() => toast.error('No se pudo cargar las mingas activas.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargarActivas(); }, []);

  const abrirAccion = (minga, tipo) => {
    setAccionModal({ minga, tipo });
    setAccionFecha('');
    setAccionObs('');
  };

  const confirmarAccion = async () => {
    if (!accionModal) return;
    const { minga, tipo } = accionModal;
    if ((tipo === 'posponer' || tipo === 'reactivar') && !accionFecha) {
      toast.error('Debes indicar la nueva fecha.');
      return;
    }
    setGuardando(true);
    try {
      const res = await actualizarMinga(minga.id, {
        accion: tipo,
        nueva_fecha: accionFecha || undefined,
        observacion: accionObs || undefined,
      });
      toast.success(res.message);
      setAccionModal(null);
      cargarActivas();
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo realizar la acción.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users className="text-green" /> Control de Mingas
          </h1>
          <p className="text-muted">Planifica el trabajo comunitario y registra las asistencias.</p>
        </div>
      </div>

      <div className="modules-grid">
        {/* TARJETA 1: PROGRAMAR */}
        <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mingas/programar')}>
          <div className="module-banner bg-gradient-blue" style={{ backgroundImage: `url(${bgProgramarMinga})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-blue"><CalendarPlus size={28} /></div>
            <h3>Programar Minga</h3>
            <p>Define la fecha, lugar, motivo y el valor de la multa por inasistencia para una nueva jornada.</p>
            <button className="btn-module text-blue">Crear Convocatoria <ArrowRight size={16} /></button>
          </div>
        </div>

        {/* TARJETA 2: ASISTENCIA */}
        <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mingas/asistencia')}>
          <div className="module-banner bg-gradient-green" style={{ backgroundImage: `url(${bgTomarAsistencia})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-green"><ClipboardCheck size={28} /></div>
            <h3>Tomar Asistencia</h3>
            <p>Registra quiénes asistieron, quiénes faltaron y las justificaciones médicas.</p>
            <button className="btn-module text-green">Registrar <ArrowRight size={16} /></button>
          </div>
        </div>

        {/* TARJETA 3: HISTORIAL */}
        <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mingas/historial')}>
          <div className="module-banner bg-gradient-earth" style={{ backgroundImage: `url(${bgHistorialMingas})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-earth"><History size={28} /></div>
            <h3>Historial</h3>
            <p>Revisa mingas pasadas, su estado (Finalizada, Suspendida) y los reportes generados.</p>
            <button className="btn-module text-earth">Ver Archivo <ArrowRight size={16} /></button>
          </div>
        </div>

        {/* TARJETA 4: MINGAS ACTIVAS */}
        <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => setPanelOpen(true)}>
          <div className="module-banner" style={{ backgroundImage: `url(${bgMingas})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="module-icon" style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}><Zap size={28} /></div>
              {!cargando && (
                <span style={{
                  background: mingasActivas.length > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)',
                  color: mingasActivas.length > 0 ? '#10b981' : '#64748b',
                  border: `1px solid ${mingasActivas.length > 0 ? 'rgba(16,185,129,0.4)' : 'rgba(100,116,139,0.3)'}`,
                  borderRadius: '999px', padding: '0.15rem 0.65rem',
                  fontSize: '0.85rem', fontWeight: 700,
                }}>
                  {mingasActivas.length} activa{mingasActivas.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h3>Mingas Activas</h3>
            <p>Consulta, edita, pospone o cancela las mingas programadas y pendientes.</p>
            <button className="btn-module" style={{ color: '#10b981' }}>
              Ver y Gestionar <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== PANEL MODAL: MINGAS ACTIVAS ===== */}
      {panelOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          overflowY: 'auto', padding: '2rem 1rem',
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '860px', padding: '2rem', position: 'relative' }}>

            {/* Header modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <div>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Zap style={{ color: '#10b981' }} size={22} /> Mingas Activas
                </h2>
                <p className="text-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                  Gestiona el estado de cada minga: pospón, cancela o reactiva desde aquí.
                </p>
              </div>
              <button onClick={() => setPanelOpen(false)} style={{
                background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)',
                cursor: 'pointer', borderRadius: '50%', width: '2.5rem', height: '2.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <X size={20} />
              </button>
            </div>

            {/* Contenido */}
            {cargando ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando mingas...</div>
            ) : mingasActivas.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '3rem',
                border: '2px dashed var(--border-color)', borderRadius: '1rem',
              }}>
                <AlertCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>No hay mingas activas en este momento.</p>
                <button className="btn-primary" style={{ marginTop: '1.25rem', width: 'auto' }} onClick={() => { setPanelOpen(false); navigate('/dashboard/mingas/programar'); }}>
                  <CalendarPlus size={16} /> Programar una minga
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {mingasActivas.map(minga => {
                  const s = ESTADO_STYLE[minga.estado] || ESTADO_STYLE['Programada'];
                  return (
                    <div key={minga.id} style={{
                      background: 'var(--bg-color)', border: `1px solid ${s.border}`,
                      borderRadius: '0.75rem', padding: '1.25rem 1.5rem',
                      borderLeft: `4px solid ${s.color}`,
                    }}>
                      {/* Cabecera tarjeta */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{minga.motivo}</span>
                            <EstadoBadge estado={minga.estado} />
                          </div>
                          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Calendar size={14} /> {minga.fecha}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <MapPin size={14} /> {minga.lugar}
                            </span>
                            <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                              Multa: ${minga.multa.toFixed(2)}
                            </span>
                          </div>
                          {minga.obs && (
                            <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: s.color }}>
                              ↳ {minga.obs}
                            </p>
                          )}
                        </div>

                        {/* Botones de acción */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          {/* Posponer: Programada, Pospuesta, Suspendida */}
                          {['Programada', 'Pospuesta', 'Suspendida'].includes(minga.estado) && (
                            <button onClick={() => abrirAccion(minga, 'posponer')} style={{
                              display: 'flex', alignItems: 'center', gap: '0.35rem',
                              padding: '0.4rem 0.85rem', borderRadius: '0.5rem', cursor: 'pointer',
                              fontSize: '0.82rem', fontWeight: 600,
                              color: '#f59e0b', background: 'rgba(245,158,11,0.12)',
                              border: '1px solid rgba(245,158,11,0.4)',
                            }}>
                              <Calendar size={14} /> Posponer
                            </button>
                          )}

                          {/* Reactivar: Pospuesta, Suspendida */}
                          {['Pospuesta', 'Suspendida'].includes(minga.estado) && (
                            <button onClick={() => abrirAccion(minga, 'reactivar')} style={{
                              display: 'flex', alignItems: 'center', gap: '0.35rem',
                              padding: '0.4rem 0.85rem', borderRadius: '0.5rem', cursor: 'pointer',
                              fontSize: '0.82rem', fontWeight: 600,
                              color: '#10b981', background: 'rgba(16,185,129,0.12)',
                              border: '1px solid rgba(16,185,129,0.4)',
                            }}>
                              <RotateCcw size={14} /> Reactivar
                            </button>
                          )}

                          {/* Cancelar: todo excepto Finalizada/Cancelada */}
                          <button onClick={() => abrirAccion(minga, 'cancelar')} style={{
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.4rem 0.85rem', borderRadius: '0.5rem', cursor: 'pointer',
                            fontSize: '0.82rem', fontWeight: 600,
                            color: '#ef4444', background: 'rgba(239,68,68,0.12)',
                            border: '1px solid rgba(239,68,68,0.4)',
                          }}>
                            <Ban size={14} /> Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ width: 'auto' }} onClick={() => setPanelOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL ACCIÓN (Posponer / Cancelar / Reactivar) ===== */}
      {accionModal && (() => {
        const cfg = ACCION_CONFIG[accionModal.tipo];
        return (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
            zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, color: cfg.color }}>{cfg.titulo}</h3>
                <button onClick={() => setAccionModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: cfg.color, fontWeight: 600 }}>{accionModal.minga.motivo}</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Fecha actual: {accionModal.minga.fecha} — Estado: {accionModal.minga.estado}
                </p>
              </div>

              {cfg.necesitaFecha && (
                <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Nueva fecha *</label>
                  <input type="date" className="input-field" value={accionFecha} onChange={e => setAccionFecha(e.target.value)} />
                </div>
              )}

              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label">
                  {accionModal.tipo === 'cancelar' ? 'Motivo de cancelación' : 'Observación'}
                  <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: '0.4rem' }}>(opcional)</span>
                </label>
                <textarea
                  className="input-field" rows={2}
                  placeholder={accionModal.tipo === 'cancelar' ? 'Ej. No se pudo coordinar el transporte...' : 'Ej. Se reagendó por lluvia...'}
                  value={accionObs} onChange={e => setAccionObs(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button className="btn-secondary" style={{ width: 'auto' }} onClick={() => setAccionModal(null)}>Cancelar</button>
                <button
                  className="btn-primary"
                  style={{ width: 'auto', background: cfg.color, color: '#fff', border: 'none' }}
                  disabled={guardando || (cfg.necesitaFecha && !accionFecha)}
                  onClick={confirmarAccion}
                >
                  {guardando ? 'Guardando...' : cfg.confirmText}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
