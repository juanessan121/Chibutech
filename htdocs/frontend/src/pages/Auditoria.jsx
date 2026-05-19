import React from 'react';
import Table from '../components/Table';
import { mockAuditoria } from '../data/auditoria';

const Auditoria = () => {
  const columns = [
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Usuario', accessor: 'usuario' },
    { header: 'Acción', accessor: 'accion' },
    { 
      header: 'Tabla Afectada', 
      accessor: 'tabla_afectada',
      render: (row) => <span style={{ color: 'var(--turquoise)' }}>{row.tabla_afectada}</span>
    }
  ];

  return (
    <>
      <div className="page-header">
        <h1>Auditoría del Sistema</h1>
      </div>

      <div className="content-card">
        <div className="content-header">
          <p style={{ color: 'var(--text-muted)' }}>Registro de las últimas acciones realizadas en el sistema.</p>
        </div>
        <Table columns={columns} data={mockAuditoria} />
      </div>
    </>
  );
};

export default Auditoria;
