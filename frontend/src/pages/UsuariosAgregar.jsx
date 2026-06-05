import { useState, useEffect } from 'react';
import { addUser, getUserById, updateUser } from '../services/userService';
import { getZonas, getSectoresByZona, getCondicionesEspeciales, getTiposContacto, getGeneros, getOperadoras } from '../services/catalogoService';
import { UserPlus, ArrowLeft, PhoneCall, Users as UsersIcon, Plus, Trash2, Mail, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import CardSlider from '../components/CardSlider';
import AutocompleteInput from '../components/AutocompleteInput';
import { allowOnlyLetters, allowOnlyNumbers } from '../utils/validators';
import api from '../services/axiosConfig';

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

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

const HijoFields = ({ control, index, register, generos, errors }) => {
  const depNivel = useWatch({ control, name: `dependientes.${index}.nivel_educativo`, defaultValue: '0' });
  const showDepSuperior = parseInt(depNivel) >= 3;
  const { fields: carrerasFields, append: appendCarrera, remove: removeCarrera } = useFieldArray({ control, name: `dependientes.${index}.carreras` });

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '0.9rem' }}>Hijo #{index + 1}</h5>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Nombres *</label>
          <input type="text" className={`input-field ${errors?.dependientes?.[index]?.nombres ? 'error' : ''}`} placeholder="Nombres" onInput={(e) => e.target.value = allowOnlyLetters(e.target.value)} {...register(`dependientes.${index}.nombres`, { required: true })} />
          {errors?.dependientes?.[index]?.nombres && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>Requerido</span>}
        </div>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Apellidos *</label>
          <input type="text" className={`input-field ${errors?.dependientes?.[index]?.apellidos ? 'error' : ''}`} placeholder="Apellidos" onInput={(e) => e.target.value = allowOnlyLetters(e.target.value)} {...register(`dependientes.${index}.apellidos`, { required: true })} />
          {errors?.dependientes?.[index]?.apellidos && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>Requerido</span>}
        </div>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Cédula</label>
          <input type="text" className="input-field" placeholder="10 dígitos" maxLength="10" onInput={(e) => e.target.value = allowOnlyNumbers(e.target.value)} {...register(`dependientes.${index}.cedula`)} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Género</label>
          <select className="form-select" {...register(`dependientes.${index}.id_genero`)}>
            {generos.map(g => <option key={`dep-${index}-g-${g.id_genero}`} value={g.id_genero}>{g.nombre_genero}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '0.7rem' }}>Nivel Máximo de Estudios</label>
          <select className="form-select" {...register(`dependientes.${index}.nivel_educativo`)}>
            <option value="0">Ninguno</option>
            <option value="1">Primaria</option>
            <option value="2">Secundaria</option>
            <option value="3">Tercer Nivel (Licenciatura/Ingeniería)</option>
            <option value="4">Cuarto Nivel (Maestría/Posgrado)</option>
            <option value="5">Quinto Nivel (Doctorado)</option>
          </select>
        </div>
      </div>
      {showDepSuperior && (
        <div className="animate-fade-in" style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px dashed var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label className="input-label" style={{ margin: 0, fontSize: '0.75rem' }}>Títulos de Educación Superior</label>
            <button type="button" className="btn-secondary hover-scale" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => appendCarrera({ nombre: '' })}>
              <Plus size={14} /> Añadir Título
            </button>
          </div>
          {carrerasFields.map((field, cIndex) => (
            <div key={field.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Controller name={`dependientes.${index}.carreras.${cIndex}.nombre`} control={control} rules={{ required: true }} render={({ field }) => (
                <div style={{ flex: 2 }}>
                  <AutocompleteInput placeholder="Escriba el título (ej. Ingeniero)" value={field.value} onChange={field.onChange} />
                </div>
              )} />
              <input type="file" className="input-field" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', minWidth: '150px' }} accept=".pdf,image/*" {...register(`dependientes.${index}.carreras.${cIndex}.archivo_titulo`)} />
              {carrerasFields.length > 1 && <button type="button" className="btn-icon text-red" onClick={() => removeCarrera(cIndex)}><Trash2 size={16} /></button>}
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

// Componente de indicador de verificación de correo
const EmailVerificador = ({ correo }) => {
  const [estado, setEstado] = useState(null); // null | 'checking' | 'valido' | 'invalido'

  useEffect(() => {
    if (!correo || !correo.includes('@') || !correo.includes('.')) {
      setEstado(null);
      return;
    }
    setEstado('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/verificar-email?correo=${encodeURIComponent(correo)}`);
        setEstado(res.data.valido ? 'valido' : 'invalido');
      } catch {
        setEstado(null);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [correo]);

  if (!estado) return null;
  if (estado === 'checking') return <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Loader2 size={12} className="animate-spin" /> Verificando dominio...</span>;
  if (estado === 'valido') return <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle size={12} /> Dominio verificado</span>;
  return <span style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><XCircle size={12} /> Dominio sin registros — verifique el correo</span>;
};

export default function UsuariosAgregar() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [zonas, setZonas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [operadoras, setOperadoras] = useState([]);
  const [catalogsReady, setCatalogsReady] = useState(false);
  const [pendingReset, setPendingReset] = useState(null);

  // Paso 1: cargar catálogos
  useEffect(() => {
    Promise.all([
      getZonas().catch(() => []),
      getCondicionesEspeciales().catch(() => []),
      getTiposContacto().catch(() => []),
      getGeneros().catch(() => []),
      getOperadoras().catch(() => []),
    ]).then(([z, c, , g, o]) => {
      setZonas(z);
      setCondiciones(c);
      setGeneros(g);
      setOperadoras(o);
      setCatalogsReady(true);
    });
  }, []);

  const { register, control, handleSubmit, trigger, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      tiene_condicion: false,
      condiciones: [],
      contactos: [{ id_tipo_contacto: '1', valor_contacto: '', id_operadora: '' }],
      correo_electronico: '',
      estado_registro: 'Activo',
      dependientes: [],
      nivel_educativo_principal: '0',
      carreras_principal: [{ nombre: '' }],
      numero_hijos: 0
    }
  });

  // Paso 2: cargar datos del usuario en modo edición (sectores pre-cargados antes del reset)
  useEffect(() => {
    if (!isEditMode) return;
    getUserById(id)
      .then(async (data) => {
        if (data.id_zona) {
          const sects = await getSectoresByZona(data.id_zona).catch(() => []);
          setSectores(sects);
        }
        setPendingReset(data);
      })
      .catch(() => toast.error('Error al cargar los datos del usuario para editar'));
  }, [id, isEditMode]);

  // Paso 3: hacer reset SOLO después de que el DOM ya tiene los <option> de los catálogos
  // useEffect garantiza que corre después del commit al DOM, evitando que los selects queden en blanco
  useEffect(() => {
    if (catalogsReady && pendingReset) {
      reset(pendingReset);
    }
  }, [catalogsReady, pendingReset, reset]);

  const tieneCondicion = watch('tiene_condicion');
  const watchedCondiciones = watch('condiciones') || [];
  const selectedZona = watch('id_zona');
  const nivelEducativo = watch('nivel_educativo_principal');
  const showTitularSuperior = parseInt(nivelEducativo) >= 3;
  const numeroHijos = watch('numero_hijos') || 0;
  const correoWatch = watch('correo_electronico');
  const estadoRegistro = watch('estado_registro');

  useEffect(() => {
    if (selectedZona) {
      getSectoresByZona(selectedZona).then(setSectores).catch(() => setSectores([]));
    } else {
      setSectores([]);
    }
  }, [selectedZona]);

  const { fields: contactosFields } = useFieldArray({ control, name: 'contactos' });
  const { fields: dependientesFields, append: appendDependiente, remove: removeDependiente } = useFieldArray({ control, name: 'dependientes' });
  const { fields: titularCarrerasFields, append: appendTitularCarrera, remove: removeTitularCarrera } = useFieldArray({ control, name: 'carreras_principal' });
  const { fields: condicionesFields, append: appendCondicion, remove: removeCondicion } = useFieldArray({ control, name: 'condiciones' });

  useEffect(() => {
    if (tieneCondicion && condicionesFields.length === 0) {
      appendCondicion({ id_condicion: '', porcentaje: '', codigo: '', observacion: '', archivo_carnet: null });
    }
  }, [tieneCondicion, condicionesFields.length, appendCondicion]);

  useEffect(() => {
    const num = parseInt(numeroHijos) || 0;
    const currentCount = dependientesFields.length;
    if (num > currentCount) {
      for (let i = currentCount; i < num; i++) {
        appendDependiente({ nombres: '', apellidos: '', cedula: '', id_genero: '1', nivel_educativo: '0', carreras: [] });
      }
    } else if (num < currentCount) {
      for (let i = currentCount - 1; i >= num; i--) {
        removeDependiente(i);
      }
    }
  }, [numeroHijos, appendDependiente, removeDependiente, dependientesFields.length]);

  const STEPS = [{ label: 'Datos Usuario' }, { label: 'Contacto' }, { label: 'Registro Hijos' }];

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      const fields = ['cedula', 'fecha_nacimiento', 'nombres', 'apellidos', 'id_genero', 'id_zona', 'id_sector', 'nivel_educativo_principal'];
      if (tieneCondicion) fields.push('condiciones');
      if (parseInt(nivelEducativo) >= 3) fields.push('carreras_principal');
      isValid = await trigger(fields);
      if (parseInt(nivelEducativo) >= 3) {
        const carreras = watch('carreras_principal');
        if (carreras.some(c => !c.nombre || c.nombre.trim() === '')) isValid = false;
      }
      if (!isValid) {
        toast.error('Hay campos obligatorios sin llenar. Están marcados en rojo.');
        return;
      }
    }
    if (currentStep === 2) {
      const camposContacto = estadoRegistro === 'Pendiente' ? ['contactos'] : ['contactos', 'correo_electronico'];
      isValid = await trigger(camposContacto);
      if (!isValid) {
        toast.error('Revisa la información de contacto.');
        return;
      }
    }
    if (currentStep === 3) isValid = true;
    if (isValid) setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmitForm = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Faltan campos por llenar o hay datos incorrectos. Revisa el formulario.');
      return;
    }
    handleSubmit(async (data) => {
      setIsSubmitting(true);
      try {
        let payload = { ...data };

        if (!payload.tiene_condicion) {
          payload.condiciones = [];
        } else {
          // Procesar archivos de carnets CONADIS
          for (let i = 0; i < payload.condiciones.length; i++) {
            const cond = payload.condiciones[i];
            if (cond.archivo_carnet && cond.archivo_carnet.length > 0) {
              payload.condiciones[i].archivo_carnet_base64 = await toBase64(cond.archivo_carnet[0]);
            }
          }
        }

        if (parseInt(payload.nivel_educativo_principal) < 3) {
          payload.carreras_principal = [];
        } else {
          for (let i = 0; i < payload.carreras_principal.length; i++) {
            const c = payload.carreras_principal[i];
            if (c.archivo_titulo && c.archivo_titulo.length > 0) {
              payload.carreras_principal[i].archivo_titulo_base64 = await toBase64(c.archivo_titulo[0]);
            }
          }
        }

        if (payload.dependientes && payload.dependientes.length > 0) {
          for (let i = 0; i < payload.dependientes.length; i++) {
            const d = payload.dependientes[i];
            if (parseInt(d.nivel_educativo) >= 3 && d.carreras) {
              for (let j = 0; j < d.carreras.length; j++) {
                const c = d.carreras[j];
                if (c.archivo_titulo && c.archivo_titulo.length > 0) {
                  payload.dependientes[i].carreras[j].archivo_titulo_base64 = await toBase64(c.archivo_titulo[0]);
                }
              }
            }
          }
        }

        if (!isEditMode) {
          payload.username = payload.cedula;
          payload.password = payload.cedula;
          payload.id_rol = 1;
        }

        if (isEditMode) {
          await updateUser(id, payload);
          toast.success('¡Actualización exitosa! Perfil guardado.');
        } else {
          await addUser(payload);
          const msg = payload.estado_registro === 'Pendiente'
            ? '¡Registro guardado como Pendiente! Requiere aprobación.'
            : '¡Registro exitoso! Perfil completo guardado.';
          toast.success(msg);
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

      <CardSlider steps={STEPS} currentStep={currentStep} onNext={handleNext} onPrev={handlePrev} onSubmit={onSubmitForm} isSubmitting={isSubmitting}>

        {/* TARJETA 1: DATOS USUARIO */}
        <div className="glass-card step-content" style={{ padding: '2.5rem' }}>
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Datos Personales</h3>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Cédula del Titular *</label>
              <input type="text" className={`input-field ${errors.cedula ? 'error' : ''}`} placeholder="10 dígitos" maxLength="10" onInput={(e) => e.target.value = allowOnlyNumbers(e.target.value)} {...register('cedula', { required: 'Este campo es obligatorio', validate: v => validarCedulaEcuatoriana(v) || 'Cédula Ecuatoriana inválida' })} />
              {errors.cedula && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.cedula.message}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Fecha de Nacimiento *</label>
              <input type="date" className={`input-field ${errors.fecha_nacimiento ? 'error' : ''}`} {...register('fecha_nacimiento', { required: 'Requerido' })} />
              {errors.fecha_nacimiento && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.fecha_nacimiento.message}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Nombres Completos *</label>
              <input type="text" className={`input-field ${errors.nombres ? 'error' : ''}`} placeholder="Ej. Juan Carlos" onInput={(e) => e.target.value = allowOnlyLetters(e.target.value)} {...register('nombres', { required: 'Requerido', pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo letras' } })} />
              {errors.nombres && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.nombres.message}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Apellidos Completos *</label>
              <input type="text" className={`input-field ${errors.apellidos ? 'error' : ''}`} placeholder="Ej. Pérez López" onInput={(e) => e.target.value = allowOnlyLetters(e.target.value)} {...register('apellidos', { required: 'Requerido', pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'Solo letras' } })} />
              {errors.apellidos && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.apellidos.message}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Género *</label>
              <select className={`form-select ${errors.id_genero ? 'error' : ''}`} {...register('id_genero', { required: 'Requerido' })}>
                <option value="">Seleccione Género...</option>
                {generos.map(g => <option key={g.id_genero} value={g.id_genero}>{g.nombre_genero}</option>)}
              </select>
              {errors.id_genero && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.id_genero.message}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Zona *</label>
              <select className={`form-select ${errors.id_zona ? 'error' : ''}`} {...register('id_zona', { required: 'Requerido' })}>
                <option value="">Seleccione una Zona...</option>
                {zonas.map(z => <option key={z.id_zona} value={z.id_zona}>{z.nombre_zona}</option>)}
              </select>
              {errors.id_zona && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.id_zona.message}</span>}
            </div>
            <div className="form-group">
              <label className="input-label">Sector *</label>
              <select className={`form-select ${errors.id_sector ? 'error' : ''}`} {...register('id_sector', { required: 'Requerido' })} disabled={!selectedZona}>
                <option value="">Seleccione un Sector...</option>
                {sectores.map(s => <option key={s.id_sector} value={s.id_sector}>{s.nombre_sector}</option>)}
              </select>
              {errors.id_sector && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.id_sector.message}</span>}
            </div>

            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" {...register('tiene_condicion')} style={{ width: '1.2rem', height: '1.2rem' }} />
                <span>¿Tiene alguna condición especial o discapacidad?</span>
              </label>
            </div>

            {tieneCondicion && (
              <div className="animate-fade-in" style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px dashed var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="input-label" style={{ margin: 0 }}>Condiciones Especiales</label>
                  <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => appendCondicion({ id_condicion: '', porcentaje: '', codigo: '', observacion: '', archivo_carnet: null })}>
                    <Plus size={16} /> Añadir Otra
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {condicionesFields.map((field, index) => {
                    const selectedCondId = watchedCondiciones[index]?.id_condicion;
                    const selectedCond = condiciones.find(c => c.id_condicion.toString() === selectedCondId?.toString());
                    const isDiscapacidad = selectedCond?.nombre_condicion.toLowerCase().includes('discapacidad');
                    const isNinguna = !selectedCondId || selectedCond?.nombre_condicion.toLowerCase().includes('ningun');

                    return (
                      <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isDiscapacidad ? '2fr 1fr 1.5fr auto' : (isNinguna ? '2fr auto' : '2fr 2fr auto'), gap: '0.75rem', alignItems: 'end' }}>
                          <div className="input-group">
                            <label className="input-label" style={{ fontSize: '0.7rem' }}>Tipo de Condición *</label>
                            <select className={`form-select ${errors?.condiciones?.[index]?.id_condicion ? 'error' : ''}`} {...register(`condiciones.${index}.id_condicion`, { required: 'Requerido' })}>
                              <option value="">Seleccione...</option>
                              {condiciones.map(c => <option key={`cond-${c.id_condicion}`} value={c.id_condicion}>{c.nombre_condicion}</option>)}
                            </select>
                            {errors?.condiciones?.[index]?.id_condicion && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>Requerido</span>}
                          </div>
                          {isDiscapacidad && (
                            <>
                              <div className="input-group animate-fade-in">
                                <label className="input-label" style={{ fontSize: '0.7rem' }}>% Discapacidad</label>
                                <input type="number" className="input-field" placeholder="0-100" min="0" max="100" {...register(`condiciones.${index}.porcentaje`)} />
                              </div>
                              <div className="input-group animate-fade-in">
                                <label className="input-label" style={{ fontSize: '0.7rem' }}>Código Carnet CONADIS</label>
                                <input type="text" className="input-field" placeholder="Ej. 0102-123456" maxLength="20" {...register(`condiciones.${index}.codigo`)} />
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
                        {isDiscapacidad && (
                          <div className="input-group animate-fade-in">
                            <label className="input-label" style={{ fontSize: '0.7rem' }}>Foto / Archivo del Carnet CONADIS</label>
                            <input type="file" className="input-field" accept="image/*,.pdf" style={{ padding: '0.4rem', fontSize: '0.8rem' }} {...register(`condiciones.${index}.archivo_carnet`)} />
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Formatos: JPG, PNG o PDF del carnet físico</span>
                          </div>
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
              <select className={`form-select ${errors.nivel_educativo_principal ? 'error' : ''}`} {...register('nivel_educativo_principal', { required: 'Requerido' })}>
                <option value="0">Ninguno</option>
                <option value="1">Primaria</option>
                <option value="2">Secundaria</option>
                <option value="3">Tercer Nivel (Licenciatura/Ingeniería)</option>
                <option value="4">Cuarto Nivel (Maestría/Posgrado)</option>
                <option value="5">Quinto Nivel (Doctorado)</option>
              </select>
              {errors.nivel_educativo_principal && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.nivel_educativo_principal.message}</span>}
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
                      <Controller name={`carreras_principal.${index}.nombre`} control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                          <AutocompleteInput placeholder="Escriba el título (ej. Ingeniero)" value={field.value || ''} onChange={(val) => { field.onChange(val); if (fieldState.error) trigger(`carreras_principal.${index}.nombre`); }} />
                          {fieldState.error && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>Requerido</span>}
                        </div>
                      )} />
                      <input type="file" className="input-field" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', minWidth: '150px' }} accept=".pdf,image/*" {...register(`carreras_principal.${index}.archivo_titulo`)} />
                      {titularCarrerasFields.length > 1 && <button type="button" className="btn-icon text-red" onClick={() => removeTitularCarrera(index)}><Trash2 size={18} /></button>}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.7rem' }}>Número de Teléfono * (10 dígitos)</label>
                    <input
                      type="text"
                      className={`input-field ${errors.contactos?.[index]?.valor_contacto ? 'error' : ''}`}
                      placeholder="Ej. 0991234567"
                      maxLength="10"
                      onInput={(e) => e.target.value = allowOnlyNumbers(e.target.value)}
                      {...register(`contactos.${index}.valor_contacto`, {
                        required: 'Número obligatorio',
                        pattern: { value: /^[0-9]{10}$/, message: 'Debe tener exactamente 10 dígitos' }
                      })}
                    />
                    {errors.contactos?.[index]?.valor_contacto && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.contactos[index].valor_contacto.message}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.7rem' }}>Operadora</label>
                    <select className="form-select" {...register(`contactos.${index}.id_operadora`)}>
                      <option value="">Seleccione...</option>
                      {operadoras.map(o => <option key={o.id_operadora} value={o.id_operadora}>{o.nombre_operadora}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Correo Electrónico Obligatorio */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: `1px solid ${errors.correo_electronico ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.05)'}` }}>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} className="text-blue" /> Correo Electrónico *
                </label>
                <input
                  type="email"
                  className={`input-field ${errors.correo_electronico ? 'error' : ''}`}
                  placeholder={estadoRegistro === 'Pendiente' ? 'Opcional cuando es Pendiente' : 'correo@ejemplo.com'}
                  {...register('correo_electronico', {
                    required: estadoRegistro !== 'Pendiente' && 'El correo electrónico es obligatorio',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de correo inválido' }
                  })}
                />
                {errors.correo_electronico
                  ? <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{errors.correo_electronico.message}</span>
                  : <EmailVerificador correo={correoWatch} />
                }
              </div>
            </div>

            {/* Estado de Registro */}
            <div style={{ background: 'rgba(245,158,11,0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Controller name="estado_registro" control={control} render={({ field }) => (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={field.value === 'Pendiente'} onChange={(e) => field.onChange(e.target.checked ? 'Pendiente' : 'Activo')} style={{ width: '1.1rem', height: '1.1rem', accentColor: '#f59e0b' }} />
                  <span style={{ color: 'var(--text-main)' }}>Registrar como <strong style={{ color: '#f59e0b' }}>Pendiente</strong> (requiere confirmación posterior)</span>
                </label>
              )} />
              {estadoRegistro === 'Pendiente' && (
                <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                  <Clock size={14} /> El usuario quedará en estado Pendiente hasta ser aprobado manualmente.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TARJETA 3: REGISTRO DE HIJOS */}
        <div className="glass-card step-content" style={{ padding: '2.5rem' }}>
          <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UsersIcon size={20} className="text-blue" /> Registro de Hijos
          </h3>
          <div className="input-group" style={{ marginBottom: '2rem', maxWidth: '200px' }}>
            <label className="input-label">¿Cuántos hijos tiene?</label>
            <input type="number" min="0" max="15" className="input-field" placeholder="0" {...register('numero_hijos')} />
          </div>
          {dependientesFields.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>No se registrarán hijos.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {dependientesFields.map((item, index) => (
                <HijoFields key={item.id} control={control} index={index} register={register} generos={generos} errors={errors} />
              ))}
            </div>
          )}
        </div>
      </CardSlider>
    </div>
  );
}
