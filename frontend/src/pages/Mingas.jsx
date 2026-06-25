import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, ClipboardCheck, History, ArrowRight, Users, Zap } from 'lucide-react';
import bgProgramarMinga from '../assets/bg_programar_minga.png';
import bgTomarAsistencia from '../assets/bg_tomar_asistencia.png';
import bgHistorialMingas from '../assets/bg_historial_mingas.png';
import bgMingas from '../assets/bg_mingas.png';
import { getMingas } from '../services/mingaService';

const ESTADOS_ACTIVOS = new Set(['Programada', 'En Ejecución', 'Pospuesta', 'Suspendida']);

export default function MingasMenu() {
  const navigate = useNavigate();
  const [countActivas, setCountActivas] = useState(null);

  useEffect(() => {
    getMingas()
      .then(todas => setCountActivas(todas.filter(m => ESTADOS_ACTIVOS.has(m.estado)).length))
      .catch(() => setCountActivas(0));
  }, []);

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
        <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mingas/programar')}>
          <div className="module-banner bg-gradient-blue" style={{ backgroundImage: `url(${bgProgramarMinga})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-blue"><CalendarPlus size={28} /></div>
            <h3>Programar Minga</h3>
            <p>Define la fecha, lugar, motivo y el valor de la multa por inasistencia para una nueva jornada.</p>
            <button className="btn-module text-blue">Crear Convocatoria <ArrowRight size={16} /></button>
          </div>
        </div>

        {/* TARJETA 2: ASISTENCIA */}
        <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mingas/activas')}>
          <div className="module-banner bg-gradient-green" style={{ backgroundImage: `url(${bgTomarAsistencia})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-green"><ClipboardCheck size={28} /></div>
            <h3>Tomar Asistencia</h3>
            <p>Registra quiénes asistieron, quiénes faltaron y las justificaciones médicas.</p>
            <button className="btn-module text-green">Registrar <ArrowRight size={16} /></button>
          </div>
        </div>

        {/* TARJETA 3: HISTORIAL */}
        <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mingas/historial')}>
          <div className="module-banner bg-gradient-earth" style={{ backgroundImage: `url(${bgHistorialMingas})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-earth"><History size={28} /></div>
            <h3>Historial</h3>
            <p>Revisa mingas pasadas, su estado (Finalizada, Suspendida) y los reportes generados.</p>
            <button className="btn-module text-earth">Ver Archivo <ArrowRight size={16} /></button>
          </div>
        </div>

        {/* TARJETA 4: MINGAS ACTIVAS */}
        <div className="glass-card module-card hover-glow cursor-pointer" onClick={() => navigate('/dashboard/mingas/activas')}>
          <div className="module-banner" style={{ backgroundImage: `url(${bgMingas})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="module-icon" style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
                <Zap size={28} />
              </div>
              {countActivas !== null && (
                <span style={{
                  background: countActivas > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)',
                  color: countActivas > 0 ? '#10b981' : '#64748b',
                  border: `1px solid ${countActivas > 0 ? 'rgba(16,185,129,0.4)' : 'rgba(100,116,139,0.3)'}`,
                  borderRadius: '999px', padding: '0.15rem 0.65rem',
                  fontSize: '0.85rem', fontWeight: 700,
                }}>
                  {countActivas} activa{countActivas !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h3>Mingas Activas</h3>
            <p>Consulta el detalle de cada minga, zonas y sectores convocados. Pospón, reactiva o cancela.</p>
            <button className="btn-module" style={{ color: '#10b981' }}>
              Ver y Gestionar <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
