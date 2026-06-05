import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Map, MapPin, ArrowLeft, Calendar, FileText, Info, Compass, FileDown, Edit2, ArrowRightLeft, X, ExternalLink } from 'lucide-react';
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
  const isUsuarioBase = user?.rol === 'Usuario Regular' || user?.rol === 'Usuario';

  const [terreno, setTerreno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalTraspaso, setModalTraspaso] = useState(false);
  const [nuevoDueno, setNuevoDueno] = useState(null);
  const [motivoTraspaso, setMotivoTraspaso] = useState('');
  const [directiva, setDirectiva] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTerrenoById(id);
        setTerreno(data);
      } catch(e) {
        toast.error('Error al cargar predio');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    api.get('/directiva/actual').then(res => setDirectiva(res.data.data || [])).catch(() => {});
  }, [id]);

  const mapLat = parseFloat(terreno?.latitud) || -1.3281;
  const mapLng = parseFloat(terreno?.longitud) || -78.5528;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${mapLat},${mapLng}&z=17&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps?q=${mapLat},${mapLng}`;

  const handleTraspaso = async () => {
    if (!nuevoDueno || !nuevoDueno.id_persona) return toast.error('Seleccione el nuevo dueño');
    if (!motivoTraspaso) return toast.error('Ingrese el motivo (Documento legal)');
    try {
      await traspasarDominio(id, nuevoDueno.id_persona, motivoTraspaso);
      toast.success('Traspaso de dominio ejecutado con éxito');
      setModalTraspaso(false);
      setLoading(true);
      const data = await getTerrenoById(id);
      setTerreno(data);
      setLoading(false);
    } catch(e) {
      toast.error(e.response?.data?.message || 'Error en el traspaso');
    }
  };

  if (loading) return <div style={{padding: '3rem', textAlign: 'center', color: 'var(--text-main)'}}>Cargando información del predio...</div>;
  if (!terreno) return <div style={{padding: '3rem', textAlign: 'center', color: 'var(--red)'}}>No se encontró el terreno</div>;

  // Genera el Certificado de Catastro con jsPDF — abre en nueva pestaña (preview) o descarga
  const handleDownloadPDF = (preview = false) => {
    const doc = new jsPDF();

    // Cálculo de cuota real (misma fórmula que en backend generarPlanillas)
    const areaM2 = parseFloat(terreno.area_m2) || 0;
    const metrosBase = 1000;
    const tarifaBase = 5.00;
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
    doc.text('JUNTA DE AGUA DE RIEGO CHIBULEO', 105, 24, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Sistema de Gestión Comunitaria - ERP Chibutech', 105, 30, { align: 'center' });
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
        {activeTab === 'ficha' && (
          <div className="details-grid animate-fade-in">
            <div>
              <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--primary)', fontSize: '1.15rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                Datos de Identificación del Lote
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="detail-row">
                  <span className="detail-label">Clave Catastral</span>
                  <span className="detail-value">{terreno.clave_catastral}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Propietario Concesionario</span>
                  <span className="detail-value">{terreno.propietario}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Cédula</span>
                  <span className="detail-value">{terreno.cedula}</span>
                </div>
                {terreno.copropietarios && terreno.copropietarios.length > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Copropietarios</span>
                    <span className="detail-value">
                      {terreno.copropietarios.map(c => `${c.nombre} (${c.cedula})`).join(', ')}
                    </span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={16} /> Sector (Zona)
                  </span>
                  <span className="detail-value">{terreno.sector} ({terreno.zona})</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Estado de Construcción</span>
                  <span className="detail-value" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{terreno.estado_construccion}</span>
                </div>
                {terreno.archivo_escritura && (
                  <div className="detail-row">
                    <span className="detail-label">Archivo de Escrituras</span>
                    <span className="detail-value">
                      <a 
                        href={`http://localhost:8000${terreno.archivo_escritura}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', textDecoration: 'underline' }}
                      >
                        <FileText size={16} /> Ver Documento
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--primary)', fontSize: '1.15rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                Medidas e Información Técnica
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="detail-row">
                  <span className="detail-label">Área del Predio (m²)</span>
                  <span className="detail-value">{terreno.area_m2} m²</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Área en Hectáreas (Ha)</span>
                  <span className="detail-value">{(terreno.area_m2 / 10000).toFixed(4)} Ha</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Latitud GPS (Centroide)</span>
                  <span className="detail-value">{terreno.latitud || 'Sin asignar'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Longitud GPS (Centroide)</span>
                  <span className="detail-value">{terreno.longitud || 'Sin asignar'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Enlace a Google Maps</span>
                  <span className="detail-value">
                    {terreno.latitud ? (
                      <a 
                        href={`https://www.google.com/maps?q=${terreno.latitud},${terreno.longitud}`} 
                        target="_blank" rel="noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                      >
                        Ver ubicación en mapa
                      </a>
                    ) : 'No disponible'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

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
          const fracciones = Math.ceil(areaMz / 1000);
          const cuotaMensual = fracciones * 5;
          const cuotaAnual = cuotaMensual * 12;
          return (
          <div className="animate-fade-in">
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontSize: '1.15rem' }}>
              Cuota de Pago por Predio
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Calculado en base al área catastrada. Cada 1000 m² o fracción corresponde a <strong style={{ color: 'var(--text-main)' }}>$5.00 / mes</strong>.
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
                <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fracciones de 1000 m²</p>
                <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {fracciones} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>× $5.00</span>
                </p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                  Cada 1000 m² o fracción = $5/mes
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
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: 'var(--yellow)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowRightLeft size={20} /> Traspaso de Dominio
              </h2>
              <button onClick={() => setModalTraspaso(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            
            <div className="alert-warning" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--yellow)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <strong>Atención:</strong> Esta acción transferirá legalmente el terreno ({terreno.clave_catastral}) a otra persona. Las deudas anteriores quedarán con el dueño actual ({terreno.propietario}).
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Buscar Nuevo Propietario *</label>
              <PersonaAutocompleteInput 
                onSelect={(persona) => setNuevoDueno(persona)} 
                placeholder="Busca por cédula o apellido..." 
              />
              {nuevoDueno && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                  <strong>Seleccionado:</strong> {nuevoDueno.nombre} {nuevoDueno.apellido} (C.I: {nuevoDueno.cedula})
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Motivo o Documento de Respaldo *</label>
              <textarea 
                className="input-field" 
                placeholder="Ej: Contrato de compra-venta No. 12345, notariado..."
                value={motivoTraspaso}
                onChange={e => setMotivoTraspaso(e.target.value)}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setModalTraspaso(false)}>Cancelar</button>
              <button className="btn-primary" style={{ background: 'var(--yellow)', color: '#000' }} onClick={handleTraspaso}>Confirmar Traspaso</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
