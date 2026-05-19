import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Map, Droplets, Receipt, Wallet, Gavel, ShieldCheck, Settings } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/personas', label: 'Personas', icon: Users },
  { path: '/terrenos', label: 'Terrenos', icon: Map },
  { path: '/mingas', label: 'Mingas', icon: Droplets },
  { path: '/multas', label: 'Multas', icon: Receipt },
  { path: '/caja', label: 'Caja Comunitaria', icon: Wallet },
  { path: '/directiva', label: 'Directiva', icon: Gavel },
  { path: '/auditoria', label: 'Auditoría', icon: ShieldCheck },
  { path: '/configuracion', label: 'Configuración', icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>●</span> Chibuleo ERP
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
