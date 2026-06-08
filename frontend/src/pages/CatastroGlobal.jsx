import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Search, ExternalLink, Building2, Fence, MapPin, Plus, Edit2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTerrenos, updateEstadoTerreno } from '../services/terrenoService';
import { toast } from 'sonner';



const estadoColor = {
  'Construida':       '#10b981',
  'En Construcción':  '#f59e0b',
  'Lote Baldío':      '#64748b',
  'En Planificación': '#3b82f6',
  'Demolido':         '#ef4444',
};

export default function CatastroGlobal() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [terrenos, setTerrenos] = useState([]);
  const [resumenEstados, setResumenEstados] = useState({});
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalTerrenos, setTotalTerrenos] = useState(0);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const debounceRef = useRef(null);

  const cargarDatos = async (busq, pag) => {
    try {
      const res = await getTerrenos({ busqueda: busq || undefined, page: pag });
      setTerrenos(res.data || []);
      setResumenEstados(res.resumen_estados || {});
      if (res.pagination) {
        setTotalPaginas(res.pagination.last_page);
        setTotalTerrenos(res.pagination.total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDatos('', 1);
  }, []);

  const handleBusqueda = (e) => {
    const val = e.target.value;
    setBusqueda(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPagina(1);
      cargarDatos(val, 1);
    }, 350);
  };

  const handlePagina = (nueva) => {
    setPagina(nueva);
    cargarDatos(busqueda, nueva);
  };

  const handleGuardarEstado = async (id_terreno) => {
    try {
      const mapVal = {'Lote Baldío': 1, 'En Planificación': 2, 'En Construcción': 3, 'Construida': 4};
      const idEstado = mapVal[nuevoEstado] || 1;
      await updateEstadoTerreno(id_terreno, idEstado);
      toast.success('Estado del predio actualizado correctamente.');
      setEditandoId(null);
      cargarDatos(busqueda, pagina);
    } catch (e) {
      toast.error('No se pudo actualizar el estado del predio. Intenta de nuevo.');
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Map className="text-earth" /> Catastro de Predios
            </h1>
            <p className="text-muted">Registro global de todos los terrenos y propiedades en las zonas de la Junta.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Buscar por propietario, cédula o zona..."
                value={busqueda}
                onChange={handleBusqueda}
                style={{ paddingLeft: '2.25rem', minWidth: '320px' }}
              />
            </div>
          </div>
        </div>

        {/* Resumen por estado de construcción y botón de acción */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', alignItems: 'stretch' }}>
          {/* Tarjetas resumen */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', flex: 1 }}>
            {Object.entries(resumenEstados).map(([estado, count]) => (
              <div key={estado} className="glass-card" style={{ padding: '0.75rem 1.25rem', borderLeft: `4px solid ${estadoColor[estado] || '#64748b'}`, display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '180px' }}>
                <Building2 size={24} style={{ color: estadoColor[estado] || '#64748b' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{count}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: estadoColor[estado] || '#64748b' }}>{estado}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Registrar reubicado */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.75rem 2rem', height: '100%', minHeight: '60px' }}
              onClick={() => navigate('/dashboard/terrenos')}
            >
              <Plus size={20} /> Registrar Terreno
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '720px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              {['Propietario', 'Zona', 'Sector', 'Estado', 'Área (m²)', 'Coordenadas GPS', 'Planimetría'].map(h => (
                <th key={h} style={{ padding: '0.9rem 1rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {terrenos.map(t => (
              <tr key={t.id_terreno}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => navigate(`/dashboard/catastro/detalles/${t.id_terreno}`)}
              >
                <td style={{ padding: '1rem' }}>
                  <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)' }}>{t.propietario}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>C.I: {t.cedula}</p>
                  {t.total_copropietarios > 0 && (
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.7rem', color: '#f59e0b' }}
                      title={t.nombres_copros}>
                      +{t.total_copropietarios} copropietario{t.total_copropietarios > 1 ? 's' : ''}
                    </p>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.zona}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Fence size={14} className="text-muted" /> 
                    <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{t.sector}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  {editandoId === t.id_terreno ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select className="input-field" style={{ padding: '0.2rem' }} defaultValue={t.estado_construccion} onChange={e => setNuevoEstado(e.target.value)}>
                        {Object.keys(estadoColor).map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <button onClick={() => handleGuardarEstado(t.id_terreno)} style={{ color: '#10b981' }}><Check size={18} /></button>
                      <button onClick={() => setEditandoId(null)} style={{ color: '#ef4444' }}><X size={18} /></button>
                    </div>
                  ) : (
                    <span style={{
                      padding: '0.3rem 0.75rem', borderRadius: '1rem', fontSize: '0.78rem', fontWeight: 'bold',
                      background: `${estadoColor[t.estado_construccion] || '#64748b'}20`,
                      color: estadoColor[t.estado_construccion] || '#64748b', whiteSpace: 'nowrap'
                    }}>
                      {t.estado_construccion}
                    </span>
                  )}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>
                  {Number(t.area_m2).toLocaleString('es-EC', { minimumFractionDigits: 2 })} m²
                </td>
                <td style={{ padding: '1rem' }}>
                  {t.latitud ? (
                    <a href={`https://www.google.com/maps?q=${t.latitud},${t.longitud}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem' }}>
                      <MapPin size={14} /> Ver en Mapa
                    </a>
                  ) : <span className="text-muted" style={{ fontSize: '0.8rem' }}>Sin coordenadas</span>}
                </td>
                <td style={{ padding: '1rem' }}>
                  {t.url_planimetria ? (
                    <a href={t.url_planimetria} target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', fontSize: '0.78rem', textDecoration: 'none' }}>
                      <ExternalLink size={14} /> Ver Planimetría
                    </a>
                  ) : <span className="text-muted" style={{ fontSize: '0.78rem' }}>Sin archivo</span>}
                </td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => { setEditandoId(t.id_terreno); setNuevoEstado(t.estado_construccion); }} className="text-muted hover:text-primary">
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {terrenos.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No se encontraron predios para tu búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '0 0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Página {pagina} de {totalPaginas} — {totalTerrenos} predios en total
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-secondary"
              style={{ padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              disabled={pagina === 1}
              onClick={() => handlePagina(pagina - 1)}
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              disabled={pagina === totalPaginas}
              onClick={() => handlePagina(pagina + 1)}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
