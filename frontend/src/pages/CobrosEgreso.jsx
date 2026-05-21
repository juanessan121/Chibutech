import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowLeft, DollarSign, FileText, Save } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function CobrosEgreso() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [comprobante, setComprobante] = useState('');

  const handleRegistrarEgreso = (e) => {
    e.preventDefault();
    if (!concepto || !monto) {
      toast.error('El concepto y el monto son obligatorios.');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Gasto registrado correctamente en el Arqueo de Caja.');
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
            <Wallet className="text-red" /> Registrar Gasto (Egreso de Caja)
          </h1>
          <p className="text-muted">Documente los gastos de la Junta para cuadrar el arqueo financiero.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto' }}>
        <form onSubmit={handleRegistrarEgreso} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="form-grid full">
            <div className="input-group">
              <label className="input-label">Concepto o Detalle del Gasto *</label>
              <textarea 
                className="input-field" 
                placeholder="Ej. Compra de tubería PVC de 2 pulgadas para reparación en San Luis..."
                style={{ minHeight: '80px', resize: 'vertical' }}
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={16} className="text-red" /> Monto del Gasto ($) *
              </label>
              <input 
                type="number" 
                step="0.01" 
                min="0.01"
                className="input-field" 
                placeholder="Ej. 150.50" 
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} className="text-muted" /> Nro. Factura / Comprobante
              </label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ej. FAC-001-002-123456" 
                value={comprobante}
                onChange={(e) => setComprobante(e.target.value)}
              />
              <span className="text-muted" style={{fontSize: '0.75rem'}}>Opcional, pero recomendado para auditorías.</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: 'auto', background: 'var(--red)', color: 'white' }} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : <><Save size={18}/> Declarar Egreso</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
