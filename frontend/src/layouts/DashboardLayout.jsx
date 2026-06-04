import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Droplets, LogOut, LayoutDashboard, Users, FileText, Settings, ShieldAlert, UserCircle, Droplet, Award, Map, MapPin, Menu, Bell, Search, User, X, CheckCircle, ChevronRight } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Toaster } from 'sonner';
import bgLayout from '../assets/bg_layout.png';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { hasPermission, isRole } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationsRef = useRef(null);

  const multasNotifications = notifications.filter(n => n.type === 'multa');
  const unreadCount = multasNotifications.filter(n => n.unread).length;

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
      name: 'Usuarios', icon: Users, show: hasPermission('crear_usuario'),
      activePaths: ['/dashboard/usuarios'],
      subItems: [
        { name: 'Padrón General', path: '/dashboard/usuarios/padron' },
        { name: 'Agregar Usuario', path: '/dashboard/usuarios/agregar' }
      ]
    },
    { 
      name: 'Mingas', icon: Users, show: hasPermission('gestionar_mingas'),
      activePaths: ['/dashboard/mingas'],
      subItems: [
        { name: 'Control de Mingas', path: '/dashboard/mingas' },
        { name: 'Historial de Mingas', path: '/dashboard/mingas/historial' },
        { name: 'Programar Minga', path: '/dashboard/mingas/programar' },
        { name: 'Tomar Asistencia', path: '/dashboard/mingas/asistencia' }
      ]
    },
    { 
      name: 'Catastros', icon: Map, show: hasPermission('gestionar_mingas') || hasPermission('crear_usuario'),
      activePaths: ['/dashboard/catastro', '/dashboard/terrenos'],
      subItems: [
        { name: 'Catastro de Predios', path: '/dashboard/catastro/generales' },
        { name: 'Registrar Terreno', path: '/dashboard/terrenos' }
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
      name: 'Directiva', icon: Award, show: true,
      activePaths: ['/dashboard/directiva'],
      subItems: [
        { name: 'Directiva Actual', path: '/dashboard/directiva' },
        { name: 'Gestionar', path: '/dashboard/directiva/gestionar' }
      ]
    },
    { 
      name: 'Administración', icon: Settings, show: hasPermission('gestionar_multas'),
      activePaths: ['/dashboard/administracion'],
      subItems: [
        { name: 'Panel Admin', path: '/dashboard/administracion' },
        { name: 'Configuración', path: '/dashboard/administracion/configuracion' }
      ]
    },
    { name: 'Mis Deudas', path: '/dashboard/mis-deudas', icon: Droplet, show: isRole('Usuario Regular') },
    { name: 'Mi Predio', path: '/dashboard/catastro/detalles/1', icon: MapPin, show: isRole('Usuario Regular') },
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
                          {item.subItems.map(subItem => {
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
            title={isCollapsed ? `${user?.username} (${user?.rol})` : ''}
          >
            <UserCircle size={32} color="var(--primary)" />
            {!isCollapsed && (
              <div className="user-info">
                <span className="user-name">{user?.username}</span>
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
                onClick={() => {
                  const isOpening = !showNotifications;
                  setShowNotifications(isOpening);
                  
                  // Auto-marcar como leído si se está abriendo
                  if (isOpening && unreadCount > 0) {
                    // Opcional: Pequeño delay para que el usuario alcance a ver que se abrieron y luego desaparezca el contador
                    setTimeout(() => {
                      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                    }, 500);
                  }
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
              </div>

              {showNotifications && (
                <div className="notifications-popover glass-card">
                  <div className="notifications-header">
                    <h4>Notificaciones</h4>
                  </div>
                  <div className="notifications-list" style={{ padding: '0.5rem' }}>
                    {multasNotifications.length === 0 ? (
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
                          <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>¡Todo al día!</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>No hay multas pendientes</p>
                        </div>
                      </div>
                    ) : (
                      multasNotifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`notification-item ${n.unread ? 'unread' : ''}`}
                          style={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                            backgroundColor: n.unread ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                            borderRadius: '0.75rem',
                            margin: '0.25rem 0.5rem',
                            padding: '0.85rem',
                            border: '1px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            const chevron = e.currentTarget.querySelector('.chevron-icon');
                            if (chevron) {
                              chevron.style.transform = 'translateX(4px)';
                              chevron.style.opacity = '1';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = n.unread ? 'rgba(239, 68, 68, 0.04)' : 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            const chevron = e.currentTarget.querySelector('.chevron-icon');
                            if (chevron) {
                              chevron.style.transform = 'translateX(0)';
                              chevron.style.opacity = '0.5';
                            }
                          }}
                          onClick={() => {
                            setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
                            setShowNotifications(false);
                            
                            // Redirección inteligente basada en los permisos del usuario
                            // utilizando el identificador de la multa (n.id)
                            if (hasPermission('gestionar_multas')) {
                              navigate(`/dashboard/cobros/ventanilla?multaId=${n.id}`, { state: { multaId: n.id } });
                            } else {
                              navigate(`/dashboard/mis-deudas?multaId=${n.id}`, { state: { multaId: n.id } });
                            }
                          }}
                        >
                          {n.unread && (
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '4px',
                              height: '40%',
                              backgroundColor: 'var(--red)',
                              borderRadius: '0 4px 4px 0'
                            }} />
                          )}
                          <div 
                            className="notification-icon-wrapper" 
                            style={{ 
                              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)',
                              color: 'var(--red)',
                              boxShadow: '0 4px 10px rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.1)'
                            }}
                          >
                            <ShieldAlert size={16} strokeWidth={2.5} />
                          </div>
                          <div className="notification-item-content" style={{ flex: 1 }}>
                            <p className="notification-title" style={{ fontSize: '0.9rem', fontWeight: n.unread ? '700' : '600' }}>{n.title}</p>
                            <p className="notification-text" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>{n.text}</p>
                            <span className="notification-time" style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{n.time}</span>
                          </div>
                          <ChevronRight 
                            className="chevron-icon"
                            size={18} 
                            style={{ 
                              color: 'var(--text-muted)', 
                              opacity: 0.5, 
                              transition: 'all 0.2s ease',
                              marginLeft: '0.5rem'
                            }} 
                          />
                        </div>
                      ))
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
              <span style={{ fontSize: '0.85rem' }}>{user?.username}</span>
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
