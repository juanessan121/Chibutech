import React from 'react';
import Table from '../components/Table';
import { mockDirectiva } from '../data/directiva';

const Directiva = () => {
  const columns = [
    { header: 'Cargo', accessor: 'cargo' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Período', accessor: 'periodo' },
    { 
      header: 'Estado', 
      accessor: 'estado',
      render: (row) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '0.8rem',
          backgroundColor: row.estado === 'Activo' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 42, 42, 0.2)',
          color: row.estado === 'Activo' ? 'var(--green)' : 'var(--red)'
        }}>
          {row.estado}
        </span>
      )
    }
  ];

  return (
    <>
      <div className="page-header">
        <h1>Directiva de la Comunidad</h1>
      </div>

      <div className="content-card">
        <Table columns={columns} data={mockDirectiva} onEdit={() => {}} />
      </div>
    </>
  );
};

export default Directiva;
