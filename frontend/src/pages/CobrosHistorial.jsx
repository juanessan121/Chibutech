import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowLeft, ArrowUpRight, ArrowDownRight, Search, FileText, Wallet } from 'lucide-react';

export default function CobrosHistorial() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Simulación de la tabla Caja_Comunitaria
  const transacciones = [
    { id: 1, fecha: '2026-05-18', tipo: 'Ingreso', concepto: 'Multa Inasistencia Minga - Juan Pérez', monto: 10.00, comprobante: 'REC-001' },
    { id: 2, fecha: '2026-05-18', tipo: 'Egreso', concepto: 'Compra de pegamento PVC', monto: 4.50, comprobante: 'FAC-889' },
    { id: 3, fecha: '2026-05-19', tipo: 'Ingreso', concepto: 'Multa Daño Tubería - María Guamán', monto: 25.00, comprobante: 'REC-002' },
    { id: 4, fecha: '2026-05-19', tipo: 'Ingreso', concepto: 'Multa Inasistencia Minga - Luis Sisa', monto: 15.00, comprobante: 'REC-003' },
  ];

  const filtradas = transacciones.filter(t => 
    t.concepto.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.fecha.includes(searchTerm)
  );

  const totalIngresos = transacciones.filter(t => t.tipo === 'Ingreso').reduce((acc, curr) => acc + curr.monto, 0);
  const totalEgresos = transacciones.filter(t => t.tipo === 'Egreso').reduce((acc, curr) => acc + curr.monto, 0);
  const saldoActual = totalIngresos - totalEgresos;

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/cobros')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BarChart3 className="text-purple" /> Arqueo y Libro Diario
          </h1>
          <p className="text-muted">Visualice el flujo de efectivo, ingresos, egresos y el balance actual.</p>
        </div>
      </div>

      {/* DASHBOARD DE RESUMEN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card hover-glow" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid var(--green)' }}>
          <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ArrowUpRight size={18} className="text-green"/> Total Ingresos</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--green)' }}>${totalIngresos.toFixed(2)}</span>
        </div>
        <div className="glass-card hover-glow" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid var(--red)' }}>
          <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ArrowDownRight size={18} className="text-red"/> Total Egresos</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--red)' }}>${totalEgresos.toFixed(2)}</span>
        </div>
        <div className="glass-card hover-glow" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid var(--blue)' }}>
          <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wallet size={18} className="text-blue"/> Saldo / Caja Fuerte</span>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>${saldoActual.toFixed(2)}</span>
        </div>
      </div>

      {/* FILTROS */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
        <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem', width: '100%', maxWidth: '400px' }}>
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Buscar concepto o fecha (Ej. 2026-05)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', width: '100%', outline: 'none', marginLeft: '0.5rem' }}
          />
        </div>
      </div>

      {/* TABLA DE TRANSACCIONES */}
      <div className="table-container glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Comprobante</th>
              <th>Concepto / Descripción</th>
              <th style={{ textAlign: 'center' }}>Tipo</th>
              <th style={{ textAlign: 'right' }}>Monto ($)</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length > 0 ? (
              filtradas.map(t => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{t.fecha}</td>
                  <td><span className="badge badge-directive" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{t.comprobante || 'S/N'}</span></td>
                  <td style={{ fontWeight: '500' }}>{t.concepto}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: t.tipo === 'Ingreso' ? 'var(--green)' : 'var(--red)', background: t.tipo === 'Ingreso' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '0.3rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {t.tipo === 'Ingreso' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {t.tipo}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: t.tipo === 'Ingreso' ? 'var(--green)' : 'var(--text-main)' }}>
                    {t.tipo === 'Ingreso' ? '+' : '-'}${t.monto.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                  No se encontraron transacciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
