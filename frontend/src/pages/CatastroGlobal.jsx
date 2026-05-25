import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Search, ExternalLink, Building2, Fence, MapPin, Plus } from 'lucide-react';

// Simulación de datos: tabla Terreno JOIN Persona JOIN Zona JOIN Catalogo_Estado_Construccion
const terrenosMock = [
  {
    id_terreno: 1,
    propietario: 'Carlos Ruiz Masaquiza',
    cedula: '1801112223',
    zona: 'Sector Centro',
    estado_construccion: 'Construida',
    area_m2: 350.5,
    latitud: -1.3281,
    longitud: -78.5528,
    url_planimetria: 'https://drive.google.com/file/d/abc123',
  },
  {
    id_terreno: 2,
    propietario: 'Ana Luisa Toalombo',
    cedula: '1804445556',
    zona: 'San Luis',
    estado_construccion: 'En Construcción',
    area_m2: 210.0,
    latitud: -1.3300,
    longitud: -78.5510,
    url_planimetria: null,
  },
  {
    id_terreno: 3,
    propietario: 'José Luis Tixilema',
    cedula: '1803334445',
    zona: 'San Francisco',
    estado_construccion: 'Lote Baldío',
    area_m2: 500.0,
    latitud: null,
    longitud: null,
    url_planimetria: null,
  },
  {
    id_terreno: 4,
    propietario: 'María Rosario Chango',
    cedula: '1809990001',
    zona: 'San Miguel',
    estado_construccion: 'Construida',
    area_m2: 180.75,
    latitud: -1.3260,
    longitud: -78.5545,
    url_planimetria: 'https://drive.google.com/file/d/xyz789',
  },
];

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

  const terrenosFiltrados = terrenosMock.filter(t =>
    t.propietario.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.cedula.includes(busqueda) ||
    t.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

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
                onChange={e => setBusqueda(e.target.value)}
                style={{ paddingLeft: '2.25rem', minWidth: '320px' }}
              />
            </div>
          </div>
        </div>

        {/* Resumen por estado de construcción y botón de acción */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', alignItems: 'stretch' }}>
          {/* Tarjetas resumen */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', flex: 1 }}>
            {Object.entries(
              terrenosMock.reduce((acc, t) => {
                acc[t.estado_construccion] = (acc[t.estado_construccion] || 0) + 1;
                return acc;
              }, {})
            ).map(([estado, count]) => (
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
              {['Propietario', 'Zona / Sector', 'Estado', 'Área (m²)', 'Coordenadas GPS', 'Planimetría'].map(h => (
                <th key={h} style={{ padding: '0.9rem 1rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {terrenosFiltrados.map(t => (
              <tr key={t.id_terreno}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '1rem' }}>
                  <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)' }}>{t.propietario}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>C.I: {t.cedula}</p>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                    <Fence size={14} className="text-muted" /> {t.zona}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.3rem 0.75rem', borderRadius: '1rem', fontSize: '0.78rem', fontWeight: 'bold',
                    background: `${estadoColor[t.estado_construccion] || '#64748b'}20`,
                    color: estadoColor[t.estado_construccion] || '#64748b', whiteSpace: 'nowrap'
                  }}>
                    {t.estado_construccion}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>
                  {t.area_m2.toLocaleString('es-EC', { minimumFractionDigits: 2 })} m²
                </td>
                <td style={{ padding: '1rem' }}>
                  {t.latitud ? (
                    <a
                      href={`https://www.google.com/maps?q=${t.latitud},${t.longitud}`}
                      target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem' }}
                    >
                      <MapPin size={14} /> Ver en Mapa
                    </a>
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Sin coordenadas</span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  {t.url_planimetria ? (
                    <a
                      href={t.url_planimetria}
                      target="_blank" rel="noreferrer"
                      className="btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', fontSize: '0.78rem', textDecoration: 'none' }}
                    >
                      <ExternalLink size={14} /> Ver Planimetría
                    </a>
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Sin archivo</span>
                  )}
                </td>
              </tr>
            ))}
            {terrenosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No se encontraron predios para tu búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
