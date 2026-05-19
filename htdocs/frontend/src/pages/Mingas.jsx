import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import { mockMingas } from '../data/mingas';

const Mingas = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Fecha', accessor: 'fecha' },
    { 
      header: 'Estado', 
      accessor: 'estado',
      render: (row) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '0.8rem',
          backgroundColor: row.estado === 'Completada' ? 'rgba(34, 197, 94, 0.2)' : 
                          row.estado === 'Programada' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(250, 204, 21, 0.2)',
          color: row.estado === 'Completada' ? 'var(--green)' : 
                 row.estado === 'Programada' ? 'var(--turquoise)' : 'var(--yellow)'
        }}>
          {row.estado}
        </span>
      )
    },
    { header: 'Asist. Esperados', accessor: 'asistentes_esperados' },
    { header: 'Asist. Reales', accessor: 'asistentes_reales' },
    { 
      header: 'Faltas', 
      accessor: 'faltas',
      render: (row) => row.faltas ? <span style={{ color: 'var(--red)' }}>{row.faltas}</span> : '-'
    }
  ];

  const filteredData = mockMingas.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h1>Gestión de Mingas</h1>
        <div className="page-actions">
          <button className="btn btn-primary">
            <Plus size={18} />
            Programar Minga
          </button>
        </div>
      </div>

      <div className="content-card">
        <div className="content-header">
          <SearchBar placeholder="Buscar minga..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Table columns={columns} data={filteredData} onEdit={() => {}} />
      </div>
    </>
  );
};

export default Mingas;
