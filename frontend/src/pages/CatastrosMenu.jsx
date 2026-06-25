
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Map, ArrowRight } from 'lucide-react';

export default function CatastrosMenu() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin className="text-blue" /> Catastros
          </h1>
          <p className="text-muted">Administra los predios y terrenos con derecho a riego de la Junta.</p>
        </div>
      </div>

      <div className="modules-grid">
        
        {/* TARJETA 1: CATASTROS GENERALES */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer" 
          onClick={() => navigate('/dashboard/catastro/generales')}
        >
          <div className="module-banner bg-gradient-blue" style={{ opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-blue"><Map size={28} /></div>
            <h3>Catastros Generales</h3>
            <p>Visualiza el padrón completo de terrenos registrados, filtra por sectores y revisa coordenadas.</p>
            <button className="btn-module text-blue" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/catastro/generales'); }}>
              Ver Padrón <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* TARJETA 2: AGREGAR TERRENO */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/terrenos')}
        >
          <div className="module-banner bg-gradient-green" style={{ opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-green"><Plus size={28} /></div>
            <h3>Agregar Terreno</h3>
            <p>Registra un nuevo predio en el sistema asignándole su propietario, área y planimetría.</p>
            <button className="btn-module text-green" onClick={(e) => { e.stopPropagation(); navigate('/dashboard/terrenos'); }}>
              Registrar <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
