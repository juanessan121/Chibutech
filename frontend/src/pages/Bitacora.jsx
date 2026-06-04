import React, { useState, useEffect } from 'react';
import { ShieldAlert, User, Clock, FileText } from 'lucide-react';
import axios from '../services/axiosConfig';

export default function Bitacora() {
  const [auditoria, setAuditoria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const res = await axios.get('/auditoria');
        setAuditoria(res.data.data);
      } catch (error) {
        console.error("Error al obtener auditoría:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditoria();
  }, []);

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldAlert className="text-red" /> Bitácora de Auditoría
          </h1>
          <p className="text-muted">Registro inmutable de todas las operaciones críticas realizadas en la base de datos (Insert, Update, Delete).</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--primary)' }}>
              <th style={{ padding: '1rem' }}>Fecha y Hora</th>
              <th style={{ padding: '1rem' }}>Usuario</th>
              <th style={{ padding: '1rem' }}>Tabla Afectada</th>
              <th style={{ padding: '1rem' }}>Operación</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Cargando bitácora...</td></tr>
            ) : auditoria.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No hay registros de auditoría.</td></tr>
            ) : auditoria.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} className="text-muted" /> {log.fecha}
                  </div>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={14} className="text-blue" /> {log.usuario}
                  </div>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{log.tabla}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    background: log.accion === 'INSERT' ? 'rgba(16, 185, 129, 0.2)' : log.accion === 'UPDATE' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: log.accion === 'INSERT' ? '#10b981' : log.accion === 'UPDATE' ? '#f59e0b' : '#ef4444'
                  }}>
                    {log.accion}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} title="Ver payload JSON de cambios" onClick={() => alert(JSON.stringify({anterior: log.datos_anteriores, nuevo: log.datos_nuevos}))}>
                    <FileText size={16} /> Ver Cambios
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
