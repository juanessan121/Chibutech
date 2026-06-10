import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, User, MapPin, DollarSign, Printer, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { getDeudasPendientes, procesarPago } from '../services/cobroService';
import axios from '../services/axiosConfig';

export default function CobrosVentanilla() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [deudasActuales, setDeudasActuales] = useState([]);
  const [deudasSeleccionadas, setDeudasSeleccionadas] = useState([]);
  const [comprobantePago, setComprobantePago] = useState('');
  const [comprobanteTouched, setComprobanteTouched] = useState(false);

  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState([]);

  // Solo mostrar resultados cuando hay al menos 3 caracteres
  useEffect(() => {
    if (searchTerm.length >= 3) {
      const fetchResultados = async () => {
        setBuscando(true);
        try {
          const res = await axios.get(`/terrenos/buscar-universal?termino=${searchTerm}&criterio=todos`);
          setResultados(res.data.data);
        } catch {
          setResultados([]);
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
      id_persona: terreno.id_persona_cobro || terreno.id_titular,
      cedula: terreno.cedula_cobro || terreno.cedula_titular,
      nombre: terreno.nombre_cobro || terreno.nombre_titular,
      sector: terreno.sector,
      es_copropietario: terreno.es_copropietario || false,
      nombre_titular: terreno.nombre_titular
    };
    setSelectedUser(userObj);
    setSearchTerm('');
    setResultados([]);
    setDeudasSeleccionadas([]);
    try {
      const deudas = await getDeudasPendientes(userObj.id_persona);
      setDeudasActuales(deudas || []);
    } catch {
      toast.error('No se pudieron cargar las deudas del comunero. Intenta buscarlo de nuevo.');
      setDeudasActuales([]);
    }
  };

  const toggleDeuda = (deuda) => {
    const yaSeleccionada = deudasSeleccionadas.some(d => d.id_deuda === deuda.id_deuda);

    if (yaSeleccionada) {
      setDeudasSeleccionadas(prev => prev.filter(d => d.id_deuda !== deuda.id_deuda));
    } else {
      // Al seleccionar una planilla, auto-agregar TODAS las multas pendientes
      if (deuda.tipo === 'Planilla' && tieneMultas) {
        const multasFaltantes = deudasActuales.filter(
          m => m.tipo === 'Multa' && !deudasSeleccionadas.some(s => s.id_deuda === m.id_deuda)
        );
        if (multasFaltantes.length > 0) {
          toast.warning('Se agregaron automáticamente las multas pendientes. Para pagar planillas de agua, todas las multas deben cancelarse también.');
        }
        setDeudasSeleccionadas(prev => [...prev, deuda, ...multasFaltantes]);
      } else {
        setDeudasSeleccionadas(prev => [...prev, deuda]);
      }
    }
  };

  const totalAPagar = deudasSeleccionadas.reduce((sum, d) => sum + d.monto, 0);

  // Bloquear si tiene planillas seleccionadas pero NO todas las multas están incluidas
  const tieneMultas = deudasActuales.some(d => d.tipo === 'Multa');
  const multasActuales = deudasActuales.filter(d => d.tipo === 'Multa');
  const todasMultasSeleccionadas = multasActuales.every(m => deudasSeleccionadas.some(s => s.id_deuda === m.id_deuda));
  const hayPlanillasSeleccionadas = deudasSeleccionadas.some(d => d.tipo === 'Planilla');
  const bloquearPago = tieneMultas && hayPlanillasSeleccionadas && !todasMultasSeleccionadas;

  const handleProcesarPago = async () => {
    if (deudasSeleccionadas.length === 0) return;
    if (!comprobantePago.toString().trim()) {
      toast.error('El número de comprobante es obligatorio para procesar el pago.');
      return;
    }
    if (bloquearPago) {
      toast.error('Este comunero tiene multas pendientes. Debe incluirlas o cancelarlas antes de pagar solo planillas de agua.');
      return;
    }

    setIsProcessing(true);
    try {
      const multas = deudasSeleccionadas.filter(d => d.tipo === 'Multa').map(d => d.id_multa);
      const planillas = deudasSeleccionadas.filter(d => d.tipo === 'Planilla').map(d => d.id_planilla);

      await procesarPago({ comprobante: comprobantePago, multas, planillas });

      toast.success(`Pago registrado. Comprobante #${comprobantePago} — Total cobrado: $${totalAPagar.toFixed(2)}`);
      const deudasActualizadas = await getDeudasPendientes(selectedUser.id_persona);
      setDeudasActuales(deudasActualizadas || []);
      setDeudasSeleccionadas([]);
      setComprobantePago('');
    } catch {
      toast.error('No se pudo procesar el pago. Intenta de nuevo.');
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
          <p className="text-muted">Procese el pago de multas y planillas de agua.</p>
        </div>
        <button
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', alignSelf: 'flex-start' }}
          onClick={() => navigate('/dashboard/reportes')}
        >
          <Filter size={16} /> Ver Reporte de Morosos
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

        {/* PANEL IZQUIERDO: BUSCADOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Buscar Comunero</h3>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                  placeholder="Mín. 3 caracteres: cédula, nombre o clave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {searchTerm.length > 0 && searchTerm.length < 3 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Ingrese al menos 3 caracteres para buscar.
                </div>
              )}

              {buscando && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', marginTop: '0.5rem', padding: '1rem', zIndex: 1000, textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.6)' }}>
                  <span className="text-muted">Buscando...</span>
                </div>
              )}

              {!buscando && resultados.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', marginTop: '0.5rem', maxHeight: '300px', overflowY: 'auto', zIndex: 1000, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.6)' }}>
                  {resultados.map((r, i) => (
                    <div
                      key={`${r.id_terreno}-${i}`}
                      style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'background 0.15s' }}
                      onClick={() => seleccionarPersona(r)}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = ''}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary-light)' }}>
                          {r.es_copropietario ? r.nombre_copropietario || r.nombre_cobro : r.nombre_titular}
                        </span>
                        {r.es_copropietario && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            Copropietario
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        C.I: {r.es_copropietario ? r.cedula_cobro : r.cedula_titular} | Clave: {r.clave_catastral}
                      </div>
                      {r.es_copropietario && (
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                          Titular del terreno: {r.nombre_titular}
                        </div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sector: {r.sector || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedUser && (
            <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(14, 165, 233, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: selectedUser.es_copropietario ? '#f59e0b' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                  <User size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>{selectedUser.nombre}</h3>
                    {selectedUser.es_copropietario && (
                      <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Copropietario</span>
                    )}
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>C.I: {selectedUser.cedula}</span>
                  {selectedUser.es_copropietario && (
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.1rem' }}>Titular del terreno: {selectedUser.nombre_titular}</div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} /> Sector:
                  </span>
                  <span>{selectedUser.sector || 'No asignado'}</span>
                </div>
                {tieneMultas && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', marginTop: '0.25rem' }}>
                    <AlertTriangle size={14} /> {multasActuales.length} multa{multasActuales.length > 1 ? 's' : ''} pendiente{multasActuales.length > 1 ? 's' : ''} — se agregarán automáticamente al seleccionar una planilla
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PANEL DERECHO: DEUDAS Y PAGO */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle className="text-red" size={20} /> Deudas Pendientes
          </h3>

          {!selectedUser ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Busque un comunero para cargar su estado de cuenta.</p>
            </div>
          ) : deudasActuales.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <CheckCircle size={48} className="text-green" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>¡Al Día!</h4>
              <p>Este comunero no tiene deudas pendientes.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {deudasActuales.map(deuda => {
                const isSelected = deudasSeleccionadas.some(d => d.id_deuda === deuda.id_deuda);
                return (
                  <div
                    key={deuda.id_deuda}
                    onClick={() => toggleDeuda(deuda)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.85rem 1rem', borderRadius: '0.75rem', cursor: 'pointer',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(14, 165, 233, 0.1)' : 'rgba(0,0,0,0.2)',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input type="checkbox" checked={isSelected} readOnly style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                      <div>
                        <p style={{ fontWeight: '500', color: 'var(--text-main)', margin: '0 0 0.15rem 0', fontSize: '0.9rem' }}>
                          {deuda.tipo === 'Planilla' && <span style={{ background: 'var(--blue)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', marginRight: '0.4rem' }}>Planilla</span>}
                          {deuda.tipo === 'Multa' && <span style={{ background: 'var(--red)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', marginRight: '0.4rem' }}>Multa</span>}
                          {deuda.compartido && <span style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', marginRight: '0.4rem' }}>Terreno compartido</span>}
                          {deuda.motivo}
                        </p>
                        <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>Emitida: {deuda.fecha_emision}</p>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--red)' }}>
                      ${deuda.monto.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TOTAL Y BOTÓN */}
          {selectedUser && deudasActuales.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              {bloquearPago && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#ef4444', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span>
                    Tiene <strong>{multasActuales.length} multa{multasActuales.length > 1 ? 's' : ''}</strong> pendiente{multasActuales.length > 1 ? 's' : ''}.
                    Deben pagarse al <strong>100%</strong> junto con las planillas de agua.
                    Seleccione la planilla de agua y las multas se agregarán automáticamente.
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="text-muted">Total Seleccionado:</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--green)' }}>${totalAPagar.toFixed(2)}</span>
              </div>

              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>N° Comprobante *</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Ej. 1001"
                  style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                  min="1"
                  value={comprobantePago}
                  onChange={(e) => setComprobantePago(e.target.value)}
                  onBlur={() => setComprobanteTouched(true)}
                />
                {comprobanteTouched && !comprobantePago.toString().trim() && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El N° de comprobante es obligatorio.</span>
                )}
              </div>

              <button
                className="btn-primary"
                disabled={deudasSeleccionadas.length === 0 || isProcessing || bloquearPago}
                onClick={handleProcesarPago}
                style={{
                  background: bloquearPago ? 'rgba(239,68,68,0.3)' : deudasSeleccionadas.length > 0 ? 'var(--green)' : 'var(--border-color)',
                  height: '3.2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                {isProcessing ? 'Procesando...' : <><Printer size={18} /> Procesar Pago</>}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
