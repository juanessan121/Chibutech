
import { useNavigate } from 'react-router-dom';
import { Leaf, Droplets, Sprout, ArrowRight } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

// Imágenes Agrícola
import bgAgricola1 from '../assets/bg_tomar_asistencia.png';
import bgAgricola2 from '../assets/bg_historial_mingas.png';

// Imágenes Recurso
import bgRecurso1 from '../assets/bg_layout.png';
import bgRecurso2 from '../assets/bg_header.png';

// Imágenes Comunitario
import bgComunitario1 from '../assets/bg_padron_general.png';
import bgComunitario2 from '../assets/bg_mingas.png';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar Transparente */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <Droplets className="text-primary" size={28} />
          <span>Junta de Agua Chibuleo</span>
        </div>
        <button className="btn-secondary-outline" onClick={() => navigate('/login')}>
          Ingresar al Portal
        </button>
      </nav>

      {/* Hero Section con la imagen generada */}
      <header className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content animate-fade-in">
          <span className="badge">Comunidad & Naturaleza</span>
          <h1>El agua es la vida de nuestros campos</h1>
          <p>Sistema inteligente para la administración eficiente y transparente del recurso hídrico, protegiendo el trabajo agrícola de nuestra comunidad.</p>
          <button className="btn-primary hero-btn" onClick={() => navigate('/login')}>
            Acceder al Sistema <ArrowRight size={20} />
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card glass-card">
          <div className="feature-bg">
            <div className="slide slide-1" style={{ backgroundImage: `url(${bgAgricola1})` }}></div>
            <div className="slide slide-2" style={{ backgroundImage: `url(${bgAgricola2})` }}></div>
          </div>
          <div className="feature-icon bg-green"><Sprout size={32} /></div>
          <h3>Cuidado Agrícola</h3>
          <p>Organización de turnos de regadío para asegurar que todas las parcelas florezcan con equidad.</p>
        </div>
        
        <div className="feature-card glass-card">
          <div className="feature-bg">
            <div className="slide slide-1" style={{ backgroundImage: `url(${bgRecurso1})` }}></div>
            <div className="slide slide-2" style={{ backgroundImage: `url(${bgRecurso2})` }}></div>
          </div>
          <div className="feature-icon bg-blue"><Droplets size={32} /></div>
          <h3>Gestión del Recurso</h3>
          <p>Control exacto del catastro de usuarios y cobros justos para el mantenimiento de las acequias.</p>
        </div>
        
        <div className="feature-card glass-card">
          <div className="feature-bg">
            <div className="slide slide-1" style={{ backgroundImage: `url(${bgComunitario1})` }}></div>
            <div className="slide slide-2" style={{ backgroundImage: `url(${bgComunitario2})` }}></div>
          </div>
          <div className="feature-icon bg-earth"><Leaf size={32} /></div>
          <h3>Trabajo Comunitario</h3>
          <p>Administración y registro de las Mingas, el pilar fundamental de nuestra fuerza comunitaria.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Consejo de Gobierno Comunitario Chibuleo-San Francisco - Unidos por nuestra tierra.</p>
      </footer>
    </div>
  );
}
