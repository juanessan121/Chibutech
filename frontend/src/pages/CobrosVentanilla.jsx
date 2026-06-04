import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, User, MapPin, DollarSign, Printer, CheckCircle, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { getUsers } from '../services/userService';
import { getDeudasPendientes, procesarPago } from '../services/cobroService';
import axios from '../services/axiosConfig';

export default function CobrosVentanilla() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [usuariosDB, setUsuariosDB] = useState([]);
  const [deudasActuales, setDeudasActuales] = useState([]);
  const [deudasSeleccionadas, setDeudasSeleccionadas] = useState([]);
  const [comprobantePago, setComprobantePago] = useState('');

  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState([]);

  // Búsqueda en tiempo real
  useEffect(() => {
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

  const seleccionarPersona = async (terreno) => {
    const userObj = {
      id_persona: terreno.id_titular,
      cedula: terreno.cedula_titular,
      nombre: terreno.nombre_titular,
      sector: terreno.sector
    };
    setSelectedUser(userObj);
    setSearchTerm('');
    setResultados([]);
    setDeudasSeleccionadas([]);
    try {
      const deudas = await getDeudasPendientes(userObj.id_persona);
      setDeudasActuales(deudas || []);
    } catch (error) {
      toast.error('Error al cargar las deudas pendientes.');
      setDeudasActuales([]);
    }
  };

  const toggleDeuda = (deuda) => {
    setDeudasSeleccionadas(prev => 
      prev.some(d => d.id_deuda === deuda.id_deuda) ? prev.filter(d => d.id_deuda !== deuda.id_deuda) : [...prev, deuda]
    );
  };

  const totalAPagar = deudasSeleccionadas.reduce((sum, d) => sum + d.monto, 0);

  const handleProcesarPago = async () => {
    if (deudasSeleccionadas.length === 0) return;
    
    setIsProcessing(true);
    try {
      const multas = deudasSeleccionadas.filter(d => d.tipo === 'Multa').map(d => d.id_multa);
      const planillas = deudasSeleccionadas.filter(d => d.tipo === 'Planilla').map(d => d.id_planilla);
      
      await procesarPago({
        comprobante: comprobantePago,
        multas,
        planillas
      });
      
      toast.success('Pago procesado correctamente.');
      // Refrescar deudas
      const deudasActualizadas = await getDeudasPendientes(selectedUser.id_persona);
      setDeudasActuales(deudasActualizadas || []);
      setDeudasSeleccionadas([]);
      setComprobantePago('');
    } catch (error) {
      toast.error('Error al procesar el pago.');
    } finally {
      setIsProcessing(false);
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
            <DollarSign className="text-yellow" /> Ventanilla de Cobro
          </h1>
          <p className="text-muted">Procese el pago de multas pendientes e ingrese el dinero a la Caja Comunitaria.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* PANEL IZQUIERDO: BUSCADOR Y PERFIL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Buscar Agricultor</h3>
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
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', marginTop: '0.5rem', padding: '1rem', zIndex: 10, textAlign: 'center' }}>
                  <span className="text-muted">Buscando...</span>
                </div>
              )}

              {!buscando && resultados.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', marginTop: '0.5rem', maxHeight: '300px', overflowY: 'auto', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
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
          </div>

          {selectedUser && (
            <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(14, 165, 233, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <User size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>{selectedUser.nombre} {selectedUser.apellido}</h3>
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>C.I: {selectedUser.cedula}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={16} /> Sector:
                  </span>
                  <span style={{ fontWeight: '500' }}>{selectedUser.sector || 'No asignado'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={16}/> Condición:</span>
                  <span style={{ fontWeight: '500', color: selectedUser.condicion !== 'Ninguna' && selectedUser.condicion ? 'var(--yellow)' : 'var(--text-main)' }}>
                    {selectedUser.condicion || 'Ninguna'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PANEL DERECHO: CARRITO DE DEUDAS */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle className="text-red" size={20} /> Deudas Pendientes
          </h3>

          {!selectedUser ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Busque un agricultor para cargar su estado de cuenta.</p>
            </div>
          ) : deudasActuales.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <CheckCircle size={48} className="text-green" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>¡Al Día!</h4>
              <p>Este agricultor no tiene multas pendientes de pago.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {deudasActuales.map(deuda => {
                const isSelected = deudasSeleccionadas.some(d => d.id_deuda === deuda.id_deuda);
                return (
                <div 
                  key={deuda.id_deuda}
                  onClick={() => toggleDeuda(deuda)}
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '1rem', borderRadius: '0.75rem', cursor: 'pointer',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(14, 165, 233, 0.1)' : 'rgba(0,0,0,0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      readOnly
                      style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <div>
                      <p style={{ fontWeight: '500', color: 'var(--text-main)', margin: 0, marginBottom: '0.2rem' }}>
                        {deuda.tipo === 'Planilla' && <span style={{ background: 'var(--blue)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', marginRight: '0.5rem' }}>Planilla</span>}
                        {deuda.tipo === 'Multa' && <span style={{ background: 'var(--red)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', marginRight: '0.5rem' }}>Multa</span>}
                        {deuda.motivo}
                      </p>
                      <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Emitida: {deuda.fecha_emision}</p>
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--red)' }}>
                    ${deuda.monto.toFixed(2)}
                  </div>
                </div>
              )})}
            </div>
          )}

          {/* TOTAL Y BOTÓN DE PAGO */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="text-muted" style={{ fontSize: '1.1rem' }}>Total Seleccionado:</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--green)' }}>
                ${totalAPagar.toFixed(2)}
              </span>
            </div>

            {/* Número de comprobante — cubre columna numero_comprobante de Caja_Comunitaria */}
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label" style={{ fontSize: '0.8rem' }}>N° Comprobante (Opcional — se autogenera si se deja vacío)</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. REC-2026-001"
                style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                value={comprobantePago}
                onChange={(e) => setComprobantePago(e.target.value)}
              />
            </div>
            
            <button 
              className="btn-primary" 
              disabled={deudasSeleccionadas.length === 0 || isProcessing}
              onClick={handleProcesarPago}
              style={{ background: deudasSeleccionadas.length > 0 ? 'var(--green)' : 'var(--border-color)', height: '3.5rem', fontSize: '1.1rem' }}
            >
              {isProcessing ? 'Procesando Transacción...' : (
                <><Printer size={20} /> Procesar Pago e Imprimir Recibo</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
