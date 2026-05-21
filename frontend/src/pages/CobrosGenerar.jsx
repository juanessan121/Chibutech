import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Search, User, DollarSign, Save, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function CobrosGenerar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [monto, setMonto] = useState('');
  const [urlDocumento, setUrlDocumento] = useState('');

  // Mocks simulando la base de datos
  const mockUsers = [
    { id: 1, cedula: '1801234567', nombre: 'Juan Carlos Pérez' },
    { id: 2, cedula: '1809876543', nombre: 'María Rosa Guamán' }
  ];

  const handleSearch = () => {
    const found = mockUsers.find(u => u.cedula === searchTerm || u.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    if (found) {
      setSelectedUser(found);
    } else {
      toast.error('Agricultor no encontrado.');
      setSelectedUser(null);
    }
  };

  const handleGenerarMulta = (e) => {
    e.preventDefault();
    if (!selectedUser || !motivo || !monto) {
      toast.error('Complete todos los campos requeridos.');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Multa generada y asignada al agricultor exitosamente.');
      setTimeout(() => navigate('/dashboard/cobros'), 2000);
    }, 1500);
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toaster richColors />
      
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/cobros')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PlusCircle className="text-red" /> Generar Sanción / Multa Manual
          </h1>
          <p className="text-muted">Aplique multas por desperdicio de agua, reconexiones o faltas disciplinarias.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto' }}>
        <form onSubmit={handleGenerarMulta} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* PASO 1: INFRACTOR */}
          <div>
            <h3 className="text-primary" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              1. Seleccionar Infractor
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Buscar por cédula o nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
              />
              <button type="button" className="btn-primary" onClick={handleSearch} style={{ width: 'auto', padding: '0 1.5rem' }}>
                <Search size={18} />
              </button>
            </div>

            {selectedUser && (
              <div className="animate-fade-in" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid var(--blue)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <User size={24} className="text-blue" />
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)' }}>{selectedUser.nombre}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem' }} className="text-muted">C.I: {selectedUser.cedula}</p>
                </div>
              </div>
            )}
          </div>

          {/* PASO 2: DETALLES DE LA MULTA */}
          <div style={{ opacity: selectedUser ? 1 : 0.5, pointerEvents: selectedUser ? 'auto' : 'none', transition: 'all 0.3s' }}>
            <h3 className="text-primary" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              2. Detalles de la Sanción
            </h3>
            
            <div className="form-grid full">
              <div className="input-group">
                <label className="input-label">Motivo o Concepto de la Multa *</label>
                <textarea 
                  className="input-field" 
                  placeholder="Ej. Desperdicio comprobado de agua potable en riego..."
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: '1rem' }}>
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={16} className="text-red" /> Monto a Cobrar ($) *
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.01"
                  className="input-field" 
                  placeholder="Ej. 25.00" 
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid full" style={{ marginTop: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Documento Justificativo (URL / Enlace Opcional)</label>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="https://drive.google.com/... (Evidencia, Foto, Parte)" 
                  value={urlDocumento}
                  onChange={(e) => setUrlDocumento(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: 'auto', background: 'var(--red)', color: 'white' }} 
              disabled={isSubmitting || !selectedUser}
            >
              {isSubmitting ? 'Registrando...' : <><AlertTriangle size={18}/> Imponer Sanción</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
