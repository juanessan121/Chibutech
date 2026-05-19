import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        {/* Aquí podría ir un buscador global o un breadcrumb */}
        <h2>Panel de Administración</h2>
      </div>
      <div className="navbar-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="name">Pacha Toaquiza</span>
            <span className="role">Administrador</span>
          </div>
        </div>
        <button className="icon-btn logout-btn" onClick={handleLogout} title="Cerrar Sesión">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
