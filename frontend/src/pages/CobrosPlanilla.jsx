import React, { useState, useEffect } from 'react';
import { Search, MapPin, User, CheckCircle, AlertCircle, FileText, Calendar } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import axios from '../services/axiosConfig';

export default function PagoAgua() {
  const [criterio, setCriterio] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  
  const [terrenoSeleccionado, setTerrenoSeleccionado] = useState(null);
  
  // Consulta proactiva
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  const [planillaConsultada, setPlanillaConsultada] = useState(null);
  const [cargandoPlanillas, setCargandoPlanillas] = useState(false);

  // Modal / Form de Pago
  const [planillaAPagar, setPlanillaAPagar] = useState(null);
  const [comprobante, setComprobante] = useState('');
  const [pagando, setPagando] = useState(false);

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
    setPlanillaConsultada(null); // Reset
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

  const procesarPago = async (e) => {
    e.preventDefault();
    if (!comprobante) return toast.warning("El número de comprobante es obligatorio");
    setPagando(true);
    try {
      await axios.post('/cobros/pagar-agua', {
        id_planilla: planillaAPagar.id_planilla,
        numero_comprobante: comprobante
      });
      toast.success('Pago procesado correctamente');
      setPlanillaAPagar(null);
      setComprobante('');
      consultarMes(terrenoSeleccionado.id_terreno); // Recargar la planilla actual
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setPagando(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toaster richColors />
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search className="text-blue" /> Pago de Agua
        </h1>
        <p className="text-muted">Busca por cédula, nombre o clave catastral para visualizar y cobrar deudas.</p>
      </div>

      {/* Buscador Universal */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', position: 'relative' }}>
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
            type="text" 
            className="input-field" 
            placeholder={
              criterio === 'cedula' ? 'Ingrese el Número de Cédula...' :
              criterio === 'nombre' ? 'Ingrese Nombres o Apellidos...' :
              criterio === 'clave' ? 'Ingrese la Clave Catastral...' :
              'Ingrese Cédula, Nombre o Clave...'
            }
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            style={{ flex: 1, fontSize: '1.1rem', padding: '1rem' }}
          />
          {buscando && <span className="text-muted">Buscando...</span>}
        </div>

        {/* Resultados del Autocompletado */}
        {resultados.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '0.5rem', maxHeight: '300px', overflowY: 'auto', marginTop: '0.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            {resultados.map(t => (
              <div 
                key={t.id_terreno} 
                onClick={() => seleccionarTerreno(t)}
                style={{ 
                  padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', 
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.2rem' 
                }}
                className="hover-bg-light"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong className="text-blue"><MapPin size={14}/> Clave: {t.clave_catastral}</strong>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>{t.area_total} m² - {t.sector}</span>
                </div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  <User size={14} className="text-yellow" /> Titular: {t.nombre_titular} ({t.cedula_titular})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tarjeta de Terreno Seleccionado */}
      {terrenoSeleccionado && (
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

      {/* Historial de Meses */}
      {terrenoSeleccionado && (
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
            <div className="animate-fade-in" style={{ 
              background: planillaConsultada.estado_pago === 'Pagada' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
              border: `1px solid ${planillaConsultada.estado_pago === 'Pagada' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, 
              padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: planillaConsultada.estado_pago === 'Pagada' ? 'var(--primary-light)' : '#ef4444' }}>
                  {planillaConsultada.estado_pago === 'Pagada' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  Estado: {planillaConsultada.estado_pago === 'Pagada' ? 'Pagado - Sin Deuda' : 'En Deuda'}
                </h4>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: 'var(--text-main)' }}>
                  Mes de Consumo: <strong>{planillaConsultada.mes_fiscal} / {planillaConsultada.anio_fiscal}</strong>
                </p>
                {planillaConsultada.estado_pago === 'Pagada' && planillaConsultada.numero_comprobante && (
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem' }} className="text-muted">
                    Factura N°: {planillaConsultada.numero_comprobante} <br/>
                    Fecha de Pago: {planillaConsultada.fecha_pago ? planillaConsultada.fecha_pago.substring(0,10) : 'N/A'}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${planillaConsultada.total_pagar}</span>
                {planillaConsultada.estado_pago === 'Pendiente' && (
                  <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', width: 'auto' }} onClick={() => setPlanillaAPagar(planillaConsultada)}>
                    Pagar Ahora
                  </button>
                )}
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
