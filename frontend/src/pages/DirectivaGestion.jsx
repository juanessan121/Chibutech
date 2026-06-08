import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, History, UserPlus, Save, FileText, Calendar, RefreshCw, RotateCcw, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from '../services/axiosConfig';
import PersonaAutocompleteInput from '../components/PersonaAutocompleteInput';

// Catálogo fijo que refleja la tabla Catalogo_Cargo_Directivo de la BD
const CARGOS_DIRECTIVA = [
  { id: 1, nombre: 'Presidente' },
  { id: 2, nombre: 'Vicepresidente' },
  { id: 3, nombre: 'Secretario' },
  { id: 4, nombre: 'Tesorero' },
  { id: 5, nombre: 'Vocal Principal 1' },
  { id: 6, nombre: 'Vocal Principal 2' },
  { id: 7, nombre: 'Vocal Principal 3' },
  { id: 8, nombre: 'Vocal Suplente 1' },
  { id: 9, nombre: 'Vocal Suplente 2' },
];

export default function DirectivaGestion() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('nuevo'); // 'nuevo' o 'historial'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cargosSeleccionados, setCargosSeleccionados] = useState({});
  const [cargosPasswords, setCargosPasswords] = useState({});
  const [formData, setFormData] = useState({
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    resolucion: ''
  });

  const [historialPeriodos, setHistorialPeriodos] = useState([]);
  const [periodoActivando, setPeriodoActivando] = useState(null);
  const [periodoActivo, setPeriodoActivo] = useState(() => localStorage.getItem('directiva_periodo_firmas') || null);
  const [directivaActiva, setDirectivaActiva] = useState(null); // { fecha_inicio, fecha_fin }
  const [miembrosActivos, setMiembrosActivos] = useState([]);

  // Estado para cambio de miembro
  const [cambioData, setCambioData] = useState({ id_cargo_directivo: '', id_persona_nueva: null, password: '' });
  const [guardandoCambio, setGuardandoCambio] = useState(false);

  // Touched para validación inline
  const [touched, setTouched] = useState({ fecha_inicio: false, resolucion: false, cargo: false });

  // Cargar directiva activa (para restricción de fechas y tab cambiar miembro)
  useEffect(() => {
    axios.get('/directiva/actual').then(res => {
      const miembros = res.data.data || [];
      if (miembros.length > 0) {
        setDirectivaActiva({ fecha_inicio: miembros[0].fecha_inicio, fecha_fin: miembros[0].fecha_fin });
        setMiembrosActivos(miembros);
      }
    }).catch(() => {});
  }, []);

  // minDate: si hay fecha_fin proyectada → después de ella; si no → después del inicio; ambos con tope de 2 meses atrás
  const calcularMinDate = () => {
    const dosMesesAtras = new Date();
    dosMesesAtras.setMonth(dosMesesAtras.getMonth() - 2);
    let min = dosMesesAtras;

    if (directivaActiva?.fecha_fin) {
      const despuesFin = new Date(directivaActiva.fecha_fin + 'T00:00:00');
      despuesFin.setDate(despuesFin.getDate() + 1);
      if (despuesFin > min) min = despuesFin;
    } else if (directivaActiva?.fecha_inicio) {
      const siguienteDia = new Date(directivaActiva.fecha_inicio + 'T00:00:00');
      siguienteDia.setDate(siguienteDia.getDate() + 1);
      if (siguienteDia > min) min = siguienteDia;
    }
    return min.toISOString().split('T')[0];
  };
  const minFechaInicio = calcularMinDate();

  const fmtFecha = (iso) => iso ? new Date(iso + 'T00:00:00').toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

  const handleCambiarMiembro = async (e) => {
    e.preventDefault();
    if (!cambioData.id_cargo_directivo || !cambioData.id_persona_nueva) {
      toast.error('Seleccione el cargo y la nueva persona.');
      return;
    }
    setGuardandoCambio(true);
    try {
      const res = await axios.patch('/directiva/miembro', {
        id_cargo_directivo: parseInt(cambioData.id_cargo_directivo),
        id_persona_nueva:   cambioData.id_persona_nueva,
        password:           cambioData.password || 'chibuleo2024',
      });
      toast.success(res.data.message);
      // Recargar miembros activos
      const updated = await axios.get('/directiva/actual');
      setMiembrosActivos(updated.data.data || []);
      setCambioData({ id_cargo_directivo: '', id_persona_nueva: null, password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar el miembro.');
    } finally {
      setGuardandoCambio(false);
    }
  };

  const [modalReactivar, setModalReactivar] = useState(null); // { periodo, presidente }
  const [reactivando, setReactivando] = useState(false);

  const handleActivarPeriodo = (hist) => {
    if (window.confirm(`¿Usar la directiva del período ${hist.periodo} (Presidente: ${hist.presidente}) para generación de documentos y firmas?\n\nEsto no elimina la directiva actual, solo selecciona cuál aparece en los PDFs.`)) {
      setPeriodoActivando(hist.periodo);
      localStorage.setItem('directiva_periodo_firmas', hist.periodo);
      setPeriodoActivo(hist.periodo);
      toast.success(`Directiva ${hist.periodo} activada para documentos y firmas.`);
      setPeriodoActivando(null);
    }
  };

  const handleConfirmarReactivar = async () => {
    if (!modalReactivar) return;
    setReactivando(true);
    try {
      await axios.post('/directiva/reactivar', { periodo: parseInt(modalReactivar.periodo) });
      toast.success(`Directiva ${modalReactivar.periodo} reactivada como directiva actual.`);
      setModalReactivar(null);
      // Actualizar localStorage también para que los PDFs usen esta directiva
      localStorage.setItem('directiva_periodo_firmas', modalReactivar.periodo);
      setPeriodoActivo(modalReactivar.periodo);
      // Recargar el historial
      axios.get('/directiva/historial').then(res => {
        const data = res.data.data || [];
        const agrupado = data.reduce((acc, curr) => {
          const y = curr.fecha_inicio.substring(0, 4);
          if (!acc[y]) acc[y] = { periodo: y, presidente: '-', resolucion: curr.resolucion_nombramiento, estado: 'Finalizado' };
          if (curr.cargo === 'Presidente') acc[y].presidente = curr.nombre;
          return acc;
        }, {});
        setHistorialPeriodos(Object.values(agrupado).sort((a, b) => b.periodo - a.periodo));
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al reactivar la directiva.');
    } finally {
      setReactivando(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'historial') {
      axios.get('/directiva/historial').then(res => {
        // Agrupar por periodo
        const data = res.data.data || [];
        const agrupado = data.reduce((acc, curr) => {
            const y = curr.fecha_inicio.substring(0, 4);
            if (!acc[y]) acc[y] = { periodo: y, presidente: '-', resolucion: curr.resolucion_nombramiento, estado: 'Finalizado' };
            if (curr.cargo === 'Presidente') acc[y].presidente = curr.nombre;
            return acc;
        }, {});
        setHistorialPeriodos(Object.values(agrupado).sort((a,b) => b.periodo - a.periodo));
      }).catch(err => console.error("Error cargando historial:", err));
    }
  }, [activeTab]);

  const handleCargoChange = (id_cargo_directivo, id_persona) => {
    setCargosSeleccionados(prev => ({ ...prev, [id_cargo_directivo]: id_persona }));
  };
  
  const handlePasswordChange = (id_cargo_directivo, password) => {
    setCargosPasswords(prev => ({ ...prev, [id_cargo_directivo]: password }));
  };

  const handleGuardarDirectiva = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Transformar el estado a array esperado
    const payloadCargos = Object.entries(cargosSeleccionados).map(([id_cargo, id_persona]) => ({
      id_cargo_directivo: parseInt(id_cargo),
      id_persona,
      password: cargosPasswords[id_cargo] || 'chibuleo2024' // default
    })).filter(c => c.id_persona); // solo los que hayan asignado a alguien

    if (payloadCargos.length === 0) {
      toast.error('Debe asignar al menos a una persona a un cargo directivo.');
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post('/directiva', {
        ...formData,
        cargos: payloadCargos
      });
      toast.success('Nueva Directiva registrada exitosamente.');
      setTimeout(() => navigate('/dashboard/directiva'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ocurrió un error al registrar la directiva.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      
      
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/directiva')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Organigrama
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield className="text-yellow" /> Gestión de Directivas
          </h1>
          <p className="text-muted">Añada nuevos miembros o consulte las autoridades de periodos anteriores.</p>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={activeTab === 'nuevo' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('nuevo')}
          style={{ width: 'auto', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}
        >
          <UserPlus size={18} /> Registrar Nuevo Periodo
        </button>
        <button
          className={activeTab === 'historial' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('historial')}
          style={{ width: 'auto', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}
        >
          <History size={18} /> Ver Historial Pasado
        </button>
        <button
          className={activeTab === 'cambiar' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('cambiar')}
          style={{ width: 'auto', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}
        >
          <RefreshCw size={18} /> Cambiar Miembro
        </button>
      </div>

      {/* CONTENIDO PESTAÑA: NUEVO PERIODO */}
      {activeTab === 'nuevo' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <h3 className="text-primary" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Configurar Autoridades Entrantes
          </h3>
          <form onSubmit={handleGuardarDirectiva} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Banner: restricción de fechas si hay directiva activa */}
            {directivaActiva && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                <AlertTriangle size={18} style={{ color: 'var(--yellow)', flexShrink: 0, marginTop: '0.1rem' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--yellow)', fontWeight: 600 }}>
                    Directiva activa desde {fmtFecha(directivaActiva.fecha_inicio)}
                    {directivaActiva.fecha_fin ? ` hasta ${fmtFecha(directivaActiva.fecha_fin)}` : ' (sin fecha fin proyectada)'}.
                  </span>
                  <span className="text-muted">
                    {directivaActiva.fecha_fin
                      ? ` Solo podrá registrar una nueva directiva después del ${fmtFecha(directivaActiva.fecha_fin)}, cuando concluya el periodo vigente.`
                      : ' La nueva fecha de inicio debe ser posterior al inicio de la directiva actual. Se permite hasta 2 meses atrás para cubrir procesos de elección y sucesión.'
                    }
                  </span>
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} className="text-blue" /> Fecha Inicio de Funciones *
                </label>
                <input
                  type="date"
                  className="input-field"
                  required
                  min={minFechaInicio}
                  value={formData.fecha_inicio}
                  onChange={e => setFormData({...formData, fecha_inicio: e.target.value})}
                  onBlur={() => setTouched(t => ({ ...t, fecha_inicio: true }))}
                />
                {touched.fecha_inicio && !formData.fecha_inicio && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>La fecha de inicio es obligatoria.</span>
                )}
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Mínimo permitido: {new Date(minFechaInicio + 'T00:00:00').toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} className="text-muted" /> Fecha Fin de Periodo (Proyectada)
                </label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={formData.fecha_fin}
                  onChange={e => setFormData({...formData, fecha_fin: e.target.value})}
                />
              </div>
            </div>

              <div className="form-grid full">
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={14} className="text-yellow" /> N° Resolución de Nombramiento *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. RES-2026-001 o Acta No. 45 del Ministerio de Inclusión"
                  required
                  value={formData.resolucion}
                  onChange={e => {
                    const validValue = e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '');
                    setFormData({...formData, resolucion: validValue});
                  }}
                  onBlur={() => setTouched(t => ({ ...t, resolucion: true }))}
                />
                {touched.resolucion && !formData.resolucion.trim() && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El número de resolución es obligatorio.</span>
                )}
                {!touched.resolucion && (
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Solo se permiten letras, números, espacios y guiones.</span>
                )}
              </div>
            </div>

            {/* ASIGNACIÓN DE CARGOS */}
            <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Asignación de Cargos Principales</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {CARGOS_DIRECTIVA.map((cargo, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', alignItems: 'center', gap: '1rem' }}>
                      <label style={{ color: 'var(--yellow)', fontWeight: 'bold', fontSize: '0.9rem' }}>{cargo.nombre}</label>
                      <div style={{ flex: 1 }}>
                        <PersonaAutocompleteInput
                          onChange={(item) => handleCargoChange(cargo.id, item.id_persona)}
                          placeholder="Buscar por Cédula o Apellido..."
                        />
                      </div>
                    </div>
                    {cargosSeleccionados[cargo.id] && (
                      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', alignItems: 'center', gap: '1rem' }}>
                        <label className="input-label" style={{ textAlign: 'right', fontSize: '0.8rem' }}>Asignar Contraseña:</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Contraseña temporal (ej. chibuleo2024)"
                          value={cargosPasswords[cargo.id] || ''}
                          onChange={(e) => handlePasswordChange(cargo.id, e.target.value)}
                          style={{ maxWidth: '300px', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1.5rem' }}>
                * Al guardar, los miembros de la directiva actual pasarán al estado "Finalizado" automáticamente.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ width: 'auto', background: 'var(--yellow)', color: '#000' }} disabled={isSubmitting}>
                {isSubmitting ? 'Registrando Directiva...' : <><Save size={18}/> Guardar Nueva Directiva</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONTENIDO PESTAÑA: HISTORIAL */}
      {activeTab === 'historial' && (
        <div className="table-container glass-card animate-fade-in">
          <table className="data-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Presidente a Cargo</th>
                <th>Resolución</th>
                <th style={{ textAlign: 'center' }}>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historialPeriodos.map((hist, idx) => {
                const esActivo = periodoActivo === hist.periodo;
                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>
                      {hist.periodo}
                      {esActivo && <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '0.1rem 0.4rem', borderRadius: '1rem' }}>En uso</span>}
                    </td>
                    <td>{hist.presidente}</td>
                    <td><code style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{hist.resolucion || 'RES-HIST-001'}</code></td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-user">{hist.estado}</span>
                    </td>
                    <td style={{ textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => navigate(`/dashboard/directiva?periodo=${hist.periodo}`)}
                        style={{ padding: '0.4rem 0.8rem', width: 'auto', fontSize: '0.78rem' }}
                      >
                        Ver Organigrama
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => handleActivarPeriodo(hist)}
                        disabled={periodoActivando === hist.periodo || esActivo}
                        style={{ padding: '0.4rem 0.8rem', width: 'auto', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', borderColor: esActivo ? '#10b981' : 'var(--yellow)', color: esActivo ? '#10b981' : 'var(--yellow)' }}
                      >
                        <RefreshCw size={13} /> {esActivo ? 'Activa' : 'Usar para Docs'}
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => setModalReactivar(hist)}
                        style={{ padding: '0.4rem 0.8rem', width: 'auto', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', borderColor: '#a78bfa', color: '#a78bfa' }}
                        title="Reactivar esta directiva como la oficial actual"
                      >
                        <RotateCcw size={13} /> Reactivar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTENIDO PESTAÑA: CAMBIAR MIEMBRO */}
      {activeTab === 'cambiar' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <h3 className="text-primary" style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Cambiar Miembro de la Directiva Actual
          </h3>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Reemplaza a un miembro activo en su cargo. El saliente queda como Finalizado desde hoy y el entrante hereda la fecha fin del periodo. La reelección está permitida.
          </p>

          {miembrosActivos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No hay directiva activa registrada.
            </div>
          ) : (
            <form onSubmit={handleCambiarMiembro} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Tabla miembros actuales */}
              <div>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Miembros actuales del periodo</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {miembrosActivos.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--yellow)', fontWeight: 600, minWidth: '160px' }}>{m.cargo}</span>
                      <span style={{ color: 'var(--text-main)' }}>{m.nombre}</span>
                      <span className="text-muted" style={{ fontSize: '0.78rem' }}>{m.cedula}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cargo a modificar */}
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={14} className="text-yellow" /> Cargo a reemplazar *
                </label>
                <select
                  className="form-select"
                  required
                  value={cambioData.id_cargo_directivo}
                  onChange={e => setCambioData({ ...cambioData, id_cargo_directivo: e.target.value, id_persona_nueva: null })}
                  onBlur={() => setTouched(t => ({ ...t, cargo: true }))}
                >
                  <option value="">-- Seleccione el cargo --</option>
                  {miembrosActivos.map(m => (
                    <option key={m.id_cargo_directivo} value={m.id_cargo_directivo}>
                      {m.cargo} — {m.nombre}
                    </option>
                  ))}
                </select>
                {touched.cargo && !cambioData.id_cargo_directivo && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Debe seleccionar un cargo.</span>
                )}
              </div>

              {/* Nueva persona */}
              {cambioData.id_cargo_directivo && (
                <>
                  <div className="input-group">
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserPlus size={14} className="text-blue" /> Nueva persona para el cargo *
                    </label>
                    <PersonaAutocompleteInput
                      key={cambioData.id_cargo_directivo}
                      onChange={item => setCambioData({ ...cambioData, id_persona_nueva: item.id_persona })}
                      placeholder="Buscar por Cédula o Apellido..."
                    />
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>La reelección está permitida — puede ser la misma persona u otra.</span>
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={14} className="text-muted" /> Contraseña temporal para el nuevo miembro
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="chibuleo2024 (por defecto si se deja vacío)"
                      value={cambioData.password}
                      onChange={e => setCambioData({ ...cambioData, password: e.target.value })}
                      style={{ maxWidth: '320px' }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={guardandoCambio || !cambioData.id_cargo_directivo || !cambioData.id_persona_nueva}
                  style={{ width: 'auto', background: '#0ea5e9' }}
                >
                  {guardandoCambio ? 'Guardando cambio...' : <><Save size={18} /> Confirmar Cambio de Miembro</>}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* MODAL REACTIVAR DIRECTIVA */}
      {modalReactivar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={20} /> Reactivar Directiva
              </h3>
              <button onClick={() => setModalReactivar(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '0.1rem' }} />
              <div style={{ fontSize: '0.9rem', color: '#f59e0b' }}>
                <strong>Esta acción finalizará la directiva actual</strong> y reactivará la del período <strong>{modalReactivar.periodo}</strong> como la directiva oficial del sistema.
                <br /><br />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Los miembros de la directiva actual quedarán con estado "Finalizado" y los del período {modalReactivar.periodo} volverán a estar "Activos" con sus roles correspondientes.
                </span>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="text-muted">Período a reactivar:</span>
                <strong style={{ color: '#a78bfa' }}>{modalReactivar.periodo}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Presidente:</span>
                <strong>{modalReactivar.presidente}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ width: 'auto' }} onClick={() => setModalReactivar(null)} disabled={reactivando}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                style={{ width: 'auto', background: '#a78bfa', color: '#fff' }}
                disabled={reactivando}
                onClick={handleConfirmarReactivar}
              >
                {reactivando ? 'Reactivando...' : <><RotateCcw size={16} /> Confirmar Reactivación</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
