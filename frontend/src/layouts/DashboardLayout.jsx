import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Droplets, LogOut, LayoutDashboard, Users, FileText, Settings, ShieldAlert, UserCircle, Droplet, Award, Map, MapPin } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Toaster } from 'sonner';
import bgLayout from '../assets/bg_layout.png';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { hasPermission, isRole } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

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
    { name: 'Mi Predio', path: '/dashboard/terrenos', icon: MapPin, show: isRole('Usuario Regular') },
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
      
      {/* Sidebar (Menú Lateral) */}
      <aside className="sidebar glass-card">
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
                onClick={() => navigate(item.path)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-profile">
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
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
