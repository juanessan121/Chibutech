import { useState, useEffect } from 'react';
import { Droplet, AlertTriangle, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import axios from '../services/axiosConfig';

export default function MisDeudas() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [deudas, setDeudas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDeudas = async () => {
      try {
        // Si id_persona ya está en sesión, lo usamos directamente
        // Si no (sesión antigua), obtenemos los datos del resumen del comunero
        if (user?.id_persona) {
          const res = await axios.get(`/cobros/deudas/${user.id_persona}`);
          setDeudas(res.data.data || []);
        } else {
          // Fallback: extraer deudas del endpoint resumen-comunero (usa token directamente)
          const res = await axios.get('/dashboard/resumen-comunero');
          setDeudas(res.data.data?.deudas_detalle?.map((d, i) => ({
            id_deuda: `D-${i}`,
            tipo: d.tipo,
            motivo: d.motivo,
            monto: d.monto,
            fecha_emision: '',
            compartido: false,
          })) || []);
        }
      } catch {
        setDeudas([]);
      } finally {
        setCargando(false);
      }
    };
    cargarDeudas();
  }, [user?.id_persona]);

  const pendientes = deudas.filter(d => !d.pagada);
  const totalPendiente = pendientes.reduce((acc, d) => acc + d.monto, 0);
  const multas   = pendientes.filter(d => d.tipo === 'Multa');
  const planillas = pendientes.filter(d => d.tipo === 'Planilla');

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Inicio
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Droplet className="text-blue" /> Mi Estado de Cuenta
          </h1>
          <p className="text-muted">Revisa tus deudas pendientes y tu historial con la Junta de Agua.</p>
        </div>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Cargando...</div>
      ) : (
        <>
          {/* Resumen */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: totalPendiente > 0 ? 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(185,28,28,0.05))' : 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))', border: `1px solid ${totalPendiente > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
              {totalPendiente > 0
                ? <AlertTriangle size={36} className="text-red" style={{ marginBottom: '1rem' }} />
                : <CheckCircle size={36} style={{ color: '#10b981', marginBottom: '1rem' }} />
              }
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>Total Pendiente</h2>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: totalPendiente > 0 ? 'var(--red)' : '#10b981', margin: '0.5rem 0 0 0' }}>
                ${totalPendiente.toFixed(2)}
              </p>
              {totalPendiente > 0
                ? <span className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>Acércate a la tesorería para cancelar.</span>
                : <span style={{ fontSize: '0.85rem', marginTop: '0.5rem', display: 'block', color: '#10b981' }}>¡Estás al día!</span>
              }
            </div>

            {multas.length > 0 && (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>Multas Pendientes</h2>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>{multas.length}</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#ef4444', fontSize: '1.2rem', fontWeight: '600' }}>
                  ${multas.reduce((a, m) => a + m.monto, 0).toFixed(2)}
                </p>
              </div>
            )}

            {planillas.length > 0 && (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.15)' }}>
                <h2 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>Planillas de Agua</h2>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0ea5e9', margin: 0 }}>{planillas.length}</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#0ea5e9', fontSize: '1.2rem', fontWeight: '600' }}>
                  ${planillas.reduce((a, p) => a + p.monto, 0).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Tabla */}
          {deudas.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#10b981' }}>
              <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.7 }} />
              <h3 style={{ margin: 0 }}>No tienes deudas pendientes</h3>
              <p className="text-muted" style={{ marginTop: '0.5rem' }}>Tu cuenta está al día con la Junta de Agua.</p>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Detalle de Obligaciones</h3>
              <div className="table-container glass-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Concepto / Motivo</th>
                      <th>Fecha Emisión</th>
                      <th style={{ textAlign: 'right' }}>Monto ($)</th>
                      <th style={{ textAlign: 'center' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deudas.map(d => (
                      <tr key={d.id_deuda}>
                        <td>
                          <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: d.tipo === 'Multa' ? 'rgba(239,68,68,0.15)' : 'rgba(14,165,233,0.15)', color: d.tipo === 'Multa' ? '#ef4444' : '#0ea5e9', fontWeight: '600' }}>
                            {d.tipo}
                          </span>
                          {d.compartido && (
                            <span style={{ fontSize: '0.65rem', marginLeft: '0.3rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>Compartido</span>
                          )}
                        </td>
                        <td style={{ fontWeight: '500' }}>{d.motivo}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{d.fecha_emision}</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#ef4444' }}>
                          ${d.monto.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <Clock size={13} /> Pendiente
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
                Para cancelar tus deudas acércate a la tesorería de la Junta de Agua.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}
