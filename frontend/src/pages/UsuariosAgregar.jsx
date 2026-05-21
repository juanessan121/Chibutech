import React, { useState, useEffect } from 'react';
import { addUser } from '../services/userService';
import { getZonas, getCondicionesEspeciales, getRoles, getTiposContacto, getEstadosConstruccion, buscarTitulosCine } from '../services/catalogoService';
import { UserPlus, ArrowLeft, ArrowRight, Check, MapPin, Shield, BookOpen, Plus, Trash2, Users as UsersIcon, Upload, Search } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function UsuariosAgregar() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Estados para catálogos dinámicos
  const [zonas, setZonas] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tiposContacto, setTiposContacto] = useState([]);
  const [estadosConstruccion, setEstadosConstruccion] = useState([]);
  const [titulosSearchText, setTitulosSearchText] = useState({});
  const [titulosResultados, setTitulosResultados] = useState({});

  useEffect(() => {
    // Cargar catálogos al montar (Simulando o llamando a la API real)
    Promise.all([
      getZonas().catch(() => [{ id_zona: 1, nombre_zona: 'Centro' }, { id_zona: 2, nombre_zona: 'San Luis' }]),
      getCondicionesEspeciales().catch(() => [{ id_condicion_especial: 1, nombre_condicion: 'Ninguna' }]),
      getRoles().catch(() => [{ id_rol: 1, nombre_rol: 'Usuario' }, { id_rol: 2, nombre_rol: 'Directiva' }]),
      getTiposContacto().catch(() => [{ id_tipo_contacto: 1, tipo_contacto: 'Celular' }, { id_tipo_contacto: 2, tipo_contacto: 'Correo' }]),
      getEstadosConstruccion().catch(() => [{ id_estado_construccion: 1, descripcion_estado: 'Lote Baldío' }])
    ]).then(([z, c, r, tc, ec]) => {
      setZonas(z);
      setCondiciones(c);
      setRoles(r);
      setTiposContacto(tc);
      setEstadosConstruccion(ec);
    });
  }, []);

  const { register, control, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      contactos: [{ id_tipo_contacto: '1', valor_contacto: '', operadora_o_detalle: '' }],
      titulos: [],
      dependientes: [],
      terrenos: [],
      nivel_educativo_principal: '1'
    }
  });

  const nivelEducativo = watch('nivel_educativo_principal');
  const showTitulos = parseInt(nivelEducativo) >= 2;

  const { fields: contactosFields, append: appendContacto, remove: removeContacto } = useFieldArray({ control, name: "contactos" });
  const { fields: titulosFields, append: appendTitulo, remove: removeTitulo } = useFieldArray({ control, name: "titulos" });
  const { fields: dependientesFields, append: appendDependiente, remove: removeDependiente } = useFieldArray({ control, name: "dependientes" });
  const { fields: terrenosFields, append: appendTerreno, remove: removeTerreno } = useFieldArray({ control, name: "terrenos" });

  const STEPS = [
    { id: 1, label: 'Personales & Familia', icon: UserPlus },
    { id: 2, label: 'Contacto & Educ.', icon: BookOpen },
    { id: 3, label: 'Catastro', icon: MapPin },
    { id: 4, label: 'Credenciales', icon: Shield },
  ];

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) isValid = await trigger(['cedula', 'nombres', 'apellidos']);
    if (currentStep === 2) isValid = await trigger(['contactos']); 
    if (currentStep === 3) isValid = true; 
    
    if (isValid || currentStep > 3) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmitNewUser = async (data) => {
    setIsSubmitting(true);
    try {
      // Si hay archivos binarios, normalmente usaríamos FormData aquí
      console.log("Datos listos para la API (adaptados al esquema V6):", data);
      await addUser(data);
      toast.success('¡Registro exitoso! Perfil completo guardado.');
      setTimeout(() => navigate('/dashboard/usuarios/padron'), 2000);
    } catch (error) {
      toast.error(error.message || 'Error al guardar el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuscarTitulos = async (index, query) => {
    setTitulosSearchText(prev => ({...prev, [index]: query}));
    if (query.length > 2) {
      try {
        const resultados = await buscarTitulosCine(query);
        // Fallback mockup por si no hay backend aún
        const mockResults = [
          { codigo_titulo_cine: 'CINE-001', nombre_titulo: 'Ingeniería en Sistemas' },
          { codigo_titulo_cine: 'CINE-002', nombre_titulo: 'Ingeniería Agrónoma' }
        ];
        setTitulosResultados(prev => ({...prev, [index]: resultados?.length ? resultados : mockResults}));
      } catch (e) {
        setTitulosResultados(prev => ({...prev, [index]: []}));
      }
    }
  };

  const seleccionarTitulo = (index, titulo) => {
    setValue(`titulos.${index}.codigo_titulo_cine`, titulo.codigo_titulo_cine);
    setTitulosSearchText(prev => ({...prev, [index]: titulo.nombre_titulo}));
    setTitulosResultados(prev => ({...prev, [index]: []}));
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
          <p className="text-muted">Asistente avanzado con manejo de grupos familiares e historial académico.</p>
        </div>
      </div>

      <div className="stepper-container">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-circle">
                {isCompleted ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit(onSubmitNewUser)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* PASO 1 */}
          {currentStep === 1 && (
            <div className="step-content">
              <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>1. Información Biológica</h3>
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
              </div>
              
              <div className="form-grid full" style={{ marginTop: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Estado Vital de la Persona</label>
                  <select className="form-select" {...register("estado_vital")}>
                    <option value="Vivo">Vivo</option>
                    <option value="Fallecido">Fallecido</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Condición Especial (Catálogo dinámico)</label>
                  <select className="form-select" {...register("id_condicion_especial")}>
                    {condiciones.map(c => <option key={c.id_condicion_especial} value={c.id_condicion_especial}>{c.nombre_condicion}</option>)}
                  </select>
                </div>
              </div>

              {/* FAMILIARES - ADAPTADO A V6 */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px dashed var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <UsersIcon size={18} className="text-blue" /> Grupo Familiar / Dependientes
                  </h4>
                  <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => appendDependiente({ cedula: '', nombres: '', apellidos: '', parentesco: 'Hijo/a' })}>
                    <Plus size={14} /> Agregar Dependiente
                  </button>
                </div>
                
                {dependientesFields.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>No hay dependientes registrados.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {dependientesFields.map((item, index) => (
                      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                        <div className="input-group">
                          <label className="input-label" style={{fontSize:'0.7rem'}}>Cédula</label>
                          <input type="text" className="input-field" placeholder="Cédula" {...register(`dependientes.${index}.cedula`)} />
                        </div>
                        <div className="input-group">
                          <label className="input-label" style={{fontSize:'0.7rem'}}>Nombres</label>
                          <input type="text" className="input-field" placeholder="Nombres" {...register(`dependientes.${index}.nombres`)} />
                        </div>
                        <div className="input-group">
                          <label className="input-label" style={{fontSize:'0.7rem'}}>Apellidos</label>
                          <input type="text" className="input-field" placeholder="Apellidos" {...register(`dependientes.${index}.apellidos`)} />
                        </div>
                        <div className="input-group">
                          <label className="input-label" style={{fontSize:'0.7rem'}}>Parentesco</label>
                          <select className="form-select" {...register(`dependientes.${index}.parentesco`)}>
                            <option value="Hijo/a">Hijo/a</option>
                            <option value="Conyuge">Cónyuge</option>
                            <option value="Tutelado">Tutelado</option>
                          </select>
                        </div>
                        <button type="button" className="btn-icon text-red" onClick={() => removeDependiente(index)} style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {currentStep === 2 && (
            <div className="step-content">
              <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>2. Comunicación e Historial Académico</h3>
              
              {/* CONTACTOS DINÁMICOS V6 */}
              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px dashed var(--border-color)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>Medios de Contacto</h4>
                  <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => appendContacto({ id_tipo_contacto: '1', valor_contacto: '', operadora_o_detalle: '' })}>
                    <Plus size={14} /> Añadir Contacto
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {contactosFields.map((item, index) => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                      <div className="input-group">
                        <label className="input-label" style={{fontSize:'0.7rem'}}>Tipo</label>
                        <select className="form-select" {...register(`contactos.${index}.id_tipo_contacto`)}>
                          {tiposContacto.map(tc => <option key={tc.id_tipo_contacto} value={tc.id_tipo_contacto}>{tc.tipo_contacto}</option>)}
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="input-label" style={{fontSize:'0.7rem'}}>Valor (Número / Email)</label>
                        <input type="text" className="input-field" placeholder="099... / correo@" {...register(`contactos.${index}.valor_contacto`, { required: true })} />
                      </div>
                      <div className="input-group">
                        <label className="input-label" style={{fontSize:'0.7rem'}}>Detalle/Operadora</label>
                        <input type="text" className="input-field" placeholder="Claro, Personal..." {...register(`contactos.${index}.operadora_o_detalle`)} />
                      </div>
                      <button type="button" className="btn-icon text-red" onClick={() => removeContacto(index)} style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-grid full">
                <div className="input-group">
                  <label className="input-label">Nivel de Educación Máximo</label>
                  <select className="form-select" {...register("nivel_educativo_principal")}>
                    <option value="1">Educación Básica / Secundaria</option>
                    <option value="2">Técnico / Tecnológico (Nivel 2)</option>
                    <option value="3">Tercer Nivel (Ingeniería / Licenciatura)</option>
                    <option value="4">Cuarto Nivel (Maestría / Posgrado)</option>
                    <option value="5">Quinto Nivel (Doctorado / PhD)</option>
                  </select>
                </div>
              </div>

              {/* TÍTULOS SENESCYT - BUSCADOR ADAPTADO */}
              {showTitulos && (
                <div className="animate-fade-in" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px dashed var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <BookOpen size={18} className="text-purple" /> Registro de Títulos (Catálogo SENESCYT)
                    </h4>
                    <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => appendTitulo({ codigo_titulo_cine: '', estado: 'Finalizado' })}>
                      <Plus size={14} /> Añadir Título
                    </button>
                  </div>
                  
                  {titulosFields.length === 0 ? (
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Haga clic en "Añadir Título" para buscar sus credenciales en el catálogo CINE.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {titulosFields.map((item, index) => (
                        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', alignItems: 'end', position: 'relative' }}>
                          <div className="input-group">
                            <label className="input-label" style={{fontSize:'0.7rem'}}>Buscar Título en Catálogo</label>
                            <div style={{ position: 'relative' }}>
                              <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                              <input 
                                type="text" 
                                className="input-field" 
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="Escribe para buscar..." 
                                value={titulosSearchText[index] || ''}
                                onChange={(e) => handleBuscarTitulos(index, e.target.value)}
                              />
                              {/* Campo oculto con el ID real */}
                              <input type="hidden" {...register(`titulos.${index}.codigo_titulo_cine`)} />
                            </div>
                            
                            {/* Resultados del Autocomplete */}
                            {titulosResultados[index] && titulosResultados[index].length > 0 && (
                              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                {titulosResultados[index].map(t => (
                                  <div key={t.codigo_titulo_cine} onClick={() => seleccionarTitulo(index, t)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}>
                                    {t.nombre_titulo} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({t.codigo_titulo_cine})</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="input-group">
                            <label className="input-label" style={{fontSize:'0.7rem'}}>Estado</label>
                            <select className="form-select" {...register(`titulos.${index}.estado`)}>
                              <option value="Finalizado">Finalizado</option>
                              <option value="Cursando">Cursando</option>
                            </select>
                          </div>
                          <button type="button" className="btn-icon text-red" onClick={() => removeTitulo(index)} style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PASO 3: CATASTRO BINARIO */}
          {currentStep === 3 && (
            <div className="step-content">
              <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>3. Información de Tierras (Catastro)</h3>
              
              <div className="form-grid full" style={{ marginBottom: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Zona Principal (Catálogo)</label>
                  <select className="form-select" {...register("id_zona_principal")}>
                    {zonas.map(z => <option key={z.id_zona} value={z.id_zona}>{z.nombre_zona}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px dashed var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <MapPin size={18} className="text-earth" /> Propiedades y Terrenos
                  </h4>
                  <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => appendTerreno({ clave_catastral: '', area_total: '', id_estado_construccion: '1', latitud: '', longitud: '' })}>
                    <Plus size={14} /> Registrar Terreno
                  </button>
                </div>
                
                {terrenosFields.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>No hay propiedades registradas.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {terrenosFields.map((item, index) => (
                      <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr auto', gap: '0.75rem', alignItems: 'end' }}>
                          <div className="input-group">
                            <label className="input-label" style={{fontSize:'0.7rem'}}>Clave Catastral</label>
                            <input type="text" className="input-field" placeholder="18-01-55..." {...register(`terrenos.${index}.clave_catastral`)} />
                          </div>
                          <div className="input-group">
                            <label className="input-label" style={{fontSize:'0.7rem'}}>Área (m²)</label>
                            <input type="number" step="0.01" className="input-field" placeholder="500.50" {...register(`terrenos.${index}.area_total`)} />
                          </div>
                          <div className="input-group">
                            <label className="input-label" style={{fontSize:'0.7rem'}}>Construcción</label>
                            <select className="form-select" {...register(`terrenos.${index}.id_estado_construccion`)}>
                              {estadosConstruccion.map(ec => <option key={ec.id_estado_construccion} value={ec.id_estado_construccion}>{ec.descripcion_estado}</option>)}
                            </select>
                          </div>
                          <button type="button" className="btn-icon text-red" onClick={() => removeTerreno(index)} style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                        {/* COORDENADAS GPS */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="input-group">
                            <label className="input-label" style={{fontSize:'0.7rem'}}>Latitud GPS (Opcional)</label>
                            <input type="text" className="input-field" placeholder="-1.2345678" {...register(`terrenos.${index}.latitud`)} />
                          </div>
                          <div className="input-group">
                            <label className="input-label" style={{fontSize:'0.7rem'}}>Longitud GPS (Opcional)</label>
                            <input type="text" className="input-field" placeholder="-78.1234567" {...register(`terrenos.${index}.longitud`)} />
                          </div>
                        </div>
                        {/* SUBIDA DE ARCHIVOS BINARIOS */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                          <div className="input-group">
                            <label className="input-label" style={{fontSize:'0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Upload size={14}/> Archivo Escritura (PDF max 16MB)</label>
                            <input type="file" accept=".pdf,image/*" className="input-field" style={{ padding: '0.4rem', fontSize: '0.8rem' }} {...register(`terrenos.${index}.archivo_escritura`)} />
                          </div>
                          <div className="input-group">
                            <label className="input-label" style={{fontSize:'0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Upload size={14}/> Archivo Planimetría (PDF max 16MB)</label>
                            <input type="file" accept=".pdf,image/*" className="input-field" style={{ padding: '0.4rem', fontSize: '0.8rem' }} {...register(`terrenos.${index}.archivo_planimetria`)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 4 */}
          {currentStep === 4 && (
            <div className="step-content">
              <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>4. Acceso al Sistema Web</h3>
              
              <div className="form-grid full">
                <div className="input-group">
                  <label className="input-label">Rol del Sistema</label>
                  <select className="form-select" {...register("id_rol")}>
                    {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre_rol}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Nombre de Usuario</label>
                  <input type="text" className="input-field" placeholder="Se usará la cédula por defecto" {...register("username")} />
                </div>
                <div className="input-group">
                  <label className="input-label">Contraseña</label>
                  <input type="password" className="input-field" placeholder="Automático (Cédula)" {...register("password")} />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={handlePrev} disabled={currentStep === 1} style={{ opacity: currentStep === 1 ? 0 : 1, transition: 'opacity 0.2s' }}>
              <ArrowLeft size={18}/> Atrás
            </button>
            
            {currentStep < 4 ? (
              <button type="button" className="btn-primary" style={{ width: 'auto' }} onClick={handleNext}>
                Siguiente <ArrowRight size={18}/>
              </button>
            ) : (
              <button type="submit" className="btn-primary" style={{ width: 'auto', background: '#10b981' }} disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : <><Check size={18}/> Finalizar Registro</>}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
