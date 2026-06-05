import React, { useState, useEffect } from 'react';
import { Search, MapPin, User, CheckCircle, AlertCircle, FileText, Calendar, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../services/axiosConfig';

export default function PagoAgua() {
  const navigate = useNavigate();
  const [criterio, setCriterio] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const [terrenoSeleccionado, setTerrenoSeleccionado] = useState(null);
  const [multasPendientes, setMultasPendientes] = useState([]);

  // Consulta proactiva
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  const [planillaConsultada, setPlanillaConsultada] = useState(null);
  const [cargandoPlanillas, setCargandoPlanillas] = useState(false);

  // Modal / Form de Pago
  const [planillaAPagar, setPlanillaAPagar] = useState(null);
  const [comprobante, setComprobante] = useState('');
  const [pagando, setPagando] = useState(false);

  // Limpiar búsqueda al cambiar criterio
  useEffect(() => {
    setTerminoBusqueda('');
    setResultados([]);
  }, [criterio]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (terminoBusqueda.length >= 3) {
        buscarUniversal();
      } else {
        setResultados([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [terminoBusqueda, criterio]);

  // Filtra texto pegado (paste)
  const filtrarInput = (valor) => {
    if (criterio === 'cedula') return valor.replace(/\D/g, '').slice(0, 10);
    if (criterio === 'nombre') return valor.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/gu, '');
    if (criterio === 'clave') return valor.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
    return valor;
  };

  // Bloquea teclas inválidas en tiempo real
  const handleKeyDown = (e) => {
    const nav = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Enter','Home','End'];
    if (nav.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (criterio === 'cedula' && !/^\d$/.test(e.key)) { e.preventDefault(); return; }
    if (criterio === 'nombre' && !/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]$/u.test(e.key)) { e.preventDefault(); return; }
    if (criterio === 'clave' && !/^[a-zA-Z0-9-]$/.test(e.key)) { e.preventDefault(); return; }
  };

  const buscarUniversal = async () => {
    setBuscando(true);
    try {
      const res = await axios.get(`/terrenos/buscar-universal?termino=${terminoBusqueda}&criterio=${criterio}`);
      setResultados(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarTerreno = async (t) => {
    setTerrenoSeleccionado(t);
    setTerminoBusqueda('');
    setResultados([]);
    setPlanillaConsultada(null);
    setMultasPendientes([]);
    // Consultar multas pendientes del titular al seleccionar el terreno
    try {
      const res = await axios.get(`/cobros/deudas/${t.id_titular}`);
      const multas = (res.data.data || []).filter(d => d.tipo === 'Multa');
      setMultasPendientes(multas);
      if (multas.length > 0) {
        toast.warning(`Este comunero tiene ${multas.length} multa${multas.length > 1 ? 's' : ''} pendiente${multas.length > 1 ? 's' : ''}. No puede pagar el agua hasta cancelarlas.`);
      }
    } catch {
      setMultasPendientes([]);
    }
  };

  const consultarMes = async (id_terreno) => {
    setCargandoPlanillas(true);
    try {
      const res = await axios.get(`/cobros/terreno/${id_terreno}/consultar-mes?mes=${mesSeleccionado}&anio=${anioSeleccionado}`);
      setPlanillaConsultada(res.data.data);
      if (res.data.message) {
        toast.info(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al consultar/generar planilla');
    } finally {
      setCargandoPlanillas(false);
    }
  };

  const intentarPagar = (planilla) => {
    if (multasPendientes.length > 0) {
      toast.error(`No puede pagar el agua. Tiene ${multasPendientes.length} multa${multasPendientes.length > 1 ? 's' : ''} pendiente${multasPendientes.length > 1 ? 's' : ''} que deben cancelarse al 100% primero.`);
      return;
    }
    setPlanillaAPagar(planilla);
  };

  const procesarPago = async (e) => {
    e.preventDefault();
    if (!comprobante) return toast.warning("El número de comprobante es obligatorio");
    if (multasPendientes.length > 0) {
      toast.error('No puede procesar el pago. Existen multas pendientes.');
      return;
    }
    setPagando(true);
    try {
      await axios.post('/cobros/pagar-agua', {
        id_planilla: planillaAPagar.id_planilla,
        numero_comprobante: comprobante
      });
      toast.success('Pago procesado correctamente');
      setPlanillaAPagar(null);
      setComprobante('');
      consultarMes(terrenoSeleccionado.id_terreno);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setPagando(false);
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
            <Search className="text-blue" /> Pago de Agua
          </h1>
          <p className="text-muted">Busca por cédula, nombre o clave catastral para visualizar y cobrar deudas.</p>
        </div>
      </div>

      {/* Buscador Universal — wrapper relativo para que el dropdown quede fuera del glass-card */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Search className="text-muted" />

            <select
              className="input-field"
              value={criterio}
              onChange={e => setCriterio(e.target.value)}
              style={{ flex: '0 0 auto', width: 'auto', minWidth: '180px', padding: '1rem', fontSize: '1rem' }}
            >
              <option value="todos">Buscar en todo</option>
              <option value="cedula">Por Cédula</option>
              <option value="nombre">Por Nombres/Apellidos</option>
              <option value="clave">Por Clave Catastral</option>
            </select>

            <input
              type={criterio === 'cedula' ? 'tel' : 'text'}
              inputMode={criterio === 'cedula' ? 'numeric' : 'text'}
              className="input-field"
              placeholder={
                criterio === 'cedula' ? 'Solo dígitos — Ej: 1804552170' :
                criterio === 'nombre' ? 'Solo letras — Ej: Palacios Mendez' :
                criterio === 'clave' ? 'Ej: SEC-01-005' :
                'Cédula, nombre o clave catastral...'
              }
              value={terminoBusqueda}
              onKeyDown={handleKeyDown}
              onChange={(e) => setTerminoBusqueda(filtrarInput(e.target.value))}
              maxLength={criterio === 'cedula' ? 10 : undefined}
              style={{ flex: 1, fontSize: '1.1rem', padding: '1rem' }}
            />
            {buscando && <span className="text-muted">Buscando...</span>}
          </div>
        </div>

        {/* Dropdown — fuera del glass-card para evitar overflow:hidden */}
        {resultados.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '0.75rem', maxHeight: '340px', overflowY: 'auto', marginTop: '0.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)'
          }}>
            {/* Cabecera del dropdown */}
            <div style={{
              padding: '0.6rem 1rem', fontSize: '0.75rem', color: '#94a3b8',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)', letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
            </div>

            {resultados.map((t, idx) => (
              <div
                key={t.id_terreno}
                onMouseDown={() => seleccionarTerreno(t)}
                style={{
                  padding: '0.85rem 1.1rem',
                  borderBottom: idx < resultados.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  cursor: 'pointer', display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto', gap: '0.75rem', alignItems: 'center',
                  transition: 'background 0.15s'
                }}
                className="hover-bg-light"
              >
                {/* Ícono */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(14,165,233,0.12)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <MapPin size={16} style={{ color: 'var(--primary-light)' }} />
                </div>

                {/* Info principal */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--primary-light)', fontSize: '0.9rem' }}>
                      {t.clave_catastral}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {t.sector}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                    <User size={11} style={{ display: 'inline', marginRight: '0.3rem' }} />
                    {t.nombre_titular} · {t.cedula_titular}
                  </div>
                </div>

                {/* Área */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#94a3b8' }}>
                    {Number(t.area_total).toLocaleString('es-EC')} m²
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tarjeta de Terreno Seleccionado — se oculta mientras el dropdown está activo */}
      {terrenoSeleccionado && resultados.length === 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 className="text-primary" style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            Datos del Terreno y Propietarios
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <p className="text-muted" style={{ marginBottom: '0.5rem' }}>Información del Predio</p>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                <p><strong>Clave Catastral:</strong> <span className="text-blue">{terrenoSeleccionado.clave_catastral}</span></p>
                <p><strong>Sector:</strong> {terrenoSeleccionado.sector}</p>
                <p><strong>Área Total:</strong> {terrenoSeleccionado.area_total} m²</p>
              </div>
            </div>
            <div>
              <p className="text-muted" style={{ marginBottom: '0.5rem' }}>Propietarios</p>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                <p><strong className="text-yellow">Titular Principal:</strong> {terrenoSeleccionado.nombre_titular} ({terrenoSeleccionado.cedula_titular})</p>
                {terrenoSeleccionado.copropietarios?.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Copropietarios:</strong>
                    <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                      {terrenoSeleccionado.copropietarios.map(cp => (
                        <li key={cp.cedula} style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{cp.nombre} ({cp.cedula})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de multas pendientes */}
      {terrenoSeleccionado && resultados.length === 0 && multasPendientes.length > 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <AlertTriangle size={22} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: 0, color: '#ef4444' }}>Pago de agua bloqueado — {multasPendientes.length} multa{multasPendientes.length > 1 ? 's' : ''} pendiente{multasPendientes.length > 1 ? 's' : ''}</h4>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                Deben cancelarse al 100% antes de poder pagar planillas de agua.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {multasPendientes.map(m => (
              <div key={m.id_deuda} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.6rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-main)' }}>{m.motivo}</span>
                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>${m.monto.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
            Para cobrar las multas diríjase a <strong>Ventanilla de Cobro</strong>.
          </p>
        </div>
      )}

      {/* Consultar Mes */}
      {terrenoSeleccionado && resultados.length === 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Consultar y Pagar Mes Específico</h3>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} className="text-muted" />
              <select className="input-field" value={mesSeleccionado} onChange={e => setMesSeleccionado(e.target.value)} style={{ width: '150px' }}>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="number" className="input-field" value={anioSeleccionado} onChange={e => setAnioSeleccionado(e.target.value)} style={{ width: '100px' }} />
            </div>
            <button className="btn-primary" onClick={() => consultarMes(terrenoSeleccionado.id_terreno)} disabled={cargandoPlanillas} style={{ width: 'auto' }}>
              {cargandoPlanillas ? 'Consultando...' : 'Consultar / Generar Cobro'}
            </button>
          </div>

          {planillaConsultada && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

              {/* Desglose del cálculo */}
              <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem 2rem' }}>
                  <div>
                    <span className="text-muted">Predio (clave catastral)</span>
                    <p style={{ margin: '0.15rem 0 0 0', fontWeight: '600', color: 'var(--primary-light)' }}>
                      {planillaConsultada.clave_catastral || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted">Área registrada</span>
                    <p style={{ margin: '0.15rem 0 0 0', fontWeight: '600' }}>
                      {planillaConsultada.area_total?.toLocaleString('es-EC')} m²
                    </p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span className="text-muted">Cálculo de la cuota</span>
                    <p style={{ margin: '0.15rem 0 0 0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      ⌈{planillaConsultada.area_total?.toLocaleString('es-EC')} m² ÷ {planillaConsultada.metros_base?.toLocaleString('es-EC')} m²⌉
                      {' = '}
                      <strong>{planillaConsultada.fracciones} fracción{planillaConsultada.fracciones !== 1 ? 'es' : ''}</strong>
                      {' × $'}{planillaConsultada.tarifa_fraccion?.toFixed(2)}
                      {' = '}
                      <strong style={{ color: 'var(--primary-light)' }}>${planillaConsultada.total_pagar}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Estado y acción */}
              <div style={{
                background: planillaConsultada.estado_pago === 'Pagada' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${planillaConsultada.estado_pago === 'Pagada' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                padding: '1.25rem 1.5rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: planillaConsultada.estado_pago === 'Pagada' ? 'var(--primary-light)' : '#ef4444', margin: 0 }}>
                    {planillaConsultada.estado_pago === 'Pagada' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    Estado: {planillaConsultada.estado_pago === 'Pagada' ? 'Pagado - Sin Deuda' : 'En Deuda'}
                  </h4>
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    Mes de Consumo: <strong>{planillaConsultada.mes_fiscal} / {planillaConsultada.anio_fiscal}</strong>
                  </p>
                  {planillaConsultada.estado_pago === 'Pagada' && planillaConsultada.numero_comprobante && (
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem' }} className="text-muted">
                      Factura N°: {planillaConsultada.numero_comprobante} &nbsp;·&nbsp;
                      Pagado: {planillaConsultada.fecha_pago ? planillaConsultada.fecha_pago.substring(0,10) : 'N/A'}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>${planillaConsultada.total_pagar}</span>
                  {planillaConsultada.estado_pago === 'Pendiente' && (
                    <button
                      className="btn-primary"
                      style={{ padding: '0.5rem 1.5rem', width: 'auto', background: multasPendientes.length > 0 ? '#4b5563' : undefined, cursor: multasPendientes.length > 0 ? 'not-allowed' : 'pointer', opacity: multasPendientes.length > 0 ? 0.6 : 1 }}
                      onClick={() => intentarPagar(planillaConsultada)}
                      title={multasPendientes.length > 0 ? 'Primero cancele las multas pendientes' : ''}
                    >
                      {multasPendientes.length > 0 ? '🔒 Pago Bloqueado' : 'Pagar Ahora'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Modal de Pago */}
      {planillaAPagar && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="glass-card animate-fade-in" style={{ padding: '2rem', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '1rem' }}>Legalizar Pago</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              Está a punto de registrar el pago del mes <strong>{planillaAPagar.mes_fiscal}/{planillaAPagar.anio_fiscal}</strong> por un valor de <strong>${planillaAPagar.total_pagar}</strong>.
            </p>
            <form onSubmit={procesarPago}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <FileText size={16} className="text-blue" /> Número de Factura / Comprobante *
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ej: FAC-001-2026" 
                  required 
                  value={comprobante}
                  onChange={e => setComprobante(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Calendar size={16} className="text-muted" /> Fecha de Pago
                </label>
                <input type="text" className="input-field" disabled value={new Date().toLocaleDateString('es-EC')} />
                <small className="text-muted">La fecha se guarda automáticamente en el sistema.</small>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" style={{ width: 'auto' }} onClick={() => { setPlanillaAPagar(null); setComprobante(''); }}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={pagando}>
                  {pagando ? 'Procesando...' : 'Confirmar Pago'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
