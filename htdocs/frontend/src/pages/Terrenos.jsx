import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import { mockTerrenos } from '../data/terrenos';

const Terrenos = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Clave Catastral', accessor: 'clave_catastral' },
    { header: 'Dueño', accessor: 'dueno' },
    { header: 'Área', accessor: 'area' },
    { 
      header: 'Estado Construcción', 
      accessor: 'estado_construccion',
      render: (row) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '0.8rem',
          backgroundColor: row.estado_construccion === 'Construido' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(250, 204, 21, 0.2)',
          color: row.estado_construccion === 'Construido' ? 'var(--green)' : 'var(--yellow)'
        }}>
          {row.estado_construccion}
        </span>
      )
    }
  ];

  const filteredData = mockTerrenos.filter(t => 
    t.dueno.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.clave_catastral.includes(searchTerm)
  );

  return (
    <>
      <div className="page-header">
        <h1>Gestión de Terrenos</h1>
        <div className="page-actions">
          <button className="btn btn-primary">
            <Plus size={18} />
            Registrar Terreno
          </button>
        </div>
      </div>

      <div className="content-card">
        <div className="content-header">
          <SearchBar placeholder="Buscar por dueño o clave..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Table columns={columns} data={filteredData} onEdit={() => {}} onDelete={() => {}} />
      </div>
    </>
  );
};

export default Terrenos;
