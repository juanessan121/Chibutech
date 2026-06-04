import React from 'react';
import { Droplet, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function MisDeudas() {
  // Simulación de los datos del agricultor logueado
  const multasPropias = [
    { id: 1, motivo: 'Inasistencia a Minga - Mantenimiento Tubería', fecha: '2026-05-10', monto: 15.00, estado: 'Pendiente' },
    { id: 2, motivo: 'Desperdicio de agua (Sector San Luis)', fecha: '2026-04-22', monto: 10.00, estado: 'Pendiente' },
    { id: 3, motivo: 'Cuota Mensual (Enero - Marzo)', fecha: '2026-03-01', monto: 9.00, estado: 'Pagada', fecha_pago: '2026-03-05' }
  ];

  const totalPendiente = multasPropias
    .filter(m => m.estado === 'Pendiente')
    .reduce((acc, curr) => acc + curr.monto, 0);

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Droplet className="text-blue" /> Mi Estado de Cuenta
          </h1>
          <p className="text-muted">Revisa tus multas pendientes y tu historial de pagos con la Junta de Agua.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <AlertTriangle size={36} className="text-red" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>Total Pendiente a Pagar</h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--red)', margin: '0.5rem 0 0 0' }}>${totalPendiente.toFixed(2)}</p>
          <span className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Acércate a la tesorería para cancelar tu deuda.</span>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Detalle de Multas y Cobros</h3>
      <div className="table-container glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha de Emisión</th>
              <th>Concepto / Motivo</th>
              <th style={{ textAlign: 'right' }}>Monto ($)</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {multasPropias.map((multa) => (
              <tr key={multa.id}>
                <td style={{ color: 'var(--text-muted)' }}>{multa.fecha}</td>
                <td style={{ fontWeight: '500' }}>{multa.motivo}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', color: multa.estado === 'Pendiente' ? 'var(--red)' : 'var(--text-main)' }}>
                  ${multa.monto.toFixed(2)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {multa.estado === 'Pendiente' ? (
                    <span className="badge badge-user" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> Pendiente
                    </span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span className="badge badge-directive" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(16,185,129,0.1)', color: 'var(--green)' }}>
                        <CheckCircle size={14} /> Pagada
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>El {multa.fecha_pago}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
