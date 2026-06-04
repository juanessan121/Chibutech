import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Users, ArrowRight, Shield } from 'lucide-react';
import bgBuscarUsuario from '../assets/bg_buscar_usuario.png';
import bgPadronGeneral from '../assets/bg_padron_general.png';
import bgAgregarUsuario from '../assets/bg_agregar_usuario.png';

export default function UsuariosMenu() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield className="text-primary" /> Módulo de Usuarios
          </h1>
          <p className="text-muted">Selecciona la acción que deseas realizar.</p>
        </div>
      </div>

      <div className="modules-grid">
        
        {/* TARJETA 1: PADRÓN GENERAL Y BÚSQUEDA */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/usuarios/padron')}
        >
          <div className="module-banner bg-gradient-purple" style={{ backgroundImage: `url(${bgPadronGeneral})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-purple"><Users size={28} /></div>
            <h3>Padrón General y Búsqueda</h3>
            <p>Busca usuarios específicos o revisa el listado completo de la directiva y comuneros registrados.</p>
            <button className="btn-module text-purple">
              Abrir Padrón <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* TARJETA 3: AGREGAR */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/usuarios/agregar')}
        >
          <div className="module-banner bg-gradient-green" style={{ backgroundImage: `url(${bgAgregarUsuario})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-green"><UserPlus size={28} /></div>
            <h3>Agregar Usuario</h3>
            <p>Registra un nuevo miembro llenando todos sus datos personales y asignando su rol.</p>
            <button className="btn-module text-green">
              Nuevo Registro <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
