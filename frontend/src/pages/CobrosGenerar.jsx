import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, User, DollarSign, AlertTriangle, X, Search } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { generarMulta } from '../services/cobroService';
import PersonaAutocompleteInput from '../components/PersonaAutocompleteInput';
import axios from '../services/axiosConfig';
import { allowTextWithPunctuation } from '../utils/validators';

export default function CobrosGenerar() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [monto, setMonto] = useState('');
  const [urlDocumento, setUrlDocumento] = useState('');
  const [touched, setTouched] = useState({ motivo: false, monto: false });

  const [searchTerm, setSearchTerm] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState([]);

  // Búsqueda en tiempo real
  React.useEffect(() => {
    if (searchTerm.length >= 3) {
      const fetchResultados = async () => {
        setBuscando(true);
        try {
          const res = await axios.get(`/terrenos/buscar-universal?termino=${searchTerm}&criterio=todos`);
          setResultados(res.data.data);
        } catch (error) {
          console.error(error);
        } finally {
          setBuscando(false);
        }
      };
      const debounce = setTimeout(fetchResultados, 300);
      return () => clearTimeout(debounce);
    } else {
      setResultados([]);
    }
  }, [searchTerm]);

  const seleccionarPersona = (terreno) => {
    setSelectedUser({
      id_persona: terreno.id_titular,
      cedula: terreno.cedula_titular,
      nombre: terreno.nombre_titular,
      apellido: '', // nombre_titular ya tiene nombre y apellido
      sector: terreno.sector
    });
    setSearchTerm('');
    setResultados([]);
  };

  const handleGenerarMulta = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error('Debe seleccionar un comunero.');
      return;
    }
    if (!motivo.trim() || motivo.trim().length < 5) {
      toast.error('El motivo debe tener al menos 5 caracteres.');
      return;
    }
    const montoNum = parseFloat(monto);
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      toast.error('El monto debe ser un valor positivo mayor a $0.00.');
      return;
    }
    if (montoNum > 10000) {
      toast.error('El monto de la multa no puede exceder $10,000.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await generarMulta({
        id_persona: selectedUser.id_persona,
        motivo,
        monto,
        url_documento: urlDocumento
      });
      toast.success('Multa registrada y asignada al comunero correctamente.');
      setTimeout(() => navigate('/dashboard/cobros'), 2000);
    } catch (error) {
      toast.error('No se pudo registrar la multa. Verifica los datos e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      
      
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

            {selectedUser ? (
              <div className="animate-fade-in" style={{ padding: '1rem', background: 'rgba(14,165,233,0.1)', border: '1px solid var(--blue)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <User size={24} className="text-blue" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)' }}>{selectedUser.nombre} {selectedUser.apellido}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem' }} className="text-muted">C.I: {selectedUser.cedula}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedUser(null)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.3rem' }}>
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                    placeholder="Ingrese Cédula, Nombre o Clave..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {buscando && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', marginTop: '0.5rem', padding: '1rem', zIndex: 100, textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.6)' }}>
                    <span className="text-muted">Buscando...</span>
                  </div>
                )}

                {!buscando && resultados.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', marginTop: '0.5rem', maxHeight: '300px', overflowY: 'auto', zIndex: 100, display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.6)' }}>
                    {resultados.map(r => (
                      <div 
                        key={r.id_terreno}
                        style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }}
                        onClick={() => seleccionarPersona(r)}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontWeight: 'bold', color: 'var(--primary-light)', marginBottom: '0.2rem' }}>
                          {r.nombre_titular}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          C.I: {r.cedula_titular} | Clave: {r.clave_catastral}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Sector: {r.sector || 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  onChange={(e) => setMotivo(allowTextWithPunctuation(e.target.value))}
                  onBlur={() => setTouched(t => ({ ...t, motivo: true }))}
                  required
                ></textarea>
                {touched.motivo && (!motivo.trim() || motivo.trim().length < 5) && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El motivo debe tener al menos 5 caracteres.</span>
                )}
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
                  onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  onChange={(e) => setMonto(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, monto: true }))}
                  required
                />
                {touched.monto && (() => {
                  const n = parseFloat(monto);
                  if (!monto) return <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El monto es obligatorio.</span>;
                  if (isNaN(n) || n <= 0) return <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El monto debe ser mayor a $0.00.</span>;
                  if (n > 10000) return <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El monto no puede exceder $10,000.</span>;
                  return null;
                })()}
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
