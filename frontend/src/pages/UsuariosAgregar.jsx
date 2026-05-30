import React, { useState, useEffect } from 'react';
import { addUser } from '../services/userService';
import { getZonas, getSectoresByZona, getCondicionesEspeciales, getTiposContacto, getGeneros } from '../services/catalogoService';
import { UserPlus, ArrowLeft, PhoneCall, Users as UsersIcon, Plus, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import CardSlider from '../components/CardSlider';
import AutocompleteInput from '../components/AutocompleteInput';

// Componente separado para optimizar los re-renders en el FieldArray (Principio SOLID / React Perf)
const HijoFields = ({ control, index, register, generos }) => {
  const depNivel = useWatch({
    control,
    name: `dependientes.${index}.nivel_educativo`,
    defaultValue: '1'
  });

  const showDepSuperior = parseInt(depNivel) >= 3;

  const { fields: carrerasFields, append: appendCarrera, remove: removeCarrera } = useFieldArray({
    control,
    name: `dependientes.${index}.carreras`
  });

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '0.9rem' }}>Hijo #{index + 1}</h5>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Nombres</label>
          <input type="text" className="input-field" placeholder="Nombres" {...register(`dependientes.${index}.nombres`, { required: true })} />
        </div>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Apellidos</label>
          <input type="text" className="input-field" placeholder="Apellidos" {...register(`dependientes.${index}.apellidos`, { required: true })} />
        </div>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Cédula</label>
          <input type="text" className="input-field" placeholder="Cédula" {...register(`dependientes.${index}.cedula`)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Género</label>
          <select className="form-select" {...register(`dependientes.${index}.id_genero`)}>
            {generos.map(g => (
              <option key={`dep-${index}-g-${g.id_genero}`} value={g.id_genero}>{g.nombre_genero}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Nivel Máximo de Estudios</label>
          <select className="form-select" {...register(`dependientes.${index}.nivel_educativo`)}>
            <option value="1">Primaria</option>
            <option value="2">Secundaria</option>
            <option value="3">Tercer Nivel (Licenciatura/Ingeniería)</option>
            <option value="4">Cuarto Nivel (Maestría/Posgrado)</option>
            <option value="5">Quinto Nivel (Doctorado)</option>
            <option value="6">Pos Doctorado</option>
          </select>
        </div>
      </div>

      {showDepSuperior && (
        <div className="animate-fade-in" style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px dashed var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label className="input-label" style={{ margin: 0, fontSize: '0.75rem' }}>Títulos de Educación Superior</label>
            <button type="button" className="btn-secondary hover-scale" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => appendCarrera({ nombre: '' })}>
              <Plus size={14} /> Añadir Otro Título
            </button>
          </div>
          {carrerasFields.map((field, cIndex) => (
            <div key={field.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Controller
                control={control}
                name={`dependientes.${index}.carreras.${cIndex}.nombre`}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <AutocompleteInput 
                    placeholder="Buscar título..." 
                    value={value} 
                    onChange={onChange} 
                  />
                )}
              />
              {carrerasFields.length > 1 && (
                <button type="button" className="btn-icon text-red" onClick={() => removeCarrera(cIndex)}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          {carrerasFields.length === 0 && (
            <button type="button" className="btn-secondary" style={{ width: '100%' }} onClick={() => appendCarrera({ nombre: '' })}>
              <Plus size={14} /> Registrar Primer Título
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function UsuariosAgregar() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Estados para catálogos dinámicos
  const [zonas, setZonas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [tiposContacto, setTiposContacto] = useState([]);
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    Promise.all([
      getZonas().catch(() => [{ id_zona: 1, nombre_zona: 'Centro' }, { id_zona: 2, nombre_zona: 'San Luis' }]),
      getCondicionesEspeciales().catch(() => [{ id_condicion: 1, nombre_condicion: 'Ninguna' }]),
      getTiposContacto().catch(() => [{ id_tipo_contacto: 1, nombre_tipo: 'Celular' }, { id_tipo_contacto: 2, nombre_tipo: 'Correo Electrónico' }]),
      getGeneros().catch(() => [{ id_genero: 1, nombre_genero: 'Masculino' }, { id_genero: 2, nombre_genero: 'Femenino' }]),
    ]).then(([z, c, tc, g]) => {
      setZonas(z);
      setCondiciones(c);
      setTiposContacto(tc);
      setGeneros(g);
    });
  }, []);

  const { register, control, handleSubmit, trigger, watch, formState: { errors } } = useForm({
    defaultValues: {
      contactos: [{ id_tipo_contacto: '1', valor_contacto: '', operadora_o_detalle: '', referencia_propietario: '' }],
      dependientes: [],
      nivel_educativo_principal: '1',
      carreras_principal: [{ nombre: '' }],
      numero_hijos: 0
    }
  });

  const selectedZona = watch('id_zona');

  useEffect(() => {
    if (selectedZona) {
      getSectoresByZona(selectedZona).then(setSectores).catch(() => setSectores([]));
    } else {
      setSectores([]);
    }
  }, [selectedZona]);

  const nivelEducativo = watch('nivel_educativo_principal');
  const showTitularSuperior = parseInt(nivelEducativo) >= 3;

  const numeroHijos = watch('numero_hijos') || 0;

  const { fields: contactosFields } = useFieldArray({ control, name: "contactos" });
  const { fields: dependientesFields, append: appendDependiente, remove: removeDependiente } = useFieldArray({ control, name: "dependientes" });
  const { fields: titularCarrerasFields, append: appendTitularCarrera, remove: removeTitularCarrera } = useFieldArray({ control, name: "carreras_principal" });

  useEffect(() => {
    const num = parseInt(numeroHijos) || 0;
    const currentCount = dependientesFields.length;
    
    // Generación dinámica de casilleros basada en la cantidad ingresada
    if (num > currentCount) {
      for (let i = currentCount; i < num; i++) {
        appendDependiente({ nombres: '', apellidos: '', cedula: '', id_genero: '1', nivel_educativo: '1', carrera: '', masterado: '' });
      }
    } else if (num < currentCount) {
      for (let i = currentCount - 1; i >= num; i--) {
        removeDependiente(i);
      }
    }
  }, [numeroHijos, appendDependiente, removeDependiente, dependientesFields.length]);

  const STEPS = [
    { label: 'Datos Usuario' },
    { label: 'Contacto' },
    { label: 'Registro Hijos' }
  ];

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) isValid = await trigger(['cedula', 'nombres', 'apellidos']);
    if (currentStep === 2) isValid = await trigger(['contactos']);
    if (currentStep === 3) isValid = true;
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmitForm = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    handleSubmit(async (data) => {
      setIsSubmitting(true);
      try {
        // Asignación automática de credenciales basadas en la cédula (oculto al usuario)
        data.username = data.cedula;
        data.password = data.cedula;
        data.id_rol = 1; // 1 = Usuario regular por defecto
        
        console.log("Datos listos para la API (Módulo Refactorizado con CardSlider):", data);
        await addUser(data);
        toast.success('¡Registro exitoso! Perfil completo guardado.');
        setTimeout(() => navigate('/dashboard/usuarios/padron'), 2000);
      } catch (error) {
        toast.error(error.message || 'Error al guardar el usuario');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toaster richColors />

      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/usuarios')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserPlus className="text-green" /> Alta de Nuevo Usuario
          </h1>
          <p className="text-muted">Asistente avanzado en una sola vista con tarjetas deslizables.</p>
        </div>
      </div>

      <CardSlider 
        steps={STEPS} 
        currentStep={currentStep} 
        onNext={handleNext} 
        onPrev={handlePrev} 
        onSubmit={onSubmitForm}
        isSubmitting={isSubmitting}
      >
        {/* TARJETA 1: DATOS USUARIO */}
        <div className="glass-card step-content" style={{ padding: '2.5rem' }}>
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Datos Personales y Biológicos</h3>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Cédula del Titular *</label>
              <input type="text" className={`input-field ${errors.cedula ? 'error' : ''}`} placeholder="10 dígitos" {...register("cedula", { required: "Este campo es obligatorio", minLength: { value: 10, message: "Debe tener 10 dígitos" } })} />
              {errors.cedula && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.cedula.message}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Fecha de Nacimiento</label>
              <input type="date" className="input-field" {...register("fecha_nacimiento")} />
            </div>
            <div className="input-group">
              <label className="input-label">Nombres Completos *</label>
              <input type="text" className={`input-field ${errors.nombres ? 'error' : ''}`} placeholder="Ej. Juan Carlos" {...register("nombres", { required: "Este campo es obligatorio" })} />
              {errors.nombres && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.nombres.message}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Apellidos Completos *</label>
              <input type="text" className={`input-field ${errors.apellidos ? 'error' : ''}`} placeholder="Ej. Pérez López" {...register("apellidos", { required: "Este campo es obligatorio" })} />
              {errors.apellidos && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.apellidos.message}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Zona</label>
              <select className="form-select" {...register("id_zona")}>
                <option value="">Seleccione una Zona...</option>
                {zonas.map(z => (
                  <option key={z.id_zona} value={z.id_zona}>{z.nombre_zona}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Sector</label>
              <select className="form-select" {...register("id_sector")} disabled={!selectedZona}>
                <option value="">Seleccione un Sector...</option>
                {sectores.map(s => (
                  <option key={s.id_sector} value={s.id_sector}>{s.nombre_sector}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Condición Especial</label>
              <select className="form-select" {...register("id_condicion_especial")}>
                {condiciones.map(c => (
                  <option key={c.id_condicion} value={c.id_condicion}>{c.nombre_condicion}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: '1.5rem' }}>
            <div className="input-group">
              <label className="input-label">Nivel Académico</label>
              <select className="form-select" {...register("nivel_educativo_principal")}>
                <option value="1">Primaria</option>
                <option value="2">Secundaria</option>
                <option value="3">Tercer Nivel (Licenciatura/Ingeniería)</option>
                <option value="4">Cuarto Nivel (Maestría/Posgrado)</option>
                <option value="5">Quinto Nivel (Doctorado)</option>
                <option value="6">Pos Doctorado</option>
              </select>
            </div>
            
            {showTitularSuperior && (
              <div className="animate-fade-in" style={{ gridColumn: '1 / -1', marginTop: '1rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px dashed var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="input-label" style={{ margin: 0 }}>Títulos de Educación Superior</label>
                  <button type="button" className="btn-secondary hover-scale" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={() => appendTitularCarrera({ nombre: '' })}>
                    <Plus size={16} /> Añadir Otro Título
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {titularCarrerasFields.map((field, index) => (
                    <div key={field.id} style={{ display: 'flex', gap: '0.75rem' }}>
                      <Controller
                        control={control}
                        name={`carreras_principal.${index}.nombre`}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <AutocompleteInput 
                            placeholder="Buscar título..." 
                            value={value} 
                            onChange={onChange} 
                          />
                        )}
                      />
                      {titularCarrerasFields.length > 1 && (
                        <button type="button" className="btn-icon text-red" onClick={() => removeTitularCarrera(index)}>
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  {titularCarrerasFields.length === 0 && (
                    <button type="button" className="btn-secondary" style={{ width: '100%' }} onClick={() => appendTitularCarrera({ nombre: '' })}>
                      <Plus size={16} /> Registrar Primer Título
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TARJETA 2: CONTACTO */}
        <div className="glass-card step-content" style={{ padding: '2.5rem' }}>
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PhoneCall size={20} className="text-green" /> Información de Contacto
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {contactosFields.map((item, index) => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.7rem' }}>Número de Teléfono *</label>
                    <input type="text" className={`input-field ${errors.contactos?.[index]?.valor_contacto ? 'error' : ''}`} placeholder="099..." {...register(`contactos.${index}.valor_contacto`, { required: "Debe ingresar un número de teléfono" })} />
                    {errors.contactos?.[index]?.valor_contacto && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.contactos[index].valor_contacto.message}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.7rem' }}>Operadora / Detalle</label>
                    <input type="text" className="input-field" placeholder="Claro, Movistar..." {...register(`contactos.${index}.operadora_o_detalle`)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.7rem' }}>Pertenencia (A quién pertenece)</label>
                    <input type="text" className="input-field" placeholder="Ej: Esposa, Propio..." {...register(`contactos.${index}.referencia_propietario`)} />
                  </div>
                </div>
                <div className="input-group" style={{ marginTop: '0.75rem' }}>
                  <label className="input-label" style={{ fontSize: '0.7rem' }}>
                    Correo Electrónico <span className="text-muted" style={{ fontWeight: 'normal', fontStyle: 'italic' }}>(Opcional)</span>
                  </label>
                  <input type="email" className="input-field" placeholder="correo@ejemplo.com" {...register(`correo_opcional`)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TARJETA 3: REGISTRO DE HIJOS */}
        <div className="glass-card step-content" style={{ padding: '2.5rem' }}>
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UsersIcon size={20} className="text-blue" /> Registro de Hijos
          </h3>
          
          <div className="input-group" style={{ marginBottom: '2rem', maxWidth: '200px' }}>
            <label className="input-label">¿Cuántos hijos tiene?</label>
            <input 
              type="number" 
              min="0" 
              max="15" 
              className="input-field" 
              placeholder="0" 
              {...register("numero_hijos")} 
            />
          </div>

          {dependientesFields.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>No se registrarán hijos.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {dependientesFields.map((item, index) => (
                <HijoFields 
                  key={item.id}
                  control={control}
                  index={index}
                  register={register}
                  generos={generos}
                />
              ))}
            </div>
          )}
        </div>
      </CardSlider>
    </div>
  );
}
