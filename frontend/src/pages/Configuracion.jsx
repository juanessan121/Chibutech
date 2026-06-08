import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Layers, MapPin, GraduationCap, Plus } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import axios from '../services/axiosConfig';
import { allowTextWithPunctuation, allowOnlyLetters } from '../utils/validators';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('parametros');
  
  // States
  const [config, setConfig] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [titulos, setTitulos] = useState([]);

  const [editando, setEditando] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formularios rápidos
  const [nuevaZona, setNuevaZona] = useState('');
  const [nuevoSector, setNuevoSector] = useState({ id_zona: '', nombre_sector: '' });
  const [nuevoTitulo, setNuevoTitulo] = useState('');

  // Touched para validación inline
  const [touchedZona, setTouchedZona] = useState(false);
  const [touchedSector, setTouchedSector] = useState({ id_zona: false, nombre_sector: false });
  const [touchedTitulo, setTouchedTitulo] = useState(false);

  // Edición
  const [editingZona, setEditingZona] = useState(null);
  const [editingSector, setEditingSector] = useState(null);

  // Diccionario amigable para las claves globales
  const labelsGlobales = {
    'TARIFA_METROS_BASE': 'Área Base de Terreno para Cobro (m²)',
    'TARIFA_VALOR_BASE': 'Costo Base a Cobrar por el Área ($)',
    'valor_multa_minga_base': 'Valor de Multa por Inasistencia a Minga ($)',
    'valor_cuota_mensual': 'Cuota Mensual de Mantenimiento de Agua ($)',
    'dias_gracia_pago': 'Días de Gracia Antes de Generar Mora',
    'nombre_junta': 'Nombre de la Organización',
    'tasa_interes_mora': 'Tasa de Interés por Mora (Decimal)'
  };

  const loadData = async () => {
    try {
      const [resConfig, resZonas, resTitulos] = await Promise.all([
        axios.get('/configuracion'),
        axios.get('/configuracion/zonas-sectores'),
        axios.get('/catalogos/titulos/todos')
      ]);
      setConfig(resConfig.data.data);
      setZonas(resZonas.data.data.zonas);
      setSectores(resZonas.data.data.sectores);
      setTitulos(resTitulos.data.data);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar los parámetros del sistema. Recarga la página.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ====== PARÁMETROS GLOBALES ======
  const handleChangeParam = (clave, value) => {
    setEditando(prev => ({ ...prev, [clave]: value }));
  };

  const handleSaveParams = async () => {
    setIsSubmitting(true);
    const payload = Object.keys(editando).map(k => ({
      clave: k,
      valor: editando[k],
      tipo_dato: isNaN(editando[k]) ? 'Texto' : 'Decimal'
    }));

    if(payload.length === 0) {
      setIsSubmitting(false);
      return toast.warning('No hay cambios pendientes para guardar.');
    }

    try {
      await axios.put('/configuracion', { configuraciones: payload });
      toast.success('Parámetros del sistema actualizados correctamente.');
      setEditando({});
      loadData();
    } catch (err) {
      toast.error('No se pudieron guardar los parámetros. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ====== AGREGAR ZONA ======
  const handleAddZona = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/configuracion/zonas', { nombre_zona: nuevaZona });
      toast.success('Zona registrada correctamente.');
      setNuevaZona('');
      loadData();
    } catch (err) {
      toast.error('No se pudo agregar la zona. Es posible que ya exista con ese nombre.');
    }
  };

  // ====== AGREGAR SECTOR ======
  const handleAddSector = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/configuracion/sectores', { 
        id_zona: nuevoSector.id_zona, 
        nombre_sector: nuevoSector.nombre_sector 
      });
      toast.success('Sector registrado correctamente.');
      setNuevoSector({ id_zona: '', nombre_sector: '' });
      loadData();
    } catch (err) {
      toast.error('No se pudo agregar el sector. Verifica que no exista ya.');
    }
  };

  // ====== EDITAR ZONA ======
  const handleUpdateZona = async (id_zona, nombre_zona) => {
    try {
      await axios.put(`/configuracion/zonas/${id_zona}`, { nombre_zona });
      toast.success('Zona actualizada correctamente.');
      setEditingZona(null);
      loadData();
    } catch (err) {
      toast.error('No se pudo actualizar la zona. Intenta de nuevo.');
    }
  };

  // ====== EDITAR SECTOR ======
  const handleUpdateSector = async (id_sector, nombre_sector) => {
    try {
      await axios.put(`/configuracion/sectores/${id_sector}`, { nombre_sector });
      toast.success('Sector actualizado correctamente.');
      setEditingSector(null);
      loadData();
    } catch (err) {
      toast.error('No se pudo actualizar el sector. Intenta de nuevo.');
    }
  };

  // ====== AGREGAR TÍTULO ======
  const handleAddTitulo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/configuracion/titulos', { nombre_titulo: nuevoTitulo });
      toast.success('Título universitario registrado correctamente.');
      setNuevoTitulo('');
      loadData();
    } catch (err) {
      toast.error('No se pudo registrar el título. Verifica que no esté duplicado.');
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings className="text-blue" /> Configuración Global del Sistema
        </h1>
        <p className="text-muted">Parámetros que controlan el ERP, cobros, zonas y títulos.</p>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={activeTab === 'parametros' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('parametros')}
          style={{ width: 'auto', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}
        >
          <Layers size={18} /> Parámetros y Tarifas
        </button>
        <button 
          className={activeTab === 'zonas' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('zonas')}
          style={{ width: 'auto', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}
        >
          <MapPin size={18} /> Zonas y Sectores
        </button>
        <button 
          className={activeTab === 'titulos' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('titulos')}
          style={{ width: 'auto', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}
        >
          <GraduationCap size={18} /> Títulos Universitarios
        </button>
      </div>

      {/* TAB 1: PARAMETROS GLOBALES */}
      {activeTab === 'parametros' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 className="text-primary">Tarifas de Cobro y Multas</h3>
            <button className="btn-primary" style={{ width: 'auto', gap: '0.5rem' }} onClick={handleSaveParams} disabled={isSubmitting}>
              {isSubmitting ? <RefreshCw size={16} className="spin" /> : <Save size={16} />} 
              Guardar Cambios
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {config.map((item, idx) => (
              <div key={item.clave} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '1.5rem', 
                  padding: '1.2rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '1rem' }}>
                    {labelsGlobales[item.clave] || item.clave}
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    className="input-field"
                    value={editando[item.clave] !== undefined ? editando[item.clave] : item.valor}
                    onChange={e => handleChangeParam(item.clave, e.target.value)}
                    style={{ maxWidth: '200px', padding: '0.5rem 0.75rem' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ZONAS Y SECTORES */}
      {activeTab === 'zonas' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 className="text-yellow" style={{ marginBottom: '1.5rem' }}>Zonas</h3>
            <form onSubmit={handleAddZona} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nombre de nueva Zona..."
                  required
                  value={nuevaZona}
                  onChange={e => setNuevaZona(allowOnlyLetters(e.target.value))}
                  onBlur={() => setTouchedZona(true)}
                />
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}><Plus size={18}/></button>
              </div>
              {touchedZona && !nuevaZona.trim() && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El nombre de la zona es obligatorio.</span>
              )}
            </form>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
              {zonas.map(z => (
                <div key={z.id_zona} style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {editingZona === z.id_zona ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Editando Zona: <strong style={{color: 'var(--text-color)'}}>{z.nombre_zona}</strong></div>
                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                          <input 
                            type="text" 
                            className="input-field" 
                            defaultValue={z.nombre_zona} 
                            id={`edit-zona-${z.id_zona}`}
                            style={{ flex: 1, minWidth: '150px' }}
                            autoFocus
                          />
                          <button onClick={() => handleUpdateZona(z.id_zona, document.getElementById(`edit-zona-${z.id_zona}`).value)} className="btn-primary" style={{ width: 'auto', padding: '0.4rem 1rem' }}>Guardar</button>
                          <button onClick={() => setEditingZona(null)} className="btn-secondary" style={{ width: 'auto', padding: '0.4rem 1rem' }}>Cancelar</button>
                        </div>
                      </div>
                  ) : (
                    <>
                      <span>{z.nombre_zona}</span>
                      <button onClick={() => setEditingZona(z.id_zona)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Editar</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 className="text-blue" style={{ marginBottom: '1.5rem' }}>Sectores</h3>
            <form onSubmit={handleAddSector} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                  className="input-field"
                  required
                  value={nuevoSector.id_zona}
                  onChange={e => setNuevoSector({...nuevoSector, id_zona: e.target.value})}
                  onBlur={() => setTouchedSector(t => ({ ...t, id_zona: true }))}
                  style={{ flex: 1, minWidth: '150px' }}
                >
                  <option value="">Seleccione Zona...</option>
                  {zonas.map(z => <option key={z.id_zona} value={z.id_zona}>{z.nombre_zona}</option>)}
                </select>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nuevo Sector..."
                  required
                  value={nuevoSector.nombre_sector}
                  onChange={e => setNuevoSector({...nuevoSector, nombre_sector: allowTextWithPunctuation(e.target.value)})}
                  onBlur={() => setTouchedSector(t => ({ ...t, nombre_sector: true }))}
                  style={{ flex: 2, minWidth: '200px' }}
                />
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}><Plus size={18}/></button>
              </div>
              {touchedSector.id_zona && !nuevoSector.id_zona && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Debe seleccionar una zona.</span>
              )}
              {touchedSector.nombre_sector && !nuevoSector.nombre_sector.trim() && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El nombre del sector es obligatorio.</span>
              )}
            </form>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
              {sectores.map(s => (
                <div key={s.id_sector} style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {editingSector === s.id_sector ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Editando Sector: <strong style={{color: 'var(--text-color)'}}>{s.nombre_sector}</strong></div>
                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                          <input 
                            type="text" 
                            className="input-field" 
                            defaultValue={s.nombre_sector} 
                            id={`edit-sector-${s.id_sector}`}
                            style={{ flex: 1, minWidth: '150px' }}
                            autoFocus
                          />
                          <button onClick={() => handleUpdateSector(s.id_sector, document.getElementById(`edit-sector-${s.id_sector}`).value)} className="btn-primary" style={{ width: 'auto', padding: '0.4rem 1rem' }}>Guardar</button>
                          <button onClick={() => setEditingSector(null)} className="btn-secondary" style={{ width: 'auto', padding: '0.4rem 1rem' }}>Cancelar</button>
                        </div>
                      </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div>
                        <strong>{s.nombre_sector}</strong> <span className="text-muted" style={{fontSize: '0.8rem'}}>({s.nombre_zona})</span>
                      </div>
                      <button onClick={() => setEditingSector(s.id_sector)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Editar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: TITULOS EDUCATIVOS */}
      {activeTab === 'titulos' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <h3 className="text-primary" style={{ marginBottom: '1.5rem' }}>Catálogo de Títulos Universitarios / Educativos</h3>
          
          <form onSubmit={handleAddTitulo} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. Ingeniero Agrónomo..."
                required
                value={nuevoTitulo}
                onChange={e => setNuevoTitulo(allowTextWithPunctuation(e.target.value))}
                onBlur={() => setTouchedTitulo(true)}
              />
              <button type="submit" className="btn-primary" style={{ width: 'auto', gap: '0.5rem' }}><Plus size={18}/> Agregar Título</button>
            </div>
            {touchedTitulo && !nuevoTitulo.trim() && (
              <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El nombre del título es obligatorio.</span>
            )}
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {titulos.map(t => (
              <div key={t.codigo} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={16} className="text-blue" /> {t.nombre}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
