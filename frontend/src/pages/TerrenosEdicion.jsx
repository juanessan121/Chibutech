import { useState, useEffect } from 'react';
import { MapPin, Save, ArrowLeft, X, Edit2, UserPlus, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CoordinateCapture from '../components/CoordinateCapture';
import PersonaAutocompleteInput from '../components/PersonaAutocompleteInput';
import { getTerrenoById, updateTerreno } from '../services/terrenoService';

export default function TerrenosEdicion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titularId, setTitularId] = useState(null);

  const [copropietarios, setCopropietarios] = useState([]);
  const [copropietarioInput, setCopropietarioInput] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      clave_catastral: '',
      area_total: '',
      id_estado_construccion: '',
      latitud: '',
      longitud: '',
      propietario: ''
    }
  });

  useEffect(() => {
    const fetchTerreno = async () => {
      try {
        const data = await getTerrenoById(id);
        setValue('clave_catastral', data.clave_catastral);
        setValue('area_total', data.area_m2);
        setValue('id_estado_construccion', data.id_estado_construccion);
        setValue('latitud', data.latitud || '');
        setValue('longitud', data.longitud || '');
        setValue('propietario', `${data.propietario} (C.I: ${data.cedula})`);
        setTitularId(data.id_persona);
        setCopropietarios(
          (data.copropietarios || []).map(c => ({
            id_persona: c.id_persona,
            cedula: c.cedula,
            nombre: c.nombre
          }))
        );
      } catch {
        toast.error('No se pudo cargar la ficha del predio. Vuelve a intentarlo.');
        navigate('/dashboard/catastro');
      } finally {
        setLoading(false);
      }
    };
    fetchTerreno();
  }, [id, setValue, navigate]);

  const handleAddCopropietario = (persona) => {
    if (!persona) return;
    if (persona.id_persona === titularId) {
      toast.error('El titular del predio no puede ser copropietario al mismo tiempo.');
      setCopropietarioInput(null);
      return;
    }
    if (copropietarios.some(c => c.id_persona === persona.id_persona)) {
      toast.error('Esta persona ya está registrada como copropietaria.');
      setCopropietarioInput(null);
      return;
    }
    setCopropietarios(prev => [...prev, {
      id_persona: persona.id_persona,
      cedula: persona.cedula,
      nombre: `${persona.nombre} ${persona.apellido}`.trim()
    }]);
    setCopropietarioInput(null);
  };

  const handleRemoveCopropietario = (id_persona) => {
    setCopropietarios(prev => prev.filter(c => c.id_persona !== id_persona));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        area_total: parseFloat(data.area_total),
        id_estado_construccion: parseInt(data.id_estado_construccion),
        latitud: parseFloat(data.latitud) || null,
        longitud: parseFloat(data.longitud) || null,
        copropietarios: copropietarios.map(c => c.id_persona)
      };

      await updateTerreno(id, payload);
      toast.success('Predio actualizado con éxito');
      setTimeout(() => navigate(`/dashboard/catastro/detalles/${id}`), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudieron guardar los cambios del predio. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#fff' }}>Cargando ficha de edición...</div>;

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate(`/dashboard/catastro/detalles/${id}`)} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver a Ficha del Predio
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Edit2 className="text-primary" /> Corrección Técnica de Predio
          </h1>
          <p className="text-muted">Modifique los datos técnicos y copropietarios del terreno. Para cambiar de dueño titular utilice "Traspaso de Dominio".</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="alert-warning" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--yellow)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
            El Dueño Titular y la Clave Catastral están bloqueados por seguridad legal. Los cambios quedarán registrados en el historial de auditoría.
          </div>

          <div className="form-grid" style={{ marginBottom: '2rem' }}>
            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--text-muted)' }}>Propietario Titular (Bloqueado)</label>
              <input type="text" className="input-field" {...register('propietario')} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--text-muted)' }}>Clave Catastral (Bloqueada)</label>
              <input type="text" className="input-field" {...register('clave_catastral')} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
            </div>
          </div>

          <h3 className="text-primary" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            Datos Técnicos
          </h3>

          <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="input-group">
              <label className="input-label">Área Real (m²) *</label>
              <input
                type="number"
                step="0.01"
                className="input-field"
                placeholder="0.00"
                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                {...register('area_total', { required: true, min: 0.01 })}
              />
              {errors.area_total && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Requerido</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Estado de Construcción *</label>
              <select className="form-select" {...register('id_estado_construccion', { required: true })}>
                <option value="">Seleccione...</option>
                <option value="1">Lote Baldío (Sembrío)</option>
                <option value="2">En Planificación</option>
                <option value="3">En Construcción</option>
                <option value="4">Construida</option>
              </select>
              {errors.id_estado_construccion && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Requerido</span>}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label className="input-label">Coordenadas Georreferenciadas</label>
            <CoordinateCapture
              initialLat={watch('latitud')}
              initialLon={watch('longitud')}
              onCapture={(coords) => {
                setValue('latitud', coords.lat, { shouldValidate: true });
                setValue('longitud', coords.lon, { shouldValidate: true });
              }}
            />
          </div>

          {/* SECCIÓN COPROPIETARIOS */}
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} className="text-primary" /> Copropietarios
          </h3>

          {/* Lista de copropietarios actuales */}
          {copropietarios.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {copropietarios.map(c => (
                <div key={c.id_persona} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>{c.nombre}</span>
                    <span className="text-muted" style={{ fontSize: '0.78rem', marginLeft: '0.75rem' }}>C.I: {c.cedula}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCopropietario(c.id_persona)}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', borderRadius: '0.4rem', padding: '0.3rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                  >
                    <X size={14} /> Quitar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Este predio no tiene copropietarios registrados.
            </p>
          )}

          {/* Agregar nuevo copropietario */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div style={{ flex: 1 }}>
              <PersonaAutocompleteInput
                value={copropietarioInput}
                onChange={handleAddCopropietario}
                placeholder="Buscar persona por cédula o apellido para agregar..."
              />
            </div>
            <div style={{ paddingTop: '0.1rem', color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap', paddingTop: '0.7rem' }}>
              <UserPlus size={16} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
              Selecciona para agregar
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(`/dashboard/catastro/detalles/${id}`)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '0.75rem 2rem' }}>
              {isSubmitting ? 'Guardando...' : <><Save size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Guardar Cambios</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
