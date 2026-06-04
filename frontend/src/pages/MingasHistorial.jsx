import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, ArrowLeft, Search, Calendar, FileText, Download, Users, X } from 'lucide-react';
import { getMingas, getConvocados } from '../services/mingaService';
import { toast } from 'sonner';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function MingasHistorial() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [historialMingas, setHistorialMingas] = useState([]);

  // Modal de detalles
  const [detallesModalOpen, setDetallesModalOpen] = useState(false);
  const [mingaDetalle, setMingaDetalle] = useState(null);
  const [convocadosDetalle, setConvocadosDetalle] = useState([]);

  useEffect(() => {
    getMingas().then(data => {
      setHistorialMingas(data);
    });
  }, []);

  const filtrados = historialMingas.filter(m => {
    const matchSearch = m.motivo.toLowerCase().includes(searchTerm.toLowerCase()) || m.fecha.includes(searchTerm);
    const matchEstado = filtroEstado === 'Todos' || m.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  const abrirDetalles = async (minga) => {
    const toastId = toast.loading('Cargando detalles...');
    try {
      const convocados = await getConvocados(minga.id);
      setMingaDetalle(minga);
      setConvocadosDetalle(convocados);
      setDetallesModalOpen(true);
      toast.dismiss(toastId);
    } catch (error) {
      toast.error('Error al cargar detalles', { id: toastId });
    }
  };

  const descargarActaPdf = async (minga) => {
    const toastId = toast.loading('Generando Acta PDF...');
    try {
      const convocados = await getConvocados(minga.id);
      
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("ACTA DE MINGA COMUNITARIA", 14, 20);
      
      doc.setFontSize(12);
      doc.text(`Fecha: ${minga.fecha}`, 14, 30);
      doc.text(`Motivo: ${minga.motivo}`, 14, 38);
      doc.text(`Lugar: ${minga.lugar}`, 14, 46);
      doc.text(`Multa por inasistencia: $${minga.multa.toFixed(2)}`, 14, 54);
      
      const presentes = convocados.filter(c => c.estado === 'Presente').length;
      const faltas = convocados.filter(c => c.estado === 'Faltó' || c.estado === 'Faltó (Pagado)').length;
      const justificados = convocados.filter(c => c.estado === 'Justificado').length;

      doc.text(`Resumen: ${presentes} Presentes, ${faltas} Faltas, ${justificados} Justificados`, 14, 62);

      const tableData = convocados.map(c => [
        c.cedula,
        c.nombre,
        c.sector,
        c.estado
      ]);

          doc.autoTable({
            startY: 70,
            head: [['Cédula', 'Nombre', 'Sector', 'Estado']],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [16, 185, 129] } // Verde
          });

          doc.save(`Acta_Minga_${minga.fecha}.pdf`);
          toast.success('PDF descargado con éxito', { id: toastId });
    } catch (error) {
      toast.error('Error al generar PDF', { id: toastId });
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/mingas')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <History className="text-earth" /> Historial de Mingas
          </h1>
          <p className="text-muted">Archivo histórico de jornadas comunitarias. Revise reportes y estadísticas pasadas.</p>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '2 1 300px' }}>
          <label className="input-label text-muted">Búsqueda Rápida</label>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por motivo o fecha (Ej. 2025-10)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', width: '100%', outline: 'none', marginLeft: '0.5rem' }}
            />
          </div>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label className="input-label text-muted">Filtrar por Estado</label>
          <select 
            className="form-select" 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Finalizada">Finalizadas</option>
            <option value="Suspendida">Suspendidas</option>
            <option value="Programada">Programadas / En curso</option>
          </select>
        </div>
      </div>

      {/* Tabla del Historial */}
      <div className="table-container glass-card animate-fade-in">
        <table className="data-table">
          <thead>
            <tr>
              <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16}/> Fecha</div></th>
              <th>Motivo y Lugar</th>
              <th style={{ textAlign: 'center' }}>Asistencia Global</th>
              <th style={{ textAlign: 'center' }}>Multa ($)</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'center' }}>Reportes</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((minga) => (
                <tr key={minga.id}>
                  <td style={{ fontWeight: '500' }}>{minga.fecha}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{minga.motivo}</span>
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>📍 {minga.lugar}</span>
                      {minga.obs && <span className="text-red" style={{ fontSize: '0.75rem', marginTop: '4px' }}>Nota: {minga.obs}</span>}
                    </div>
                  </td>
                  <td>
                    {minga.estado === 'Finalizada' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span className="text-green" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Users size={14}/> {minga.asistentes} Presentes</span>
                        <span className="text-red" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>{minga.faltos} Faltas</span>
                      </div>
                    ) : (
                      <span className="text-muted" style={{ display: 'block', textAlign: 'center' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>${minga.multa.toFixed(2)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${minga.estado === 'Finalizada' ? 'badge-directive' : minga.estado === 'Suspendida' ? 'badge-user' : 'badge-admin'}`}>
                      {minga.estado}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button 
                        title="Ver Resumen Detallado"
                        className="btn-icon"
                        onClick={() => abrirDetalles(minga)}
                        style={{ color: 'var(--blue)', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid var(--blue)', borderRadius: '0.5rem', padding: '0.4rem' }}
                      >
                        <FileText size={18} />
                      </button>
                      {minga.estado === 'Finalizada' && (
                        <button 
                          title="Descargar Acta PDF"
                          className="btn-icon"
                          onClick={() => descargarActaPdf(minga)}
                          style={{ color: 'var(--earth)', background: 'rgba(217, 119, 6, 0.1)', border: '1px solid var(--earth)', borderRadius: '0.5rem', padding: '0.4rem' }}
                        >
                          <Download size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No se encontraron mingas en el historial con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {detallesModalOpen && mingaDetalle && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-card animate-fade-in" style={{ padding: '2rem', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setDetallesModalOpen(false)} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', borderRadius: '50%', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-color)'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--blue)' }}>Resumen de Minga</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{mingaDetalle.fecha} - {mingaDetalle.motivo}</p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ flex: 1, padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid var(--green)' }}>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--green)' }}>
                  {convocadosDetalle.filter(c => c.estado === 'Presente').length}
                </span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Asistencias</span>
              </div>
              <div style={{ flex: 1, padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid var(--red)' }}>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--red)' }}>
                  {convocadosDetalle.filter(c => c.estado === 'Faltó' || c.estado === 'Faltó (Pagado)').length}
                </span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Faltas</span>
              </div>
              <div style={{ flex: 1, padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid var(--yellow)' }}>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--yellow)' }}>
                  {convocadosDetalle.filter(c => c.estado === 'Justificado').length}
                </span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Justificados</span>
              </div>
            </div>

            <h4 style={{ marginBottom: '1rem' }}>Detalle de Convocados</h4>
            <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cédula</th>
                    <th>Nombre y Apellido</th>
                    <th>Sector</th>
                    <th style={{ textAlign: 'center' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {convocadosDetalle.map((c, i) => (
                    <tr key={i}>
                      <td>{c.cedula}</td>
                      <td>{c.nombre}</td>
                      <td>{c.sector}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${c.estado === 'Presente' ? 'badge-admin' : c.estado.includes('Faltó') ? 'badge-user' : 'badge-directive'}`}>
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {convocadosDetalle.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No hay datos de asistentes registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={() => setDetallesModalOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
