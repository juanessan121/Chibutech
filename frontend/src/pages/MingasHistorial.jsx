import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, ArrowLeft, Search, Calendar, FileText, Download, Users, X, RotateCcw, Ban } from 'lucide-react';
import { getMingas, getConvocados, actualizarMinga } from '../services/mingaService';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ESTADO_STYLE = {
  'Programada':   { bg: 'rgba(14,165,233,0.15)',  color: '#0ea5e9',  border: 'rgba(14,165,233,0.4)'  },
  'En Ejecución': { bg: 'rgba(16,185,129,0.15)',  color: '#10b981',  border: 'rgba(16,185,129,0.4)'  },
  'Finalizada':   { bg: 'rgba(5,150,105,0.15)',   color: '#059669',  border: 'rgba(5,150,105,0.4)'   },
  'Pospuesta':    { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b',  border: 'rgba(245,158,11,0.4)'  },
  'Suspendida':   { bg: 'rgba(234,179,8,0.15)',   color: '#eab308',  border: 'rgba(234,179,8,0.4)'   },
  'Cancelada':    { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444',  border: 'rgba(239,68,68,0.4)'   },
};

function EstadoBadge({ estado }) {
  const s = ESTADO_STYLE[estado] || ESTADO_STYLE['Programada'];
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '999px',
      fontSize: '0.78rem', fontWeight: 600,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`
    }}>
      {estado}
    </span>
  );
}

export default function MingasHistorial() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [historialMingas, setHistorialMingas] = useState([]);

  const [detallesModalOpen, setDetallesModalOpen] = useState(false);
  const [mingaDetalle, setMingaDetalle] = useState(null);
  const [convocadosDetalle, setConvocadosDetalle] = useState([]);

  // Modal de acción (posponer / cancelar / reactivar)
  const [accionModal, setAccionModal] = useState(null); // { minga, tipo: 'posponer'|'cancelar'|'reactivar' }
  const [accionFecha, setAccionFecha] = useState('');
  const [accionObs, setAccionObs] = useState('');
  const [guardandoAccion, setGuardandoAccion] = useState(false);

  const cargarMingas = () => getMingas().then(data => setHistorialMingas(data));
  useEffect(() => { cargarMingas(); }, []);

  const filtrados = historialMingas.filter(m => {
    const matchSearch = m.motivo.toLowerCase().includes(searchTerm.toLowerCase()) || m.fecha.includes(searchTerm);
    const matchEstado = filtroEstado === 'Todos' || m.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

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
    setGuardandoAccion(true);
    try {
      const res = await actualizarMinga(minga.id, {
        accion: tipo,
        nueva_fecha: accionFecha || undefined,
        observacion: accionObs || undefined,
      });
      toast.success(res.message);
      setAccionModal(null);
      cargarMingas();
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo realizar la acción. Intenta de nuevo.');
    } finally {
      setGuardandoAccion(false);
    }
  };

  const abrirDetalles = async (minga) => {
    const toastId = toast.loading('Cargando detalles...');
    try {
      const convocados = await getConvocados(minga.id);
      setMingaDetalle(minga);
      setConvocadosDetalle(convocados);
      setDetallesModalOpen(true);
      toast.dismiss(toastId);
    } catch {
      toast.error('No se pudieron cargar los detalles de la minga. Intenta de nuevo.', { id: toastId });
    }
  };

  const descargarActaPdf = async (minga) => {
    const toastId = toast.loading('Generando Acta PDF...');
    try {
      const convocados = await getConvocados(minga.id);
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("ACTA DE MINGA COMUNITARIA", 14, 20);
      doc.setFontSize(12);
      doc.text(`Fecha: ${minga.fecha}`, 14, 30);
      doc.text(`Motivo: ${minga.motivo}`, 14, 38);
      doc.text(`Lugar: ${minga.lugar}`, 14, 46);
      doc.text(`Multa por inasistencia: $${minga.multa.toFixed(2)}`, 14, 54);
      const presentes    = convocados.filter(c => c.estado === 'Presente').length;
      const faltas       = convocados.filter(c => c.estado === 'Faltó' || c.estado === 'Faltó (Pagado)').length;
      const justificados = convocados.filter(c => c.estado === 'Justificado').length;
      doc.text(`Resumen: ${presentes} Presentes, ${faltas} Faltas, ${justificados} Justificados`, 14, 62);
      autoTable(doc, {
        startY: 70,
        head: [['Cédula', 'Nombre', 'Sector', 'Estado', 'Multa']],
        body: convocados.map(c => [
          c.cedula,
          c.nombre,
          c.sector,
          c.estado,
          c.multa_estado === 'Pagada'    ? '✓ Pagada'
          : c.multa_estado === 'Pendiente' ? `$${Number(c.multa_monto || 0).toFixed(2)} Pend.`
          : c.multa_estado === 'Anulada'   ? 'Anulada'
          : '—'
        ]),
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [16, 185, 129] },
        columnStyles: { 4: { halign: 'center' } },
      });
      doc.save(`Acta_Minga_${minga.fecha}.pdf`);
      toast.success('Acta PDF descargada correctamente.', { id: toastId });
    } catch {
      toast.error('No se pudo generar el acta PDF. Intenta de nuevo.', { id: toastId });
    }
  };

  const ACCION_CONFIG = {
    posponer:   { titulo: 'Posponer Minga',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.35)', necesitaFecha: true,  confirmText: 'Marcar como Pospuesta' },
    cancelar:   { titulo: 'Cancelar Minga',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.35)',  necesitaFecha: false, confirmText: 'Confirmar Cancelación' },
    reactivar:  { titulo: 'Reactivar Minga',  color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)', necesitaFecha: true,  confirmText: 'Reprogramar y Activar' },
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/mingas')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <History className="text-earth" /> Historial de Mingas
          </h1>
          <p className="text-muted">Archivo histórico de jornadas comunitarias. Revise reportes y estadísticas pasadas.</p>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '2 1 300px' }}>
          <label className="input-label text-muted">Búsqueda Rápida</label>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem' }}>
            <Search size={18} className="text-muted" />
            <input
              type="text"
              placeholder="Buscar por motivo o fecha (Ej. 2025-10)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', width: '100%', outline: 'none', marginLeft: '0.5rem' }}
            />
          </div>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label className="input-label text-muted">Filtrar por Estado</label>
          <select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos">Todos los estados</option>
            <option value="Programada">Programadas</option>
            <option value="En Ejecución">En Ejecución</option>
            <option value="Pospuesta">Pospuestas</option>
            <option value="Finalizada">Finalizadas</option>
            <option value="Suspendida">Suspendidas</option>
            <option value="Cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container glass-card animate-fade-in">
        <table className="data-table">
          <thead>
            <tr>
              <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16}/> Fecha</div></th>
              <th>Motivo y Lugar</th>
              <th style={{ textAlign: 'center' }}>Asistencia</th>
              <th style={{ textAlign: 'center' }}>Multa ($)</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((minga) => (
                <tr key={minga.id}>
                  <td style={{ fontWeight: '500' }}>{minga.fecha}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{minga.motivo}</span>
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>📍 {minga.lugar}</span>
                      {minga.obs && (
                        <span style={{ fontSize: '0.75rem', marginTop: '4px', color: ESTADO_STYLE[minga.estado]?.color || 'var(--text-muted)' }}>
                          ↳ {minga.obs}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {minga.estado === 'Finalizada' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span className="text-green" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Users size={14}/> {minga.asistentes} Presentes</span>
                        <span className="text-red">{minga.faltos} Faltas</span>
                      </div>
                    ) : (
                      <span className="text-muted" style={{ display: 'block', textAlign: 'center' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>${minga.multa.toFixed(2)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <EstadoBadge estado={minga.estado} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {/* Ver detalles — siempre visible */}
                      <button title="Ver Resumen" className="btn-icon" onClick={() => abrirDetalles(minga)}
                        style={{ color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.4)', borderRadius: '0.5rem', padding: '0.4rem' }}>
                        <FileText size={16} />
                      </button>

                      {/* Descargar PDF — solo Finalizadas */}
                      {minga.estado === 'Finalizada' && (
                        <button title="Descargar Acta PDF" className="btn-icon" onClick={() => descargarActaPdf(minga)}
                          style={{ color: 'var(--earth)', background: 'rgba(217,119,6,0.1)', border: '1px solid var(--earth)', borderRadius: '0.5rem', padding: '0.4rem' }}>
                          <Download size={16} />
                        </button>
                      )}

                      {/* Posponer — Programada o Pospuesta */}
                      {(minga.estado === 'Programada' || minga.estado === 'Pospuesta' || minga.estado === 'Suspendida') && (
                        <button title="Posponer a nueva fecha" className="btn-icon" onClick={() => abrirAccion(minga, 'posponer')}
                          style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '0.5rem', padding: '0.4rem' }}>
                          <Calendar size={16} />
                        </button>
                      )}

                      {/* Reactivar — Pospuesta o Suspendida */}
                      {(minga.estado === 'Pospuesta' || minga.estado === 'Suspendida') && (
                        <button title="Reactivar y programar nueva fecha" className="btn-icon" onClick={() => abrirAccion(minga, 'reactivar')}
                          style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '0.5rem', padding: '0.4rem' }}>
                          <RotateCcw size={16} />
                        </button>
                      )}

                      {/* Cancelar — cualquier estado excepto Finalizada y Cancelada */}
                      {!['Finalizada', 'Cancelada'].includes(minga.estado) && (
                        <button title="Cancelar minga" className="btn-icon" onClick={() => abrirAccion(minga, 'cancelar')}
                          style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '0.5rem', padding: '0.4rem' }}>
                          <Ban size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No se encontraron mingas con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL ACCIONES (Posponer / Cancelar / Reactivar) */}
      {accionModal && (() => {
        const cfg = ACCION_CONFIG[accionModal.tipo];
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: cfg.color }}>{cfg.titulo}</h3>
                <button onClick={() => setAccionModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>

              <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: cfg.color, fontWeight: 600 }}>{accionModal.minga.motivo}</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Fecha actual: {accionModal.minga.fecha} — Estado: {accionModal.minga.estado}</p>
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
                  className="input-field"
                  rows={2}
                  placeholder={accionModal.tipo === 'cancelar' ? 'Ej. No se pudo coordinar el transporte...' : 'Ej. Se reagendó por lluvia...'}
                  value={accionObs}
                  onChange={e => setAccionObs(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button className="btn-secondary" style={{ width: 'auto' }} onClick={() => setAccionModal(null)}>Cancelar</button>
                <button
                  className="btn-primary"
                  style={{ width: 'auto', background: cfg.color, color: '#fff', border: 'none' }}
                  disabled={guardandoAccion || (cfg.necesitaFecha && !accionFecha)}
                  onClick={confirmarAccion}
                >
                  {guardandoAccion ? 'Guardando...' : cfg.confirmText}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL DETALLES */}
      {detallesModalOpen && mingaDetalle && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ padding: '2rem', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setDetallesModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', borderRadius: '50%', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-color)'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--blue)' }}>Resumen de Minga</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{mingaDetalle.fecha} — {mingaDetalle.motivo}</p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Asistencias', valor: convocadosDetalle.filter(c => c.estado === 'Presente').length, color: 'var(--green)', bg: 'rgba(16,185,129,0.1)', border: 'var(--green)' },
                { label: 'Faltas', valor: convocadosDetalle.filter(c => c.estado === 'Faltó' || c.estado === 'Faltó (Pagado)').length, color: 'var(--red)', bg: 'rgba(239,68,68,0.1)', border: 'var(--red)' },
                { label: 'Justificados', valor: convocadosDetalle.filter(c => c.estado === 'Justificado').length, color: 'var(--yellow)', bg: 'rgba(245,158,11,0.1)', border: 'var(--yellow)' },
              ].map(({ label, valor, color, bg, border }) => (
                <div key={label} style={{ flex: 1, padding: '1rem', background: bg, borderRadius: '0.5rem', textAlign: 'center', border: `1px solid ${border}` }}>
                  <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color }}>{valor}</span>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>{label}</span>
                </div>
              ))}
            </div>

            <h4 style={{ marginBottom: '1rem' }}>Detalle de Convocados</h4>
            <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cédula</th>
                    <th>Nombre y Apellido</th>
                    <th>Sector</th>
                    <th style={{ textAlign: 'center' }}>Estado</th>
                    <th style={{ textAlign: 'center' }}>Multa</th>
                  </tr>
                </thead>
                <tbody>
                  {convocadosDetalle.map((c, i) => (
                    <tr key={i}>
                      <td>{c.cedula}</td>
                      <td>{c.nombre}</td>
                      <td>{c.sector}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${
                          c.estado === 'Presente'       ? 'badge-admin' :
                          c.estado.includes('Faltó')   ? 'badge-user'  :
                          c.estado === 'Justificado'   ? 'badge-directive' : ''
                        }`} style={c.estado === 'Faltó (Pagado)' ? { background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid #f59e0b' } : {}}>
                          {c.estado}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                        {c.multa_estado === 'Pagada' ? (
                          <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Pagada</span>
                        ) : c.multa_estado === 'Pendiente' ? (
                          <span style={{ color: '#ef4444', fontWeight: 600 }}>${Number(c.multa_monto || 0).toFixed(2)} Pendiente</span>
                        ) : c.multa_estado === 'Anulada' ? (
                          <span style={{ color: '#94a3b8' }}>Anulada</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {convocadosDetalle.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No hay datos de asistentes registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={() => setDetallesModalOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
