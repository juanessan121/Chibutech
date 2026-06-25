import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, ArrowLeft, Save, MapPin, DollarSign, Clock, Users, FileText, Tag, Navigation } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { getAllSectores } from '../services/catalogoService';
import { programarMinga } from '../services/mingaService';
import { allowTextWithPunctuation } from '../utils/validators';

function StepBadge({ n, activo }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.65rem',
      fontWeight: 700, flexShrink: 0,
      background: activo ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
      color: activo ? '#fff' : '#64748b',
      transition: 'background 0.3s, color 0.3s',
    }}>{n}</span>
  );
}

const estiloProgresivo = (activo) => ({
  opacity: activo ? 1 : 0.38,
  pointerEvents: activo ? 'auto' : 'none',
  transition: 'opacity 0.35s ease',
});

const hintTexto = {
  fontSize: '0.7rem', color: '#475569', fontWeight: 400, marginLeft: '0.25rem',
};

// Catálogo local de tipos de evento (refleja Catalogo_Tipo_Evento de la BD)
const TIPOS_EVENTO = [
  { id: 1, nombre: 'Minga Comunitaria' },
  { id: 2, nombre: 'Asamblea General' },
  { id: 3, nombre: 'Sesión de Directiva' },
  { id: 4, nombre: 'Inspección de Campo' },
];

export default function MingasProgramar() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onBlur' });

  // Progresividad: cada campo se habilita cuando el anterior tiene valor
  const watchFecha  = watch('fecha_hora_programada');
  const watchLugar  = watch('lugar_encuentro');
  const watchMotivo = watch('motivo_minga');
  const watchValor  = watch('valor_multa_inasistencia');

  const paso3 = !!watchFecha;                              // Lugar ← después de fecha
  const paso4 = !!watchLugar?.trim();                      // Motivo ← después de lugar
  const paso5 = !!watchMotivo?.trim();                     // Valor multa ← después de motivo
  const paso6 = !!watchValor && Number(watchValor) > 0;    // Obs + Sectores ← después de valor
  
  const { fields: asignacionesFields, replace } = useFieldArray({
    control,
    name: "asignaciones"
  });

  const [sectores, setSectores] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState('todas');
  const [filtroZona, setFiltroZona] = useState('');

  useEffect(() => {
    // Cargar catálogos dinámicos
    Promise.all([
      getAllSectores()
    ]).then(([s]) => {
      setSectores(s);
      // Inicializar las asignaciones con todos los sectores desmarcados por defecto
      // Usamos replace en lugar de append para evitar duplicaciones en el StrictMode de React
      replace(s.map(sector => ({
        id_sector: sector.id_sector,
        nombre_sector: sector.nombre_sector,
        id_zona: sector.id_zona,
        nombre_zona: sector.nombre_zona,
        seleccionado: false
      })));
    });
  }, [replace]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Filtrar solo las zonas que fueron seleccionadas o enviar todas si el modo es 'todas'
      let zonasSeleccionadas = [];
      if (modoSeleccion === 'todas') {
        zonasSeleccionadas = data.asignaciones;
      } else {
        zonasSeleccionadas = data.asignaciones.filter(a => a.seleccionado);
      }

      if (zonasSeleccionadas.length === 0) {
        toast.error('Debe seleccionar al menos un sector o zona para la convocatoria.');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        id_tipo_evento: data.id_tipo_evento,
        fecha_hora_programada: data.fecha_hora_programada,
        lugar_encuentro: data.lugar_encuentro,
        motivo_minga: data.motivo_minga,
        valor_multa_inasistencia: data.valor_multa_inasistencia,
        observacion_estado: data.observacion_estado,
        asignaciones: zonasSeleccionadas.map(a => ({
          id_sector: a.id_sector
        }))
      };

      await programarMinga(payload);
      toast.success('¡Convocatoria de Minga creada exitosamente!');
      setTimeout(() => navigate('/dashboard/mingas'), 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'No se pudo crear la convocatoria. Verifica los datos e intenta de nuevo.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      
      
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/mingas')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CalendarPlus className="text-blue" /> Programar Convocatoria a Minga
          </h1>
          <p className="text-muted">Define la fecha, motivo y convoca a los sectores correspondientes (Reglas V6).</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Detalles de la Jornada
          </h3>

          {/* Paso 1+2 — Tipo de Evento y Fecha (ambos activos desde el inicio) */}
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StepBadge n={1} activo /> <Tag size={14} className="text-purple" /> Tipo de Evento *
              </label>
              <select className="form-select" {...register('id_tipo_evento', { required: true })}>
                {TIPOS_EVENTO.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StepBadge n={2} activo /> <Clock size={16} className="text-blue" /> Fecha y Hora Programada *
              </label>
              <input
                type="datetime-local"
                min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                className={`input-field ${errors.fecha_hora_programada ? 'error' : ''}`}
                {...register("fecha_hora_programada", { required: "La fecha es obligatoria" })}
              />
              {errors.fecha_hora_programada && <span className="text-red" style={{fontSize:'0.75rem'}}>{errors.fecha_hora_programada.message}</span>}
            </div>
          </div>

          {/* Paso 3 — Lugar (habilita cuando hay fecha) */}
          <div className="form-grid full" style={estiloProgresivo(paso3)}>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StepBadge n={3} activo={paso3} /> <MapPin size={16} className="text-earth" /> Lugar de Encuentro *
                {!paso3 && <span style={hintTexto}>← ingresa la fecha primero</span>}
              </label>
              <input
                type="text"
                className={`input-field ${errors.lugar_encuentro ? 'error' : ''}`}
                placeholder="Ej. Sede Central de la Junta"
                onInput={(e) => e.target.value = allowTextWithPunctuation(e.target.value)}
                {...register("lugar_encuentro", { required: "El lugar es obligatorio" })}
              />
            </div>
          </div>

          {/* Paso 4 — Motivo (habilita cuando hay lugar) */}
          <div className="form-grid full" style={estiloProgresivo(paso4)}>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StepBadge n={4} activo={paso4} /> Motivo o Trabajo a Realizar *
                {paso3 && !paso4 && <span style={hintTexto}>← ingresa el lugar primero</span>}
              </label>
              <textarea
                className={`input-field ${errors.motivo_minga ? 'error' : ''}`}
                style={{ minHeight: '80px', resize: 'vertical' }}
                placeholder="Ej. Limpieza de las acequias principales..."
                onInput={(e) => e.target.value = allowTextWithPunctuation(e.target.value)}
                {...register("motivo_minga", { required: "Debe especificar un motivo" })}
              />
            </div>
          </div>

          {/* Paso 5+6 — Valor Multa y Observación (habilita cuando hay motivo) */}
          <div className="form-grid" style={estiloProgresivo(paso5)}>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StepBadge n={5} activo={paso5} /> <DollarSign size={16} className="text-green" /> Valor Multa Inasistencia ($) *
                {paso4 && !paso5 && <span style={hintTexto}>← ingresa el motivo primero</span>}
              </label>
              <input
                type="number"
                step="0.01"
                className={`input-field ${errors.valor_multa_inasistencia ? 'error' : ''}`}
                placeholder="Ej. 10.00"
                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                {...register("valor_multa_inasistencia", { required: "Ingrese el valor de la multa", min: 0 })}
              />
            </div>
            <div className="input-group" style={estiloProgresivo(paso6)}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StepBadge n={6} activo={paso6} /> <FileText size={16} className="text-muted" /> Observación Inicial (Opcional)
                {paso5 && !paso6 && <span style={hintTexto}>← ingresa el valor de multa primero</span>}
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. Llevar palas y picos..."
                onInput={(e) => e.target.value = allowTextWithPunctuation(e.target.value)}
                {...register("observacion_estado")}
              />
            </div>
          </div>

          {/* Paso 7 — Sectores (habilita cuando hay valor de multa) */}
          <div className="form-grid full" style={{ marginTop: '1rem', ...estiloProgresivo(paso6) }}>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StepBadge n={7} activo={paso6} /> <Users size={16} className="text-purple" /> Sectores Asignados
                {paso5 && !paso6 && <span style={hintTexto}>← ingresa el valor de multa primero</span>}
              </label>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <select 
                  className="form-select" 
                  value={modoSeleccion} 
                  onChange={(e) => setModoSeleccion(e.target.value)}
                  style={{ width: '200px' }}
                >
                  <option value="todas">Todos los sectores</option>
                  <option value="escoger">Escoger sectores</option>
                </select>

                {modoSeleccion === 'escoger' && (
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Buscar por zona o sector..." 
                    value={filtroZona}
                    onChange={(e) => setFiltroZona(e.target.value)}
                    style={{ flex: 1 }}
                  />
                )}
              </div>

              {modoSeleccion === 'escoger' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  {asignacionesFields
                    .map((item, idx) => ({ ...item, originalIndex: idx }))
                    .filter(item => item.nombre_zona.toLowerCase().includes(filtroZona.toLowerCase()) || item.nombre_sector.toLowerCase().includes(filtroZona.toLowerCase()))
                    .map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'var(--text-main)', fontWeight: '600', width: '100%' }}>
                        <input type="checkbox" {...register(`asignaciones.${item.originalIndex}.seleccionado`)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                        <input type="hidden" {...register(`asignaciones.${item.originalIndex}.id_sector`)} />
                        <div>
                          <div style={{ fontSize: '0.95rem' }}>{item.nombre_sector}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{item.nombre_zona}</div>
                        </div>
                      </label>
                    </div>
                  ))}
                  {asignacionesFields.filter(item => item.nombre_zona.toLowerCase().includes(filtroZona.toLowerCase()) || item.nombre_sector.toLowerCase().includes(filtroZona.toLowerCase())).length === 0 && (
                    <p style={{ color: 'var(--text-muted)', margin: 0, gridColumn: '1 / -1', textAlign: 'center' }}>No se encontraron sectores que coincidan con la búsqueda.</p>
                  )}
                </div>
              ) : (
                <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--green)', borderRadius: '0.5rem', border: '1px solid var(--green)' }}>
                  <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                    <Users size={18} /> Se convocará a todos los sectores registrados en el sistema.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando Convocatoria...' : <><Save size={18}/> Crear Convocatoria a Minga</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
