import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Zap, ChevronDown, ChevronUp,
  Calendar, MapPin, Users, AlertCircle,
  RotateCcw, Ban, X, CalendarPlus, Layers, Map,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMingasActivasDetalle, actualizarMinga } from '../services/mingaService';

const ESTADO_STYLE = {
  'Programada':   { color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.45)', pill: 'rgba(14,165,233,0.15)'  },
  'En Ejecución': { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.45)', pill: 'rgba(16,185,129,0.15)'  },
  'Pospuesta':    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.45)', pill: 'rgba(245,158,11,0.15)'  },
  'Suspendida':   { color: '#eab308', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.45)',  pill: 'rgba(234,179,8,0.15)'   },
};

const ACCION_CONFIG = {
  posponer:  { titulo: 'Posponer Minga',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.35)', necesitaFecha: true,  confirmText: 'Marcar como Pospuesta' },
  cancelar:  { titulo: 'Cancelar Minga',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.35)',  necesitaFecha: false, confirmText: 'Confirmar Cancelación' },
  reactivar: { titulo: 'Reactivar Minga', color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)', necesitaFecha: true,  confirmText: 'Reprogramar y Activar' },
};

function EstadoBadge({ estado }) {
  const s = ESTADO_STYLE[estado] || ESTADO_STYLE['Programada'];
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px',
      fontSize: '0.78rem', fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{estado}</span>
  );
}

function PillTag({ label, color, bg }) {
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '0.4rem',
      fontSize: '0.78rem', fontWeight: 500,
      background: bg || 'rgba(100,116,139,0.15)',
      color: color || 'var(--text-muted)',
      border: `1px solid ${color ? color + '55' : 'var(--border-color)'}`,
    }}>{label}</span>
  );
}

export default function MingasActivas() {
  const navigate = useNavigate();

  const [mingas, setMingas]         = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [expandido, setExpandido]   = useState(null); // id de la minga expandida

  // Acción modal
  const [accionModal, setAccionModal] = useState(null);
  const [accionFecha, setAccionFecha] = useState('');
  const [accionObs, setAccionObs]     = useState('');
  const [guardando, setGuardando]     = useState(false);

  const cargar = () => {
    setCargando(true);
    getMingasActivasDetalle()
      .then(setMingas)
      .catch(() => toast.error('No se pudo cargar las mingas activas.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const toggleExpandir = (id) => setExpandido(prev => prev === id ? null : id);

  const abrirAccion = (e, minga, tipo) => {
    e.stopPropagation();
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
      setExpandido(null);
      cargar();
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo realizar la acción.');
    } finally {
      setGuardando(false);
    }
  };

  const ZONA_COLORS = [
    '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6',
  ];
  const zonaColor = (nombre, idx) => ZONA_COLORS[idx % ZONA_COLORS.length];

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/mingas')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Zap style={{ color: '#10b981' }} /> Mingas Activas
          </h1>
          <p className="text-muted">
            {cargando ? 'Cargando...' : `${mingas.length} minga${mingas.length !== 1 ? 's' : ''} en curso o pendiente${mingas.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', alignSelf: 'flex-start' }}
          onClick={() => navigate('/dashboard/mingas/programar')}>
          <CalendarPlus size={16} /> Nueva Minga
        </button>
      </div>

      {/* Lista de mingas */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Cargando mingas...
        </div>
      ) : mingas.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: 'center', padding: '4rem',
          border: '2px dashed var(--border-color)',
        }}>
          <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>No hay mingas activas</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
            Todas las mingas están finalizadas o canceladas.
          </p>
          <button className="btn-primary" style={{ width: 'auto' }}
            onClick={() => navigate('/dashboard/mingas/programar')}>
            <CalendarPlus size={16} /> Programar nueva minga
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {mingas.map((minga) => {
            const s = ESTADO_STYLE[minga.estado] || ESTADO_STYLE['Programada'];
            const abierto = expandido === minga.id;

            return (
              <div
                key={minga.id}
                className="glass-card"
                style={{
                  padding: 0, overflow: 'hidden',
                  borderLeft: `4px solid ${s.color}`,
                  border: `1px solid ${s.border}`,
                  borderLeft: `4px solid ${s.color}`,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
                onClick={() => toggleExpandir(minga.id)}
              >
                {/* ── CABECERA (siempre visible) ── */}
                <div style={{
                  padding: '1.1rem 1.4rem',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '1rem',
                  background: abierto ? s.bg : 'transparent',
                  transition: 'background 0.2s',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Fila superior: estado + motivo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <EstadoBadge estado={minga.estado} />
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                        {minga.motivo}
                      </span>
                    </div>
                    {/* Fila inferior: meta info */}
                    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {minga.fecha}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} /> {minga.lugar}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Users size={13} /> {minga.total_convocados} convocados
                      </span>
                      <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                        Multa: ${minga.multa.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div style={{ color: s.color, flexShrink: 0 }}>
                    {abierto ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* ── DETALLE EXPANDIDO ── */}
                {abierto && (
                  <div
                    style={{ padding: '1.25rem 1.4rem 1.5rem', borderTop: `1px solid ${s.border}` }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Observación */}
                    {minga.obs && (
                      <div style={{
                        marginBottom: '1.25rem', padding: '0.65rem 1rem',
                        borderRadius: '0.5rem', background: s.bg, border: `1px solid ${s.border}`,
                      }}>
                        <span style={{ fontSize: '0.8rem', color: s.color, fontWeight: 600 }}>Observación: </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{minga.obs}</span>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                      {/* Zonas */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                          <Map size={15} style={{ color: 'var(--text-muted)' }} />
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                            Zonas convocadas
                          </span>
                        </div>
                        {minga.zonas.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {minga.zonas.map((z, i) => (
                              <PillTag key={z} label={z} color={zonaColor(z, i)} bg={`${zonaColor(z, i)}22`} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.82rem' }}>Sin zonas asignadas</span>
                        )}
                      </div>

                      {/* Sectores */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                          <Layers size={15} style={{ color: 'var(--text-muted)' }} />
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                            Sectores convocados ({minga.sectores.length})
                          </span>
                        </div>
                        {minga.sectores.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {minga.sectores.map((sec) => (
                              <PillTag key={sec} label={sec} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.82rem' }}>Sin sectores asignados</span>
                        )}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div style={{
                      display: 'flex', gap: '0.6rem', flexWrap: 'wrap',
                      paddingTop: '1rem', borderTop: `1px solid ${s.border}`,
                    }}>
                      {['Programada', 'Pospuesta', 'Suspendida'].includes(minga.estado) && (
                        <button onClick={(e) => abrirAccion(e, minga, 'posponer')} style={{
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
                          fontSize: '0.85rem', fontWeight: 600,
                          color: '#f59e0b', background: 'rgba(245,158,11,0.12)',
                          border: '1px solid rgba(245,158,11,0.4)',
                        }}>
                          <Calendar size={15} /> Posponer
                        </button>
                      )}
                      {['Pospuesta', 'Suspendida'].includes(minga.estado) && (
                        <button onClick={(e) => abrirAccion(e, minga, 'reactivar')} style={{
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
                          fontSize: '0.85rem', fontWeight: 600,
                          color: '#10b981', background: 'rgba(16,185,129,0.12)',
                          border: '1px solid rgba(16,185,129,0.4)',
                        }}>
                          <RotateCcw size={15} /> Reactivar
                        </button>
                      )}
                      <button onClick={(e) => abrirAccion(e, minga, 'cancelar')} style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
                        fontSize: '0.85rem', fontWeight: 600,
                        color: '#ef4444', background: 'rgba(239,68,68,0.12)',
                        border: '1px solid rgba(239,68,68,0.4)',
                      }}>
                        <Ban size={15} /> Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL ACCIÓN ── */}
      {accionModal && (() => {
        const cfg = ACCION_CONFIG[accionModal.tipo];
        return (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
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
