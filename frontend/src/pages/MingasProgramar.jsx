import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, ArrowLeft, Save, MapPin, DollarSign, Clock, Users, FileText, Tag, Navigation } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { getZonas, getActividadesMinga } from '../services/catalogoService';
import { programarMinga } from '../services/mingaService';

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
  const { register, control, handleSubmit, formState: { errors } } = useForm();
  
  const { fields: asignacionesFields, append, remove } = useFieldArray({
    control,
    name: "asignaciones"
  });

  const [zonas, setZonas] = useState([]);
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    // Cargar catálogos dinámicos
    Promise.all([
      getZonas().catch(() => [
        { id_zona: 1, nombre_zona: 'Sector Centro' }, 
        { id_zona: 2, nombre_zona: 'San Luis' },
        { id_zona: 3, nombre_zona: 'San Francisco' },
        { id_zona: 4, nombre_zona: 'San Miguel' }
      ]),
      getActividadesMinga().catch(() => [
        { id_actividad_minga: 1, descripcion_actividad: 'Limpieza de Acequias' },
        { id_actividad_minga: 2, descripcion_actividad: 'Excavación de Zanjas' }
      ])
    ]).then(([z, a]) => {
      setZonas(z);
      setActividades(a);
      // Inicializar las asignaciones con todas las zonas desmarcadas por defecto
      if (asignacionesFields.length === 0) {
        z.forEach(zona => {
          append({
            id_zona: zona.id_zona,
            nombre_zona: zona.nombre_zona,
            seleccionado: false,
            id_actividad_minga: '',
            valor_multa_grupo: ''
          });
        });
      }
    });
  }, [append, asignacionesFields.length]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Filtrar solo las zonas que fueron seleccionadas
      const zonasSeleccionadas = data.asignaciones.filter(a => a.seleccionado);
      if (zonasSeleccionadas.length === 0) {
        toast.error('Debe seleccionar al menos una zona para la minga');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        fecha_hora_programada: data.fecha_hora_programada,
        lugar_encuentro: data.lugar_encuentro,
        motivo_minga: data.motivo_minga,
        valor_multa_inasistencia: data.valor_multa_inasistencia,
        observacion_estado: data.observacion_estado,
        asignaciones: zonasSeleccionadas.map(a => ({
          id_zona: a.id_zona,
          id_actividad_minga: a.id_actividad_minga,
          valor_multa_grupo: a.valor_multa_grupo || null
        }))
      };

      await programarMinga(payload);
      toast.success('¡Convocatoria de Minga creada exitosamente!');
      setTimeout(() => navigate('/dashboard/mingas'), 2000);
    } catch (error) {
      toast.error(error.message || 'Error al programar la minga');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toaster richColors />
      
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

          {/* Tipo de Evento — cubre columna id_tipo_evento de tabla Minga */}
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={14} className="text-purple" /> Tipo de Evento *
              </label>
              <select className="form-select" {...register('id_tipo_evento', { required: true })}>
                {TIPOS_EVENTO.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} className="text-blue" /> Fecha y Hora Programada *
              </label>
              <input 
                type="datetime-local" 
                className={`input-field ${errors.fecha_hora_programada ? 'error' : ''}`}
                {...register("fecha_hora_programada", { required: "La fecha es obligatoria" })} 
              />
              {errors.fecha_hora_programada && <span className="text-red" style={{fontSize:'0.75rem'}}>{errors.fecha_hora_programada.message}</span>}
            </div>
          </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} className="text-earth" /> Lugar de Encuentro *
              </label>
              <input 
                type="text" 
                className={`input-field ${errors.lugar_encuentro ? 'error' : ''}`}
                placeholder="Ej. Sede Central de la Junta" 
                {...register("lugar_encuentro", { required: "El lugar es obligatorio" })} 
              />
            </div>
          </div>

          <div className="form-grid full">
            <div className="input-group">
              <label className="input-label">Motivo o Trabajo a Realizar *</label>
              <textarea 
                className={`input-field ${errors.motivo_minga ? 'error' : ''}`}
                style={{ minHeight: '80px', resize: 'vertical' }}
                placeholder="Ej. Limpieza de las acequias principales..." 
                {...register("motivo_minga", { required: "Debe especificar un motivo" })} 
              ></textarea>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={14} className="text-muted" /> Latitud GPS (Opcional)
              </label>
              <input type="number" step="any" className="input-field" placeholder="Ej. -1.3281" {...register('latitud')} />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={14} className="text-muted" /> Longitud GPS (Opcional)
              </label>
              <input type="number" step="any" className="input-field" placeholder="Ej. -78.5528" {...register('longitud')} />
            </div>
          </div>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={16} className="text-green" /> Valor Multa General Inasistencia ($) *
              </label>
              <input 
                type="number" 
                step="0.01"
                className={`input-field ${errors.valor_multa_inasistencia ? 'error' : ''}`}
                placeholder="Ej. 10.00" 
                {...register("valor_multa_inasistencia", { required: "Ingrese el valor de la multa", min: 0 })} 
              />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} className="text-muted" /> Observación Inicial (Opcional)
              </label>
              <input 
                type="text" 
                className="input-field"
                placeholder="Ej. Llevar palas y picos..." 
                {...register("observacion_estado")} 
              />
            </div>
          </div>

          <div className="form-grid full" style={{ marginTop: '1rem' }}>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} className="text-purple" /> Sectores y Actividades Asignadas
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                {asignacionesFields.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'var(--text-main)', fontWeight: '600' }}>
                      <input type="checkbox" {...register(`asignaciones.${idx}.seleccionado`)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                      <input type="hidden" {...register(`asignaciones.${idx}.id_zona`)} />
                      {item.nombre_zona}
                    </label>
                    <div style={{ paddingLeft: '1.75rem' }}>
                      <select className="form-select" {...register(`asignaciones.${idx}.id_actividad_minga`)} style={{ fontSize: '0.8rem', padding: '0.4rem', marginBottom: '0.5rem' }}>
                        <option value="">Seleccione actividad (Requerido)...</option>
                        {actividades.map(act => (
                          <option key={act.id_actividad_minga} value={act.id_actividad_minga}>{act.descripcion_actividad}</option>
                        ))}
                      </select>
                      <input type="number" step="0.01" className="input-field" placeholder="Multa Específica Zona ($) Opcional" {...register(`asignaciones.${idx}.valor_multa_grupo`)} style={{ fontSize: '0.8rem', padding: '0.4rem' }} title="Sobrescribe la multa general si esta zona hace un trabajo más pesado." />
                    </div>
                  </div>
                ))}
              </div>
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
