import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <span>●</span> Comunidad Chibuleo
        </div>
        <div className="nav-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/register')}>
            Registrarse
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="hero-card">
          <h1>Sistema de Gestión de Mingas y ERP</h1>
          <p>
            Un espacio digital profesional creado para organizar, gestionar y honrar nuestra 
            cultura mediante el trabajo comunitario en la <strong>Comunidad Chibuleo</strong>.
          </p>
          <button className="btn btn-primary" style={{ marginTop: '15px', padding: '15px 30px', fontSize: '1.1rem' }} onClick={() => navigate('/login')}>
            Comenzar Ahora
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
