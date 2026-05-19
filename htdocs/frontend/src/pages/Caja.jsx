import React from 'react';
import Table from '../components/Table';
import { mockCaja, resumenCaja } from '../data/caja';

const Caja = () => {
  const columns = [
    { header: 'Fecha', accessor: 'fecha' },
    { 
      header: 'Tipo', 
      accessor: 'tipo',
      render: (row) => (
        <span style={{ 
          color: row.tipo === 'Ingreso' ? 'var(--green)' : 'var(--red)',
          fontWeight: '600'
        }}>
          {row.tipo}
        </span>
      )
    },
    { header: 'Concepto', accessor: 'concepto' },
    { 
      header: 'Monto', 
      accessor: 'monto',
      render: (row) => (
        <span style={{ color: row.monto > 0 ? 'var(--green)' : 'var(--red)' }}>
          {row.monto > 0 ? '+' : ''}${Math.abs(row.monto).toFixed(2)}
        </span>
      )
    },
    { 
      header: 'Balance', 
      accessor: 'balance',
      render: (row) => `$${row.balance.toFixed(2)}`
    }
  ];

  return (
    <>
      <div className="page-header">
        <h1>Caja Comunitaria</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="content-card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Ingresos Totales</h3>
          <h2 style={{ color: 'var(--green)', fontSize: '2.5rem' }}>${resumenCaja.ingresosTotales.toFixed(2)}</h2>
        </div>
        <div className="content-card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Egresos Totales</h3>
          <h2 style={{ color: 'var(--red)', fontSize: '2.5rem' }}>${resumenCaja.egresosTotales.toFixed(2)}</h2>
        </div>
        <div className="content-card" style={{ textAlign: 'center', borderColor: 'var(--turquoise)' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Balance Actual</h3>
          <h2 style={{ color: 'var(--turquoise)', fontSize: '2.5rem' }}>${resumenCaja.balanceActual.toFixed(2)}</h2>
        </div>
      </div>

      <div className="content-card">
        <div className="content-header">
          <h3>Historial Financiero</h3>
        </div>
        <Table columns={columns} data={mockCaja} />
      </div>
    </>
  );
};

export default Caja;
