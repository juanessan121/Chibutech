import React, { useState, useMemo } from 'react';
import { MapPin, Building2, Fence, FileText, Search, Plus, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import BadgeEstado from '../components/ui/BadgeEstado';

const misTerrenosMock = [
  {
    id_terreno: 1,
    zona: 'Sector Centro',
    estado_construccion: 'Construida',
    area_m2: 350.5,
    latitud: -1.3281,
    longitud: -78.5528,
    url_planimetria: 'https://drive.google.com/file/d/abc123',
    fecha_registro: '2025-10-15'
  },
  {
    id_terreno: 2,
    zona: 'San Luis',
    estado_construccion: 'Lote Baldío',
    area_m2: 500.0,
    latitud: -1.3300,
    longitud: -78.5510,
    url_planimetria: null,
    fecha_registro: '2025-11-02'
  }
];

export default function MisTerrenos() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  // Cálculo de métricas automáticas
  const totalArea = misTerrenosMock.reduce((sum, t) => sum + t.area_m2, 0);
  const totalConstruidos = misTerrenosMock.filter(t => t.estado_construccion === 'Construida').length;

  // Filtrado de terrenos
  const terrenosFiltrados = useMemo(() => {
    return misTerrenosMock.filter(t => {
      const matchTexto = t.zona.toLowerCase().includes(busqueda.toLowerCase());
      const matchEstado = filtroEstado === 'Todos' || t.estado_construccion === filtroEstado;
      return matchTexto && matchEstado;
    });
  }, [busqueda, filtroEstado]);

  return (
    <div className="animate-fade-in pb-10">
      <PageHeader 
        title="Mis Terrenos Registrados"
        description="Consulta la información, estado y ubicación de tus propios predios de forma privada."
        icon={MapPin}
        iconColor="#10b981"
        actions={
          <button onClick={() => navigate('/dashboard/terrenos')} className="btn-primary hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Registrar Nuevo
          </button>
        }
      />

      {misTerrenosMock.length === 0 ? (
        <EmptyState 
          icon={MapPin}
          title="No tienes terrenos registrados"
          message="Parece que aún no has inscrito ningún predio en el sistema. Puedes empezar registrando tu primer terreno."
          action={
            <button onClick={() => navigate('/dashboard/terrenos')} className="btn-primary">
              <Plus size={18} style={{ marginRight: '0.5rem' }} /> Iniciar Registro
            </button>
          }
        />
      ) : (
        <>
          {/* Dashboard Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <StatCard 
              title="Predios Registrados"
              value={misTerrenosMock.length}
              icon={Fence}
              color="#3b82f6"
              subtext="Total de terrenos a tu nombre"
            />
            <StatCard 
              title="Área Total"
              value={totalArea}
              suffix="m²"
              icon={MapPin}
              color="#10b981"
              subtext="Suma de áreas de tus predios"
            />
            <StatCard 
              title="Predios Construidos"
              value={totalConstruidos}
              icon={Building2}
              color="#8b5cf6"
              subtext="Terrenos con construcciones"
            />
          </div>

          {/* Barra de Filtros */}
          <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                className="input-field"
                placeholder="Buscar por zona o sector..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Todos', 'Construida', 'En Construcción', 'Lote Baldío'].map(estado => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={filtroEstado === estado ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Terrenos */}
          {terrenosFiltrados.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No se encontraron terrenos con los filtros aplicados.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {terrenosFiltrados.map(t => (
                <div key={t.id_terreno} className="glass-card hover-scale" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `4px solid ${t.estado_construccion === 'Construida' ? '#10b981' : t.estado_construccion === 'En Construcción' ? '#f59e0b' : '#94a3b8'}` }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                      <Fence size={20} className="text-earth" /> 
                      <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{t.zona}</span>
                    </div>
                    <BadgeEstado estado={t.estado_construccion} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.25rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Área Total</p>
                      <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-main)', fontSize: '1.1rem' }}>{t.area_m2.toLocaleString('es-EC')} m²</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Fecha Registro</p>
                      <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-main)', fontSize: '1.1rem' }}>{t.fecha_registro}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {t.latitud && t.longitud ? (
                      <a
                        href={`https://www.google.com/maps?q=${t.latitud},${t.longitud}`}
                        target="_blank" rel="noreferrer"
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.6rem', fontSize: '0.85rem' }}
                      >
                        <Navigation size={16} /> Ver Ubicación GPS
                      </a>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                        Sin coordenadas registradas
                      </div>
                    )}

                    {t.url_planimetria ? (
                      <a
                        href={t.url_planimetria}
                        target="_blank" rel="noreferrer"
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.6rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                      >
                        <FileText size={16} /> Documento de Planimetría
                      </a>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
                        Sin documento adjunto
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
