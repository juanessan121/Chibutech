import React from 'react';
import {
  Users, FileText, ShieldAlert, Droplets, ArrowRight,
  User, Banknote, TrendingUp, ClipboardList, AlertTriangle,
  MapPin, CalendarCheck,
} from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';

// Importar imágenes de fondo
import bgUsuarios   from '../assets/bg_usuarios.png';
import bgMingas     from '../assets/bg_mingas.png';
import bgCobros     from '../assets/bg_cobros.png';
import bgReportes   from '../assets/bg_reportes.png';
import bgDeudas     from '../assets/bg_deudas.png';
import bgHeader     from '../assets/bg_header.png';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — Reemplazar con llamadas API cuando esté disponible
// ─────────────────────────────────────────────────────────────────────────────
const STATS_ADMIN = [
  { title: 'Comuneros Registrados', value: 156, icon: Users,         color: '#0ea5e9', trend: 8,  trendLabel: 'nuevos este mes',  subtext: 'Padrón activo del sistema' },
  { title: 'Recaudación del Mes',   value: 2340, icon: Banknote,      color: '#10b981', trend: 12, trendLabel: 'vs. mes anterior', subtext: 'Planillas + multas cobradas', prefix: '$' },
  { title: 'Multas Pendientes',     value: 23,   icon: ShieldAlert,   color: '#ef4444', trend: -5, trendLabel: 'vs. mes anterior', subtext: 'Usuarios con deuda activa' },
  { title: 'Mingas del Mes',        value: 4,    icon: ClipboardList, color: '#f59e0b', trend: 0,  trendLabel: 'igual que siempre', subtext: 'Jornadas comunitarias programadas' },
  { title: 'Terrenos Catastrados',  value: 312,  icon: MapPin,        color: '#8b5cf6', trend: 3,  trendLabel: 'nuevos predios',   subtext: 'Lotes con derecho a riego' },
  { title: 'Ingresos del Año',      value: 18420, icon: TrendingUp,   color: '#6366f1', trend: 15, trendLabel: 'vs. año anterior', subtext: 'Total acumulado 2024', prefix: '$' },
];

const STATS_TESORERO = [
  { title: 'Recaudación del Mes',   value: 2340, icon: Banknote,    color: '#10b981', trend: 12, trendLabel: 'vs. mes anterior', subtext: 'Total cobrado en caja', prefix: '$' },
  { title: 'Multas Pendientes',     value: 23,   icon: ShieldAlert, color: '#ef4444', trend: -5, trendLabel: 'vs. mes anterior', subtext: 'Requieren cobro inmediato' },
  { title: 'Pagos de Hoy',          value: 8,    icon: CalendarCheck,color: '#0ea5e9', subtext: 'Transacciones registradas hoy' },
  { title: 'Deuda Total Acumulada', value: 450,  icon: AlertTriangle,color: '#f59e0b', subtext: 'Saldo en mora del sistema', prefix: '$' },
];

const STATS_SECRETARIO = [
  { title: 'Comuneros Registrados', value: 156, icon: Users,         color: '#0ea5e9', subtext: 'En el padrón activo' },
  { title: 'Mingas Programadas',    value: 4,   icon: ClipboardList, color: '#f59e0b', subtext: 'Este mes en el calendario' },
  { title: 'Asistencias Tomadas',   value: 3,   icon: CalendarCheck, color: '#10b981', subtext: 'Mingas con asistencia registrada' },
];

// Stats personales del usuario comunero — valores mock
const STATS_USUARIO = [
  { title: 'Mis Multas Pendientes', value: 1,   icon: ShieldAlert,   color: '#ef4444', subtext: 'Inasistencia a minga' },
  { title: 'Total a Pagar',         value: 15,  icon: Banknote,      color: '#f59e0b', subtext: 'Deuda vigente', prefix: '$' },
  { title: 'Asistencia a Mingas',   value: 100, icon: CalendarCheck, color: '#10b981', subtext: 'Histórico de asistencia', suffix: '%' },
  { title: 'Lotes Registrados',     value: 1,   icon: MapPin,        color: '#0ea5e9', subtext: 'Lote #45 — Sector Centro' },
];

/** Devuelve el array de stats según el rol del usuario */
function getStatsByRole(rol) {
  if (rol === 'Administrador' || rol === 'Presidente' || rol === 'Vicepresidente') return STATS_ADMIN;
  if (rol === 'Tesorero') return STATS_TESORERO;
  if (rol === 'Secretario' || rol === 'Vocal') return STATS_SECRETARIO;
  return STATS_USUARIO; // Usuario Regular
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { hasPermission } = usePermissions();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isUsuarioBase = user?.rol === 'Usuario Regular' || user?.rol === 'Usuario';
  const stats = getStatsByRole(user?.rol);

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
          <h1>¡Hola, {user?.username}! 👋</h1>
          <p>
            {isUsuarioBase
              ? 'Aquí puedes revisar tu estado, turnos de agua y multas.'
              : `Bienvenido. Rol activo: ${user?.rol}. ¿Qué deseas gestionar hoy?`}
          </p>
        </div>
        <div className="header-stats">
          {isUsuarioBase ? (
            <>
              <div className="stat-item">
                <span className="stat-value text-green" style={{ fontSize: '1.5rem' }}>Al Día</span>
                <span className="stat-label">Estado General</span>
              </div>
              <div className="stat-item">
                <span className="stat-value" style={{ fontSize: '1.5rem' }}>Sector 2</span>
                <span className="stat-label">Zona de Riego</span>
              </div>
            </>
          ) : (
            <>
              <div className="stat-item">
                <span className="stat-value">156</span>
                <span className="stat-label">Comuneros Activos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">$2,340</span>
                <span className="stat-label">Recaudación Mensual</span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── TARJETA DE PERFIL (no Admin) ─────────────────────────────────── */}
      {user?.rol !== 'Administrador' && (
        <div
          className="glass-card animate-fade-in hover-glow"
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
              <span className="hover-scale" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.3s' }}>
                <ShieldAlert size={18} /> Sin Multas Pendientes
              </span>
              <span className="hover-scale" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', color: '#0ea5e9', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.3s' }}>
                <Droplets size={18} /> Turno de Agua: Viernes 14:00
              </span>
              <span className="hover-scale" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.3s' }}>
                <Users size={18} /> 100% Asistencia a Mingas
              </span>
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
      {isUsuarioBase && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {/* Asignación de Riego Semanal */}
          <div className="chart-container-dashboard glass-card hover-glow">
            <div className="chart-header">
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>Consumo de Caudal y Horas de Riego</h4>
              <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: 'var(--primary)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', margin: 0 }}>Turno: Viernes 14h00</span>
            </div>
            <div className="chart-body-svg">
              <svg viewBox="0 0 400 200" style={{ width: '100%', height: '180px' }}>
                <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.05)" />
                <line x1="40" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.05)" />
                <line x1="40" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.05)" />
                <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(255,255,255,0.1)" />
                <text x="10" y="25" fill="var(--text-muted)" fontSize="9">3.0 L/s</text>
                <text x="10" y="75" fill="var(--text-muted)" fontSize="9">2.0 L/s</text>
                <text x="10" y="125" fill="var(--text-muted)" fontSize="9">1.0 L/s</text>
                <text x="15" y="175" fill="var(--text-muted)" fontSize="9">0 L/s</text>
                <path d="M 40,120 Q 90,70 140,70 T 240,70 T 340,30 L 340,170 L 40,170 Z" fill="url(#area-gradient-user)" opacity="0.2" />
                <path d="M 40,120 Q 90,70 140,70 T 240,70 T 340,30" fill="none" stroke="var(--primary)" strokeWidth="3" />
                <defs>
                  <linearGradient id="area-gradient-user" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <circle cx="140" cy="70" r="4" fill="var(--primary)" stroke="white" strokeWidth="1.5" />
                <circle cx="240" cy="70" r="4" fill="var(--primary)" stroke="white" strokeWidth="1.5" />
                <circle cx="340" cy="30" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
                <text x="320" y="20" fill="white" fontSize="10" fontWeight="bold">3.0 L/s</text>
                <text x="40" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Sem 1</text>
                <text x="140" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Sem 2</text>
                <text x="240" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Sem 3</text>
                <text x="340" y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Sem 4</text>
              </svg>
            </div>
          </div>

          {/* Cumplimiento de Tareas */}
          <div className="chart-container-dashboard glass-card hover-glow">
            <div className="chart-header">
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>Cumplimiento de Jornadas de Mingas</h4>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green)', fontSize: '0.7rem', padding: '0.2rem 0.5rem', margin: 0 }}>Histórico del Año</span>
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
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="105" fill="white" fontSize="28" fontWeight="800" textAnchor="middle">100%</text>
                <text x="100" y="130" fill="var(--text-muted)" fontSize="10" fontWeight="bold" textAnchor="middle">Asistencias Completas</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ── GRID DE MÓDULOS (solo para gestores) ───────────────────────────── */}
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

      {/* ── CARDS DEL USUARIO COMUNERO ─────────────────────────────────────── */}
      {isUsuarioBase && (
        <div className="modules-grid animate-fade-in" style={{ marginTop: '2.5rem' }}>

          <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/catastro/detalles/1')} style={{ borderTop: '4px solid #0ea5e9' }}>
            <div className="module-banner" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(3,105,161,0.2))' }} />
            <div className="module-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="module-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', color: 'white', boxShadow: '0 10px 20px rgba(14,165,233,0.3)' }}><Droplets size={28} /></div>
              <h3>Mis Terrenos y Derechos</h3>
              <p style={{ marginBottom: '1rem' }}>Información catastral de tus propiedades con derecho a riego.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Lote Registrado:</span> <strong>Lote #45 (Centro)</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Área (Hectáreas):</span> <strong>1.5 Ha</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Caudal Asignado:</span> <strong>2.5 L/s</strong></div>
              </div>
              <div style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', padding: '0.6rem', borderRadius: '0.5rem', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>Ramal Principal: Acequia Alta</div>
            </div>
          </div>

          <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mingas')} style={{ borderTop: '4px solid #f59e0b' }}>
            <div className="module-banner" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(180,83,9,0.2))' }} />
            <div className="module-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="module-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)', color: 'white', boxShadow: '0 10px 20px rgba(245,158,11,0.3)' }}><Users size={28} /></div>
              <h3>Convocatoria a Minga</h3>
              <p style={{ marginBottom: '1rem' }}>Tienes una asistencia comunitaria obligatoria programada.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Fecha:</span> <strong>Sábado, 28 de Oct.</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Lugar:</span> <strong>Toma de Agua Principal</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Actividad:</span> <strong>Limpieza de desarenador</strong></div>
              </div>
              <div style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '0.6rem', borderRadius: '0.5rem', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Multa por inasistencia:</span><span style={{ fontSize: '1.2rem' }}>$15.00</span>
              </div>
            </div>
          </div>

          <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mis-deudas')} style={{ borderTop: '4px solid #ef4444' }}>
            <div className="module-banner" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(185,28,28,0.2))' }} />
            <div className="module-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="module-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white', boxShadow: '0 10px 20px rgba(239,68,68,0.3)' }}><ShieldAlert size={28} /></div>
              <h3>Obligaciones y Multas</h3>
              <p style={{ marginBottom: '1rem' }}>Detalle de multas por inasistencia o deudas de mantenimiento.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Multas Pendientes:</span> <strong>1 (Inasistencia)</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Fecha Límite:</span> <strong>30 de Octubre</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Estado:</span> <strong style={{ color: '#ef4444' }}>En Mora</strong></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', background: 'rgba(239,68,68,0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}>
                <span style={{ color: '#ef4444', fontWeight: '500' }}>Total a Pagar:</span>
                <span style={{ fontSize: '1.4rem', color: '#ef4444', fontWeight: 'bold' }}>$10.00</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
