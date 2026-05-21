import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Plus, History, UserPlus, Save, Search, FileText, Calendar } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Catálogo fijo que refleja la tabla Catalogo_Cargo_Directivo de la BD
const CARGOS_DIRECTIVA = [
  { id: 1, nombre: 'Presidente' },
  { id: 2, nombre: 'Vicepresidente' },
  { id: 3, nombre: 'Secretario' },
  { id: 4, nombre: 'Tesorero' },
  { id: 5, nombre: 'Vocal Principal 1' },
  { id: 6, nombre: 'Vocal Principal 2' },
  { id: 7, nombre: 'Vocal Principal 3' },
  { id: 8, nombre: 'Vocal Suplente 1' },
  { id: 9, nombre: 'Vocal Suplente 2' },
];

export default function DirectivaGestion() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('nuevo'); // 'nuevo' o 'historial'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mocks simulando la tabla Miembro_Directiva
  const historialPeriodos = [
    { periodo: '2024 - 2025', presidente: 'Luis Alberto Sisa', estado: 'Finalizado' },
    { periodo: '2022 - 2023', presidente: 'María Rosario Chango', estado: 'Finalizado' }
  ];

  const handleGuardarDirectiva = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Nueva Directiva registrada. La anterior ha pasado al historial automáticamente.');
      setTimeout(() => navigate('/dashboard/directiva'), 2000);
    }, 1500);
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toaster richColors />
      
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/directiva')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Organigrama
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield className="text-yellow" /> Gestión de Directivas
          </h1>
          <p className="text-muted">Añada nuevos miembros o consulte las autoridades de periodos anteriores.</p>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={activeTab === 'nuevo' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('nuevo')}
          style={{ width: 'auto', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}
        >
          <UserPlus size={18} /> Registrar Nuevo Periodo
        </button>
        <button 
          className={activeTab === 'historial' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('historial')}
          style={{ width: 'auto', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}
        >
          <History size={18} /> Ver Historial Pasado
        </button>
      </div>

      {/* CONTENIDO PESTAÑA: NUEVO PERIODO */}
      {activeTab === 'nuevo' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <h3 className="text-primary" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Configurar Autoridades Entrantes
          </h3>
          <form onSubmit={handleGuardarDirectiva} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} className="text-blue" /> Fecha Inicio de Funciones *
                </label>
                <input type="date" className="input-field" required />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} className="text-muted" /> Fecha Fin de Periodo (Proyectada)
                </label>
                <input type="date" className="input-field" />
              </div>
            </div>

            <div className="form-grid full">
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={14} className="text-yellow" /> N° Resolución de Nombramiento *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. RES-2026-001 o Acta No. 45 del Ministerio de Inclusión"
                  required
                />
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Corresponde al campo <code>resolucion_nombramiento</code> de la tabla Miembro_Directiva.</span>
              </div>
            </div>

            {/* ASIGNACIÓN DE CARGOS */}
            <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Asignación de Cargos Principales</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {CARGOS_DIRECTIVA.map((cargo, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ color: 'var(--yellow)', fontWeight: 'bold', fontSize: '0.9rem' }}>{cargo.nombre}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" className="input-field" placeholder="Buscar por Cédula o Apellido..." style={{ flex: 1 }} />
                      <button type="button" className="btn-secondary" style={{ padding: '0 1rem', width: 'auto' }} title="Buscar Agricultor">
                        <Search size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1.5rem' }}>
                * Al guardar, los miembros de la directiva actual pasarán al estado "Finalizado" automáticamente.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ width: 'auto', background: 'var(--yellow)', color: '#000' }} disabled={isSubmitting}>
                {isSubmitting ? 'Registrando Directiva...' : <><Save size={18}/> Guardar Nueva Directiva</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONTENIDO PESTAÑA: HISTORIAL */}
      {activeTab === 'historial' && (
        <div className="table-container glass-card animate-fade-in">
          <table className="data-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Presidente a Cargo</th>
                <th>Resolución</th>
                <th style={{ textAlign: 'center' }}>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historialPeriodos.map((hist, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{hist.periodo}</td>
                  <td>{hist.presidente}</td>
                  <td><code style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{hist.resolucion || 'RES-HIST-001'}</code></td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge badge-user">{hist.estado}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => navigate(`/dashboard/directiva?periodo=${hist.periodo}`)}
                      style={{ padding: '0.4rem 1rem', width: 'auto', fontSize: '0.8rem' }}
                    >
                      Ver Organigrama Pasado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
