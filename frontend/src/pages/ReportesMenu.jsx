import React, { useState, useEffect } from 'react';
import { FileText, Users, AlertCircle, BarChart3, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { usePDF } from '../hooks/usePDF';
import PDFDownloadButton from '../components/pdf/PDFDownloadButton';
import PageHeader from '../components/ui/PageHeader';
import { getZonas, getAllSectores } from '../services/catalogoService';
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
  const [filtroPadron, setFiltroPadron] = useState({
    zona: 'todas', sector: 'todos', nombreZona: '', nombreSector: '', sectoresDeLaZona: []
  });
  const [filtroMorosos, setFiltroMorosos]       = useState({ concepto: 'todas', montoMin: '0', fechaDesde: '', fechaHasta: '' });
  const [filtroFinanciero, setFiltroFinanciero] = useState({ periodo: 'este_mes', fechaDesde: '', fechaHasta: '' });

  // Progreso de campos para Morosos: 0=solo Origen, 1=+Monto, 2=+Fechas
  const [pasoMorosos, setPasoMorosos] = useState(0);

  // Catálogos para el filtro jerárquico del Padrón
  const [zonas, setZonas]     = useState([]);
  const [sectores, setSectores] = useState([]);

  useEffect(() => {
    Promise.all([getZonas(), getAllSectores()]).then(([z, s]) => {
      setZonas(z);
      setSectores(s);
    }).catch(() => {});
  }, []);

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
      toast.success('Reporte PDF generado y descargado.', {
        id: toastId,
        description: 'El documento se ha descargado automáticamente.',
        icon: <CheckCircle2 size={18} />,
      });
    } catch (err) {
      toast.error('No se pudo generar el reporte PDF.', {
        id: toastId,
        description: err.message || 'Intenta de nuevo.',
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
      toast.success('Vista previa lista.', { id: toastId });
    } catch (err) {
      toast.error('No se pudo generar la vista previa del reporte.', { id: toastId, description: err.message });
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
              onClick={() => { setActiveReport(rep.id); setPreviewUrl(null); setPasoMorosos(0); }}
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

              {/* ── FILTROS: PADRÓN — jerarquía Zona → Sector ─────────── */}
              {activeReport === 'padron' && (
                <>
                  {/* Paso 1 — Zona */}
                  <div className="input-group">
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StepBadge n={1} activo />
                      Zona / Área geográfica
                    </label>
                    <select
                      className="form-select"
                      value={filtroPadron.zona}
                      onChange={(e) => {
                        const idZona = e.target.value;
                        const zonaObj = zonas.find(z => String(z.id_zona) === idZona);
                        const sects   = sectores.filter(s => String(s.id_zona) === idZona);
                        setFiltroPadron({
                          zona: idZona,
                          sector: 'todos',
                          nombreZona: zonaObj?.nombre_zona ?? '',
                          nombreSector: '',
                          sectoresDeLaZona: sects.map(s => s.nombre_sector),
                        });
                      }}
                    >
                      <option value="todas">Todas las zonas</option>
                      {zonas.map(z => (
                        <option key={z.id_zona} value={z.id_zona}>{z.nombre_zona}</option>
                      ))}
                    </select>
                  </div>

                  {/* Paso 2 — Sector (se activa al elegir zona) */}
                  <div className="input-group" style={estiloProgresivo(filtroPadron.zona !== 'todas')}>
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StepBadge n={2} activo={filtroPadron.zona !== 'todas'} />
                      Sector específico
                      {filtroPadron.zona === 'todas' && <span style={styles.hintTexto}>← elige una zona primero</span>}
                    </label>
                    <select
                      className="form-select"
                      disabled={filtroPadron.zona === 'todas'}
                      value={filtroPadron.sector}
                      onChange={(e) => {
                        const idSector = e.target.value;
                        const sectObj  = sectores.find(s => String(s.id_sector) === idSector);
                        setFiltroPadron(f => ({
                          ...f,
                          sector: idSector,
                          nombreSector: sectObj?.nombre_sector ?? '',
                        }));
                      }}
                    >
                      <option value="todos">
                        Todos los sectores{filtroPadron.nombreZona ? ` de ${filtroPadron.nombreZona}` : ''}
                      </option>
                      {sectores
                        .filter(s => String(s.id_zona) === filtroPadron.zona)
                        .map(s => (
                          <option key={s.id_sector} value={s.id_sector}>{s.nombre_sector}</option>
                        ))}
                    </select>
                  </div>
                </>
              )}

              {/* ── FILTROS: MOROSOS (progresivo) ────────────────────────── */}
              {activeReport === 'morosos' && (
                <>
                  {/* Paso 1 — Origen */}
                  <div className="input-group">
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StepBadge n={1} activo />
                      Origen de la Deuda
                    </label>
                    <select
                      className="form-select"
                      value={filtroMorosos.concepto}
                      onChange={(e) => {
                        setFiltroMorosos(f => ({ ...f, concepto: e.target.value }));
                        if (pasoMorosos < 1) setPasoMorosos(1);
                      }}
                    >
                      <option value="todas">Todas las deudas y multas</option>
                      <option value="mingas">Solo inasistencias a Mingas</option>
                      <option value="agua">Solo deudas por servicio de agua</option>
                      <option value="danos">Solo multas por daños/disciplina</option>
                    </select>
                  </div>

                  {/* Paso 2 — Monto mínimo */}
                  <div className="input-group" style={estiloProgresivo(pasoMorosos >= 1)}>
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StepBadge n={2} activo={pasoMorosos >= 1} />
                      Mostrar usuarios que deban más de:
                      {pasoMorosos < 1 && <span style={styles.hintTexto}>← selecciona el origen primero</span>}
                    </label>
                    <select
                      className="form-select"
                      disabled={pasoMorosos < 1}
                      value={filtroMorosos.montoMin}
                      onChange={(e) => {
                        setFiltroMorosos(f => ({ ...f, montoMin: e.target.value }));
                        if (pasoMorosos < 2) setPasoMorosos(2);
                      }}
                    >
                      <option value="0">Cualquier valor (Desde $1)</option>
                      <option value="10">Más de $10 dólares</option>
                      <option value="50">Más de $50 dólares</option>
                      <option value="100">Más de $100 (Casos críticos)</option>
                    </select>
                  </div>

                  {/* Paso 3 — Rango de fechas */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', gridColumn: '1 / -1', ...estiloProgresivo(pasoMorosos >= 2) }}>
                    <div className="input-group">
                      <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StepBadge n={3} activo={pasoMorosos >= 2} />
                        Desde Fecha
                        {pasoMorosos < 2 && <span style={styles.hintTexto}>← selecciona el monto primero</span>}
                      </label>
                      <input
                        type="date"
                        className="input-field"
                        disabled={pasoMorosos < 2}
                        value={filtroMorosos.fechaDesde}
                        onChange={(e) => setFiltroMorosos(f => ({ ...f, fechaDesde: e.target.value, fechaHasta: '' }))}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StepBadge n={4} activo={!!filtroMorosos.fechaDesde} />
                        Hasta Fecha
                        {pasoMorosos >= 2 && !filtroMorosos.fechaDesde && <span style={styles.hintTexto}>← ingresa la fecha de inicio</span>}
                      </label>
                      <input
                        type="date"
                        className="input-field"
                        disabled={!filtroMorosos.fechaDesde}
                        min={filtroMorosos.fechaDesde}
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
                        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <StepBadge n={2} activo />
                          Desde
                        </label>
                        <input
                          type="date"
                          className="input-field"
                          value={filtroFinanciero.fechaDesde}
                          onChange={(e) => setFiltroFinanciero(f => ({ ...f, fechaDesde: e.target.value, fechaHasta: '' }))}
                          required
                        />
                      </div>
                      <div className="input-group" style={estiloProgresivo(!!filtroFinanciero.fechaDesde)}>
                        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <StepBadge n={3} activo={!!filtroFinanciero.fechaDesde} />
                          Hasta
                          {!filtroFinanciero.fechaDesde && <span style={styles.hintTexto}>← ingresa la fecha de inicio</span>}
                        </label>
                        <input
                          type="date"
                          className="input-field"
                          disabled={!filtroFinanciero.fechaDesde}
                          min={filtroFinanciero.fechaDesde}
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

// Badge numerado para cada paso del formulario progresivo
function StepBadge({ n, activo }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.65rem',
      fontWeight: 700, flexShrink: 0,
      background: activo ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
      color: activo ? '#fff' : '#64748b',
      transition: 'background 0.3s, color 0.3s',
    }}>
      {n}
    </span>
  );
}

// Estilo que atenúa visualmente los campos aún no habilitados
const estiloProgresivo = (activo) => ({
  opacity: activo ? 1 : 0.38,
  pointerEvents: activo ? 'auto' : 'none',
  transition: 'opacity 0.35s ease',
});

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
  hintTexto: {
    fontSize: '0.7rem',
    color: '#475569',
    fontWeight: 400,
    marginLeft: '0.25rem',
  },
};
