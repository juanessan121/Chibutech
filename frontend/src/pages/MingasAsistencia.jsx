import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ArrowLeft, Search, Save, CheckCircle, XCircle, FileText, Lock } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { getMingasActivas, getConvocados, registrarAsistencia } from '../services/mingaService';

export default function MingasAsistencia() {
  const navigate = useNavigate();
  const [selectedMinga, setSelectedMinga] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  const [mingasActivas, setMingasActivas] = useState([]);
  const [asistencia, setAsistencia] = useState([]);

  useEffect(() => {
    getMingasActivas().then(setMingasActivas);
  }, []);

  useEffect(() => {
    if (selectedMinga) {
      getConvocados(selectedMinga).then(setAsistencia);
    } else {
      setAsistencia([]);
    }
  }, [selectedMinga]);

  const handleMarcar = (id, nuevoEstado) => {
    setAsistencia(prev => prev.map(u => u.id === id ? { ...u, estado: nuevoEstado } : u));
    toast(`Asistencia actualizada a: ${nuevoEstado}`);
  };

  const handleGuardarTodo = async () => {
    try {
      await registrarAsistencia(selectedMinga, { asistencias: asistencia, cerrar_registro: false });
      toast.success('Listado de asistencia guardado correctamente en la base de datos.');
    } catch (e) {
      toast.error('Error al guardar asistencia');
    }
  };

  const handleCerrarRegistro = async () => {
    if (window.confirm("¿Está seguro de cerrar el registro? Una vez cerrado, no se podrán modificar las asistencias. Las inasistencias generarán multas irrevocables.")) {
      try {
        await registrarAsistencia(selectedMinga, { asistencias: asistencia, cerrar_registro: true });
        setIsClosed(true);
        toast.success('El registro de asistencia ha sido cerrado definitivamente.');
      } catch (e) {
        toast.error('Error al cerrar el registro');
      }
    }
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
            onChange={(e) => {
              setSelectedMinga(e.target.value);
              setIsClosed(false); // Reiniciamos el estado al cambiar de minga
            }}
          >
            <option value="">-- Elija una Minga para pasar lista --</option>
            {mingasActivas.map(m => (
              <option key={m.id_minga} value={m.id_minga}>{m.fecha_programada} - {m.motivo_general}</option>
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

        <div style={{ display: 'flex', gap: '0.5rem', flex: '0 0 auto' }}>
          <button className="btn-primary" onClick={handleGuardarTodo} disabled={!selectedMinga || isClosed} style={{ background: '#10b981', opacity: (!selectedMinga || isClosed) ? 0.5 : 1 }}>
            <Save size={18} /> Guardar Cambios
          </button>
          
          <button className="btn-primary" onClick={handleCerrarRegistro} disabled={!selectedMinga || isClosed} style={{ background: '#ef4444', opacity: (!selectedMinga || isClosed) ? 0.5 : 1 }}>
            <Lock size={18} /> Cerrar Registro
          </button>
        </div>
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
                    <span 
                      className={`badge ${user.estado === 'Presente' ? 'badge-admin' : user.estado === 'Faltó' ? 'badge-user' : user.estado === 'Justificado' ? 'badge-directive' : user.estado === 'Faltó (Pagado)' ? 'badge-directive' : ''}`} 
                      style={{ 
                        background: user.estado === 'Pendiente' ? 'var(--border-color)' : user.estado === 'Faltó (Pagado)' ? 'var(--yellow)' : '',
                        color: user.estado === 'Faltó (Pagado)' ? '#000' : ''
                      }}
                    >
                      {user.estado}
                    </span>
                  </td>
                  <td>
                    {(!isClosed && user.estado !== 'Faltó (Pagado)') ? (
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
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }} title={user.estado === 'Faltó (Pagado)' ? 'Multa saldada, inasistencia inamovible' : 'Registro cerrado'}>
                        {user.estado === 'Faltó (Pagado)' ? (
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Multa Cancelada</span>
                        ) : (
                          <Lock size={16} style={{ display: 'inline-block' }} />
                        )}
                      </div>
                    )}
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
