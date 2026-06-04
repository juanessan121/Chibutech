import React, { useState, useEffect } from 'react';
import { MapPin, Save, ArrowLeft, X, Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import CoordinateCapture from '../components/CoordinateCapture';
import { getTerrenoById, updateTerreno } from '../services/terrenoService';

export default function TerrenosEdicion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
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
      } catch (error) {
        toast.error('Error al cargar datos del terreno');
        navigate('/dashboard/catastro');
      } finally {
        setLoading(false);
      }
    };
    fetchTerreno();
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        area_total: parseFloat(data.area_total),
        id_estado_construccion: parseInt(data.id_estado_construccion),
        latitud: parseFloat(data.latitud) || null,
        longitud: parseFloat(data.longitud) || null
      };

      await updateTerreno(id, payload);
      toast.success('Predio actualizado con éxito');
      setTimeout(() => navigate(`/dashboard/catastro/detalles/${id}`), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar el predio');
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
          <p className="text-muted">Modifique los datos técnicos del terreno. Para cambiar de dueño utilice "Traspaso de Dominio".</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className="alert-warning" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--yellow)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
            El Dueño Titular y la Clave Catastral están bloqueados por seguridad legal. Los cambios realizados aquí quedarán registrados en el historial de auditoría.
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

          <h3 className="text-primary" style={{ fontSize: '1.15rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            Datos Técnicos a Modificar
          </h3>

          <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="input-group">
              <label className="input-label">Área Real (m²) *</label>
              <input 
                type="number" 
                step="0.01"
                className="input-field" 
                placeholder="0.00" 
                {...register('area_total', { required: "Requerido", min: 0.01 })} 
              />
              {errors.area_total && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Requerido</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Estado de Construcción *</label>
              <select 
                className="form-select" 
                {...register('id_estado_construccion', { required: "Requerido" })}
              >
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(`/dashboard/catastro/detalles/${id}`)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '0.75rem 2rem' }}>
              {isSubmitting ? 'Guardando...' : <><Save size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Guardar Correcciones</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
