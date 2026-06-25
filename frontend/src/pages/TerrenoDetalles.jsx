import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Map, MapPin, ArrowLeft, Calendar, FileText, Info, Compass, FileDown, Edit2, ArrowRightLeft, X, ExternalLink, Users, ChevronRight, AlertTriangle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import useAuthStore from '../store/useAuthStore';

import { getTerrenoById, traspasarDominio } from '../services/terrenoService';
import { toast } from 'sonner';
import PersonaAutocompleteInput from '../components/PersonaAutocompleteInput';
import api from '../services/axiosConfig';

export default function TerrenoDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ficha');
  const user = useAuthStore(state => state.user);
  const isUsuarioBase = user?.rol === 'Comunero' || user?.rol === 'Usuario Regular' || user?.rol === 'Usuario';

  const [terreno, setTerreno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalTraspaso, setModalTraspaso] = useState(false);
  const [traspasoStep, setTraspasoStep] = useState(1); // 1 = buscar nuevo dueño, 2 = confirmar
  const [nuevoDueno, setNuevoDueno] = useState(null);
  const [motivoTraspaso, setMotivoTraspaso] = useState('');
  const [motivoTouched, setMotivoTouched] = useState(false);
  const [directiva, setDirectiva] = useState([]);
  const [tarifas, setTarifas] = useState({ metrosBase: 1000, valorBase: 5 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTerrenoById(id);
        setTerreno(data);
      } catch(e) {
        toast.error('No se pudo cargar la información del predio. Vuelve a intentarlo.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    api.get('/directiva/actual').then(res => setDirectiva(res.data.data || [])).catch(() => {});
    api.get('/configuracion').then(res => {
      const cfg = Object.fromEntries((res.data.data || []).map(c => [c.clave, parseFloat(c.valor)]));
      setTarifas({
        metrosBase: cfg['TARIFA_METROS_BASE'] || 1000,
        valorBase:  cfg['TARIFA_VALOR_BASE']  || 5,
      });
    }).catch(() => {});
  }, [id]);

  const mapLat = parseFloat(terreno?.latitud) || -1.3281;
  const mapLng = parseFloat(terreno?.longitud) || -78.5528;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${mapLat},${mapLng}&z=17&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps?q=${mapLat},${mapLng}`;

  const handleTraspaso = async () => {
    if (!nuevoDueno || !nuevoDueno.id_persona) return toast.error('Debe seleccionar al nuevo propietario del predio antes de continuar.');
    if (!motivoTraspaso) return toast.error('Debe indicar el documento o motivo legal del traspaso de dominio.');
    try {
      await traspasarDominio(id, nuevoDueno.id_persona, motivoTraspaso);
      toast.success('Traspaso de dominio ejecutado con éxito');
      setModalTraspaso(false);
      setTraspasoStep(1);
      setNuevoDueno(null);
      setMotivoTraspaso('');
      setLoading(true);
      const data = await getTerrenoById(id);
      setTerreno(data);
      setLoading(false);
    } catch(e) {
      toast.error(e.response?.data?.message || 'No se pudo realizar el traspaso. Verifica los datos e intenta de nuevo.');
    }
  };

  const cerrarModalTraspaso = () => {
    setModalTraspaso(false);
    setTraspasoStep(1);
    setNuevoDueno(null);
    setMotivoTraspaso('');
    setMotivoTouched(false);
  };

  if (loading) return <div style={{padding: '3rem', textAlign: 'center', color: 'var(--text-main)'}}>Cargando información del predio...</div>;
  if (!terreno) return <div style={{padding: '3rem', textAlign: 'center', color: 'var(--red)'}}>No se encontró el terreno</div>;

  // Genera el Certificado de Catastro con jsPDF — abre en nueva pestaña (preview) o descarga
  const handleDownloadPDF = (preview = false) => {
    const doc = new jsPDF();

    // Cálculo de cuota real (misma fórmula que en backend generarPlanillas)
    const areaM2 = parseFloat(terreno.area_m2) || 0;
    const metrosBase = tarifas.metrosBase;
    const tarifaBase = tarifas.valorBase;
    const fracciones = Math.ceil(areaM2 / metrosBase);
    const cuotaMensual = fracciones * tarifaBase;
    const cuotaAnual = cuotaMensual * 12;

    // Miembros de la directiva para firmas
    const presidente = directiva.find(m => m.cargo === 'Presidente');
    const secretario = directiva.find(m => m.cargo === 'Secretario');
    const periodoDirectiva = directiva[0]?.periodo || new Date().getFullYear();

    // ── Bordes ────────────────────────────────────────────────────────────────
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, 200, 287);
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.rect(8, 8, 194, 281);

    // ── Encabezado ────────────────────────────────────────────────────────────
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text('CONSEJO DE GOBIERNO COMUNITARIO CHIBULEO-SAN FRANCISCO', 105, 24, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Sistema de Gestión Comunitaria', 105, 30, { align: 'center' });
    doc.text('Tungurahua - Ecuador', 105, 35, { align: 'center' });

    doc.setLineWidth(0.8);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 41, 195, 41);

    // ── Título ────────────────────────────────────────────────────────────────
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text('CERTIFICADO OFICIAL DE CATASTRO DE PREDIO', 105, 50, { align: 'center' });

    // Número y fecha
    const certificadoNo = `CERT-${terreno.clave_catastral.replace(/-/g, '')}`;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`No: ${certificadoNo}`, 15, 58);
    doc.text(`Emisión: ${new Date().toLocaleDateString('es-EC')}`, 195, 58, { align: 'right' });

    // ── Texto introductorio ───────────────────────────────────────────────────
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const introText = `La Directiva de la Junta de Agua de Riego Chibuleo, período ${periodoDirectiva}, hace constar y certifica que, según los registros vigentes del catastro comunitario, el predio detallado a continuación se encuentra inscrito y tiene asignada su cuota de agua correspondiente.`;
    doc.text(doc.splitTextToSize(introText, 180), 15, 68);

    // ── Sección 1: Propietario ────────────────────────────────────────────────
    doc.setFillColor(240, 249, 255);
    doc.rect(15, 86, 180, terreno.copropietarios?.length > 0 ? 26 : 20, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(2, 132, 199);
    doc.text('DATOS DEL COMUNERO TITULAR', 20, 93);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Nombre Completo:`, 20, 100);
    doc.setFont('Helvetica', 'bold');
    doc.text(`${terreno.propietario}`, 70, 100);

    doc.setFont('Helvetica', 'normal');
    doc.text(`Cédula de Identidad:`, 20, 106);
    doc.setFont('Helvetica', 'bold');
    doc.text(`${terreno.cedula}`, 70, 106);

    let yPos = 115;
    if (terreno.copropietarios && terreno.copropietarios.length > 0) {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('Copropietarios:', 20, yPos - 3);
      doc.setTextColor(15, 23, 42);
      const copText = terreno.copropietarios.map(c => `${c.nombre} (C.I: ${c.cedula})`).join(' • ');
      doc.text(doc.splitTextToSize(copText, 145), 55, yPos - 3);
      yPos = 118;
    }

    // ── Sección 2: Ficha Catastral ────────────────────────────────────────────
    doc.setLineWidth(0.3);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, yPos, 195, yPos);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(2, 132, 199);
    doc.text('INFORMACIÓN CATASTRAL DEL PREDIO', 15, yPos + 8);
    doc.line(15, yPos + 11, 195, yPos + 11);

    const camposCatastrales = [
      ['Clave Catastral:', terreno.clave_catastral],
      ['Sector / Zona:', `${terreno.sector || ''} (${terreno.zona || 'Sin zona'})`],
      ['Área del Predio:', `${parseFloat(terreno.area_m2).toLocaleString('es-EC')} m²  |  ${(areaM2/10000).toFixed(4)} Hectáreas`],
      ['Estado del Lote:', terreno.estado_construccion || 'Sin especificar'],
      ['Coordenadas GPS:', terreno.latitud ? `Lat ${terreno.latitud}, Lng ${terreno.longitud}` : 'No registradas'],
    ];

    let y = yPos + 18;
    camposCatastrales.forEach(([label, valor]) => {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(label, 20, y);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(String(valor), 75, y);
      y += 7;
    });

    doc.line(15, y + 2, 195, y + 2);

    // ── Sección 3: Cuota Mensual (datos reales calculados) ────────────────────
    y += 12;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(2, 132, 199);
    doc.text('CUOTA DE AGUA MENSUAL ASIGNADA', 15, y);
    doc.line(15, y + 3, 195, y + 3);
    y += 11;

    const camposCuota = [
      ['Área del predio:', `${parseFloat(terreno.area_m2).toLocaleString('es-EC')} m²`],
      ['Tarifa base:', `$${tarifaBase.toFixed(2)} por cada ${metrosBase} m² o fracción`],
      [`Fracciones (ceil(${parseFloat(terreno.area_m2).toLocaleString('es-EC')}÷${metrosBase})):`, `${fracciones} unidades`],
      ['Cuota Mensual:', `$${cuotaMensual.toFixed(2)}`],
      ['Cuota Anual Estimada:', `$${cuotaAnual.toFixed(2)} (12 meses)`],
    ];

    camposCuota.forEach(([label, valor], i) => {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(label, 20, y);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(i >= 3 ? 16 : 15, i >= 3 ? 185 : 23, i >= 3 ? 129 : 42);
      doc.text(String(valor), 110, y);
      y += 7;
    });

    doc.line(15, y + 2, 195, y + 2);

    // ── Nota de validez ───────────────────────────────────────────────────────
    y += 10;
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const notaText = 'Este certificado tiene validez de 90 días a partir de la fecha de emisión. Está prohibida la transferencia o fraccionamiento de los derechos de agua sin autorización escrita de la Asamblea General de la Junta de Agua de Riego Chibuleo.';
    doc.text(doc.splitTextToSize(notaText, 180), 15, y);

    // ── Firmas (nombres reales de la directiva) ───────────────────────────────
    const firmaY = 258;
    doc.setDrawColor(203, 213, 225);
    doc.line(25, firmaY, 95, firmaY);
    doc.line(115, firmaY, 185, firmaY);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('PRESIDENTE', 60, firmaY + 5, { align: 'center' });
    doc.text('SECRETARIO/A', 150, firmaY + 5, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(presidente?.nombre || 'Junta de Agua de Riego Chibuleo', 60, firmaY + 10, { align: 'center' });
    doc.text(secretario?.nombre || 'Junta de Agua de Riego Chibuleo', 150, firmaY + 10, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Junta de Agua de Riego Chibuleo', 60, firmaY + 15, { align: 'center' });
    doc.text('Junta de Agua de Riego Chibuleo', 150, firmaY + 15, { align: 'center' });

    if (preview) {
      window.open(doc.output('bloburl'), '_blank');
    } else {
      doc.save(`Certificado_Catastro_${terreno.clave_catastral}.pdf`);
    }
  };

  return (
    <div className="page-slide-in pb-10">
      {/* Botón Volver y Cabecera */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          className="btn-secondary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '2rem', marginBottom: '1rem' }}
          onClick={() => navigate(isUsuarioBase ? '/dashboard' : '/dashboard/catastro')}
        >
          <ArrowLeft size={16} /> {isUsuarioBase ? 'Volver al Inicio' : 'Volver al Catastro'}
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', margin: 0 }}>
              <Map className="text-earth" /> Ficha de Predio: {terreno.clave_catastral}
            </h1>
            <p className="text-muted">Propietario titular: {terreno.propietario}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!isUsuarioBase && (
              <>
                <button 
                  className="btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                  onClick={() => navigate(`/dashboard/catastro/editar/${id}`)}
                >
                  <Edit2 size={18} /> Editar Predio
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderColor: 'var(--yellow)', color: 'var(--yellow)' }}
                  onClick={() => setModalTraspaso(true)}
                >
                  <ArrowRightLeft size={18} /> Traspaso Dominio
                </button>
              </>
            )}
            <button
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
              onClick={() => handleDownloadPDF(true)}
            >
              <ExternalLink size={18} /> Vista Previa PDF
            </button>
            <button
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              onClick={() => handleDownloadPDF(false)}
            >
              <FileDown size={18} /> Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="terrain-tabs">
        <button 
          className={`tab-btn ${activeTab === 'ficha' ? 'active' : ''}`}
          onClick={() => setActiveTab('ficha')}
        >
          <Info size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Ficha Catastral
        </button>
        <button
          className={`tab-btn ${activeTab === 'mapa' ? 'active' : ''}`}
          onClick={() => setActiveTab('mapa')}
        >
          <Compass size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Vista en Google Maps
        </button>
        <button 
          className={`tab-btn ${activeTab === 'turno' ? 'active' : ''}`}
          onClick={() => setActiveTab('turno')}
        >
          <Calendar size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Cuota Mensual
        </button>
      </div>

      {/* Contenido de Tabs */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        
        {/* TAB 1: FICHA CATASTRAL */}
        {activeTab === 'ficha' && (() => {
          const estadoColor = {
            'Construido':       { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
            'En Construcción':  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
            'En Planificación': { bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.3)', text: '#0ea5e9' },
            'Abandonado':       { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#ef4444' },
          };
          const ec = estadoColor[terreno.estado_construccion] || { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', text: 'var(--text-muted)' };
          const initials = (name) => name?.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('') || '?';
          return (
          <div className="details-grid animate-fade-in">

            {/* ── COLUMNA IZQUIERDA ─────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} /> Datos de Identificación
              </h3>

              {/* Clave catastral destacada */}
              <div style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.22)', borderRadius: '0.75rem', padding: '0.9rem 1.1rem' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.3rem' }}>Clave Catastral</div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1.5px' }}>{terreno.clave_catastral}</div>
              </div>

              {/* Propietario con avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '0.9rem 1.1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 700, color: '#fff', flexShrink: 0, boxShadow: '0 2px 8px rgba(14,165,233,0.35)' }}>
                  {initials(terreno.propietario)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>Propietario Concesionario</div>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{terreno.propietario}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>C.I: <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{terreno.cedula}</span></div>
                </div>
              </div>

              {/* Copropietarios */}
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '0.9rem 1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: terreno.copropietarios?.length > 0 ? '0.65rem' : 0 }}>
                  <Users size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Copropietarios</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, color: terreno.copropietarios?.length > 0 ? 'var(--primary)' : 'var(--text-muted)', background: terreno.copropietarios?.length > 0 ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.06)', padding: '0.1rem 0.55rem', borderRadius: '999px' }}>
                    {terreno.copropietarios?.length || 0}
                  </span>
                </div>
                {terreno.copropietarios?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {terreno.copropietarios.map(c => (
                      <div key={c.id_persona} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.7rem', background: 'rgba(14,165,233,0.06)', borderRadius: '0.5rem', border: '1px solid rgba(14,165,233,0.14)' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                          {initials(c.nombre)}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>C.I: {c.cedula}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin copropietarios registrados</p>
                )}
              </div>

              {/* Sector / Zona + Estado */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'start' }}>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '0.9rem 1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    <MapPin size={13} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sector / Zona</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{terreno.sector}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{terreno.zona}</div>
                </div>
                <div style={{ background: ec.bg, border: `1px solid ${ec.border}`, borderRadius: '0.75rem', padding: '0.9rem 1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>Estado</div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: ec.text }}>{terreno.estado_construccion || '—'}</div>
                </div>
              </div>

              {/* Escritura si existe */}
              {terreno.archivo_escritura && (
                <a href={`http://localhost:8000${terreno.archivo_escritura}`} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                  <FileText size={16} /> Ver Archivo de Escrituras <ExternalLink size={13} style={{ marginLeft: 'auto' }} />
                </a>
              )}
            </div>

            {/* ── COLUMNA DERECHA ───────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={16} /> Medidas e Información Técnica
              </h3>

              {/* Métricas de área */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(14,165,233,0.05) 100%)', border: '1px solid rgba(14,165,233,0.22)', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Área del Predio</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{parseFloat(terreno.area_m2).toLocaleString('es-EC')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>m²</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.04) 100%)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>Hectáreas</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>{(terreno.area_m2 / 10000).toFixed(4)}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Ha</div>
                </div>
              </div>

              {/* Coordenadas GPS */}
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '0.9rem 1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <Compass size={13} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coordenadas GPS (Centroide)</span>
                </div>
                {terreno.latitud ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Latitud</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>{terreno.latitud}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Longitud</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>{terreno.longitud}</div>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin coordenadas GPS registradas</p>
                )}
              </div>

              {/* Botón Google Maps */}
              {terreno.latitud ? (
                <a href={`https://www.google.com/maps?q=${terreno.latitud},${terreno.longitud}`} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.1rem', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', transition: 'background 0.2s' }}>
                  <MapPin size={16} />
                  Ver ubicación en Google Maps
                  <ExternalLink size={13} style={{ marginLeft: 'auto' }} />
                </a>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  <MapPin size={16} /> Ubicación en mapa no disponible
                </div>
              )}
            </div>
          </div>
          );
        })()}

        {/* TAB 2: VISTA EN GOOGLE MAPS */}
        {activeTab === 'mapa' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem' }}>Ubicación del Predio en Mapa</h3>
                {terreno.latitud
                  ? <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Coordenadas: {terreno.latitud}, {terreno.longitud}</p>
                  : <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#f59e0b' }}>Sin coordenadas GPS registradas — mostrando zona aproximada</p>
                }
              </div>
              <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', textDecoration: 'none', fontSize: '0.85rem' }}>
                <ExternalLink size={14} /> Abrir en Google Maps
              </a>
            </div>
            <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: '420px' }}>
              <iframe
                title="Ubicación del predio"
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* TAB 3: CUOTA DE PAGO */}
        {activeTab === 'turno' && (() => {
          const areaMz = parseFloat(terreno.area_m2) || 0;
          const fracciones = Math.ceil(areaMz / tarifas.metrosBase);
          const cuotaMensual = fracciones * tarifas.valorBase;
          const cuotaAnual = cuotaMensual * 12;
          return (
          <div className="animate-fade-in">
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontSize: '1.15rem' }}>
              Cuota de Pago por Predio
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Calculado en base al área catastrada. Cada {tarifas.metrosBase.toLocaleString('es-EC')} m² o fracción corresponde a <strong style={{ color: 'var(--text-main)' }}>${tarifas.valorBase.toFixed(2)} / mes</strong>.
            </p>

            <div style={{
              background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(16,185,129,0.08) 100%)',
              border: '1px solid rgba(14,165,233,0.25)',
              borderRadius: '1rem',
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Área del Predio</p>
                <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {areaMz.toLocaleString('es-EC')} m²
                </p>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '1.5rem' }}>
                <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fracciones de {tarifas.metrosBase.toLocaleString('es-EC')} m²</p>
                <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {fracciones} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>× ${tarifas.valorBase.toFixed(2)}</span>
                </p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                  Cada {tarifas.metrosBase.toLocaleString('es-EC')} m² o fracción = ${tarifas.valorBase.toFixed(2)}/mes
                </p>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '1.5rem' }}>
                <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cuota Mensual</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--green)' }}>
                  ${cuotaMensual.toFixed(2)}
                </p>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '1.5rem' }}>
                <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cuota Anual Estimada</p>
                <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#f59e0b' }}>
                  ${cuotaAnual.toFixed(2)}
                </p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>12 meses</p>
              </div>
            </div>
          </div>
          );
        })()}



      </div>

      {/* MODAL TRASPASO DE DOMINIO */}
      {modalTraspaso && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '560px', padding: '2rem' }}>

            {/* Cabecera */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
                  <ArrowRightLeft size={20} /> Traspaso de Dominio
                </h2>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Predio: <strong style={{ color: 'var(--text-main)' }}>{terreno.clave_catastral}</strong>
                </p>
              </div>
              <button onClick={cerrarModalTraspaso} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            {/* Indicador de pasos */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[1, 2].map(step => (
                <Fragment key={step}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700,
                    background: traspasoStep >= step ? 'var(--yellow)' : 'rgba(255,255,255,0.08)',
                    color: traspasoStep >= step ? '#000' : 'var(--text-muted)',
                    border: traspasoStep >= step ? '2px solid var(--yellow)' : '2px solid rgba(255,255,255,0.12)',
                    transition: 'all 0.3s'
                  }}>{step}</div>
                  {step < 2 && <div style={{ flex: 1, height: '2px', background: traspasoStep > 1 ? 'var(--yellow)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />}
                  <span style={{ fontSize: '0.75rem', color: traspasoStep >= step ? 'var(--yellow)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {step === 1 ? 'Nuevo propietario' : 'Confirmar'}
                  </span>
                  {step < 2 && <div style={{ flex: 1 }} />}
                </Fragment>
              ))}
            </div>

            {/* PASO 1: Buscar nuevo propietario */}
            {traspasoStep === 1 && (
              <>
                {/* Dueño actual */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dueño actual</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{terreno.propietario}</p>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>C.I: {terreno.cedula}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Buscar nuevo propietario *</label>
                  <PersonaAutocompleteInput
                    onChange={(persona) => setNuevoDueno(persona)}
                    placeholder="Busca por cédula o apellido..."
                  />
                </div>

                {nuevoDueno && (
                  <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
                    <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.72rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nuevo dueño seleccionado</p>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                      {nuevoDueno.nombre} {nuevoDueno.apellido}
                    </p>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>C.I: {nuevoDueno.cedula}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" onClick={cerrarModalTraspaso}>Cancelar</button>
                  <button
                    className="btn-primary"
                    style={{ background: nuevoDueno ? 'var(--yellow)' : undefined, color: nuevoDueno ? '#000' : undefined, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    disabled={!nuevoDueno}
                    onClick={() => setTraspasoStep(2)}
                  >
                    Continuar <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}

            {/* PASO 2: Confirmar con documento */}
            {traspasoStep === 2 && (
              <>
                {/* Visualización: de → a */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', padding: '0.75rem', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sale</p>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{terreno.propietario}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{terreno.cedula}</p>
                  </div>
                  <ArrowRightLeft size={20} style={{ color: 'var(--yellow)', flexShrink: 0 }} />
                  <div style={{ flex: 1, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.6rem', padding: '0.75rem', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', color: '#10b981', textTransform: 'uppercase' }}>Entra</p>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{nuevoDueno.nombre} {nuevoDueno.apellido}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{nuevoDueno.cedula}</p>
                  </div>
                </div>

                {/* Aviso */}
                <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '0.6rem', padding: '0.75rem', marginBottom: '1.25rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} style={{ color: 'var(--yellow)', flexShrink: 0, marginTop: '0.1rem' }} />
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--yellow)', lineHeight: 1.5 }}>
                    Las deudas pendientes quedan con el dueño saliente. Los copropietarios se borran con el traspaso.
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Documento o motivo legal del traspaso *</label>
                  <textarea
                    className="input-field"
                    placeholder="Ej: Contrato de compra-venta No. 12345, escritura notariada..."
                    value={motivoTraspaso}
                    onChange={e => setMotivoTraspaso(e.target.value)}
                    onBlur={() => setMotivoTouched(true)}
                    rows={3}
                  />
                  {motivoTouched && !motivoTraspaso.trim() && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El documento de respaldo es obligatorio.</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" onClick={() => setTraspasoStep(1)}>← Atrás</button>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--yellow)', color: '#000' }}
                    disabled={!motivoTraspaso.trim()}
                    onClick={handleTraspaso}
                  >
                    Ejecutar Traspaso
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
