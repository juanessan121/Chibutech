import { useState, useEffect, useMemo } from 'react';
import {
  Users, FileText, ShieldAlert, Droplets, ArrowRight,
  User, Banknote, TrendingUp, ClipboardList,
  MapPin, CalendarCheck, ChevronDown, ChevronUp
} from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import axios from '../services/axiosConfig';

// Importar imágenes de fondo
import bgUsuarios   from '../assets/bg_usuarios.png';
import bgMingas     from '../assets/bg_mingas.png';
import bgCobros     from '../assets/bg_cobros.png';
import bgReportes   from '../assets/bg_reportes.png';
import bgHeader     from '../assets/bg_header.png';

// ─────────────────────────────────────────────────────────────────────────────
// DATA POR ROL
// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { hasPermission } = usePermissions();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false); // Desplegable para las estadísticas
  const [realData, setRealData] = useState({ comuneros: 0, recaudacion: 0, multasPendientes: null, mingasMes: null, terrenos: null });

  const isUsuarioBase = user?.rol === 'Comunero' || user?.rol === 'Usuario Regular' || user?.rol === 'Usuario';
  const [comuneroData, setComuneroData] = useState(null);
  const [loadingComunero, setLoadingComunero] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    if (!isUsuarioBase) {
      const fetchDashboardData = async () => {
        try {
          const res = await axios.get('/dashboard/resumen', { signal: controller.signal });
          const d = res.data.data;
          setRealData({
            comuneros:        d.comuneros         ?? 0,
            recaudacion:      d.ingresos          ?? 0,
            mingasMes:        d.mingas_mes        ?? 0,
            terrenos:         d.terrenos          ?? 0,
            multasPendientes: d.multas_pendientes ?? 0,
          });
        } catch (error) {
          if (!controller.signal.aborted) console.error('Error cargando datos del dashboard', error);
        }
      };
      fetchDashboardData();
    } else {
      setLoadingComunero(true);
      axios.get('/dashboard/resumen-comunero', { signal: controller.signal })
        .then(res => setComuneroData(res.data.data))
        .catch(err => { if (!controller.signal.aborted) console.error('Error cargando datos del comunero', err); })
        .finally(() => setLoadingComunero(false));
    }

    return () => controller.abort();
  }, [isUsuarioBase]);

  // Recalcula solo cuando cambia el rol o llegan datos reales de la API
  const stats = useMemo(() => {
    const rol = user?.rol;
    const STATS_ADMIN = [
      { title: 'Comuneros Registrados', value: realData.comuneros,    icon: Users,         color: '#0ea5e9', trend: 0, trendLabel: 'padrón general',  subtext: 'Padrón activo del sistema' },
      { title: 'Recaudación del Mes',   value: realData.recaudacion,  icon: Banknote,      color: '#10b981', trend: 0, trendLabel: 'acumulado actual', subtext: 'Planillas + multas cobradas', prefix: '$' },
      { title: 'Multas Pendientes',     value: realData.multasPendientes ?? '—', icon: ShieldAlert,   color: '#ef4444', subtext: 'Usuarios con deuda activa' },
      { title: 'Mingas del Mes',        value: realData.mingasMes ?? '—',        icon: ClipboardList, color: '#f59e0b', subtext: 'Jornadas comunitarias programadas' },
      { title: 'Terrenos Catastrados',  value: realData.terrenos ?? '—',         icon: MapPin,        color: '#8b5cf6', subtext: 'Lotes con derecho a riego' },
      { title: 'Ingresos del Año',      value: realData.recaudacion,  icon: TrendingUp,    color: '#6366f1', trend: 0, trendLabel: 'acumulado anual', subtext: 'Total recaudado', prefix: '$' },
    ];
    const STATS_TESORERO = [
      { title: 'Recaudación del Mes',   value: realData.recaudacion,  icon: Banknote,    color: '#10b981', trend: 0, trendLabel: 'acumulado actual', subtext: 'Total cobrado en caja', prefix: '$' },
      { title: 'Multas Pendientes',     value: realData.multasPendientes ?? '—', icon: ShieldAlert, color: '#ef4444', subtext: 'Requieren cobro inmediato' },
    ];
    const STATS_SECRETARIO = [
      { title: 'Comuneros Registrados', value: realData.comuneros,        icon: Users,         color: '#0ea5e9', subtext: 'En el padrón activo' },
      { title: 'Mingas Programadas',    value: realData.mingasMes ?? '—', icon: ClipboardList, color: '#f59e0b', subtext: 'Este mes en el calendario' },
    ];
    const STATS_USUARIO = [
      { title: 'Mis Multas Pendientes', value: '—', icon: ShieldAlert,   color: '#ef4444', subtext: 'Cargando...' },
      { title: 'Total a Pagar',         value: '—', icon: Banknote,      color: '#f59e0b', subtext: 'Cargando...', prefix: '$' },
      { title: 'Asistencia a Mingas',   value: '—', icon: CalendarCheck, color: '#10b981', subtext: 'Cargando...', suffix: '%' },
      { title: 'Lotes Registrados',     value: '—', icon: MapPin,        color: '#0ea5e9', subtext: 'Cargando...' },
    ];

    if (rol === 'Administrador' || rol === 'Presidente' || rol === 'Vicepresidente') return STATS_ADMIN;
    if (rol === 'Tesorero') return STATS_TESORERO;
    if (rol === 'Secretario' || rol?.startsWith('Vocal')) return STATS_SECRETARIO;
    return STATS_USUARIO;
  }, [user?.rol, realData]);

  return (
    <div className="dashboard-page animate-fade-in pb-10">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        className="dashboard-header glass-card"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 100%), url(${bgHeader})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="header-greeting">
          <h1>¡Hola, {user?.nombre_completo || user?.username}! 👋</h1>
          <p>
            {isUsuarioBase
              ? 'Aquí puedes revisar tu estado de cuenta y obligaciones comunitarias.'
              : `Bienvenido. Rol activo: ${user?.rol}. ¿Qué deseas gestionar hoy?`}
          </p>
        </div>
        <div className="header-stats">
          {isUsuarioBase ? (
            <>
              <div className="stat-item">
                <span className="stat-value" style={{ fontSize: '1.5rem', color: comuneroData?.total_deuda > 0 ? '#ef4444' : '#10b981' }}>
                  {loadingComunero ? '...' : comuneroData?.total_deuda > 0 ? `$${comuneroData.total_deuda.toFixed(2)}` : 'Al Día'}
                </span>
                <span className="stat-label">{comuneroData?.total_deuda > 0 ? 'Deuda pendiente' : 'Estado General'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value" style={{ fontSize: '1.5rem' }}>
                  {loadingComunero ? '...' : comuneroData?.terrenos?.length ?? 0}
                </span>
                <span className="stat-label">Predio{(comuneroData?.terrenos?.length ?? 0) !== 1 ? 's' : ''} registrado{(comuneroData?.terrenos?.length ?? 0) !== 1 ? 's' : ''}</span>
              </div>
            </>
          ) : (
            <>
              <div className="stat-item">
                <span className="stat-value">{realData.comuneros}</span>
                <span className="stat-label">Comuneros Activos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">${realData.recaudacion.toFixed(2)}</span>
                <span className="stat-label">Recaudación Mensual</span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── GRID DE MÓDULOS (AHORA AL PRINCIPIO) ───────────────────────────── */}
      {!isUsuarioBase && (
        <div className="modules-grid" style={{ marginTop: '2rem' }}>

          {hasPermission('crear_usuario') && (
            <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/usuarios')}>
              <div className="module-banner bg-gradient-purple" style={{ backgroundImage: `url(${bgUsuarios})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }} />
              <div className="module-content">
                <div className="module-icon bg-purple"><Users size={28} /></div>
                <h3>Gestión de Usuarios</h3>
                <p>Administra la directiva, agricultores y permisos del sistema.</p>
                <button className="btn-module" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/usuarios'); }}>
                  Abrir Módulo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {hasPermission('crear_usuario') && (
            <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/catastro')}>
              <div className="module-banner" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.5), rgba(3,105,161,0.5))', opacity: 0.8 }} />
              <div className="module-content">
                <div className="module-icon bg-blue"><MapPin size={28} /></div>
                <h3>Catastros</h3>
                <p>Registra y administra los terrenos y el padrón de riego.</p>
                <button className="btn-module text-blue" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/catastro'); }}>
                  Abrir Módulo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {hasPermission('gestionar_mingas') && (
            <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mingas')}>
              <div className="module-banner bg-gradient-green" style={{ backgroundImage: `url(${bgMingas})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }} />
              <div className="module-content">
                <div className="module-icon bg-green"><ClipboardList size={28} /></div>
                <h3>Control de Mingas</h3>
                <p>Organiza el trabajo comunitario y toma asistencia fácilmente.</p>
                <button className="btn-module text-green" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/mingas'); }}>
                  Abrir Módulo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {hasPermission('gestionar_multas') && (
            <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/cobros')}>
              <div className="module-banner bg-gradient-red" style={{ backgroundImage: `url(${bgCobros})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }} />
              <div className="module-content">
                <div className="module-icon bg-red"><ShieldAlert size={28} /></div>
                <h3>Cobros y Multas</h3>
                <p>Revisa inasistencias y registra pagos en la caja comunitaria.</p>
                <button className="btn-module text-red" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/cobros'); }}>
                  Abrir Módulo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {hasPermission('ver_reportes') && (
            <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/reportes')}>
              <div className="module-banner bg-gradient-blue" style={{ backgroundImage: `url(${bgReportes})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }} />
              <div className="module-content">
                <div className="module-icon bg-blue"><FileText size={28} /></div>
                <h3>Reportes y Finanzas</h3>
                <p>Genera reportes de transparencia para toda la comunidad.</p>
                <button className="btn-module text-blue" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/reportes'); }}>
                  Abrir Módulo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CARDS DEL USUARIO COMUNERO (AHORA AL PRINCIPIO) ────────────────── */}
      {isUsuarioBase && (
        <div className="modules-grid animate-fade-in" style={{ marginTop: '2.5rem' }}>

          {/* CARD 1: MIS TERRENOS — datos reales */}
          {(() => {
            const terrenos = comuneroData?.terrenos ?? [];
            const primero  = terrenos[0];
            return (
              <div
                className="glass-card module-card hover-glow cursor-pointer"
                onClick={() => primero ? navigate(`/dashboard/catastro/detalles/${primero.id_terreno}`) : navigate('/dashboard/mis-terrenos')}
                style={{ borderTop: '4px solid #0ea5e9' }}
              >
                <div className="module-banner" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(3,105,161,0.2))' }} />
                <div className="module-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="module-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', color: 'white', boxShadow: '0 10px 20px rgba(14,165,233,0.3)' }}><Droplets size={28} /></div>
                  <h3>Mis Terrenos y Derechos</h3>
                  {loadingComunero ? (
                    <p className="text-muted">Cargando...</p>
                  ) : terrenos.length === 0 ? (
                    <p className="text-muted">No tienes terrenos registrados.</p>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', flex: 1 }}>
                        {terrenos.slice(0, 3).map((t, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: i < Math.min(terrenos.length, 3) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{t.clave_catastral}</span>
                            <strong style={{ fontSize: '0.85rem' }}>{t.area_ha} Ha — {t.sector}</strong>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', padding: '0.6rem', borderRadius: '0.5rem', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>
                        {terrenos.length} predio{terrenos.length !== 1 ? 's' : ''} registrado{terrenos.length !== 1 ? 's' : ''}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* CARD 2: PRÓXIMA MINGA — datos reales */}
          {(() => {
            const minga = comuneroData?.minga_proxima;
            const fecha = minga ? new Date(minga.fecha + 'T12:00:00').toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' }) : null;
            return (
              <div
                className="glass-card module-card"
                style={{ borderTop: `4px solid ${minga ? '#f59e0b' : '#4b5563'}` }}
              >
                <div className="module-banner" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(180,83,9,0.2))' }} />
                <div className="module-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="module-icon" style={{ background: minga ? 'linear-gradient(135deg, #f59e0b, #b45309)' : 'rgba(75,85,99,0.5)', color: 'white', boxShadow: minga ? '0 10px 20px rgba(245,158,11,0.3)' : 'none' }}><Users size={28} /></div>
                  <h3>Próxima Minga</h3>
                  {loadingComunero ? (
                    <p className="text-muted">Cargando...</p>
                  ) : !minga ? (
                    <p className="text-muted" style={{ flex: 1 }}>No hay mingas programadas por el momento.</p>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Fecha:</span> <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{fecha}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Lugar:</span> <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{minga.lugar}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Actividad:</span> <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{minga.actividad}</strong></div>
                      </div>
                      <div style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '0.6rem', borderRadius: '0.5rem', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Multa por inasistencia:</span>
                        <span style={{ fontSize: '1.2rem' }}>${minga.multa.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* CARD 3: OBLIGACIONES — datos reales */}
          {(() => {
            const total    = comuneroData?.total_deuda ?? 0;
            const multas   = comuneroData?.multas_count ?? 0;
            const planillas= comuneroData?.planillas_count ?? 0;
            const deudas   = comuneroData?.deudas_detalle ?? [];
            const sinDeuda = !loadingComunero && total === 0;
            return (
              <div
                className="glass-card module-card hover-glow cursor-pointer"
                onClick={() => navigate('/dashboard/mis-deudas')}
                style={{ borderTop: `4px solid ${sinDeuda ? '#10b981' : '#ef4444'}` }}
              >
                <div className="module-banner" style={{ background: sinDeuda ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))' : 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(185,28,28,0.2))' }} />
                <div className="module-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="module-icon" style={{ background: sinDeuda ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white' }}><ShieldAlert size={28} /></div>
                  <h3>Obligaciones y Multas</h3>
                  {loadingComunero ? (
                    <p className="text-muted">Cargando...</p>
                  ) : sinDeuda ? (
                    <>
                      <p style={{ color: '#10b981', fontWeight: '600', flex: 1 }}>¡Estás al día! No tienes deudas pendientes.</p>
                      <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.6rem', borderRadius: '0.5rem', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>
                        ✓ Sin deudas pendientes
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', flex: 1 }}>
                        {multas > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Multas pendientes:</span> <strong style={{ color: '#ef4444' }}>{multas}</strong></div>}
                        {planillas > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Planillas de agua:</span> <strong style={{ color: '#f59e0b' }}>{planillas}</strong></div>}
                        {deudas.slice(0, 2).map((d, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem' }}>
                            <span className="text-muted">{d.motivo}</span>
                            <span style={{ color: '#ef4444' }}>${d.monto.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', background: 'rgba(239,68,68,0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}>
                        <span style={{ color: '#ef4444', fontWeight: '500' }}>Total a Pagar:</span>
                        <span style={{ fontSize: '1.4rem', color: '#ef4444', fontWeight: 'bold' }}>${total.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* ── DESPLEGABLE DE ESTADÍSTICAS E INFORMACIÓN SECUNDARIA ────────────── */}
      <div style={{ marginTop: '3rem' }}>
        <button 
          onClick={() => setShowStats(!showStats)}
          className="btn-secondary-outline"
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)' }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{showStats ? 'Ocultar Resumen Estadístico' : 'Ver Resumen Estadístico e Información Adicional'}</span>
          {showStats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {showStats && (
        <div className="animate-fade-in">
          {/* ── TARJETA DE PERFIL (no Admin) ─────────────────────────────────── */}
          {user?.rol !== 'Administrador' && (
            <div
              className="glass-card hover-glow"
              style={{ padding: '2.5rem', marginTop: '2rem', display: 'flex', gap: '2.5rem', alignItems: 'center', borderLeft: '4px solid var(--primary)', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
              <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '2px solid var(--primary)', color: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, zIndex: 1, boxShadow: '0 10px 25px -5px rgba(14,165,233,0.4)' }}>
                <User size={55} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                      <h2 style={{ color: 'var(--text-main)', fontSize: '2rem', margin: 0 }}>{user?.username?.toUpperCase()}</h2>
                      <span className="badge" style={{ background: 'var(--primary)', color: '#000', fontWeight: 'bold', fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                        {user?.rol?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
                      Comunero Activo • Miembro registrado en el sistema de la Junta de Agua Chibuleo
                    </p>
                  </div>
                  <button className="btn-secondary-outline hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.05)' }}>
                    <FileText size={18} /> Ver mi Expediente
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ background: comuneroData?.total_deuda > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${comuneroData?.total_deuda > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, color: comuneroData?.total_deuda > 0 ? '#ef4444' : '#10b981', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert size={18} /> {comuneroData?.total_deuda > 0 ? `${comuneroData.multas_count + comuneroData.planillas_count} deuda(s) pendiente(s)` : 'Sin deudas pendientes'}
                  </span>
                  <span style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', color: '#0ea5e9', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={18} /> {comuneroData?.terrenos?.length ?? 0} predio{(comuneroData?.terrenos?.length ?? 0) !== 1 ? 's' : ''} catastrado{(comuneroData?.terrenos?.length ?? 0) !== 1 ? 's' : ''}
                  </span>
                  {comuneroData?.minga_proxima && (
                    <span style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={18} /> Minga: {new Date(comuneroData.minga_proxima.fecha + 'T12:00:00').toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── STAT CARDS (por rol) ───────────────────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginTop: '2rem',
            }}
          >
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

          {/* ── GRÁFICOS ESTADÍSTICOS (solo para gestores) ───────────────────── */}
          {!isUsuarioBase && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              {/* Recaudación */}
              <div className="chart-container-dashboard glass-card hover-glow">
                <div className="chart-header">
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>Recaudación Mensual (Planillas + Multas)</h4>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', margin: 0 }}>+12% vs. Mayo</span>
                </div>
                <div className="chart-body-svg">
                  <svg viewBox="0 0 400 200" style={{ width: '100%', height: '180px' }}>
                    <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.05)" />
                    <line x1="40" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.05)" />
                    <line x1="40" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.05)" />
                    <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(255,255,255,0.1)" />
                    <text x="10" y="25" fill="var(--text-muted)" fontSize="9">$2.5k</text>
                    <text x="10" y="75" fill="var(--text-muted)" fontSize="9">$1.5k</text>
                    <text x="10" y="125" fill="var(--text-muted)" fontSize="9">$500</text>
                    <text x="15" y="175" fill="var(--text-muted)" fontSize="9">$0</text>
                    <path d="M 40,170 Q 90,130 140,110 T 240,80 T 340,30 L 340,170 Z" fill="url(#area-gradient)" opacity="0.3" />
                    <path d="M 40,170 Q 90,130 140,110 T 240,80 T 340,30" fill="none" stroke="var(--primary)" strokeWidth="3" />
                    <defs>
                      <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <circle cx="140" cy="110" r="4" fill="var(--primary)" stroke="white" strokeWidth="1.5" />
                    <circle cx="240" cy="80" r="4" fill="var(--primary)" stroke="white" strokeWidth="1.5" />
                    <circle cx="340" cy="30" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
                    <text x="320" y="20" fill="white" fontSize="10" fontWeight="bold">$2,340</text>
                    <text x="40" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Ene</text>
                    <text x="100" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Feb</text>
                    <text x="160" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Mar</text>
                    <text x="220" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Abr</text>
                    <text x="280" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">May</text>
                    <text x="340" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Jun</text>
                  </svg>
                </div>
              </div>

              {/* Asistencia */}
              <div className="chart-container-dashboard glass-card hover-glow">
                <div className="chart-header">
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>Asistencia Global a Mingas</h4>
                  <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: 'var(--primary)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', margin: 0 }}>4 Mingas este mes</span>
                </div>
                <div className="chart-body-svg">
                  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '180px' }}>
                    <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <circle 
                      cx="100" cy="100" r="70" 
                      fill="none" 
                      stroke="var(--green)" 
                      strokeWidth="12" 
                      strokeDasharray="439.8" 
                      strokeDashoffset="57"
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                    <text x="100" y="105" fill="white" fontSize="28" fontWeight="800" textAnchor="middle">87%</text>
                    <text x="100" y="130" fill="var(--text-muted)" fontSize="10" fontWeight="bold" textAnchor="middle">Participación</text>
                  </svg>
                </div>
              </div>

              {/* Distribución por Sector */}
              <div className="chart-container-dashboard glass-card hover-glow">
                <div className="chart-header">
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>Predios por Sector Catastrado</h4>
                  <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--purple)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', margin: 0 }}>312 Predios</span>
                </div>
                <div className="chart-body-svg" style={{ display: 'block', padding: '0.5rem 0' }}>
                  <svg viewBox="0 0 300 180" style={{ width: '100%', height: '170px' }}>
                    <text x="10" y="20" fill="white" fontSize="11" fontWeight="600">Sector Centro</text>
                    <text x="290" y="20" fill="var(--text-muted)" fontSize="11" textAnchor="end">120 predios</text>
                    <rect x="10" y="28" width="280" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
                    <rect x="10" y="28" width="215" height="8" rx="4" fill="var(--purple)" />

                    <text x="10" y="60" fill="white" fontSize="11" fontWeight="600">San Luis</text>
                    <text x="290" y="60" fill="var(--text-muted)" fontSize="11" textAnchor="end">85 predios</text>
                    <rect x="10" y="68" width="280" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
                    <rect x="10" y="68" width="152" height="8" rx="4" fill="var(--primary)" />

                    <text x="10" y="100" fill="white" fontSize="11" fontWeight="600">San Francisco</text>
                    <text x="290" y="100" fill="var(--text-muted)" fontSize="11" textAnchor="end">54 predios</text>
                    <rect x="10" y="108" width="280" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
                    <rect x="10" y="108" width="97" height="8" rx="4" fill="var(--green)" />

                    <text x="10" y="140" fill="white" fontSize="11" fontWeight="600">San Miguel</text>
                    <text x="290" y="140" fill="var(--text-muted)" fontSize="11" textAnchor="end">53 predios</text>
                    <rect x="10" y="148" width="280" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
                    <rect x="10" y="148" width="95" height="8" rx="4" fill="var(--yellow)" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ── GRÁFICOS ESTADÍSTICOS (solo para comuneros) ─────────────────── */}
          {isUsuarioBase && comuneroData && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {/* Mis terrenos detallados */}
              <div className="chart-container-dashboard glass-card hover-glow">
                <div className="chart-header">
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>Mis Predios Catastrados</h4>
                  <span className="badge" style={{ background: 'rgba(14,165,233,0.15)', color: 'var(--primary)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', margin: 0 }}>{comuneroData.terrenos.length} predio(s)</span>
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                  {comuneroData.terrenos.length === 0 ? (
                    <p className="text-muted" style={{ padding: '1rem', textAlign: 'center' }}>No tienes predios registrados.</p>
                  ) : comuneroData.terrenos.map((t, i) => (
                    <div key={i} onClick={() => navigate(`/dashboard/catastro/detalles/${t.id_terreno}`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', borderRadius: '0.3rem', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: 'var(--primary)', fontSize: '0.85rem' }}>{t.clave_catastral}</p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.sector} — {t.estado}{t.es_copropietario ? ' (Copropietario)' : ''}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-main)' }}>{t.area_ha} Ha</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.area_m2.toLocaleString('es-EC')} m²</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deudas detalladas */}
              <div className="chart-container-dashboard glass-card hover-glow">
                <div className="chart-header">
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>Detalle de Obligaciones</h4>
                  <span className="badge" style={{ background: comuneroData.total_deuda > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: comuneroData.total_deuda > 0 ? '#ef4444' : '#10b981', fontSize: '0.7rem', padding: '0.2rem 0.5rem', margin: 0 }}>
                    {comuneroData.total_deuda > 0 ? `$${comuneroData.total_deuda.toFixed(2)} pendiente` : 'Al día'}
                  </span>
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                  {comuneroData.deudas_detalle.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: '#10b981' }}>
                      <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>✓</p>
                      <p style={{ margin: 0, fontWeight: '600' }}>¡Sin deudas pendientes!</p>
                    </div>
                  ) : comuneroData.deudas_detalle.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', background: d.tipo === 'Multa' ? 'rgba(239,68,68,0.2)' : 'rgba(14,165,233,0.2)', color: d.tipo === 'Multa' ? '#ef4444' : '#0ea5e9', padding: '0.1rem 0.4rem', borderRadius: '4px', marginRight: '0.5rem' }}>{d.tipo}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{d.motivo}</span>
                      </div>
                      <strong style={{ color: '#ef4444' }}>${d.monto.toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
