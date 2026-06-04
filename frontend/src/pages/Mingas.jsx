import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, ClipboardCheck, History, ArrowRight, Users } from 'lucide-react';
import bgProgramarMinga from '../assets/bg_programar_minga.png';
import bgTomarAsistencia from '../assets/bg_tomar_asistencia.png';
import bgHistorialMingas from '../assets/bg_historial_mingas.png';

export default function MingasMenu() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users className="text-green" /> Control de Mingas
          </h1>
          <p className="text-muted">Planifica el trabajo comunitario y registra las asistencias.</p>
        </div>
      </div>

      <div className="modules-grid">
        
        {/* TARJETA 1: PROGRAMAR */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer" 
          onClick={() => navigate('/dashboard/mingas/programar')}
        >
          <div className="module-banner bg-gradient-blue" style={{ backgroundImage: `url(${bgProgramarMinga})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-blue"><CalendarPlus size={28} /></div>
            <h3>Programar Minga</h3>
            <p>Define la fecha, lugar, motivo y el valor de la multa por inasistencia para una nueva jornada.</p>
            <button className="btn-module text-blue">
              Crear Convocatoria <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* TARJETA 2: ASISTENCIA */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/mingas/asistencia')}
        >
          <div className="module-banner bg-gradient-green" style={{ backgroundImage: `url(${bgTomarAsistencia})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-green"><ClipboardCheck size={28} /></div>
            <h3>Tomar Asistencia</h3>
            <p>Registra quiénes asistieron, quiénes faltaron y las justificaciones médicas.</p>
            <button className="btn-module text-green">
              Registrar <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* TARJETA 3: HISTORIAL */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/mingas/historial')}
        >
          <div className="module-banner bg-gradient-earth" style={{ backgroundImage: `url(${bgHistorialMingas})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-earth"><History size={28} /></div>
            <h3>Historial</h3>
            <p>Revisa mingas pasadas, su estado (Finalizada, Suspendida) y los reportes generados.</p>
            <button className="btn-module text-earth">
              Ver Archivo <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
