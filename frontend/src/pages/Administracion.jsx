import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Settings, ArrowRight, ShieldAlert } from 'lucide-react';
import bgLayout from '../assets/bg_layout.png';
import bgReportes from '../assets/bg_reportes.png';

export default function Administracion() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield className="text-primary" /> Administración del Sistema
          </h1>
          <p className="text-muted">Ajustes globales y auditoría del sistema.</p>
        </div>
      </div>

      <div className="modules-grid">
        
        {/* TARJETA 1: CONFIGURACION */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer" 
          onClick={() => navigate('/dashboard/administracion/configuracion')}
        >
          <div className="module-banner bg-gradient-blue" style={{ backgroundImage: `url(${bgLayout})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-blue"><Settings size={28} /></div>
            <h3>Configuración Global</h3>
            <p>Ajustes generales del sistema como valores de multas, cuotas y parámetros globales.</p>
            <button className="btn-module text-blue">
              Abrir Configuración <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* TARJETA 2: BITACORA */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/administracion/bitacora')}
        >
          <div className="module-banner bg-gradient-purple" style={{ backgroundImage: `url(${bgReportes})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-purple"><ShieldAlert size={28} /></div>
            <h3>Bitácora / Auditoría</h3>
            <p>Registro de actividades de los usuarios, sesiones y acciones clave en el sistema.</p>
            <button className="btn-module text-purple">
              Ver Bitácora <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
