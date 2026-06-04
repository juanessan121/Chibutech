import React, { useState } from 'react';
import { FileText, Users, AlertCircle, BarChart3, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { usePDF } from '../hooks/usePDF';
import PDFDownloadButton from '../components/pdf/PDFDownloadButton';
import PageHeader from '../components/ui/PageHeader';
import bgRepPadron from '../assets/bg_rep_padron.png';
import bgRepMorosos from '../assets/bg_rep_morosos.png';
import bgRepFinanciero from '../assets/bg_rep_financiero.png';

// Configuración de reportes disponibles
const REPORTES = [
  {
    id: 'padron',
    title: 'Padrón de Usuarios',
    desc: 'Lista completa de comuneros activos por sectores para asambleas y registros oficiales.',
    icon: Users,
    color: '#0ea5e9',
    bg: bgRepPadron,
  },
  {
    id: 'morosos',
    title: 'Reporte de Morosidad',
    desc: 'Listado de usuarios con deudas y multas pendientes ordenado por monto adeudado.',
    icon: AlertCircle,
    color: '#ef4444',
    bg: bgRepMorosos,
  },
  {
    id: 'financiero',
    title: 'Balance Financiero',
    desc: 'Resumen de ingresos, egresos y estado actual de la caja comunitaria de la Junta.',
    icon: BarChart3,
    color: '#10b981',
    bg: bgRepFinanciero,
  },
];

export default function ReportesMenu() {
  const [activeReport, setActiveReport] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { generarPadron, generarMorosos, generarBalance, isGenerating } = usePDF();

  // Estado local de filtros por tipo de reporte
  const [filtroPadron, setFiltroPadron]         = useState({ sector: 'todos' });
  const [filtroMorosos, setFiltroMorosos]       = useState({ concepto: 'todas', montoMin: '0', fechaDesde: '', fechaHasta: '' });
  const [filtroFinanciero, setFiltroFinanciero] = useState({ periodo: 'este_mes', fechaDesde: '', fechaHasta: '' });

  // ── Dispatcher de generación según tipo activo ─────────────────────────────
  const handleGenerate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Procesando documento PDF...', {
      description: 'Consolidando información del sistema...',
    });
    try {
      if (activeReport === 'padron') {
        await generarPadron(filtroPadron);
      } else if (activeReport === 'morosos') {
        await generarMorosos({ 
          montoMin: parseFloat(filtroMorosos.montoMin) || 0,
          concepto: filtroMorosos.concepto,
          fechaDesde: filtroMorosos.fechaDesde,
          fechaHasta: filtroMorosos.fechaHasta
        });
      } else if (activeReport === 'financiero') {
        await generarBalance({ periodo: filtroFinanciero.periodo });
      }
      toast.success('¡PDF generado exitosamente!', {
        id: toastId,
        description: 'El documento se ha descargado automáticamente.',
        icon: <CheckCircle2 size={18} />,
      });
    } catch (err) {
      toast.error('Error al generar el PDF', {
        id: toastId,
        description: err.message || 'Intenta nuevamente.',
      });
    }
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Generando vista previa...');
    try {
      let url = null;
      if (activeReport === 'padron') {
        url = await generarPadron(filtroPadron, 'preview');
      } else if (activeReport === 'morosos') {
        url = await generarMorosos({ 
          montoMin: parseFloat(filtroMorosos.montoMin) || 0,
          concepto: filtroMorosos.concepto,
          fechaDesde: filtroMorosos.fechaDesde,
          fechaHasta: filtroMorosos.fechaHasta
        }, 'preview');
      } else if (activeReport === 'financiero') {
        url = await generarBalance({ periodo: filtroFinanciero.periodo }, 'preview');
      }
      setPreviewUrl(url);
      toast.success('Vista previa generada', { id: toastId });
    } catch (err) {
      toast.error('Error al generar vista previa', { id: toastId, description: err.message });
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      

      <PageHeader
        title="Centro de Reportes"
        description="Genera documentos PDF oficiales para Asambleas Generales y auditorías de la Junta."
        icon={FileText}
        iconColor="#0ea5e9"
        breadcrumb="Dashboard / Reportes"
      />

      {/* ── SELECTOR DE REPORTES ──────────────────────────────────────────── */}
      <div style={styles.reportGrid}>
        {REPORTES.map((rep) => {
          const Icon = rep.icon;
          const isActive = activeReport === rep.id;
          return (
            <div
              key={rep.id}
              className={`glass-card hover-glow cursor-pointer`}
              onClick={() => setActiveReport(rep.id)}
              style={{
                padding: '1.5rem',
                border: isActive ? `2px solid ${rep.color}` : '1px solid var(--border-color)',
                backgroundImage: `linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.92)), url(${rep.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: isActive ? `0 0 25px ${rep.color}35` : 'none',
                transition: 'all 0.3s ease',
                transform: isActive ? 'translateY(-2px)' : 'none',
                position: 'relative',
              }}
            >
              {/* Badge de selección */}
              {isActive && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: rep.color, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={14} color="#fff" />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '0.65rem', background: `${rep.color}20`, border: `1px solid ${rep.color}40`, color: rep.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 700 }}>{rep.title}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>{rep.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ── PANEL DE FILTROS ──────────────────────────────────────────────── */}
      {activeReport && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', marginTop: '1.5rem' }}>
          <h3 style={styles.panelTitle}>
            <Filter size={18} style={{ color: 'var(--primary)' }} />
            Configurar y Generar Documento
          </h3>

          <form onSubmit={handleGenerate}>
            <div className="form-grid" style={{ marginBottom: '2rem' }}>

              {/* ── FILTROS: PADRÓN ─────────────────────────────────────── */}
              {activeReport === 'padron' && (
                <div className="input-group">
                  <label className="input-label">Filtrar por Sector (Zona)</label>
                  <select
                    className="form-select"
                    value={filtroPadron.sector}
                    onChange={(e) => setFiltroPadron({ sector: e.target.value })}
                  >
                    <option value="todos">Todos los Sectores</option>
                    <option value="1">Sector Centro</option>
                    <option value="2">San Luis</option>
                    <option value="3">San Francisco</option>
                  </select>
                </div>
              )}

              {/* ── FILTROS: MOROSOS ─────────────────────────────────────── */}
              {activeReport === 'morosos' && (
                <>
                  <div className="input-group">
                    <label className="input-label">Origen de la Deuda</label>
                    <select
                      className="form-select"
                      value={filtroMorosos.concepto}
                      onChange={(e) => setFiltroMorosos(f => ({ ...f, concepto: e.target.value }))}
                    >
                      <option value="todas">Todas las deudas y multas</option>
                      <option value="mingas">Solo inasistencias a Mingas</option>
                      <option value="agua">Solo deudas por servicio de agua</option>
                      <option value="danos">Solo multas por daños/disciplina</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Mostrar usuarios que deban más de:</label>
                    <select
                      className="form-select"
                      value={filtroMorosos.montoMin}
                      onChange={(e) => setFiltroMorosos(f => ({ ...f, montoMin: e.target.value }))}
                    >
                      <option value="0">Cualquier valor (Desde $1)</option>
                      <option value="10">Más de $10 dólares</option>
                      <option value="50">Más de $50 dólares</option>
                      <option value="100">Más de $100 (Casos críticos)</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', gridColumn: '1 / -1' }}>
                    <div className="input-group">
                      <label className="input-label">Desde Fecha</label>
                      <input
                        type="date"
                        className="input-field"
                        value={filtroMorosos.fechaDesde}
                        onChange={(e) => setFiltroMorosos(f => ({ ...f, fechaDesde: e.target.value }))}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Hasta Fecha</label>
                      <input
                        type="date"
                        className="input-field"
                        value={filtroMorosos.fechaHasta}
                        onChange={(e) => setFiltroMorosos(f => ({ ...f, fechaHasta: e.target.value }))}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ── FILTROS: FINANCIERO ───────────────────────────────────── */}
              {activeReport === 'financiero' && (
                <>
                  <div className="input-group">
                    <label className="input-label">Período del Balance</label>
                    <select
                      className="form-select"
                      value={filtroFinanciero.periodo}
                      onChange={(e) => setFiltroFinanciero(f => ({ ...f, periodo: e.target.value }))}
                    >
                      <option value="este_mes">Lo que va de este mes</option>
                      <option value="mes_pasado">Mes Anterior</option>
                      <option value="este_anio">Todo el año actual</option>
                      <option value="personalizado">Rango personalizado</option>
                    </select>
                  </div>
                  {filtroFinanciero.periodo === 'personalizado' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', gridColumn: '1 / -1' }}>
                      <div className="input-group">
                        <label className="input-label">Desde</label>
                        <input
                          type="date"
                          className="input-field"
                          value={filtroFinanciero.fechaDesde}
                          onChange={(e) => setFiltroFinanciero(f => ({ ...f, fechaDesde: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Hasta</label>
                        <input
                          type="date"
                          className="input-field"
                          value={filtroFinanciero.fechaHasta}
                          onChange={(e) => setFiltroFinanciero(f => ({ ...f, fechaHasta: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── BOTONES DE ACCIÓN ─────────────────────────────────────── */}
            <div style={styles.actionRow}>
              <button
                type="button"
                className="btn-secondary"
                style={{ width: 'auto' }}
                onClick={() => { setActiveReport(null); setPreviewUrl(null); }}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: 'auto', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--blue)', borderColor: 'var(--blue)' }}
                onClick={handlePreview}
                disabled={isGenerating}
              >
                Previsualizar
              </button>

              <PDFDownloadButton
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                label={`Descargar ${REPORTES.find(r => r.id === activeReport)?.title}`}
              />
            </div>

            {previewUrl && (
              <div style={{ marginTop: '2rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', overflow: 'hidden' }} className="animate-fade-in">
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem' }}>Vista Previa del Documento</h4>
                  <button type="button" className="btn-icon" onClick={() => setPreviewUrl(null)} style={{ color: 'var(--text-muted)' }}>
                    <XCircle size={20}/>
                  </button>
                </div>
                <iframe src={previewUrl} style={{ width: '100%', height: '600px', border: 'none', display: 'block' }} title="Vista previa PDF" />
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  reportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem',
    marginBottom: '0.5rem',
  },
  panelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  actionRow: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border-color)',
  },
};
