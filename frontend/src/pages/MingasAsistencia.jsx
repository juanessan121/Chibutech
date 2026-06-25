import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ArrowLeft, Search, Save, CheckCircle, XCircle, FileText, Lock } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { getMingasActivas, getConvocados, registrarAsistencia } from '../services/mingaService';

import { allowTextWithPunctuation } from '../utils/validators';

export default function MingasAsistencia() {
  const navigate = useNavigate();
  const [selectedMinga, setSelectedMinga] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const pendientesCount = asistencia.filter(u => u.estado === 'Pendiente').length;
  const totalConvocados = asistencia.length;

  const handleMarcar = (id, nuevoEstado) => {
    setAsistencia(prev => prev.map(u => u.id === id ? { ...u, estado: nuevoEstado } : u));
  };

  const handleMarcarTodos = (nuevoEstado) => {
    setAsistencia(prev => prev.map(u => u.estado === 'Pendiente' ? { ...u, estado: nuevoEstado } : u));
    toast.success(`${pendientesCount} persona(s) marcadas como "${nuevoEstado}" en el registro.`);
  };

  const handleGuardarTodo = async () => {
    if (pendientesCount > 0) {
      toast.error(`Hay ${pendientesCount} persona(s) sin marcar. Debe definir si asistió o no para cada una antes de guardar.`);
      return;
    }
    try {
      await registrarAsistencia(selectedMinga, { asistencias: asistencia, cerrar_registro: false });
      // Recargar convocados y verificar si la minga fue auto-finalizada
      const [updatedConvocados, mingasAun] = await Promise.all([
        getConvocados(selectedMinga),
        getMingasActivas(),
      ]);
      setAsistencia(updatedConvocados);
      setMingasActivas(mingasAun);
      const sigueActiva = mingasAun.some(m => m.id_minga == selectedMinga);
      if (sigueActiva) {
        toast.success('Listado de asistencia guardado correctamente.');
      } else {
        setIsClosed(true);
        toast.success('Lista registrada. El registro se cerró automáticamente — todos los participantes marcados.');
      }
    } catch (e) {
      toast.error('No se pudo guardar el listado de asistencia. Intenta de nuevo.');
    }
  };

  const handleCerrarRegistro = () => {
    if (pendientesCount > 0) {
      toast.error(`No puede cerrar el registro: ${pendientesCount} persona(s) aún están en estado Pendiente. Marque a todos antes de cerrar.`);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCerrarRegistro = async () => {
    setShowConfirmModal(false);
    try {
      await registrarAsistencia(selectedMinga, { asistencias: asistencia, cerrar_registro: true });
      setIsClosed(true);
      toast.success('El registro de asistencia ha sido cerrado definitivamente.');
      setTimeout(() => navigate('/dashboard/mingas'), 2500);
    } catch (e) {
      toast.error('No se pudo cerrar el registro de asistencia. Intenta de nuevo.');
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
              onChange={(e) => setSearchTerm(allowTextWithPunctuation(e.target.value))}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', width: '100%', outline: 'none', marginLeft: '0.5rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flex: '0 0 auto', flexWrap: 'wrap' }}>
          {/* Acciones masivas para pendientes */}
          {selectedMinga && !isClosed && pendientesCount > 0 && (
            <>
              <button
                className="btn-secondary"
                onClick={() => handleMarcarTodos('Presente')}
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid #10b981', width: 'auto', fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                title={`Marcar los ${pendientesCount} pendientes como Presente`}
              >
                <CheckCircle size={16} /> Todos Presente
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleMarcarTodos('Faltó')}
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', width: 'auto', fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                title={`Marcar los ${pendientesCount} pendientes como Faltó`}
              >
                <XCircle size={16} /> Todos Faltó
              </button>
            </>
          )}

          <button
            className="btn-primary"
            onClick={handleGuardarTodo}
            disabled={!selectedMinga || isClosed || pendientesCount > 0}
            style={{ background: pendientesCount > 0 ? '#4b5563' : '#10b981', opacity: (!selectedMinga || isClosed) ? 0.5 : 1, cursor: pendientesCount > 0 ? 'not-allowed' : 'pointer' }}
            title={pendientesCount > 0 ? `${pendientesCount} persona(s) sin marcar` : 'Guardar asistencia'}
          >
            <Save size={18} /> {pendientesCount > 0 ? `${pendientesCount} sin marcar` : 'Guardar Cambios'}
          </button>

          <button
            className="btn-primary"
            onClick={handleCerrarRegistro}
            disabled={!selectedMinga || isClosed || pendientesCount > 0}
            style={{ background: pendientesCount > 0 ? '#4b5563' : '#ef4444', opacity: (!selectedMinga || isClosed) ? 0.5 : 1, cursor: pendientesCount > 0 ? 'not-allowed' : 'pointer' }}
            title={pendientesCount > 0 ? `Primero marque los ${pendientesCount} pendientes` : 'Cerrar registro definitivamente'}
          >
            <Lock size={18} /> Cerrar Registro
          </button>
        </div>
      </div>

      {/* Barra de progreso de asistencia */}
      {selectedMinga && totalConvocados > 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
              <span className="text-muted">Progreso del registro</span>
              <span style={{ fontWeight: '600', color: pendientesCount > 0 ? '#f59e0b' : '#10b981' }}>
                {totalConvocados - pendientesCount} / {totalConvocados} marcados
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${((totalConvocados - pendientesCount) / totalConvocados) * 100}%`,
                background: pendientesCount > 0 ? 'linear-gradient(90deg, #f59e0b, #10b981)' : '#10b981',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#10b981' }}>✓ {asistencia.filter(u => u.estado === 'Presente').length} Presentes</span>
            <span style={{ color: '#ef4444' }}>✗ {asistencia.filter(u => u.estado === 'Faltó' || u.estado === 'Faltó (Pagado)').length} Faltas</span>
            <span style={{ color: '#f59e0b' }}>⚡ {asistencia.filter(u => u.estado === 'Justificado').length} Justificados</span>
            {pendientesCount > 0 && <span style={{ color: '#94a3b8', fontWeight: '600' }}>⏳ {pendientesCount} Pendientes</span>}
          </div>
        </div>
      )}

      {/* Tabla de Asistencia (Solo visible si hay minga seleccionada) */}
      {selectedMinga ? (
        <div className="table-container animate-fade-in">
          {/* Indicador de filas ocultas cuando hay búsqueda activa */}
          {searchTerm.trim() && (
            <div style={{ padding: '0.6rem 1rem', background: 'rgba(14,165,233,0.08)', borderBottom: '1px solid rgba(14,165,233,0.2)', fontSize: '0.8rem', color: 'var(--primary)' }}>
              Mostrando todos los resultados para "{searchTerm}" (incluye ya marcados). Borra la búsqueda para ver solo pendientes.
            </div>
          )}
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
              {(searchTerm.trim()
                ? asistencia.filter(u =>
                    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (u.cedula && u.cedula.includes(searchTerm))
                  )
                : asistencia.filter(u => u.estado === 'Pendiente')
              ).map((user) => (
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

      {showConfirmModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="glass-card animate-fade-in" style={{ padding: '2rem', maxWidth: '500px', width: '90%', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <Lock size={48} className="text-red" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>¿Cerrar Registro Definitivamente?</h2>
            <p className="text-muted" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
              Una vez cerrado, <strong>no se podrán modificar</strong> las asistencias. Las inasistencias generarán multas automáticas e irrevocables para los comuneros que faltaron.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={confirmCerrarRegistro} style={{ flex: 1, background: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                Sí, Cerrar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
