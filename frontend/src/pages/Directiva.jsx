import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, UserCheck, Star, Award, User, UserPlus } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import axios from '../services/axiosConfig';

// Componentes Iconos auxiliares definidos antes del componente para evitar referencias antes de su declaración
const FileTextIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const DollarSignIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;

export default function Directiva() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  
  // Solo Administrador o Presidente pueden editar la directiva
  const isAdmin = user && (user.rol === 'Administrador' || user.rol === 'Presidente');
  
  // Detectar si estamos viendo el historial
  const queryParams = new URLSearchParams(location.search);
  const periodoHistorial = queryParams.get('periodo');

  const [miembrosDirectiva, setMiembrosDirectiva] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectiva = async () => {
      setLoading(true);
      try {
        const url = periodoHistorial ? `/directiva/historial?periodo=${periodoHistorial}` : '/directiva/actual';
        const res = await axios.get(url);
        
        // Mapear los iconos y colores según el cargo
        const mapeados = res.data.data.map(m => {
          let icono = UserCheck;
          let color = '#64748b';
          
          if (m.cargo.includes('Presidente')) { icono = Award; color = '#f59e0b'; }
          else if (m.cargo.includes('Vicepresidente')) { icono = Star; color = '#0ea5e9'; }
          else if (m.cargo.includes('Secretario')) { icono = FileTextIcon; color = '#8b5cf6'; }
          else if (m.cargo.includes('Tesorero')) { icono = DollarSignIcon; color = '#10b981'; }

          return { ...m, icono, color };
        });

        setMiembrosDirectiva(mapeados);
      } catch (error) {
        console.error("Error al obtener la directiva:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectiva();
  }, [periodoHistorial]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando directiva...</div>;

  return (
    <div className="animate-fade-in pb-10">
      
      {periodoHistorial && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--red)', color: 'var(--red)', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 'bold' }}>
          ⚠️ Estás visualizando un archivo histórico de la Directiva del periodo {periodoHistorial}. Estas autoridades ya NO están en funciones.
        </div>
      )}

      <div className="page-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Shield size={48} className={periodoHistorial ? "text-muted" : "text-yellow"} style={{ marginBottom: '1rem' }} />
          <h1>{periodoHistorial ? `Archivo Histórico: Periodo ${periodoHistorial}` : 'Junta Directiva Actual'}</h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '1.5rem' }}>
            {periodoHistorial ? 'Registro organizativo de las autoridades que sirvieron en el pasado.' : 'Estructura organizativa y autoridades vigentes de la comunidad.'}
          </p>
          {!periodoHistorial && isAdmin && (
            <button className="btn-primary" onClick={() => navigate('/dashboard/directiva/gestionar')} style={{ width: 'auto', gap: '0.5rem', background: '#f59e0b', color: '#000', padding: '0.8rem 1.5rem', borderRadius: '2rem', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <UserPlus size={18} /> Administrar y Registrar Directivas
            </button>
          )}
        </div>
      </div>

      {/* ORGANIGRAMA VISUAL */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        
        {/* NIVEL 1: PRESIDENTE */}
        {miembrosDirectiva.filter(m => m.cargo === 'Presidente').map(miembro => (
          <MiembroCard key={miembro.id} miembro={miembro} isMain={true} />
        ))}

        {/* LÍNEA CONECTORA */}
        <div style={{ width: '2px', height: '2rem', background: 'var(--border-color)' }}></div>

        {/* NIVEL 2: VICE, SEC, TESORERO */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', width: '100%', maxWidth: '900px' }}>
          {miembrosDirectiva.filter(m => ['Vicepresidente', 'Secretario', 'Tesorero'].includes(m.cargo)).map(miembro => (
            <MiembroCard key={miembro.id} miembro={miembro} />
          ))}
        </div>

        {/* LÍNEA CONECTORA */}
        <div style={{ width: '2px', height: '2rem', background: 'var(--border-color)' }}></div>

        {/* NIVEL 3: VOCALES */}
        <div style={{ 
          width: '100%', 
          maxWidth: '800px', 
          padding: '2rem', 
          borderRadius: '1.5rem', 
          border: '1px solid var(--border-color)',
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('/src/assets/bg_layout.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Vocales y Representantes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {miembrosDirectiva.filter(m => m.cargo.includes('Vocal')).map(miembro => (
              <div key={miembro.id} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', borderLeft: `3px solid ${miembro.color}` }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${miembro.color}20`, color: miembro.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>{miembro.nombre}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: miembro.color }}>{miembro.cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-componente para las tarjetas principales
function MiembroCard({ miembro, isMain = false }) {
  const Icono = miembro.icono;
  return (
    <div className="glass-card hover-glow" style={{ 
      padding: isMain ? '2.5rem' : '1.5rem', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      textAlign: 'center',
      minWidth: isMain ? '320px' : '250px',
      borderTop: `4px solid ${miembro.color}`,
      backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.95)), url('/src/assets/bg_layout.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: `0 10px 30px -10px ${miembro.color}40`
    }}>
      <div style={{ 
        width: isMain ? '80px' : '60px', 
        height: isMain ? '80px' : '60px', 
        borderRadius: '50%', 
        background: `${miembro.color}20`, 
        color: miembro.color, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        <Icono size={isMain ? 40 : 30} />
      </div>
      <h2 style={{ fontSize: isMain ? '1.5rem' : '1.2rem', color: 'var(--text-main)', margin: '0 0 0.2rem 0' }}>{miembro.nombre}</h2>
      <span style={{ fontWeight: 'bold', color: miembro.color, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>{miembro.cargo}</span>
      <span className="text-muted" style={{ fontSize: '0.8rem' }}>C.I: {miembro.cedula}</span>
    </div>
  );
}
