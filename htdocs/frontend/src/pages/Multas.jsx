import React, { useState } from 'react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import { mockMultas } from '../data/multas';

const Multas = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Persona', accessor: 'persona' },
    { header: 'Motivo', accessor: 'motivo' },
    { 
      header: 'Monto', 
      accessor: 'monto',
      render: (row) => `$${row.monto.toFixed(2)}`
    },
    { header: 'Fecha Emisión', accessor: 'fecha_emision' },
    { 
      header: 'Estado', 
      accessor: 'estado_pago',
      render: (row) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '0.8rem',
          backgroundColor: row.estado_pago === 'Pagado' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 42, 42, 0.2)',
          color: row.estado_pago === 'Pagado' ? 'var(--green)' : 'var(--red)'
        }}>
          {row.estado_pago}
        </span>
      )
    }
  ];

  const filteredData = mockMultas.filter(m => 
    m.persona.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h1>Gestión de Multas</h1>
      </div>

      <div className="content-card">
        <div className="content-header">
          <SearchBar placeholder="Buscar por persona o motivo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Table columns={columns} data={filteredData} onEdit={() => {}} />
      </div>
    </>
  );
};

export default Multas;
