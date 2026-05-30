import React, { useState } from 'react';
import { MapPin, Save, ArrowLeft, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import CoordinateCapture from '../components/CoordinateCapture';
import PersonaAutocompleteInput from '../components/PersonaAutocompleteInput';
import useAuthStore from '../store/useAuthStore';
import api from '../services/axiosConfig';

export default function TerrenosRegistro() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      dueno: null,
      terrenos: [
        { clave_catastral: '', area: '', estado_terreno: '', latitud: '', longitud: '' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "terrenos" });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAuthStore(state => state.user);
  const isComunero = !user || user?.id_rol === 1;
  const backRoute = isComunero ? '/dashboard/mis-terrenos' : '/dashboard/catastro';
  const backText = isComunero ? 'Volver a Mis Terrenos' : 'Volver a Catastro';

  const onSubmit = async (data) => {
    if (!data.dueno || !data.dueno.id_persona) {
      toast.error('Debe seleccionar un dueño válido (Comunero) antes de guardar.');
      return;
    }
    
    if (data.terrenos.length === 0) {
      toast.error('Debe agregar al menos un terreno.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id_persona: data.dueno.id_persona,
        terrenos: data.terrenos
      };

      const res = await api.post('/terrenos', payload);
      if (res.data.status === 'success') {
        toast.success(res.data.message || '¡Terrenos registrados con éxito!');
        setTimeout(() => navigate(backRoute), 1500);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error de conexión al guardar los terrenos';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate(backRoute)} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> {backText}
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin className="text-earth" /> Registro Múltiple de Terrenos
          </h1>
          <p className="text-muted">Asigne predios directamente a un comunero.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* SECCIÓN DUEÑO */}
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            1. Asignación de Titular (Dueño)
          </h3>
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Buscar Comunero (Cédula o Apellido) *</label>
            <Controller
              name="dueno"
              control={control}
              rules={{ required: "Debe seleccionar un dueño" }}
              render={({ field }) => (
                <PersonaAutocompleteInput 
                  value={field.value} 
                  onChange={field.onChange} 
                  placeholder="Ej. 180... o Pacari..." 
                />
              )}
            />
            {errors.dueno && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.dueno.message}</span>}
          </div>

          {/* SECCIÓN TERRENOS MÚLTIPLES */}
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            2. Lista de Terrenos
          </h3>

          {fields.map((item, index) => (
            <div key={item.id} className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: '#f8fafc', margin: 0 }}>Terreno #{index + 1}</h4>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', color: '#ef4444' }}>
                    <Trash2 size={16} /> Eliminar
                  </button>
                )}
              </div>

              <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="input-group">
                  <label className="input-label">Clave Catastral *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ej. 1801..." 
                    {...register(`terrenos.${index}.clave_catastral`, { required: "Requerido" })} 
                  />
                  {errors.terrenos?.[index]?.clave_catastral && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Requerido</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Área (m²) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="input-field" 
                    placeholder="0.00" 
                    {...register(`terrenos.${index}.area`, { required: "Requerido", min: 0.01 })} 
                  />
                  {errors.terrenos?.[index]?.area && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Valor inválido</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Estado *</label>
                  <select 
                    className="form-select" 
                    {...register(`terrenos.${index}.estado_terreno`, { required: "Requerido" })}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Sembrio">Sembrío</option>
                    <option value="Construccion">Construcción</option>
                    <option value="Abandonado">Abandonado</option>
                  </select>
                  {errors.terrenos?.[index]?.estado_terreno && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Requerido</span>}
                </div>
              </div>

              {/* Mapa de este terreno */}
              <CoordinateCapture 
                initialLat={watch(`terrenos.${index}.latitud`)}
                initialLon={watch(`terrenos.${index}.longitud`)}
                onCapture={(coords) => {
                  setValue(`terrenos.${index}.latitud`, coords.lat, { shouldValidate: true });
                  setValue(`terrenos.${index}.longitud`, coords.lon, { shouldValidate: true });
                }}
              />

            </div>
          ))}

          <button 
            type="button" 
            onClick={() => append({ clave_catastral: '', area: '', estado_terreno: '', latitud: '', longitud: '' })}
            className="btn-secondary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '3rem', borderStyle: 'dashed' }}
          >
            <Plus size={18} /> Añadir Otro Terreno al Mismo Dueño
          </button>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              {isSubmitting ? 'Guardando...' : <><Save size={20} /> Finalizar Registro Integral</>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
