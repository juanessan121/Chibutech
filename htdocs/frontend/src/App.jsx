import React, { useState } from 'react';
import './index.css'; // Usamos el CSS épico que acabamos de crear

function App() {
  // Estado para simular las 3 vistas: 'unregistered', 'registered', 'admin'
const [userRole, setUserRole] = useState('unregistered');

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
            <button className="btn btn-primary">
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
                <a className="dropdown-item" style={{ color: 'var(--red)' }}>Cerrar Sesión</a>
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
                <a className="dropdown-item" style={{ color: 'var(--red)' }}>Cerrar Sesión</a>
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
            <button className="btn btn-primary" style={{ marginTop: '15px', padding: '15px 30px', fontSize: '1.1rem' }}>
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