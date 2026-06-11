import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Droplets, LogOut, LayoutDashboard, Users, FileText, Settings, ShieldAlert, UserCircle, Droplet, Award, Map, MapPin, Menu, Bell, Search, User, X, CheckCircle, ChevronRight, Calendar, Wallet, AlertTriangle } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Toaster } from 'sonner';
import bgLayout from '../assets/bg_layout.png';
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from '../services/notificacionService';

export default function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { hasPermission, isRole } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const notificationsRef = useRef(null);

  const fetchNotificaciones = useCallback(async () => {
    try {
      const res = await getNotificaciones();
      setNotifications(res.data || []);
      setNoLeidas(res.no_leidas || 0);
    } catch {
      // silencioso — no interrumpir el layout
    }
  }, []);

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 120000);
    return () => clearInterval(interval);
  }, [fetchNotificaciones]);

  const unreadCount = noLeidas;

  // Cerrar notificaciones al cambiar de página
  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  // Cerrar notificaciones al hacer clic fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Panel Principal', path: '/dashboard', icon: LayoutDashboard, show: true },
    {
      name: 'Usuarios', icon: Users,
      show: hasPermission('ver_usuarios') || hasPermission('crear_usuario'),
      activePaths: ['/dashboard/usuarios'],
      subItems: [
        { name: 'Padrón General', path: '/dashboard/usuarios/padron' },
        { name: 'Agregar Usuario', path: '/dashboard/usuarios/agregar', show: hasPermission('crear_usuario') }
      ]
    },
    {
      name: 'Mingas', icon: Users,
      show: hasPermission('gestionar_mingas') || hasPermission('ver_mingas'),
      activePaths: ['/dashboard/mingas'],
      subItems: [
        { name: 'Control de Mingas', path: '/dashboard/mingas' },
        { name: 'Mingas Activas', path: '/dashboard/mingas/activas' },
        { name: 'Historial de Mingas', path: '/dashboard/mingas/historial' },
        { name: 'Programar Minga', path: '/dashboard/mingas/programar', show: hasPermission('gestionar_mingas') },
        { name: 'Tomar Asistencia', path: '/dashboard/mingas/asistencia', show: hasPermission('gestionar_mingas') }
      ]
    },
    {
      name: 'Catastros', icon: Map,
      show: hasPermission('ver_catastro') || hasPermission('gestionar_mingas') || hasPermission('crear_usuario'),
      activePaths: ['/dashboard/catastro', '/dashboard/terrenos'],
      subItems: [
        { name: 'Catastro de Predios', path: '/dashboard/catastro/generales' },
        { name: 'Registrar Terreno', path: '/dashboard/terrenos', show: hasPermission('crear_usuario') }
      ]
    },
    {
      name: 'Multas y Cobros', icon: ShieldAlert, show: hasPermission('gestionar_multas'),
      activePaths: ['/dashboard/cobros'],
      subItems: [
        { name: 'Panel de Cobros', path: '/dashboard/cobros' },
        { name: 'Ventanilla de Cobro', path: '/dashboard/cobros/ventanilla' },
        { name: 'Generar Multa Manual', path: '/dashboard/cobros/generar' },
        { name: 'Registrar Egreso', path: '/dashboard/cobros/egreso' },
        { name: 'Arqueo e Historial', path: '/dashboard/cobros/historial' },
        { name: 'Emitir Planillas', path: '/dashboard/cobros/planilla' }
      ]
    },
    { name: 'Reportes', path: '/dashboard/reportes', icon: FileText, show: hasPermission('ver_reportes') },
    {
      name: 'Directiva', icon: Award, show: hasPermission('crear_usuario'),
      activePaths: ['/dashboard/directiva'],
      subItems: [
        { name: 'Directiva Actual', path: '/dashboard/directiva' },
        { name: 'Gestionar', path: '/dashboard/directiva/gestionar' }
      ]
    },
    {
      name: 'Administración', icon: Settings, show: hasPermission('eliminar_usuario'),
      activePaths: ['/dashboard/administracion'],
      subItems: [
        { name: 'Panel Admin', path: '/dashboard/administracion' },
        { name: 'Configuración', path: '/dashboard/administracion/configuracion' }
      ]
    },
    { name: 'Mis Deudas', path: '/dashboard/mis-deudas', icon: Droplet, show: isRole('Comunero') },
    { name: 'Mis Terrenos', path: '/dashboard/mis-terrenos', icon: MapPin, show: isRole('Comunero') },
  ];

  // Sincronizar automáticamente el submenú abierto (accordion) con la ruta actual
  useEffect(() => {
    const activeItem = menuItems.find(item => {
      if (!item.subItems) return false;
      return item.activePaths 
        ? item.activePaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
        : item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));
    });
    
    // Si la ruta pertenece a un padre, asegurarse de que ese padre esté abierto
    if (activeItem) {
      if (openMenu !== activeItem.name) {
        setOpenMenu(activeItem.name);
      }
    } else {
      // Si la ruta es una vista sin submenú (ej. Panel Principal), cerramos cualquier acordeón abierto
      if (openMenu !== '') {
        setOpenMenu('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="layout-container" style={{ 
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7)), url(${bgLayout})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Toaster richColors position="top-right" />
      
      {/* Sidebar Overlay (Móvil) */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* Sidebar (Menú Lateral) */}
      <aside className={`sidebar glass-card ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header" style={{ justifyContent: isCollapsed ? 'center' : 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="logo-icon-small">
              <Droplets size={24} color="white" />
            </div>
            {!isCollapsed && <h2>Chibutech</h2>}
          </div>
          <button className="desktop-collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? "Expandir menú" : "Colapsar menú"}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            
            if (item.subItems) {
              const isOpen = openMenu === item.name;
              
              // Determinar si la ruta actual pertenece a este padre
              const isRouteActive = item.activePaths 
                ? item.activePaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
                : item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));

              // El bloque padre se resalta si está expandido, O si es la ruta actual y no hay otro menú abierto
              const isParentActive = isOpen || (isRouteActive && openMenu === '');

              return (
                <div key={item.name} className="sidebar-accordion">
                  <button 
                    className={`sidebar-link ${isParentActive ? 'active' : ''}`}
                    onClick={() => {
                      if (isCollapsed) {
                        setIsCollapsed(false);
                        setOpenMenu(item.name);
                      } else {
                        setOpenMenu(isOpen ? '' : item.name);
                      }
                    }}
                    style={{ justifyContent: isCollapsed ? 'center' : 'space-between' }}
                    title={isCollapsed ? item.name : ''}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Icon size={20} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <span style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: '0.2s' }}>▶</span>
                    )}
                  </button>
                  {!isCollapsed && (
                    <div 
                      style={{ 
                        display: 'grid', 
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: isOpen ? 1 : 0
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <div className="sidebar-subitems" style={{ paddingLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', paddingBottom: '0.5rem' }}>
                          {item.subItems.filter(sub => sub.show !== false).map(subItem => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <button 
                                key={subItem.path}
                                className={`sidebar-sublink ${isSubActive ? 'active' : ''}`}
                                tabIndex={isOpen ? 0 : -1}
                                onMouseEnter={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.color = 'var(--text-main)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.color = '#94a3b8';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                  }
                                }}
                                onClick={() => {
                                  navigate(subItem.path);
                                  setIsSidebarOpen(false);
                                }}
                                style={{ 
                                  background: isSubActive ? 'rgba(14, 165, 233, 0.08)' : 'transparent', 
                                  border: 'none', 
                                  color: isSubActive ? 'var(--primary)' : '#94a3b8', 
                                  fontWeight: isSubActive ? '600' : 'normal',
                                  textAlign: 'left', 
                                  cursor: 'pointer', 
                                  fontSize: '0.9rem', 
                                  padding: '0.4rem 0.6rem',
                                  borderRadius: '0.4rem',
                                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                  position: 'relative',
                                  display: 'flex',
                                  alignItems: 'center',
                                  transform: isSubActive ? 'translateX(4px)' : 'translateX(0)'
                                }}
                              >
                                {/* Indicador activo sutil para el submenú (punto luminoso) */}
                                {isSubActive ? (
                                  <div style={{
                                    width: '5px',
                                    height: '5px',
                                    backgroundColor: 'var(--primary)',
                                    borderRadius: '50%',
                                    marginRight: '8px',
                                    boxShadow: '0 0 6px var(--primary)'
                                  }} />
                                ) : (
                                  <div style={{
                                    width: '5px',
                                    height: '5px',
                                    backgroundColor: 'transparent',
                                    borderRadius: '50%',
                                    marginRight: '8px',
                                    transition: 'background-color 0.2s'
                                  }} />
                                )}
                                {subItem.name}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Para elementos sin submenú (ej. Panel Principal, Reportes)
            // Se usa coincidencia exacta para la raíz (/dashboard) y startsWith para el resto.
            const isRouteActive = item.path === '/dashboard' 
              ? location.pathname === '/dashboard' 
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
            // Solo resaltamos la opción individual si no hay ningún menú colapsable acaparando la atención
            const isActive = isRouteActive && openMenu === '';
              
            return (
              <button 
                key={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setOpenMenu('');
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                title={isCollapsed ? item.name : ''}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div 
            className="user-mini-profile" 
            style={{ cursor: 'pointer', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
            onClick={() => {
              navigate('/dashboard/perfil');
              setIsSidebarOpen(false);
            }}
            title={isCollapsed ? `${user?.nombre_completo || user?.username} (${user?.rol})` : ''}
          >
            <UserCircle size={32} color="var(--primary)" />
            {!isCollapsed && (
              <div className="user-info">
                <span className="user-name" style={{ fontSize: '0.82rem' }}>{user?.nombre_completo || user?.username}</span>
                <span className="user-role">{user?.rol}</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} style={{ justifyContent: isCollapsed ? 'center' : 'center' }} title={isCollapsed ? 'Cerrar Sesión' : ''}>
            <LogOut size={18} />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Cabecera superior global con notificaciones y perfil */}
        <div className="dashboard-topbar">
          <button className="burger-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>



          <div className="topbar-actions">
            {/* Campana de Notificaciones */}
            <div style={{ position: 'relative' }} ref={notificationsRef}>
              <div
                className={`notifications-bell-container ${unreadCount > 0 ? 'bell-animate' : ''}`}
                onClick={async () => {
                  const isOpening = !showNotifications;
                  setShowNotifications(isOpening);
                  if (isOpening) {
                    setLoadingNotif(true);
                    await fetchNotificaciones();
                    setLoadingNotif(false);
                  }
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="bell-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
              </div>

              {showNotifications && (
                <div className="notifications-popover glass-card">
                  <div className="notifications-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>Notificaciones {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>({unreadCount} nuevas)</span>}</h4>
                    {unreadCount > 0 && (
                      <button
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '0.4rem', whiteSpace: 'nowrap' }}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await marcarTodasLeidas();
                          setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
                          setNoLeidas(0);
                        }}
                      >
                        Marcar todas leídas
                      </button>
                    )}
                  </div>
                  <div className="notifications-list" style={{ padding: '0.5rem' }}>
                    {loadingNotif ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>Cargando...</div>
                    ) : notifications.length === 0 ? (
                      <div style={{
                        padding: '2.5rem 1rem',
                        textAlign: 'center',
                        color: '#94a3b8',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.8rem',
                        backgroundColor: 'rgba(241, 245, 249, 0.03)',
                        borderRadius: '0.75rem',
                        margin: '0.5rem'
                      }}>
                        <CheckCircle size={32} style={{ color: 'var(--green)', opacity: 0.8 }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>¡Sin notificaciones!</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Todo en orden por ahora</p>
                        </div>
                      </div>
                    ) : (
                      notifications.map(n => {
                        const tipoConfig = {
                          multa:     { Icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
                          minga:     { Icon: Calendar,      color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)' },
                          directiva: { Icon: Award,         color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
                          planilla:  { Icon: Wallet,        color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
                          sistema:   { Icon: Bell,          color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
                        }[n.tipo] || { Icon: Bell, color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' };
                        const { Icon, color, bg } = tipoConfig;
                        const isUnread = !n.leida;
                        const fecha = new Date(n.fecha_creacion);
                        const ahora = new Date();
                        const diffMin = Math.floor((ahora - fecha) / 60000);
                        const tiempoStr = diffMin < 1 ? 'Ahora mismo'
                          : diffMin < 60 ? `hace ${diffMin} min`
                          : diffMin < 1440 ? `hace ${Math.floor(diffMin / 60)}h`
                          : fecha.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' });

                        return (
                          <div
                            key={n.id}
                            className={`notification-item ${isUnread ? 'unread' : ''}`}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              backgroundColor: isUnread ? `${color}08` : 'transparent',
                              borderRadius: '0.75rem',
                              margin: '0.25rem 0.5rem',
                              padding: '0.85rem',
                              border: '1px solid transparent',
                              display: 'flex',
                              alignItems: 'flex-start',
                              position: 'relative',
                              overflow: 'hidden',
                              gap: '0.75rem',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${color}12`;
                              e.currentTarget.style.borderColor = `${color}30`;
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isUnread ? `${color}08` : 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            onClick={async () => {
                              if (isUnread) {
                                await marcarLeida(n.id);
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, leida: true } : item));
                                setNoLeidas(prev => Math.max(0, prev - 1));
                              }
                              setShowNotifications(false);
                              if (n.url_destino) navigate(n.url_destino);
                            }}
                          >
                            {isUnread && (
                              <div style={{
                                position: 'absolute',
                                left: 0, top: '50%',
                                transform: 'translateY(-50%)',
                                width: '4px', height: '40%',
                                backgroundColor: color,
                                borderRadius: '0 4px 4px 0'
                              }} />
                            )}
                            <div
                              className="notification-icon-wrapper"
                              style={{ background: bg, color, border: `1px solid ${color}20`, flexShrink: 0 }}
                            >
                              <Icon size={16} strokeWidth={2.5} />
                            </div>
                            <div className="notification-item-content" style={{ flex: 1, minWidth: 0 }}>
                              <p className="notification-title" style={{ fontSize: '0.88rem', fontWeight: isUnread ? '700' : '600', margin: 0 }}>{n.titulo}</p>
                              <p className="notification-text" style={{ fontSize: '0.79rem', lineHeight: '1.4', margin: '0.2rem 0 0' }}>{n.mensaje}</p>
                              <span className="notification-time" style={{ fontSize: '0.72rem', marginTop: '0.3rem', display: 'block', color: '#64748b' }}>{tiempoStr}</span>
                            </div>
                            <ChevronRight size={16} style={{ color: '#64748b', opacity: 0.5, flexShrink: 0, marginTop: '2px' }} />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Acceso rápido a Perfil */}
            <button 
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem', borderRadius: '2rem' }}
              onClick={() => navigate('/dashboard/perfil')}
            >
              <User size={16} />
              <span style={{ fontSize: '0.85rem' }}>{user?.nombre_completo || user?.username}</span>
            </button>
          </div>
        </div>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
