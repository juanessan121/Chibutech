import { useState, useEffect } from 'react';
import { MapPin, Building2, Navigation, ArrowLeft, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import axios from '../services/axiosConfig';

export default function MisTerrenos() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [terrenos, setTerrenos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get('/dashboard/resumen-comunero')
      .then(res => setTerrenos(res.data.data?.terrenos || []))
      .catch(() => setTerrenos([]))
      .finally(() => setCargando(false));
  }, []);

  const estadoColor = {
    'Construida':       '#10b981',
    'En Construcción':  '#f59e0b',
    'Lote Baldío':      '#64748b',
    'En Planificación': '#3b82f6',
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Inicio
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin className="text-green" /> Mis Terrenos
          </h1>
          <p className="text-muted">Información catastral de tus predios registrados en la Junta de Agua.</p>
        </div>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Cargando predios...</div>
      ) : terrenos.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <MapPin size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3 style={{ margin: 0, color: 'var(--text-main)' }}>No tienes predios registrados</h3>
          <p style={{ marginTop: '0.5rem' }}>Para registrar un terreno comunícate con la directiva de la Junta.</p>
        </div>
      ) : (
        <>
          {/* Resumen */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Predios</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{terrenos.length}</p>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Área Total</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>
                {terrenos.reduce((s, t) => s + t.area_m2, 0).toLocaleString('es-EC')} m²
              </p>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hectáreas</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>
                {terrenos.reduce((s, t) => s + t.area_ha, 0).toFixed(4)} Ha
              </p>
            </div>
          </div>

          {/* Grid de terrenos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {terrenos.map(t => (
              <div
                key={t.id_terreno}
                className="glass-card"
                style={{ padding: '1.5rem', borderTop: `4px solid ${estadoColor[t.estado] || '#64748b'}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                      {t.sector}
                      {t.es_copropietario && (
                        <span style={{ fontSize: '0.7rem', marginLeft: '0.5rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Copropietario</span>
                      )}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '1rem', background: `${estadoColor[t.estado] || '#64748b'}20`, color: estadoColor[t.estado] || '#64748b', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    {t.estado}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Área</p>
                    <p style={{ margin: '0.2rem 0 0 0', fontWeight: '700', color: 'var(--text-main)' }}>{t.area_m2.toLocaleString('es-EC')} m²</p>
                    <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.area_ha} Ha</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cuota mensual</p>
                    <p style={{ margin: '0.2rem 0 0 0', fontWeight: '700', color: '#10b981', fontSize: '1.1rem' }}>
                      ${(Math.ceil(t.area_m2 / 1000) * 5).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/dashboard/catastro/detalles/${t.id_terreno}`)}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', fontSize: '0.85rem' }}
                  >
                    <Building2 size={16} /> Ver Ficha Completa y PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
