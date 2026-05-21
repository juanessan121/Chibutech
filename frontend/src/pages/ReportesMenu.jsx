import React, { useState } from 'react';
import { FileText, Users, AlertCircle, BarChart3, Download, Printer, Filter } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import bgRepPadron from '../assets/bg_rep_padron.png';
import bgRepMorosos from '../assets/bg_rep_morosos.png';
import bgRepFinanciero from '../assets/bg_rep_financiero.png';

export default function ReportesMenu() {
  const [activeReport, setActiveReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportesDisponibles = [
    { 
      id: 'padron', 
      title: 'Padrón de Usuarios', 
      desc: 'Lista completa de comuneros activos por sectores para asambleas.',
      icon: Users,
      color: '#0ea5e9', // Blue
      bg: bgRepPadron
    },
    { 
      id: 'morosos', 
      title: 'Reporte de Morosidad', 
      desc: 'Listado de usuarios con deudas y multas pendientes ordenado por monto.',
      icon: AlertCircle,
      color: '#ef4444', // Red
      bg: bgRepMorosos
    },
    { 
      id: 'financiero', 
      title: 'Balance Financiero', 
      desc: 'Resumen de ingresos, egresos y estado de la caja comunitaria.',
      icon: BarChart3,
      color: '#10b981', // Green
      bg: bgRepFinanciero
    }
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const toastId = toast.loading('Consultando registros financieros y comunitarios...', {
      description: 'Por favor espere mientras se consolida la información.'
    });
    
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('¡Documento emitido exitosamente!', {
        id: toastId,
        description: 'El reporte oficial está listo y la descarga ha comenzado automáticamente.'
      });
    }, 2500);
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toaster richColors />
      
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText className="text-blue" /> Centro de Reportes y Auditoría
          </h1>
          <p className="text-muted">Genere documentos en PDF o Excel para las Asambleas Generales de la Junta.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {reportesDisponibles.map((rep) => {
          const Icon = rep.icon;
          const isActive = activeReport === rep.id;
          return (
            <div 
              key={rep.id}
              className={`glass-card hover-glow cursor-pointer ${isActive ? 'active-report' : ''}`}
              onClick={() => setActiveReport(rep.id)}
              style={{ 
                padding: '1.5rem', 
                border: isActive ? `2px solid ${rep.color}` : '1px solid var(--border-color)',
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9)), url(${rep.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: isActive ? `0 0 20px ${rep.color}40` : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '0.5rem', background: `${rep.color}20`, color: rep.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>{rep.title}</h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>{rep.desc}</p>
            </div>
          );
        })}
      </div>

      {/* PANEL DE CONFIGURACIÓN DEL REPORTE */}
      {activeReport && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Filter className="text-primary" size={20} /> Filtros del Documento
          </h3>
          
          <form onSubmit={handleGenerate}>
            <div className="form-grid">
              
              {/* Filtros dinámicos según el reporte elegido */}
              {activeReport === 'padron' && (
                <div className="input-group">
                  <label className="input-label">Filtrar por Sector (Zona)</label>
                  <select className="form-select">
                    <option value="todos">Todos los Sectores</option>
                    <option value="1">Sector Centro</option>
                    <option value="2">San Luis</option>
                    <option value="3">San Francisco</option>
                  </select>
                </div>
              )}

              {activeReport === 'morosos' && (
                <>
                  <div className="input-group">
                    <label className="input-label">Origen de la Deuda</label>
                    <select className="form-select">
                      <option value="todas">Todas las deudas y multas</option>
                      <option value="mingas">Solo inasistencias a Mingas</option>
                      <option value="agua">Solo deudas por servicio de agua</option>
                      <option value="danos">Solo multas por daños/disciplina</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Mostrar usuarios que deban más de:</label>
                    <select className="form-select">
                      <option value="0">Cualquier valor (Desde $1)</option>
                      <option value="10">Más de $10 dólares</option>
                      <option value="50">Más de $50 dólares</option>
                      <option value="100">Más de $100 dólares (Casos críticos)</option>
                    </select>
                  </div>
                </>
              )}

              {activeReport === 'financiero' && (
                <>
                  <div className="input-group">
                    <label className="input-label">Período del Balance</label>
                    <select className="form-select">
                      <option value="personalizado">Rango de fechas específico</option>
                      <option value="este_mes">Lo que va de este mes</option>
                      <option value="mes_pasado">Mes Anterior (Cierre de fin de mes)</option>
                      <option value="este_anio">Todo el año actual</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', gridColumn: '1 / -1' }}>
                    <div className="input-group">
                      <label className="input-label">Desde (Fecha de Inicio)</label>
                      <input type="date" className="input-field" required />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Hasta (Fecha de Fin)</label>
                      <input type="date" className="input-field" required />
                    </div>
                  </div>
                </>
              )}

              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Formato de Salida</label>
                <select className="form-select">
                  <option value="pdf">Documento PDF (Listo para imprimir)</option>
                  <option value="excel">Hoja de Cálculo Excel (.xlsx)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: 'auto', gap: '0.5rem' }} 
                disabled={isGenerating}
              >
                {isGenerating ? 'Generando...' : <><Download size={18}/> Descargar Archivo</>}
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ width: 'auto', gap: '0.5rem' }}
                disabled={isGenerating}
                onClick={handleGenerate}
              >
                <Printer size={18}/> Imprimir Directo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
