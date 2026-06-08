import React, { useState } from 'react';
import { MapPin, Save, ArrowLeft, CheckCircle, Plus, Trash2, UserCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import CoordinateCapture from '../components/CoordinateCapture';
import PersonaAutocompleteInput from '../components/PersonaAutocompleteInput';
import useAuthStore from '../store/useAuthStore';
import api from '../services/axiosConfig';

// Utilidad para convertir archivo a base64
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const formatClaveCatastral = (value) => {
  if (!value) return '';
  const v = value.replace(/\D/g, '');
  let res = '';
  if (v.length > 0) res += v.substring(0, 2);
  if (v.length > 2) res += '-' + v.substring(2, 4);
  if (v.length > 4) res += '-' + v.substring(4, 6);
  if (v.length > 6) res += '-' + v.substring(6, 8);
  if (v.length > 8) res += '-' + v.substring(8, 11);
  if (v.length > 11) res += '-' + v.substring(11, 14);
  return res;
};

export default function TerrenosRegistro() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      dueno: null,
      terrenos: [
        { clave_catastral: '', area: '', estado_terreno: '', latitud: '', longitud: '', copropietarios: [] }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "terrenos" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dueno = watch('dueno');

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
      // Convertir archivos de escrituras a base64
      const terrenosProcesados = await Promise.all(data.terrenos.map(async (t) => {
        let archivo_base64 = null;
        if (t.escrituras_file && t.escrituras_file.length > 0) {
          archivo_base64 = await toBase64(t.escrituras_file[0]);
        }
        return {
          ...t,
          archivo_escritura_base64: archivo_base64
        };
      }));

      const payload = {
        id_persona: data.dueno.id_persona,
        terrenos: terrenosProcesados
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
              rules={{ required: "Debe seleccionar un dueño principal" }}
              render={({ field }) => (
                field.value ? (
                  <div className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <UserCheck className="text-blue" size={24} />
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>{field.value.nombre} {field.value.apellido}</h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cédula: {field.value.cedula}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => field.onChange(null)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                      <X size={18} className="text-red" />
                    </button>
                  </div>
                ) : (
                  <PersonaAutocompleteInput 
                    value={field.value} 
                    onChange={field.onChange} 
                    placeholder="Ej. 180... o Pacari..." 
                  />
                )
              )}
            />
            {errors.dueno && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.dueno.message}</span>}
          </div>

          {/* SECCIÓN TERRENOS MÚLTIPLES */}
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            2. Lista de Terrenos
            {!dueno && <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'normal', background: 'rgba(245,158,11,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', border: '1px solid rgba(245,158,11,0.3)' }}>Seleccione primero el titular</span>}
          </h3>

          <div style={{ opacity: dueno ? 1 : 0.4, pointerEvents: dueno ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
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
                  <Controller
                    name={`terrenos.${index}.clave_catastral`}
                    control={control}
                    rules={{ 
                      required: "Requerido",
                      pattern: {
                        value: /^\d{2}-\d{2}-\d{2}-\d{2}-\d{3}-\d{3}$/,
                        message: "Formato inválido"
                      }
                    }}
                    render={({ field }) => (
                      <input 
                        {...field}
                        type="text" 
                        className="input-field" 
                        placeholder="Ej. 18-01-50-01-001-001" 
                        maxLength={19}
                        onChange={(e) => {
                          const formatted = formatClaveCatastral(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    )}
                  />
                  {errors.terrenos?.[index]?.clave_catastral && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.terrenos[index].clave_catastral.message || 'Requerido'}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Área (m²) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="input-field" 
                    placeholder="0.00" 
                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
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
                    <option value="1">Lote Baldío (Sembrío)</option>
                    <option value="2">En Planificación</option>
                    <option value="3">En Construcción</option>
                    <option value="4">Construida</option>
                  </select>
                  {errors.terrenos?.[index]?.estado_terreno && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Requerido</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Escrituras (Respaldo)</label>
                  <input 
                    type="file" 
                    className="input-field" 
                    accept=".pdf,image/*"
                    {...register(`terrenos.${index}.escrituras_file`)} 
                  />
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Opcional. Formatos: PDF, JPG, PNG</span>
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

              {/* SECCIÓN COPROPIETARIOS */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <details>
                  <summary style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', outline: 'none', userSelect: 'none' }}>
                    3. Copropietarios (Opcional) <span style={{fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'normal', marginLeft: '0.5rem'}}>(Clic para desplegar)</span>
                  </summary>
                  <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Puede asignar otros comuneros que comparten derechos sobre este predio.</p>
                
                <Controller
                  name={`terrenos.${index}.copropietarios`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      {field.value && field.value.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                          {field.value.map((copropietario, cIndex) => (
                            <div key={cIndex} className="glass-card" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16,185,129,0.05)' }}>
                              <div>
                                <h6 style={{ margin: 0, fontSize: '0.9rem', color: '#f8fafc' }}>{copropietario.nombre} {copropietario.apellido}</h6>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CC: {copropietario.cedula}</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => {
                                  const newVal = [...field.value];
                                  newVal.splice(cIndex, 1);
                                  field.onChange(newVal);
                                }} 
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="input-group">
                        <PersonaAutocompleteInput 
                          value={null}
                          placeholder="Buscar copropietario..."
                          includeDependents={true}
                          onChange={(personaSel) => {
                            // Evitar agregar al dueño principal o a uno ya agregado
                            const duenoActual = watch('dueno');
                            if (duenoActual?.id_persona === personaSel.id_persona) {
                              toast.error('Esta persona ya es el titular principal.');
                              return;
                            }
                            const actuales = field.value || [];
                            if (actuales.find(p => p.id_persona === personaSel.id_persona)) {
                              toast.error('Este copropietario ya fue agregado.');
                              return;
                            }
                            field.onChange([...actuales, personaSel]);
                          }}
                        />
                      </div>
                      </div>
                    )}
                  />
                  </div>
                </details>
              </div>

            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ clave_catastral: '', area: '', estado_terreno: '', latitud: '', longitud: '', copropietarios: [] })}
            className="btn-secondary"
            style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '3rem', borderStyle: 'dashed' }}
            disabled={!dueno}
          >
            <Plus size={18} /> Añadir Otro Terreno al Mismo Dueño
          </button>
          </div>

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
