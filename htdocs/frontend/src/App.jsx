// src/App.jsx
import React, { useState } from 'react';
import './index.css';
import Login from './login';
import Register from './register';

function App() {
  const [userRole, setUserRole] = useState('unregistered');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleOpenLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleOpenRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleCloseAuth = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLoginSuccess = () => {
    setUserRole('registered');
    handleCloseAuth();
  };

  const handleRegisterSuccess = () => {
    setUserRole('registered');
    handleCloseAuth();
  };

  const handleLogout = () => {
    setUserRole('unregistered');
  };

  // Si está mostrando login o register, renderiza eso
  if (showLogin) {
    return <Login onSwitchToRegister={handleOpenRegister} onLoginSuccess={handleLoginSuccess} />;
  }

  if (showRegister) {
    return <Register onSwitchToLogin={handleOpenLogin} onRegisterSuccess={handleRegisterSuccess} />;
  }

  // Si no, muestra la página principal
  return (
    <>
      {/* NAVBAR SUPERIOR - MODO ÉPICO */}
      <nav className="navbar">
        <div className="nav-brand">
          <span>●</span> Comunidad Chibuleo
        </div>

        <div className="nav-actions">
          {/* VISTA 1: Usuario sin registrar */}
          {userRole === 'unregistered' && (
            <button className="btn btn-primary" onClick={handleOpenLogin}>
              Iniciar Sesión
            </button>
          )}

          {/* VISTA 2: Usuario común registrado */}
          {userRole === 'registered' && (
            <>
              <button className="btn btn-yellow">
                Inscribirse a Minga
              </button>

              {/* Botón Desplegable */}
              <div className="dropdown">
                <button className="btn btn-secondary">
                  Mi Cuenta ▼
                </button>
                <div className="dropdown-content">
                  <a className="dropdown-item">Perfil Personal</a>
                  <a className="dropdown-item">Reportes de Multas</a>
                  <a className="dropdown-item" style={{ color: 'var(--red)' }} onClick={handleLogout}>
                    Cerrar Sesión
                  </a>
                </div>
              </div>
            </>
          )}

          {/* VISTA 3: Administrador */}
          {userRole === 'admin' && (
            <>
              {/* Desplegable de Administración */}
              <div className="dropdown">
                <button className="btn btn-primary">
                  Panel de Administración ▼
                </button>
                <div className="dropdown-content">
                  <a className="dropdown-item">Gestionar Mingas</a>
                  <a className="dropdown-item">Gestionar Usuarios</a>
                  <a className="dropdown-item">Caja Comunitaria</a>
                  <a className="dropdown-item">Gestionar Multas</a>
                </div>
              </div>
              
              {/* Desplegable de Cuenta Admin */}
              <div className="dropdown">
                <button className="btn btn-secondary">
                  Mi Cuenta ▼
                </button>
                <div className="dropdown-content">
                  <a className="dropdown-item">Perfil Admin</a>
                  <a className="dropdown-item" style={{ color: 'var(--red)' }} onClick={handleLogout}>
                    Cerrar Sesión
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL - HERO CARD */}
      <main className="main-content">
        <div className="hero-card">
          <h1>Sistema de Gestión de Mingas</h1>
          <p>
            Un espacio digital profesional creado para organizar, gestionar y honrar nuestra 
            cultura mediante el trabajo comunitario en la <strong>Comunidad Chibuleo</strong>.
          </p>
          
          {userRole === 'unregistered' && (
            <button className="btn btn-primary" style={{ marginTop: '15px', padding: '15px 30px', fontSize: '1.1rem' }} onClick={handleOpenLogin}>
              Comenzar Ahora
            </button>
          )}
          {userRole === 'registered' && (
            <button className="btn btn-yellow" style={{ marginTop: '15px', padding: '15px 30px', fontSize: '1.1rem' }}>
              Ver Próximas Mingas
            </button>
          )}
          {userRole === 'admin' && (
            <button className="btn btn-primary" style={{ marginTop: '15px', padding: '15px 30px', fontSize: '1.1rem' }}>
              Ir al Dashboard
            </button>
          )}
        </div>
      </main>

      {/* SWITCHER PARA PROBAR LAS VISTAS (Solo Desarrollo) */}
      <div className="view-switcher">
        <span>Vistas de Prueba:</span>
        <button 
          className={userRole === 'unregistered' ? 'active' : ''} 
          onClick={() => setUserRole('unregistered')}
        >
          Sin Registrar
        </button>
        <button 
          className={userRole === 'registered' ? 'active' : ''} 
          onClick={() => setUserRole('registered')}
        >
          Usuario Común
        </button>
        <button 
          className={userRole === 'admin' ? 'active' : ''} 
          onClick={() => setUserRole('admin')}
        >
          Administrador
        </button>
      </div>
    </>
  );
}

export default App;