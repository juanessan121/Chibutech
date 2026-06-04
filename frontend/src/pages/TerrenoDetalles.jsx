import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Map, MapPin, ArrowLeft, Calendar, FileText, Info, Compass, HelpCircle, FileDown, Droplet, Edit2, ArrowRightLeft, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import useAuthStore from '../store/useAuthStore';

import { getTerrenoById, traspasarDominio } from '../services/terrenoService';
import { toast } from 'sonner';
import PersonaAutocompleteInput from '../components/PersonaAutocompleteInput';

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
  }, [id]);

  // Estado del mapa interactivo
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedElement, setSelectedElement] = useState('Polígono del Terreno');

  // Polígono SVG basado en coordenadas simuladas o reales
  const baseLat = parseFloat(terreno?.latitud) || -1.3281;
  const baseLng = parseFloat(terreno?.longitud) || -78.5528;
  const nodes = [
    { id: 'A', name: 'Vértice Norte', x: 250, y: 50,  lat: baseLat + 0.0005, lng: baseLng + 0.0003 },
    { id: 'B', name: 'Vértice Este',  x: 380, y: 150, lat: baseLat + 0.0002, lng: baseLng + 0.0007 },
    { id: 'C', name: 'Vértice Sur',   x: 300, y: 280, lat: baseLat - 0.0004, lng: baseLng + 0.0004 },
    { id: 'D', name: 'Vértice Oeste', x: 120, y: 220, lat: baseLat - 0.0001, lng: baseLng - 0.0006 },
  ];


  // Concatenar puntos para el polygon SVG
  const polygonPoints = nodes.map(n => `${n.x},${n.y}`).join(' ');

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

  // Descarga del Certificado de Derechos de Agua con jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Fondo / Borde elegante
    doc.setDrawColor(14, 165, 233); // Color azul principal
    doc.setLineWidth(1.5);
    doc.rect(5, 5, 200, 287);

    doc.setDrawColor(245, 158, 11); // Color amarillo tierra
    doc.setLineWidth(0.5);
    doc.rect(8, 8, 194, 281);

    // Encabezado
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // Deep dark
    doc.text('JUNTA DE AGUA DE RIEGO CHIBULEO', 105, 25, { align: 'center' });
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Sistema de Gestión e Información Hídrica - ERP Chibutech', 105, 30, { align: 'center' });
    doc.text('RUC: 1891000000001 | Tungurahua - Ecuador', 105, 35, { align: 'center' });

    doc.setLineWidth(0.8);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 42, 195, 42);

    // Título del documento
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(2, 132, 199);
    doc.text('CERTIFICADO OFICIAL DE CATASTRO Y DERECHOS DE AGUA', 105, 52, { align: 'center' });

    // Código y Fecha
    const certificadoNo = `CERT-${terreno.clave_catastral.replace(/-/g, '')}`;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Certificado No: ${certificadoNo}`, 15, 63);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-EC')}`, 195, 63, { align: 'right' });

    // Introducción
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    const introText = `La Directiva de la Junta de Agua de Riego Chibuleo hace constar y certifica que, según los registros vigentes del catastro global de la organización, el predio detallado a continuación se encuentra inscrito y cuenta con la asignación activa del recurso hídrico para fines agrícolas.`;
    const splitIntro = doc.splitTextToSize(introText, 180);
    doc.text(splitIntro, 15, 73);

    // Sección 1: Información del Propietario
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 92, 180, 24, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('DATOS DEL COMUNERO TITULAR:', 20, 98);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Nombre Completo: ${terreno.propietario}`, 20, 104);
    doc.text(`Cédula de Identidad: ${terreno.cedula}`, 20, 110);

    // Sección 2: Ficha Catastral del Lote
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text('INFORMACIÓN CATASTRAL DEL PREDIO:', 15, 128);
    
    // Tabla básica manual
    doc.setLineWidth(0.3);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 132, 195, 132);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Clave Catastral:', 20, 138);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(terreno.clave_catastral, 70, 138);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Ubicación / Sector:', 20, 144);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(terreno.zona, 70, 144);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Área Concedida:', 20, 150);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${terreno.area_m2} m² (${(terreno.area_m2 / 10000).toFixed(4)} Ha)`, 70, 150);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Estado del Lote:', 20, 156);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(terreno.estado_construccion, 70, 156);

    doc.line(15, 162, 195, 162);

    // Sección 3: Concesión Hídrica
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text('DETALLE DEL DERECHO DE AGUA ASIGNADO:', 15, 175);
    doc.line(15, 179, 195, 179);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Ramal de Conexión:', 20, 185);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(terreno.acequia, 70, 185);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Caudal Autorizado:', 20, 191);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${terreno.caudal_ls} Litros por segundo (L/s)`, 70, 191);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Turno de Agua Semanal:', 20, 197);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(terreno.turno, 70, 197);

    doc.line(15, 203, 195, 203);

    // Nota de Validez
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    const notaText = 'Este certificado tiene una validez de 90 días a partir de la fecha de emisión. Está prohibida la venta, transferencia o fraccionamiento de los derechos de agua sin la previa autorización escrita de la Asamblea General de la Junta de Agua Chibuleo.';
    const splitNota = doc.splitTextToSize(notaText, 180);
    doc.text(splitNota, 15, 212);

    // Firmas
    doc.setDrawColor(203, 213, 225);
    doc.line(35, 260, 95, 260);
    doc.line(115, 260, 175, 260);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('PRESIDENTE JUNTA DE AGUA', 65, 265, { align: 'center' });
    doc.text('SECRETARIO JUNTA DE AGUA', 145, 265, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Ing. Franklin Masaquiza', 65, 270, { align: 'center' });
    doc.text('Sr. Segundo C. Toalombo', 145, 270, { align: 'center' });

    // Descargar
    doc.save(`Certificado_Riego_${terreno.clave_catastral}.pdf`);
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
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              onClick={handleDownloadPDF}
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
          <Compass size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Plano del Lote (SVG)
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

        {/* TAB 2: MAPA DEL LOTE (SVG INTERACTIVO) */}
        {activeTab === 'mapa' && (
          <div className="details-grid animate-fade-in" style={{ alignItems: 'center' }}>
            {/* Visor SVG del Mapa */}
            <div className="svg-map-container">
              <svg className="map-svg" viewBox="0 0 500 400">
                {/* Cuadrícula de coordenadas de fondo */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Canal de Agua adyacente */}
                <path 
                  d="M -10,350 C 150,340 300,380 510,360" 
                  className="map-water-channel" 
                  onClick={() => setSelectedElement('Acequia de Riego R1')}
                />
                <text x="350" y="340" fill="var(--primary)" fontSize="10" fontWeight="bold">Canal Acequia Principal</text>

                {/* Polígono del Lote */}
                <polygon 
                  points={polygonPoints} 
                  className="map-lot"
                  onClick={() => setSelectedElement('Polígono del Terreno')}
                />

                {/* Líneas de cota (Líneas divisorias ficticias) */}
                <line x1="250" y1="50" x2="300" y2="280" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1="380" y1="150" x2="120" y2="220" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                {/* Nodos (Vértices) */}
                {nodes.map((node) => (
                  <circle
                    key={node.id}
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    className="map-node"
                    onMouseEnter={() => {
                      setHoveredNode(node);
                      setSelectedElement(`Vértice ${node.id}: ${node.name}`);
                    }}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                ))}

                {/* Etiquetas de nodos */}
                {nodes.map((node) => (
                  <text 
                    key={`text-${node.id}`}
                    x={node.x + 12}
                    y={node.y + 4}
                    fill="var(--text-main)"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {node.id}
                  </text>
                ))}
              </svg>
            </div>

            {/* Información del Elemento Seleccionado / Hovered */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--green)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700 }}>
                  Visor de Vértices y Límites
                </h4>
                <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                  Pasa el mouse sobre los nodos (<strong style={{ color: 'var(--green)' }}>A, B, C, D</strong>) en el plano para leer los datos GPS del polígono catastrado.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Elemento Activo:
                </h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedElement}</p>
                
                {hoveredNode ? (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                    <div><span className="text-muted">Nombre:</span> <strong>{hoveredNode.name}</strong></div>
                    <div><span className="text-muted">Latitud GPS:</span> <strong>{hoveredNode.lat.toFixed(6)}</strong></div>
                    <div><span className="text-muted">Longitud GPS:</span> <strong>{hoveredNode.lng.toFixed(6)}</strong></div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                    <div><span className="text-muted">Área Catastrada:</span> <strong>{terreno.area_m2} m²</strong></div>
                    <div><span className="text-muted">Perímetro Aprox:</span> <strong>85.4 metros</strong></div>
                    <div><span className="text-muted">Colindante Norte:</span> <strong>Ramal Acequia Alta</strong></div>
                  </div>
                )}
              </div>
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
