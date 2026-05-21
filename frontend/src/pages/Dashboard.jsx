import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Users, FileText, Settings, ShieldAlert, Droplets, ArrowRight, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

// Importar imágenes de fondo representativas
import bgUsuarios from '../assets/bg_usuarios.png';
import bgMingas from '../assets/bg_mingas.png';
import bgCobros from '../assets/bg_cobros.png';
import bgReportes from '../assets/bg_reportes.png';
import bgDeudas from '../assets/bg_deudas.png';
import bgHeader from '../assets/bg_header.png';

export default function Dashboard() {
  const { hasPermission } = usePermissions();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isUsuarioBase = user?.rol === 'Usuario Regular' || user?.rol === 'Usuario';

  return (
    <div className="dashboard-page animate-fade-in pb-10">
      <header className="dashboard-header glass-card" style={{
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 100%), url(${bgHeader})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="header-greeting">
          <h1>¡Hola, {user?.username}! 👋</h1>
          <p>
            {isUsuarioBase 
              ? 'Aquí puedes revisar tu estado, turnos de agua y multas.' 
              : 'Bienvenido al Sistema Central de Gestión. ¿Qué deseas hacer hoy?'}
          </p>
        </div>
        <div className="header-stats">
          {isUsuarioBase ? (
            <>
              <div className="stat-item">
                <span className="stat-value text-green" style={{ fontSize: '1.5rem' }}>Al Día</span>
                <span className="stat-label">Estado Financiero</span>
              </div>
              <div className="stat-item">
                <span className="stat-value" style={{ fontSize: '1.5rem' }}>Sector 2</span>
                <span className="stat-label">Ubicación de Lote</span>
              </div>
            </>
          ) : (
            <>
              <div className="stat-item">
                <span className="stat-value">12</span>
                <span className="stat-label">Mingas Activas</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">$450</span>
                <span className="stat-label">Recaudación Mensual</span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* TARJETA DE PERFIL UNIVERSAL (Oculta para Super Admin por limpieza visual) */}
      {user?.rol !== 'Administrador' && (
        <div className="glass-card animate-fade-in hover-glow" style={{ padding: '2.5rem', marginTop: '2rem', display: 'flex', gap: '2.5rem', alignItems: 'center', borderLeft: `4px solid var(--primary)`, position: 'relative', overflow: 'hidden' }}>
        
        {/* Efecto visual de fondo interactivo */}
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0, transition: 'transform 0.5s ease', pointerEvents: 'none' }} className="profile-glow"></div>

        {/* Avatar del Usuario */}
        <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.03)', border: '2px solid var(--primary)', color: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, zIndex: 1, boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.4)' }}>
          <User size={55} strokeWidth={1.5} />
        </div>
        
        {/* Información Principal */}
        <div style={{ flex: 1, zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                <h2 style={{ color: 'var(--text-main)', fontSize: '2rem', margin: 0 }}>{user?.username?.toUpperCase()}</h2>
                <span className="badge" style={{ background: 'var(--primary)', color: '#000', fontWeight: 'bold', fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                  {user?.rol?.toUpperCase()}
                </span>
              </div>
              <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                Comunero Activo • C.I: 1802345678 • Sector Centro, Lote #45
              </p>
            </div>
            
            <button className="btn-secondary-outline hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.05)' }}>
              <FileText size={18} /> Ver mi Expediente Completo
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Estadísticas Personales Interactivos */}
            <span className="hover-scale" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.3s' }}>
              <ShieldAlert size={18} /> Sin Multas Pendientes
            </span>
            <span className="hover-scale" style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#0ea5e9', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.3s' }}>
              <Droplets size={18} /> Turno de Agua: Viernes 14:00
            </span>
            <span className="hover-scale" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.3s' }}>
              <Users size={18} /> 100% Asistencia a Mingas
            </span>

            {/* Módulo de Funciones Oficiales (Solo para Directiva/Admin) */}
            {!isUsuarioBase && (
              <span className="animate-fade-in" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px dashed #8b5cf6', color: '#c4b5fd', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                <Settings size={20} className="text-purple" /> 
                <span>
                  <strong style={{ color: '#fff' }}>Mis Funciones Oficiales: </strong> 
                  {
                    user?.rol === 'Presidente' ? 'Gestión total del sistema, aprobación de balances financieros y supervisión general de la junta.' :
                    user?.rol === 'Tesorero' ? 'Recaudación de fondos, cobro de multas, arqueo de caja y emisión de balances económicos.' :
                    user?.rol === 'Secretario' ? 'Toma de asistencia en asambleas, registro de mingas y gestión del padrón de usuarios.' :
                    user?.rol === 'Vicepresidente' ? 'Supervisión de transparencia, veeduría de reportes y reemplazo gerencial de presidencia.' :
                    user?.rol === 'Vocal' ? 'Apoyo logístico en campo, asistencia en ventanilla de cobros y supervisión de acequias.' :
                    'Administración técnica completa del ERP, mantenimiento de bases de datos y roles de seguridad.'
                  }
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    )}

      {/* GRID INTERACTIVO Y ORGANIZADO PARA EL USUARIO COMUNERO */}
      {isUsuarioBase && (
        <div className="modules-grid animate-fade-in" style={{ marginTop: '2.5rem' }}>
          
          {/* Card: Terrenos y Derechos de Agua */}
          <div className="glass-card module-card hover-glow" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', borderTop: '4px solid #0ea5e9' }}>
            <div className="module-banner" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(3,105,161,0.2))' }}></div>
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

          {/* Card: Próxima Minga / Convocatoria */}
          <div className="glass-card module-card hover-glow" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', borderTop: '4px solid #f59e0b' }}>
            <div className="module-banner" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(180,83,9,0.2))' }}></div>
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
                <span>Multa por inasistencia:</span>
                <span style={{ fontSize: '1.2rem' }}>$15.00</span>
              </div>
            </div>
          </div>

          {/* Card: Estado Financiero / Multas */}
          <div className="glass-card module-card hover-glow" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', borderTop: '4px solid #ef4444' }}>
            <div className="module-banner" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(185,28,28,0.2))' }}></div>
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

      <div className="modules-grid" style={{ marginTop: '2rem' }}>
        
        {hasPermission('crear_usuario') && (
          <div className="glass-card module-card hover-glow" onClick={() => navigate('/dashboard/usuarios')} style={{ cursor: 'pointer' }}>
            <div className="module-banner bg-gradient-purple" style={{ backgroundImage: `url(${bgUsuarios})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
            <div className="module-content">
              <div className="module-icon bg-purple"><Settings size={28} /></div>
              <h3>Gestión de Usuarios</h3>
              <p>Administra la directiva, agricultores y permisos del sistema.</p>
              <button className="btn-module" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/usuarios'); }}>Abrir Módulo <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {hasPermission('gestionar_mingas') && (
          <div className="glass-card module-card hover-glow" onClick={() => navigate('/dashboard/mingas')} style={{ cursor: 'pointer' }}>
            <div className="module-banner bg-gradient-green" style={{ backgroundImage: `url(${bgMingas})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
            <div className="module-content">
              <div className="module-icon bg-green"><Users size={28} /></div>
              <h3>Control de Mingas</h3>
              <p>Organiza el trabajo comunitario y toma asistencia fácilmente.</p>
              <button className="btn-module text-green" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/mingas'); }}>Abrir Módulo <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {hasPermission('gestionar_multas') && (
          <div className="glass-card module-card hover-glow" onClick={() => navigate('/dashboard/cobros')} style={{ cursor: 'pointer' }}>
            <div className="module-banner bg-gradient-red" style={{ backgroundImage: `url(${bgCobros})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
            <div className="module-content">
              <div className="module-icon bg-red"><ShieldAlert size={28} /></div>
              <h3>Cobros y Multas</h3>
              <p>Revisa inasistencias y registra pagos en la caja comunitaria.</p>
              <button className="btn-module text-red" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/cobros'); }}>Abrir Módulo <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {hasPermission('ver_reportes') && (
          <div className="glass-card module-card hover-glow" onClick={() => navigate('/dashboard/reportes')} style={{ cursor: 'pointer' }}>
            <div className="module-banner bg-gradient-blue" style={{ backgroundImage: `url(${bgReportes})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
            <div className="module-content">
              <div className="module-icon bg-blue"><FileText size={28} /></div>
              <h3>Reportes y Finanzas</h3>
              <p>Genera reportes de transparencia para toda la comunidad.</p>
              <button className="btn-module text-blue" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/reportes'); }}>Abrir Módulo <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {hasPermission('ver_mis_multas') && !hasPermission('gestionar_multas') && (
          <div className="glass-card module-card hover-glow" onClick={() => navigate('/dashboard/deudas')} style={{ cursor: 'pointer' }}>
            <div className="module-banner bg-gradient-earth" style={{ backgroundImage: `url(${bgDeudas})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
            <div className="module-content">
              <div className="module-icon bg-earth"><Droplets size={28} /></div>
              <h3>Mis Deudas y Turnos</h3>
              <p>Revisa tus pagos pendientes y tus próximos turnos de riego.</p>
              <button className="btn-module text-earth" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/deudas'); }}>Abrir Módulo <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
