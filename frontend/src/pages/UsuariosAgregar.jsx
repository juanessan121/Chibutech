import React, { useState, useEffect } from 'react';
import { addUser, getUserById, updateUser } from '../services/userService';
import { getZonas, getSectoresByZona, getCondicionesEspeciales, getTiposContacto, getGeneros, getOperadoras } from '../services/catalogoService';
import { UserPlus, ArrowLeft, PhoneCall, Users as UsersIcon, Plus, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import CardSlider from '../components/CardSlider';
import AutocompleteInput from '../components/AutocompleteInput';

// Validador de Cédula Ecuatoriana (Módulo 10)
const validarCedulaEcuatoriana = (cedula) => {
  if (typeof cedula !== 'string' || cedula.length !== 10) return false;
  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;
  const tercerDigito = parseInt(cedula.substring(2, 3), 10);
  if (tercerDigito >= 6) return false;
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i], 10) * coeficientes[i];
    if (valor > 9) valor -= 9;
    suma += valor;
  }
  const decenaSuperior = Math.ceil(suma / 10) * 10;
  let digitoVerificador = decenaSuperior - suma;
  if (digitoVerificador === 10) digitoVerificador = 0;
  return digitoVerificador === parseInt(cedula[9], 10);
};

// Componente separado para optimizar los re-renders en el FieldArray (Principio SOLID / React Perf)
const HijoFields = ({ control, index, register, generos, errors }) => {
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
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Nombres *</label>
          <input type="text" className={`input-field ${errors?.dependientes?.[index]?.nombres ? 'error' : ''}`} placeholder="Nombres" onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')} {...register(`dependientes.${index}.nombres`, { required: true })} />
          {errors?.dependientes?.[index]?.nombres && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>Requerido</span>}
        </div>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Apellidos *</label>
          <input type="text" className={`input-field ${errors?.dependientes?.[index]?.apellidos ? 'error' : ''}`} placeholder="Apellidos" onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')} {...register(`dependientes.${index}.apellidos`, { required: true })} />
          {errors?.dependientes?.[index]?.apellidos && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>Requerido</span>}
        </div>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Cédula</label>
          <input type="text" className="input-field" placeholder="10 dígitos" maxLength="10" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} {...register(`dependientes.${index}.cedula`)} />
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
                name={`dependientes.${index}.carreras.${cIndex}.nombre`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <AutocompleteInput 
                    placeholder="Escriba el título (ej. Ingeniero)"
                    value={field.value}
                    onChange={field.onChange}
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
  const { id } = useParams();
  const isEditMode = !!id;

  // Estados para catálogos dinámicos
  const [zonas, setZonas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [tiposContacto, setTiposContacto] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [operadoras, setOperadoras] = useState([]);

  useEffect(() => {
    Promise.all([
      getZonas().catch(() => []),
      getCondicionesEspeciales().catch(() => []),
      getTiposContacto().catch(() => []),
      getGeneros().catch(() => []),
      getOperadoras().catch(() => []),
    ]).then(([z, c, tc, g, o]) => {
      setZonas(z);
      setCondiciones(c);
      setTiposContacto(tc);
      setGeneros(g);
      setOperadoras(o);
    });
  }, []);

  const { register, control, handleSubmit, trigger, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      tiene_condicion: false,
      condiciones: [],
      contactos: [{ id_tipo_contacto: '1', valor_contacto: '', id_operadora: '' }],
      dependientes: [],
      nivel_educativo_principal: '1',
      carreras_principal: [{ nombre: '' }],
      numero_hijos: 0
    }
  });

  useEffect(() => {
    if (isEditMode) {
      getUserById(id).then(data => {
        reset(data);
      }).catch(err => {
        toast.error("Error al cargar los datos del usuario para editar");
      });
    }
  }, [id, reset, isEditMode]);

  const tieneCondicion = watch('tiene_condicion');
  const watchedCondiciones = watch('condiciones') || [];

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
  const { fields: condicionesFields, append: appendCondicion, remove: removeCondicion } = useFieldArray({ control, name: "condiciones" });

  useEffect(() => {
    if (tieneCondicion && condicionesFields.length === 0) {
      appendCondicion({ id_condicion: '', porcentaje: '', codigo: '', observacion: '' });
    }
  }, [tieneCondicion, condicionesFields.length, appendCondicion]);

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
    if (currentStep === 1) {
      // Disparamos la validación de todos los campos visibles en la tarjeta 1
      const fields = ['cedula', 'fecha_nacimiento', 'nombres', 'apellidos', 'id_genero', 'id_zona', 'id_sector', 'nivel_educativo_principal'];
      
      if (tieneCondicion) {
        fields.push('condiciones');
      }
      if (parseInt(nivelEducativo) >= 3) {
        fields.push('carreras_principal');
      }
      
      isValid = await trigger(fields);
      
      // Verificación manual de arreglos por si el trigger(array) de la librería falla en esta versión
      if (parseInt(nivelEducativo) >= 3) {
        const carreras = watch('carreras_principal');
        const hasEmptyCarrera = carreras.some(c => !c.nombre || c.nombre.trim() === '');
        if (hasEmptyCarrera) isValid = false;
      }
      
      if (!isValid) {
        toast.error('Hay campos obligatorios sin llenar en esta tarjeta. Revísalos (están marcados en rojo).');
        return;
      }
    }
    if (currentStep === 2) {
      isValid = await trigger(['contactos']);
      if (!isValid) {
        toast.error('Revisa la información de contacto.');
        return;
      }
    }
    if (currentStep === 3) isValid = true;
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmitForm = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Faltan campos por llenar o hay datos incorrectos. Revisa el formulario.');
      // Opcional: imprimir los errores en consola para depuración
      console.log('Errores de validación:', errors);
      return;
    }

    handleSubmit(async (data) => {
      setIsSubmitting(true);
      try {
        let payload = { ...data };
        
        // LIMPIEZA DE PAYLOAD: Si el usuario desmarcó opciones, vaciamos los arreglos
        // para que no viajen objetos basura vacíos (ej. [{ id_condicion: '' }]) al backend.
        if (!payload.tiene_condicion) {
          payload.condiciones = [];
        }
        if (parseInt(payload.nivel_educativo_principal) < 3) {
          payload.carreras_principal = [];
        }

        if (!isEditMode) {
          payload.username = payload.cedula;
          payload.password = payload.cedula;
          payload.id_rol = 1; // 1 = Usuario regular por defecto
        }
        
        console.log("Datos limpios para la API:", payload);
        
        if (isEditMode) {
          await updateUser(id, payload);
          toast.success('¡Actualización exitosa! Perfil guardado.');
        } else {
          await addUser(payload);
          toast.success('¡Registro exitoso! Perfil completo guardado.');
        }
        
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
            <UserPlus className="text-green" /> {isEditMode ? 'Editar Usuario' : 'Alta de Nuevo Usuario'}
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
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Datos Personales</h3>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Cédula del Titular *</label>
              <input type="text" className={`input-field ${errors.cedula ? 'error' : ''}`} placeholder="10 dígitos" maxLength="10" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} {...register("cedula", { required: "Este campo es obligatorio", validate: v => validarCedulaEcuatoriana(v) || "Cédula Ecuatoriana inválida" })} />
              {errors.cedula && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.cedula.message}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Fecha de Nacimiento *</label>
              <input type="date" className={`input-field ${errors.fecha_nacimiento ? 'error' : ''}`} {...register("fecha_nacimiento", { required: "Requerido" })} />
              {errors.fecha_nacimiento && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.fecha_nacimiento.message}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Nombres Completos *</label>
              <input type="text" className={`input-field ${errors.nombres ? 'error' : ''}`} placeholder="Ej. Juan Carlos" onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')} {...register("nombres", { required: "Requerido", pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: "Solo letras permitidas" } })} />
              {errors.nombres && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.nombres.message}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Apellidos Completos *</label>
              <input type="text" className={`input-field ${errors.apellidos ? 'error' : ''}`} placeholder="Ej. Pérez López" onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')} {...register("apellidos", { required: "Requerido", pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: "Solo letras permitidas" } })} />
              {errors.apellidos && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.apellidos.message}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Género *</label>
              <select className={`form-select ${errors.id_genero ? 'error' : ''}`} {...register("id_genero", { required: "Requerido" })}>
                <option value="">Seleccione Género...</option>
                {generos.map(g => (
                  <option key={g.id_genero} value={g.id_genero}>{g.nombre_genero}</option>
                ))}
              </select>
              {errors.id_genero && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.id_genero.message}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Zona *</label>
              <select className={`form-select ${errors.id_zona ? 'error' : ''}`} {...register("id_zona", { required: "Requerido" })}>
                <option value="">Seleccione una Zona...</option>
                {zonas.map(z => (
                  <option key={z.id_zona} value={z.id_zona}>{z.nombre_zona}</option>
                ))}
              </select>
              {errors.id_zona && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.id_zona.message}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Sector *</label>
              <select className={`form-select ${errors.id_sector ? 'error' : ''}`} {...register("id_sector", { required: "Requerido" })} disabled={!selectedZona}>
                <option value="">Seleccione un Sector...</option>
                {sectores.map(s => (
                  <option key={s.id_sector} value={s.id_sector}>{s.nombre_sector}</option>
                ))}
              </select>
              {errors.id_sector && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.id_sector.message}</span>}
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" {...register("tiene_condicion")} style={{ width: '1.2rem', height: '1.2rem' }} />
                <span>¿Tiene alguna condición especial o discapacidad?</span>
              </label>
            </div>

            {tieneCondicion && (
              <div className="animate-fade-in" style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px dashed var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="input-label" style={{ margin: 0 }}>Condiciones Especiales</label>
                  <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => appendCondicion({ id_condicion: '', porcentaje: '', codigo: '', observacion: '' })}>
                    <Plus size={16} /> Añadir Otra
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {condicionesFields.map((field, index) => {
                    const selectedCondId = watchedCondiciones[index]?.id_condicion;
                    const selectedCond = condiciones.find(c => c.id_condicion.toString() === selectedCondId?.toString());
                    const isDiscapacidad = selectedCond?.nombre_condicion.toLowerCase().includes('discapacidad');
                    
                    // Si no ha seleccionado nada o seleccionó "Ninguna"
                    const isNinguna = !selectedCondId || selectedCond?.nombre_condicion.toLowerCase().includes('ningun');

                    return (
                      <div key={field.id} style={{ display: 'grid', gridTemplateColumns: isDiscapacidad ? '2fr 1fr 1.5fr 2fr auto' : (isNinguna ? '2fr auto' : '2fr 2fr auto'), gap: '0.75rem', alignItems: 'end' }}>
                        <div className="input-group">
                          <label className="input-label" style={{ fontSize: '0.7rem' }}>Tipo de Condición *</label>
                          <select className={`form-select ${errors?.condiciones?.[index]?.id_condicion ? 'error' : ''}`} {...register(`condiciones.${index}.id_condicion`, { required: "Requerido" })}>
                            <option value="">Seleccione...</option>
                            {condiciones.map(c => (
                              <option key={`cond-${c.id_condicion}`} value={c.id_condicion}>{c.nombre_condicion}</option>
                            ))}
                          </select>
                          {errors?.condiciones?.[index]?.id_condicion && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>Requerido</span>}
                        </div>
                        
                        {isDiscapacidad && (
                          <>
                            <div className="input-group animate-fade-in">
                              <label className="input-label" style={{ fontSize: '0.7rem' }}>%</label>
                              <input type="number" className="input-field" placeholder="0-100" min="0" max="100" {...register(`condiciones.${index}.porcentaje`)} />
                            </div>
                            <div className="input-group animate-fade-in">
                              <label className="input-label" style={{ fontSize: '0.7rem' }}>Código Carnet</label>
                              <input type="text" className="input-field" placeholder="CONADIS..." {...register(`condiciones.${index}.codigo`)} />
                            </div>
                          </>
                        )}

                        {!isNinguna && (
                          <div className="input-group animate-fade-in">
                            <label className="input-label" style={{ fontSize: '0.7rem' }}>Observación</label>
                            <input type="text" className="input-field" placeholder="Detalles..." {...register(`condiciones.${index}.observacion`)} />
                          </div>
                        )}
                        
                        {condicionesFields.length > 1 && (
                          <button type="button" className="btn-icon text-red" onClick={() => removeCondicion(index)} style={{ paddingBottom: '0.5rem' }}>
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="form-grid" style={{ marginTop: '1.5rem' }}>
            <div className="input-group">
              <label className="input-label">Nivel Académico *</label>
              <select className={`form-select ${errors.nivel_educativo_principal ? 'error' : ''}`} {...register("nivel_educativo_principal", { required: "Requerido" })}>
                <option value="">Seleccione Nivel...</option>
                <option value="1">Primaria</option>
                <option value="2">Secundaria</option>
                <option value="3">Tercer Nivel (Licenciatura/Ingeniería)</option>
                <option value="4">Cuarto Nivel (Maestría/Posgrado)</option>
                <option value="5">Quinto Nivel (Doctorado)</option>
                <option value="6">Pos Doctorado</option>
              </select>
              {errors.nivel_educativo_principal && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.nivel_educativo_principal.message}</span>}
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
                        name={`carreras_principal.${index}.nombre`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState }) => (
                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <AutocompleteInput 
                              placeholder="Escriba el título (ej. Ingeniero)"
                              value={field.value || ''}
                              onChange={(val) => {
                                field.onChange(val);
                                // Limpiar error manualmente al escribir/seleccionar
                                if (fieldState.error) {
                                  trigger(`carreras_principal.${index}.nombre`);
                                }
                              }}
                            />
                            {fieldState.error && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>Requerido</span>}
                          </div>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.7rem' }}>Número de Teléfono *</label>
                    <input type="text" className={`input-field ${errors.contactos?.[index]?.valor_contacto ? 'error' : ''}`} placeholder="Solo números ej. 0991234567" maxLength="15" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} {...register(`contactos.${index}.valor_contacto`, { required: "Debe ingresar un número de teléfono", pattern: { value: /^[0-9]+$/, message: "Solo se permiten números" } })} />
                    {errors.contactos?.[index]?.valor_contacto && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.contactos[index].valor_contacto.message}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.7rem' }}>Operadora</label>
                    <select className="form-select" {...register(`contactos.${index}.id_operadora`)}>
                      <option value="">Seleccione...</option>
                      {operadoras.map(o => (
                        <option key={o.id_operadora} value={o.id_operadora}>{o.nombre_operadora}</option>
                      ))}
                    </select>
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
                  errors={errors}
                />
              ))}
            </div>
          )}
        </div>
      </CardSlider>
    </div>
  );
}
