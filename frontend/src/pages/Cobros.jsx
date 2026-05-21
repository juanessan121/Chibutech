import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Search, PlusCircle, BarChart3, ArrowRight, Droplets } from 'lucide-react';
import bgVentanillaCobro from '../assets/bg_ventanilla_cobro.png';
import bgGenerarMulta from '../assets/bg_generar_multa.png';
import bgRegistrarEgreso from '../assets/bg_registrar_egreso.png';
import bgArqueoCaja from '../assets/bg_arqueo_caja.png';

export default function CobrosMenu() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Wallet className="text-yellow" /> Gestión de Cobros y Multas
          </h1>
          <p className="text-muted">Administra la caja comunitaria, cobra multas de mingas y registra ingresos.</p>
        </div>
      </div>

      <div className="modules-grid">
        
        {/* TARJETA 1: VENTANILLA DE COBRO */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer" 
          onClick={() => navigate('/dashboard/cobros/ventanilla')}
        >
          <div className="module-banner" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', backgroundImage: `url(${bgVentanillaCobro})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon" style={{ background: '#f59e0b', color: 'white' }}><Search size={28} /></div>
            <h3>Ventanilla de Cobro</h3>
            <p>Busca a un agricultor para ver sus multas pendientes, procesar pagos y emitir recibos.</p>
            <button className="btn-module text-yellow" style={{ color: '#d97706' }}>
              Cobrar Deudas <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* TARJETA 2: GENERAR MULTA MANUAL */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/cobros/generar')}
        >
          <div className="module-banner bg-gradient-red" style={{ backgroundImage: `url(${bgGenerarMulta})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-red"><PlusCircle size={28} /></div>
            <h3>Generar Multa Manual</h3>
            <p>Emite multas por desperdicio de agua, faltas disciplinarias o daños a la comunidad.</p>
            <button className="btn-module text-red">
              Aplicar Sanción <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* TARJETA 3: REGISTRAR GASTO (EGRESO) */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/cobros/egreso')}
        >
          <div className="module-banner" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', backgroundImage: `url(${bgRegistrarEgreso})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon" style={{ background: '#ef4444', color: 'white' }}><Wallet size={28} /></div>
            <h3>Registrar Egreso</h3>
            <p>Registra compras de materiales, pagos por maquinaria y cualquier gasto de la Junta.</p>
            <button className="btn-module text-red">
              Declarar Gasto <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* TARJETA 4: ARQUEO DE CAJA */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/cobros/historial')}
        >
          <div className="module-banner bg-gradient-purple" style={{ backgroundImage: `url(${bgArqueoCaja})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon bg-purple"><BarChart3 size={28} /></div>
            <h3>Arqueo e Historial</h3>
            <p>Revisa todos los ingresos y egresos para el control financiero de la Junta.</p>
            <button className="btn-module text-purple">
              Ver Transacciones <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* TARJETA 5: EMITIR PLANILLAS DE AGUA */}
        <div 
          className="glass-card module-card hover-glow cursor-pointer"
          onClick={() => navigate('/dashboard/cobros/planilla')}
        >
          <div className="module-banner" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', opacity: 0.8 }}></div>
          <div className="module-content">
            <div className="module-icon" style={{ background: '#3b82f6', color: 'white' }}><Droplets size={28} /></div>
            <h3>Emitir Planillas</h3>
            <p>Genera las facturas o planillas de agua mensuales de forma masiva o individual.</p>
            <button className="btn-module text-blue" style={{ color: '#3b82f6' }}>
              Generar Planilla <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
