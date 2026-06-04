import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Droplets, LogOut, LayoutDashboard, Users, FileText, Settings, ShieldAlert, UserCircle, Droplet, Award, Map, MapPin, Menu, Bell, Search, User, X } from 'lucide-react';
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
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Convocatoria a Minga', text: 'Limpieza de desarenador el sábado 28 de Oct.', time: 'Hace 10 min', unread: true, type: 'minga' },
    { id: 2, title: 'Pago Registrado', text: 'Se ha registrado tu pago de cuota mensual de $9.00.', time: 'Hace 2 horas', unread: true, type: 'pago' },
    { id: 3, title: 'Multa Generada', text: 'Inasistencia a minga de mantenimiento. Total: $15.00.', time: 'Ayer', unread: false, type: 'multa' }
  ]);

  const notificationsRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

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
      subItems: [
        { name: 'Padrón General', path: '/dashboard/usuarios/padron' },
        { name: 'Agregar Usuario', path: '/dashboard/usuarios/agregar' }
      ]
    },
    { 
      name: 'Mingas', icon: Users, show: hasPermission('gestionar_mingas'),
      subItems: [
        { name: 'Lista de Mingas', path: '/dashboard/mingas' },
        { name: 'Programar Minga', path: '/dashboard/mingas/programar' },
        { name: 'Tomar Asistencia', path: '/dashboard/mingas/asistencia' }
      ]
    },
    { 
      name: 'Catastros', icon: Map, show: hasPermission('gestionar_mingas') || hasPermission('crear_usuario'),
      subItems: [
        { name: 'Catastro Global', path: '/dashboard/catastro' },
        { name: 'Registrar Terreno', path: '/dashboard/terrenos' }
      ]
    },
    { 
      name: 'Multas y Cobros', icon: ShieldAlert, show: hasPermission('gestionar_multas'),
      subItems: [
        { name: 'Panel de Cobros', path: '/dashboard/cobros' },
        { name: 'Generar Cobro', path: '/dashboard/cobros/generar' },
        { name: 'Ventanilla', path: '/dashboard/cobros/ventanilla' }
      ]
    },
    { name: 'Reportes', path: '/dashboard/reportes', icon: FileText, show: hasPermission('ver_reportes') },
    { 
      name: 'Directiva', icon: Award, show: true,
      subItems: [
        { name: 'Directiva Actual', path: '/dashboard/directiva' },
        { name: 'Gestionar', path: '/dashboard/directiva/gestionar' }
      ]
    },
    { 
      name: 'Administración', icon: Settings, show: hasPermission('gestionar_multas'),
      subItems: [
        { name: 'Panel Admin', path: '/dashboard/administracion' },
        { name: 'Configuración', path: '/dashboard/administracion/configuracion' }
      ]
    },
    { name: 'Mis Deudas', path: '/dashboard/mis-deudas', icon: Droplet, show: isRole('Usuario Regular') },
    { name: 'Mi Predio', path: '/dashboard/catastro/detalles/1', icon: MapPin, show: isRole('Usuario Regular') },
  ];

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
      <aside className={`sidebar glass-card ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon-small">
            <Droplets size={24} color="white" />
          </div>
          <h2>Chibutech</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            
            if (item.subItems) {
              const isOpen = openMenu === item.name;
              return (
                <div key={item.name} className="sidebar-accordion">
                  <button 
                    className="sidebar-link"
                    onClick={() => setOpenMenu(isOpen ? '' : item.name)}
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </div>
                    <span style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: '0.2s' }}>▶</span>
                  </button>
                  {isOpen && (
                    <div className="sidebar-subitems" style={{ paddingLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {item.subItems.map(subItem => {
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <button 
                            key={subItem.path}
                            className={`sidebar-sublink ${isSubActive ? 'active' : ''}`}
                            onClick={() => {
                              navigate(subItem.path);
                              setIsSidebarOpen(false);
                            }}
                            style={{ 
                              background: 'transparent', border: 'none', color: isSubActive ? 'var(--primary-light)' : '#94a3b8', 
                              textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', padding: '0.3rem 0',
                              transition: 'color 0.2s'
                            }}
                          >
                            {subItem.name}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div 
            className="user-mini-profile" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/dashboard/perfil');
              setIsSidebarOpen(false);
            }}
          >
            <UserCircle size={32} color="var(--primary)" />
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">{user?.rol}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Cerrar Sesión
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
                  <div className="notifications-list">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`notification-item ${n.unread ? 'unread' : ''}`}
                        onClick={() => {
                          setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
                        }}
                      >
                        <div 
                          className="notification-icon-wrapper" 
                          style={{ 
                            background: n.type === 'minga' ? 'rgba(16, 185, 129, 0.15)' : n.type === 'pago' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: n.type === 'minga' ? 'var(--green)' : n.type === 'pago' ? 'var(--blue)' : 'var(--red)'
                          }}
                        >
                          <Droplet size={14} />
                        </div>
                        <div className="notification-item-content">
                          <p className="notification-title">{n.title}</p>
                          <p className="notification-text">{n.text}</p>
                          <span className="notification-time">{n.time}</span>
                        </div>
                      </div>
                    ))}
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
