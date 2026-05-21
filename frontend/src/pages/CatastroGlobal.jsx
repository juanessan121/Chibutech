import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Search, FileDown, Eye, Building2, Fence, MapPin } from 'lucide-react';

// Simulación de datos de la tabla Terreno + JOIN con Persona y Zona
const terrenosMock = [
  {
    id_terreno: 1,
    propietario: 'Carlos Ruiz Masaquiza',
    cedula: '1801112223',
    zona: 'Sector Centro',
    estado_construccion: 'Construido',
    area_m2: 350.5,
    latitud: -1.3281,
    longitud: -78.5528,
    tiene_escritura: true,
    tiene_planimetria: true,
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
    tiene_escritura: true,
    tiene_planimetria: false,
  },
  {
    id_terreno: 3,
    propietario: 'José Luis Tixilema',
    cedula: '1803334445',
    zona: 'San Francisco',
    estado_construccion: 'Solar/Terreno',
    area_m2: 500.0,
    latitud: null,
    longitud: null,
    tiene_escritura: false,
    tiene_planimetria: false,
  },
  {
    id_terreno: 4,
    propietario: 'María Rosario Chango',
    cedula: '1809990001',
    zona: 'San Miguel',
    estado_construccion: 'Construido',
    area_m2: 180.75,
    latitud: -1.3260,
    longitud: -78.5545,
    tiene_escritura: true,
    tiene_planimetria: true,
  },
];

const estadoColor = {
  'Construido': '#10b981',
  'En Construcción': '#f59e0b',
  'Solar/Terreno': '#64748b',
  'Demolido': '#ef4444',
};

export default function CatastroGlobal() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const terrenosFiltrados = terrenosMock.filter(t =>
    t.propietario.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.cedula.includes(busqueda) ||
    t.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleDescargarPdf = (idTerreno, tipo) => {
    // En producción: llama al backend que retorna el MEDIUMBLOB como blob descargable
    alert(`Descargando ${tipo} del terreno #${idTerreno} desde la base de datos...`);
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
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Buscar por propietario, cédula o zona..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ paddingLeft: '2.25rem', minWidth: '280px' }}
            />
          </div>
        </div>

        {/* Resumen rápido */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {Object.entries(
            terrenosMock.reduce((acc, t) => {
              acc[t.estado_construccion] = (acc[t.estado_construccion] || 0) + 1;
              return acc;
            }, {})
          ).map(([estado, count]) => (
            <div key={estado} className="glass-card" style={{ padding: '1rem', borderLeft: `4px solid ${estadoColor[estado] || '#64748b'}`, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Building2 size={24} style={{ color: estadoColor[estado] || '#64748b' }} />
              <div>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{count}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: estadoColor[estado] || '#64748b' }}>{estado}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              {['Propietario', 'Zona / Sector', 'Estado', 'Área (m²)', 'Coordenadas', 'Escritura', 'Planimetría'].map(h => (
                <th key={h} style={{ padding: '0.9rem 1rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {terrenosFiltrados.map(t => (
              <tr key={t.id_terreno} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
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
                    padding: '0.3rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    background: `${estadoColor[t.estado_construccion] || '#64748b'}20`,
                    color: estadoColor[t.estado_construccion] || '#64748b',
                    whiteSpace: 'nowrap'
                  }}>
                    {t.estado_construccion}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{t.area_m2} m²</td>
                <td style={{ padding: '1rem' }}>
                  {t.latitud ? (
                    <a
                      href={`https://www.google.com/maps?q=${t.latitud},${t.longitud}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem' }}
                    >
                      <MapPin size={14} /> Ver en Mapa
                    </a>
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Sin coordenadas</span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  {t.tiene_escritura ? (
                    <button
                      onClick={() => handleDescargarPdf(t.id_terreno, 'Escritura')}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem', gap: '0.4rem' }}
                    >
                      <FileDown size={14} /> Escritura
                    </button>
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Sin archivo</span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  {t.tiene_planimetria ? (
                    <button
                      onClick={() => handleDescargarPdf(t.id_terreno, 'Planimetría')}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem', gap: '0.4rem' }}
                    >
                      <FileDown size={14} /> Planimetría
                    </button>
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Sin archivo</span>
                  )}
                </td>
              </tr>
            ))}
            {terrenosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
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
