import React, { useState, useEffect } from 'react';
import { addUser } from '../services/userService';
import { getZonas, getCondicionesEspeciales, getTiposContacto, getGeneros } from '../services/catalogoService';
import { UserPlus, ArrowLeft, PhoneCall, Users as UsersIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import CardSlider from '../components/CardSlider';

// Componente separado para optimizar los re-renders en el FieldArray (Principio SOLID / React Perf)
const HijoFields = ({ control, index, register, generos }) => {
  const depNivel = useWatch({
    control,
    name: `dependientes.${index}.nivel_educativo`,
    defaultValue: '1'
  });

  const showDepCarrera = parseInt(depNivel) === 3;
  const showDepMasterado = parseInt(depNivel) === 4;

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
          </select>
        </div>
      </div>

      {showDepCarrera && (
        <div className="input-group animate-fade-in" style={{ marginTop: '0.75rem' }}>
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Seleccione la Carrera</label>
          <input type="text" className="input-field" placeholder="Nombre de la carrera..." {...register(`dependientes.${index}.carrera`)} />
        </div>
      )}

      {showDepMasterado && (
        <div className="input-group animate-fade-in" style={{ marginTop: '0.75rem' }}>
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Especifique el Masterado</label>
          <input type="text" className="input-field" placeholder="Título del masterado..." {...register(`dependientes.${index}.masterado`)} />
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
      numero_hijos: 0
    }
  });

  const nivelEducativo = watch('nivel_educativo_principal');
  const showTitularCarrera = parseInt(nivelEducativo) === 3;
  const showTitularMasterado = parseInt(nivelEducativo) === 4;

  const numeroHijos = watch('numero_hijos') || 0;

  const { fields: contactosFields } = useFieldArray({ control, name: "contactos" });
  const { fields: dependientesFields, append: appendDependiente, remove: removeDependiente } = useFieldArray({ control, name: "dependientes" });

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
              <input type="text" className={`input-field ${errors.cedula ? 'error' : ''}`} placeholder="10 dígitos" {...register("cedula", { required: "Obligatorio", minLength: 10 })} />
            </div>
            <div className="input-group">
              <label className="input-label">Fecha de Nacimiento</label>
              <input type="date" className="input-field" {...register("fecha_nacimiento")} />
            </div>
            <div className="input-group">
              <label className="input-label">Nombres Completos *</label>
              <input type="text" className="input-field" placeholder="Ej. Juan Carlos" {...register("nombres", { required: true })} />
            </div>
            <div className="input-group">
              <label className="input-label">Apellidos Completos *</label>
              <input type="text" className="input-field" placeholder="Ej. Pérez López" {...register("apellidos", { required: true })} />
            </div>
            <div className="input-group">
              <label className="input-label">Zona</label>
              <select className="form-select" {...register("id_zona")}>
                <option value="">-- Sin asignar --</option>
                {zonas.map(z => (
                  <option key={z.id_zona} value={z.id_zona}>{z.nombre_zona}</option>
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
              </select>
            </div>
            
            {showTitularCarrera && (
              <div className="input-group animate-fade-in">
                <label className="input-label">Carrera de Tercer Nivel</label>
                <input type="text" className="input-field" placeholder="Nombre de la carrera..." {...register("carrera_principal")} />
              </div>
            )}

            {showTitularMasterado && (
              <div className="input-group animate-fade-in">
                <label className="input-label">Título de Masterado</label>
                <input type="text" className="input-field" placeholder="Especifique su masterado..." {...register("masterado_principal")} />
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
                    <label className="input-label" style={{ fontSize: '0.7rem' }}>Número de Teléfono</label>
                    <input type="text" className="input-field" placeholder="099..." {...register(`contactos.${index}.valor_contacto`, { required: true })} />
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
