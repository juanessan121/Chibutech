import { useState, useEffect } from 'react';
import { Search, MapPin, User, CheckCircle, AlertCircle, FileText, AlertTriangle, ArrowLeft, Zap, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../services/axiosConfig';

const MESES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const TIPOS_PERIODO = [
  { id: '1',      label: '1 mes'          },
  { id: '3',      label: 'Trimestral'     },
  { id: '6',      label: 'Semestral'      },
  { id: '12',     label: 'Anual'          },
  { id: 'custom', label: 'Personalizado'  },
];

function calcularPeriodos(mesInicio, anioInicio, cantidad) {
  const periodos = [];
  for (let i = 0; i < cantidad; i++) {
    const total = mesInicio - 1 + i;
    periodos.push({ mes: (total % 12) + 1, anio: anioInicio + Math.floor(total / 12) });
  }
  return periodos;
}

function calcularPeriodosCustom(mesInicio, anioInicio, mesFin, anioFin) {
  const periodos = [];
  let mes = mesInicio, anio = anioInicio;
  while (anio < anioFin || (anio === anioFin && mes <= mesFin)) {
    periodos.push({ mes, anio });
    mes++;
    if (mes > 12) { mes = 1; anio++; }
    if (periodos.length > 36) break;
  }
  return periodos;
}

export default function PagoAgua() {
  const navigate = useNavigate();

  // ── Búsqueda ──────────────────────────────────────────────────────────────
  const [criterio, setCriterio]               = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados]           = useState([]);
  const [buscando, setBuscando]               = useState(false);
  const [terrenoSeleccionado, setTerrenoSeleccionado] = useState(null);
  const [multasPendientes, setMultasPendientes]       = useState([]);

  // ── Selector de período ───────────────────────────────────────────────────
  const hoy = new Date();
  const [tipoPeriodo, setTipoPeriodo]   = useState('1');
  const [mesInicio, setMesInicio]       = useState(hoy.getMonth() + 1);
  const [anioInicio, setAnioInicio]     = useState(hoy.getFullYear());
  const [mesFin, setMesFin]             = useState(hoy.getMonth() + 1);
  const [anioFin, setAnioFin]           = useState(hoy.getFullYear());

  // ── Resultados del período ────────────────────────────────────────────────
  const [datosPeriodo, setDatosPeriodo]     = useState(null);
  const [cargandoPeriodo, setCargandoPeriodo] = useState(false);
  const [comprobante, setComprobante]       = useState('');
  const [comprobanteTouched, setComprobanteTouched] = useState(false);
  const [pagando, setPagando]               = useState(false);

  // ── Admin: generación manual ──────────────────────────────────────────────
  const [mesAdmin, setMesAdmin]           = useState(hoy.getMonth() + 1);
  const [anioAdmin, setAnioAdmin]         = useState(hoy.getFullYear());
  const [generando, setGenerando]         = useState(false);
  const [panelAdmin, setPanelAdmin]       = useState(false);

  // Limpiar campo al cambiar criterio
  useEffect(() => { setTerminoBusqueda(''); setResultados([]); }, [criterio]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (terminoBusqueda.length >= 3) buscarUniversal();
      else setResultados([]);
    }, 500);
    return () => clearTimeout(t);
  }, [terminoBusqueda, criterio]);

  const filtrarInput = (v) => {
    if (criterio === 'cedula') return v.replace(/\D/g, '').slice(0, 10);
    if (criterio === 'nombre') return v.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/gu, '');
    if (criterio === 'clave')  return v.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
    return v;
  };

  const handleKeyDown = (e) => {
    const nav = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Enter','Home','End'];
    if (nav.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (criterio === 'cedula' && !/^\d$/.test(e.key))                              { e.preventDefault(); return; }
    if (criterio === 'nombre' && !/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]$/u.test(e.key))      { e.preventDefault(); return; }
    if (criterio === 'clave'  && !/^[a-zA-Z0-9-]$/.test(e.key))                   { e.preventDefault(); return; }
  };

  const buscarUniversal = async () => {
    setBuscando(true);
    try {
      const res = await axios.get(`/terrenos/buscar-universal?termino=${terminoBusqueda}&criterio=${criterio}`);
      setResultados(res.data.data);
    } catch { /* silencio */ } finally { setBuscando(false); }
  };

  const seleccionarTerreno = async (t) => {
    setTerrenoSeleccionado(t);
    setTerminoBusqueda('');
    setResultados([]);
    setDatosPeriodo(null);
    setMultasPendientes([]);
    try {
      const res = await axios.get(`/cobros/deudas/${t.id_titular}`);
      const multas = (res.data.data || []).filter(d => d.tipo === 'Multa');
      setMultasPendientes(multas);
      if (multas.length > 0)
        toast.warning(`${multas.length} multa(s) pendiente(s). Debe cancelarlas antes de pagar el agua.`);
    } catch { setMultasPendientes([]); }
  };

  const consultarPeriodo = async () => {
    if (!terrenoSeleccionado) return;
    let periodos = [];
    if (tipoPeriodo === 'custom') {
      periodos = calcularPeriodosCustom(mesInicio, anioInicio, mesFin, anioFin);
    } else {
      periodos = calcularPeriodos(mesInicio, anioInicio, parseInt(tipoPeriodo));
    }
    if (periodos.length === 0) return toast.error('El rango de fechas seleccionado no es válido. Verifica que el inicio sea anterior al fin.');

    setCargandoPeriodo(true);
    setDatosPeriodo(null);
    try {
      const res = await axios.post(`/cobros/terreno/${terrenoSeleccionado.id_terreno}/periodo`, { periodos });
      setDatosPeriodo(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo consultar el período seleccionado. Intenta de nuevo.');
    } finally { setCargandoPeriodo(false); }
  };

  const procesarPago = async (e) => {
    e.preventDefault();
    if (!comprobante) return toast.warning('Ingrese el número de comprobante antes de registrar el pago.');
    if (multasPendientes.length > 0) return toast.error('No se puede registrar el pago del agua. Existen multas pendientes que deben cancelarse primero desde Ventanilla de Cobro.');
    if (!datosPeriodo?.ids_pendientes?.length) return toast.warning('No hay planillas pendientes de pago para el período seleccionado.');

    setPagando(true);
    try {
      const res = await axios.post('/cobros/pagar-periodo', {
        id_planillas: datosPeriodo.ids_pendientes,
        numero_comprobante: parseInt(comprobante),
      });
      toast.success(res.data.message);
      setComprobante('');
      // Refrescar el período
      const r2 = await axios.post(`/cobros/terreno/${terrenoSeleccionado.id_terreno}/periodo`, {
        periodos: datosPeriodo.meses.map(m => ({ mes: m.mes, anio: m.anio })),
      });
      setDatosPeriodo(r2.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo registrar el pago. Intenta de nuevo.');
    } finally { setPagando(false); }
  };

  const generarMesAdmin = async () => {
    setGenerando(true);
    try {
      const res = await axios.post('/cobros/planillas/auto-generar', { mes: mesAdmin, anio: anioAdmin });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudieron generar las planillas para el período indicado. Intenta de nuevo.');
    } finally { setGenerando(false); }
  };

  const hayPendientes = datosPeriodo?.ids_pendientes?.length > 0;

  return (
    <div className="animate-fade-in pb-10">

      {/* ── Encabezado ───────────────────────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/cobros')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search className="text-blue" /> Pago de Agua
          </h1>
          <p className="text-muted">Busca por cédula, nombre o clave catastral para visualizar y cobrar planillas.</p>
        </div>

        {/* Botón para mostrar panel admin */}
        <button
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', padding: '0.6rem 1.2rem' }}
          onClick={() => setPanelAdmin(v => !v)}
        >
          <Zap size={16} /> Generación Manual
        </button>
      </div>

      {/* ── Panel Admin: generación manual ───────────────────────────────── */}
      {panelAdmin && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.05)' }}>
          <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} className="text-blue" /> Generar planillas para todos los terrenos
          </h4>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            El sistema genera automáticamente el día 1 de cada mes. Usa esto si necesitas forzar la generación de un mes específico. Los terrenos que ya tienen planilla para ese mes no se duplican.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select className="input-field" value={mesAdmin} onChange={e => setMesAdmin(+e.target.value)} style={{ width: '160px' }}>
              {MESES_ES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
            </select>
            <input type="number" className="input-field" value={anioAdmin} onChange={e => setAnioAdmin(+e.target.value)} style={{ width: '100px' }} min="2020" max="2100" />
            <button className="btn-primary" style={{ width: 'auto' }} disabled={generando} onClick={generarMesAdmin}>
              {generando ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generando...</> : <><Zap size={16} /> Generar {MESES_ES[mesAdmin-1]} {anioAdmin}</>}
            </button>
          </div>
        </div>
      )}

      {/* ── Buscador ─────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Search className="text-muted" />
            <select className="input-field" value={criterio} onChange={e => setCriterio(e.target.value)}
              style={{ flex: '0 0 auto', width: 'auto', minWidth: '180px', padding: '1rem', fontSize: '1rem' }}>
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
                criterio === 'clave'  ? 'Ej: SEC-01-005' :
                'Cédula, nombre o clave catastral...'
              }
              value={terminoBusqueda}
              onKeyDown={handleKeyDown}
              onChange={e => setTerminoBusqueda(filtrarInput(e.target.value))}
              maxLength={criterio === 'cedula' ? 10 : undefined}
              style={{ flex: 1, fontSize: '1.1rem', padding: '1rem' }}
            />
            {buscando && <span className="text-muted">Buscando...</span>}
          </div>
        </div>

        {resultados.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
            background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.75rem', maxHeight: '340px', overflowY: 'auto', marginTop: '0.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)'
          }}>
            <div style={{ padding: '0.6rem 1rem', fontSize: '0.75rem', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
            </div>
            {resultados.map((t, idx) => (
              <div key={t.id_terreno} onMouseDown={() => seleccionarTerreno(t)}
                style={{ padding: '0.85rem 1.1rem', borderBottom: idx < resultados.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '0.75rem', alignItems: 'center' }}
                className="hover-bg-light">
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={16} style={{ color: 'var(--primary-light)' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--primary-light)', fontSize: '0.9rem' }}>{t.clave_catastral}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{t.sector}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                    <User size={11} style={{ display: 'inline', marginRight: '0.3rem' }} />
                    {t.nombre_titular} · {t.cedula_titular}
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#94a3b8' }}>{Number(t.area_total).toLocaleString('es-EC')} m²</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Tarjeta terreno seleccionado ─────────────────────────────────── */}
      {terrenoSeleccionado && resultados.length === 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} className="text-blue" />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--primary-light)' }}>{terrenoSeleccionado.clave_catastral}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{terrenoSeleccionado.sector} · {terrenoSeleccionado.area_total} m²</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Titular</div>
              <div style={{ fontWeight: '600' }}>{terrenoSeleccionado.nombre_titular}</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{terrenoSeleccionado.cedula_titular}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Alerta multas ────────────────────────────────────────────────── */}
      {terrenoSeleccionado && resultados.length === 0 && multasPendientes.length > 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
            <h4 style={{ margin: 0, color: '#ef4444' }}>Pago bloqueado — {multasPendientes.length} multa(s) pendiente(s)</h4>
          </div>
          {multasPendientes.map(m => (
            <div key={m.id_deuda} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.4rem', marginBottom: '0.35rem', fontSize: '0.88rem' }}>
              <span>{m.motivo}</span>
              <strong style={{ color: '#ef4444' }}>${m.monto.toFixed(2)}</strong>
            </div>
          ))}
          <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Cancélelas en <strong>Ventanilla de Cobro</strong> para poder pagar el agua.</p>
        </div>
      )}

      {/* ── Selector de período + consulta ───────────────────────────────── */}
      {terrenoSeleccionado && resultados.length === 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Seleccionar Período de Pago</h3>

          {/* Pills de tipo de período */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {TIPOS_PERIODO.map(tp => (
              <button key={tp.id} onClick={() => setTipoPeriodo(tp.id)}
                style={{
                  padding: '0.45rem 1rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
                  background: tipoPeriodo === tp.id ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                  color: tipoPeriodo === tp.id ? '#fff' : 'var(--text-muted)',
                  fontWeight: tipoPeriodo === tp.id ? '600' : '400',
                  fontSize: '0.85rem', transition: 'all 0.2s',
                }}>
                {tp.label}
              </button>
            ))}
          </div>

          {/* Controles de fecha */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                {tipoPeriodo === 'custom' ? 'Desde mes' : 'Mes de inicio'}
              </label>
              <select className="input-field" value={mesInicio} onChange={e => setMesInicio(+e.target.value)} style={{ width: '155px' }}>
                {MESES_ES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Año</label>
              <input type="number" className="input-field" value={anioInicio} onChange={e => setAnioInicio(+e.target.value)} style={{ width: '100px' }} min="2020" max="2100" />
            </div>

            {tipoPeriodo === 'custom' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Hasta mes</label>
                  <select className="input-field" value={mesFin} onChange={e => setMesFin(+e.target.value)} style={{ width: '155px' }}>
                    {MESES_ES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Año fin</label>
                  <input type="number" className="input-field" value={anioFin} onChange={e => setAnioFin(+e.target.value)} style={{ width: '100px' }} min="2020" max="2100" />
                </div>
              </>
            )}

            <button className="btn-primary" onClick={consultarPeriodo} disabled={cargandoPeriodo} style={{ width: 'auto', alignSelf: 'flex-end' }}>
              {cargandoPeriodo ? 'Consultando...' : 'Consultar período'}
            </button>
          </div>
        </div>
      )}

      {/* ── Tabla de meses del período ───────────────────────────────────── */}
      {datosPeriodo && resultados.length === 0 && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>

          {/* Info del predio */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
            <span>Predio: <strong className="text-blue">{datosPeriodo.clave_catastral}</strong></span>
            <span>Área: <strong>{datosPeriodo.area_total?.toLocaleString('es-EC')} m²</strong></span>
            <span style={{ fontFamily: 'monospace' }}>
              ⌈{datosPeriodo.area_total?.toLocaleString('es-EC')} ÷ {datosPeriodo.tarifa_fraccion && datosPeriodo.metros_base ? datosPeriodo.metros_base?.toLocaleString('es-EC') : '1000'}⌉ = <strong>{datosPeriodo.fracciones} fracción(es)</strong> × ${datosPeriodo.tarifa_fraccion?.toFixed(2)} = <strong>${(datosPeriodo.fracciones * datosPeriodo.tarifa_fraccion)?.toFixed(2)}/mes</strong>
            </span>
          </div>

          {/* Tabla de meses */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Mes</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Estado</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Monto</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Comprobante</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Fecha pago</th>
                </tr>
              </thead>
              <tbody>
                {datosPeriodo.meses.map((m, i) => {
                  const pagado = m.estado === 'Pagada';
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: pagado ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)' }}>
                      <td style={{ padding: '0.8rem 0.75rem', fontWeight: '600' }}>
                        {MESES_ES[m.mes - 1]} {m.anio}
                      </td>
                      <td style={{ padding: '0.8rem 0.75rem', textAlign: 'center' }}>
                        {pagado
                          ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.8rem', fontWeight: '600' }}><CheckCircle size={14} /> Pagado</span>
                          : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.8rem', fontWeight: '600' }}><AlertCircle size={14} /> Pendiente</span>}
                      </td>
                      <td style={{ padding: '0.8rem 0.75rem', textAlign: 'right', fontWeight: '600', color: pagado ? '#10b981' : '#ef4444' }}>
                        ${m.monto.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.8rem 0.75rem', textAlign: 'right', color: '#94a3b8', fontSize: '0.82rem' }}>
                        {m.comprobante || '—'}
                      </td>
                      <td style={{ padding: '0.8rem 0.75rem', textAlign: 'right', color: '#94a3b8', fontSize: '0.82rem' }}>
                        {m.fecha_pago || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                  <td colSpan={2} style={{ padding: '0.8rem 0.75rem', fontWeight: '700', fontSize: '0.9rem' }}>
                    {datosPeriodo.ids_pendientes?.length ?? 0} mes(es) pendiente(s)
                  </td>
                  <td style={{ padding: '0.8rem 0.75rem', textAlign: 'right', fontWeight: '700', fontSize: '1.15rem', color: hayPendientes ? '#ef4444' : '#10b981' }}>
                    ${datosPeriodo.total_pendiente?.toFixed(2)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Formulario de pago */}
          {hayPendientes && (
            <form onSubmit={procesarPago} style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                  <FileText size={14} /> N° Comprobante / Factura *
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Ej: 1001"
                  required
                  min="1"
                  value={comprobante}
                  onChange={e => setComprobante(e.target.value)}
                  onBlur={() => setComprobanteTouched(true)}
                  style={{ padding: '0.75rem 1rem' }}
                />
                {comprobanteTouched && !comprobante && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El N° de comprobante es obligatorio.</span>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={pagando || multasPendientes.length > 0}
                style={{
                  width: 'auto', padding: '0.75rem 2rem', alignSelf: 'flex-end',
                  background: multasPendientes.length > 0 ? '#4b5563' : undefined,
                  cursor: multasPendientes.length > 0 ? 'not-allowed' : 'pointer',
                  opacity: multasPendientes.length > 0 ? 0.6 : 1,
                }}
                title={multasPendientes.length > 0 ? 'Primero cancele las multas pendientes' : ''}
              >
                {pagando ? 'Procesando...' : multasPendientes.length > 0
                  ? '🔒 Pago Bloqueado'
                  : `Pagar ${datosPeriodo.ids_pendientes.length} mes(es) — $${datosPeriodo.total_pendiente?.toFixed(2)}`}
              </button>
            </form>
          )}

          {!hayPendientes && (
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <CheckCircle size={22} />
              <span style={{ fontWeight: '600' }}>Todo el período está al día. Sin deudas pendientes.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
