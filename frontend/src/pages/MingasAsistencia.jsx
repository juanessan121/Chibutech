import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ArrowLeft, Search, Filter, Save, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function MingasAsistencia() {
  const navigate = useNavigate();
  const [selectedMinga, setSelectedMinga] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulando datos de la DB
  const mingasActivas = [
    { id: 1, fecha: '2026-05-25', motivo: 'Limpieza de Acequias' },
    { id: 2, fecha: '2026-06-10', motivo: 'Reparación de Tubería Principal' }
  ];

  const usuariosConvocados = [
    { id: 101, cedula: '1801234567', nombre: 'Juan Carlos Pérez', sector: 'San Luis', estado: 'Pendiente' },
    { id: 102, cedula: '1809876543', nombre: 'María Rosa Guamán', sector: 'Centro', estado: 'Pendiente' },
    { id: 103, cedula: '1805556667', nombre: 'Luis Alberto Sisa', sector: 'San Francisco', estado: 'Pendiente' },
    { id: 104, cedula: '1804443332', nombre: 'Carmen Tixilema', sector: 'San Luis', estado: 'Pendiente' },
  ];

  const [asistencia, setAsistencia] = useState(usuariosConvocados);

  const handleMarcar = (id, nuevoEstado) => {
    setAsistencia(prev => prev.map(u => u.id === id ? { ...u, estado: nuevoEstado } : u));
    toast(`Asistencia actualizada a: ${nuevoEstado}`);
  };

  const handleGuardarTodo = () => {
    toast.success('Listado de asistencia guardado correctamente en la base de datos.');
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toaster richColors />
      
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/mingas')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ClipboardCheck className="text-green" /> Registro de Asistencia
          </h1>
          <p className="text-muted">Pasa lista a los agricultores convocados. Los inasistentes generarán multas automáticas.</p>
        </div>
      </div>

      {/* Panel de Control superior */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 300px' }}>
          <label className="input-label text-muted">Seleccionar Minga Activa</label>
          <select 
            className="form-select" 
            value={selectedMinga} 
            onChange={(e) => setSelectedMinga(e.target.value)}
          >
            <option value="">-- Elija una Minga para pasar lista --</option>
            {mingasActivas.map(m => (
              <option key={m.id} value={m.id}>{m.fecha} - {m.motivo}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <label className="input-label text-muted">Buscar Agricultor</label>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o cédula..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', width: '100%', outline: 'none', marginLeft: '0.5rem' }}
            />
          </div>
        </div>

        <button className="btn-primary" onClick={handleGuardarTodo} disabled={!selectedMinga} style={{ background: '#10b981', flex: '0 0 auto' }}>
          <Save size={18} /> Guardar Lista Completa
        </button>
      </div>

      {/* Tabla de Asistencia (Solo visible si hay minga seleccionada) */}
      {selectedMinga ? (
        <div className="table-container animate-fade-in">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cédula</th>
                <th>Nombres</th>
                <th>Sector</th>
                <th style={{ textAlign: 'center' }}>Estado Actual</th>
                <th style={{ textAlign: 'center' }}>Acciones Rápidas (Marcar)</th>
              </tr>
            </thead>
            <tbody>
              {asistencia.filter(u => u.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                <tr key={user.id}>
                  <td>{user.cedula}</td>
                  <td style={{ fontWeight: '500', color: 'var(--text-main)' }}>{user.nombre}</td>
                  <td><span className="badge badge-directive">{user.sector}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${user.estado === 'Presente' ? 'badge-admin' : user.estado === 'Faltó' ? 'badge-user' : user.estado === 'Justificado' ? 'badge-directive' : ''}`} style={{ background: user.estado === 'Pendiente' ? 'var(--border-color)' : '' }}>
                      {user.estado}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button 
                        title="Marcar Presente"
                        onClick={() => handleMarcar(user.id, 'Presente')}
                        style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid #10b981', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        title="Marcar Faltó (Genera Multa)"
                        onClick={() => handleMarcar(user.id, 'Faltó')}
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <XCircle size={18} />
                      </button>
                      <button 
                        title="Justificar Inasistencia"
                        onClick={() => handleMarcar(user.id, 'Justificado')}
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <FileText size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '1rem' }}>
          <ClipboardCheck size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
          <p>Seleccione una minga en el panel superior para cargar la lista de asistencia.</p>
        </div>
      )}
    </div>
  );
}
