import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, ArrowLeft, Search, Calendar, FileText, Download, Users } from 'lucide-react';
import { getMingas } from '../services/mingaService';

export default function MingasHistorial() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [historialMingas, setHistorialMingas] = useState([]);

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
                        style={{ color: 'var(--blue)', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid var(--blue)', borderRadius: '0.5rem', padding: '0.4rem' }}
                      >
                        <FileText size={18} />
                      </button>
                      {minga.estado === 'Finalizada' && (
                        <button 
                          title="Descargar Acta PDF"
                          className="btn-icon"
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
    </div>
  );
}
