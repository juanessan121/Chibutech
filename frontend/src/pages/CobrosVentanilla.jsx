import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, User, MapPin, DollarSign, Printer, CheckCircle, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function CobrosVentanilla() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mocks simulando la base de datos
  const [usuariosMock] = useState([
    { id: 1, cedula: '1801234567', nombre: 'Juan Carlos Pérez', zona: 'Zona Norte', sector: 'Sector Centro', condicion: 'Ninguna' },
    { id: 2, cedula: '1809876543', nombre: 'María Rosa Guamán', zona: 'Zona Sur', sector: 'San Luis', condicion: 'Tercera Edad' }
  ]);

  const mockDeudas = {
    1: [
      { id_multa: 101, motivo: 'Inasistencia a Minga (Limpieza Acequias)', fecha_emision: '2025-10-15', monto: 10.00, tipo: 'Multa' },
      { id_multa: 102, motivo: 'Daño a tubería principal', fecha_emision: '2025-11-20', monto: 25.50, tipo: 'Multa' },
      { id_multa: 201, motivo: 'Planilla de Agua - Enero 2026', fecha_emision: '2026-01-01', monto: 5.00, tipo: 'Planilla' }
    ],
    2: [
      { id_multa: 103, motivo: 'Inasistencia a Minga (Mantenimiento)', fecha_emision: '2026-02-10', monto: 15.00, tipo: 'Multa' },
      { id_multa: 202, motivo: 'Planilla de Agua - Enero 2026', fecha_emision: '2026-01-01', monto: 5.00, tipo: 'Planilla' },
      { id_multa: 203, motivo: 'Planilla de Agua - Febrero 2026', fecha_emision: '2026-02-01', monto: 5.00, tipo: 'Planilla' }
    ]
  };

  const [deudasActuales, setDeudasActuales] = useState([]);
  const [deudasSeleccionadas, setDeudasSeleccionadas] = useState([]);

  const handleSearch = () => {
    const found = usuariosMock.find(u => u.cedula === searchTerm || u.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    if (found) {
      setSelectedUser(found);
      setDeudasActuales(mockDeudas[found.id] || []);
      setDeudasSeleccionadas([]); // Limpiar selección previa
    } else {
      toast.error('No se encontró al agricultor en el padrón.');
      setSelectedUser(null);
      setDeudasActuales([]);
    }
  };

  const toggleDeuda = (id_multa) => {
    setDeudasSeleccionadas(prev => 
      prev.includes(id_multa) ? prev.filter(id => id !== id_multa) : [...prev, id_multa]
    );
  };

  const totalAPagar = deudasActuales
    .filter(d => deudasSeleccionadas.includes(d.id_multa))
    .reduce((sum, d) => sum + d.monto, 0);

  const handleProcesarPago = () => {
    if (deudasSeleccionadas.length === 0) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Pago procesado correctamente. Generando recibo...');
      // Simulamos que desaparecen las deudas pagadas
      setDeudasActuales(prev => prev.filter(d => !deudasSeleccionadas.includes(d.id_multa)));
      setDeudasSeleccionadas([]);
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
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ingrese Cédula o Apellidos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn-primary" onClick={handleSearch} style={{ width: 'auto', padding: '0 1.5rem' }}>
                <Search size={18} />
              </button>
            </div>
          </div>

          {selectedUser && (
            <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(14, 165, 233, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <User size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>{selectedUser.nombre}</h3>
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>C.I: {selectedUser.cedula}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={16} /> Sector:
                  </span>
                  <span style={{ fontWeight: '500' }}>{selectedUser.sector} ({selectedUser.zona})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={16}/> Condición Especial:</span>
                  <span style={{ fontWeight: '500', color: selectedUser.condicion !== 'Ninguna' ? 'var(--yellow)' : 'var(--text-main)' }}>
                    {selectedUser.condicion}
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
              {deudasActuales.map(deuda => (
                <div 
                  key={deuda.id_multa}
                  onClick={() => toggleDeuda(deuda.id_multa)}
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '1rem', borderRadius: '0.75rem', cursor: 'pointer',
                    border: deudasSeleccionadas.includes(deuda.id_multa) ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: deudasSeleccionadas.includes(deuda.id_multa) ? 'rgba(14, 165, 233, 0.1)' : 'rgba(0,0,0,0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input 
                      type="checkbox" 
                      checked={deudasSeleccionadas.includes(deuda.id_multa)} 
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
              ))}
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
