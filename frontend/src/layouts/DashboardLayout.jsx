import React, { useState } from 'react';
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Convocatoria a Minga', text: 'Limpieza de desarenador el sábado 28 de Oct.', time: 'Hace 10 min', unread: true, type: 'minga' },
    { id: 2, title: 'Pago Registrado', text: 'Se ha registrado tu pago de cuota mensual de $9.00.', time: 'Hace 2 horas', unread: true, type: 'pago' },
    { id: 3, title: 'Multa Generada', text: 'Inasistencia a minga de mantenimiento. Total: $15.00.', time: 'Ayer', unread: false, type: 'multa' }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Panel Principal', path: '/dashboard', icon: LayoutDashboard, show: true },
    { name: 'Directiva', path: '/dashboard/directiva', icon: Award, show: true },
    { name: 'Usuarios', path: '/dashboard/usuarios', icon: Users, show: hasPermission('crear_usuario') },
    { name: 'Mingas', path: '/dashboard/mingas', icon: Users, show: hasPermission('gestionar_mingas') },
    { name: 'Catastro de Predios', path: '/dashboard/catastro', icon: Map, show: hasPermission('gestionar_mingas') || hasPermission('crear_usuario') },
    { name: 'Mi Predio', path: '/dashboard/catastro/detalles/1', icon: MapPin, show: isRole('Usuario Regular') },
    { name: 'Multas y Cobros', path: '/dashboard/cobros', icon: ShieldAlert, show: hasPermission('gestionar_multas') },
    { name: 'Reportes', path: '/dashboard/reportes', icon: FileText, show: hasPermission('ver_reportes') },
    { name: 'Mis Deudas', path: '/dashboard/mis-deudas', icon: Droplet, show: isRole('Usuario Regular') },
    { name: 'Administración', path: '/dashboard/administracion', icon: Settings, show: hasPermission('gestionar_multas') },
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
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
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
        {/* Cabecera superior global con barra de búsqueda, notificaciones y hamburguesa */}
        <div className="dashboard-topbar glass-card">
          <button className="burger-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="search-container-topbar">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Buscar predios, actas..." 
                style={{ paddingLeft: '2.25rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', minWidth: '240px', fontSize: '0.875rem' }} 
              />
            </div>
          </div>

          <div className="topbar-actions">
            {/* Campana de Notificaciones */}
            <div style={{ position: 'relative' }}>
              <div 
                className={`notifications-bell-container ${unreadCount > 0 ? 'bell-animate' : ''}`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
              </div>

              {showNotifications && (
                <div className="notifications-popover glass-card">
                  <div className="notifications-header">
                    <h4>Notificaciones</h4>
                    {unreadCount > 0 && (
                      <button 
                        className="btn-clear-notifications" 
                        onClick={() => {
                          setNotifications(notifications.map(n => ({ ...n, unread: false })));
                        }}
                      >
                        Marcar leídas
                      </button>
                    )}
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
