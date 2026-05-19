import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import { mockPersonas } from '../data/personas';

const Personas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Cédula', accessor: 'cedula' },
    { header: 'Nombres', accessor: 'nombres' },
    { header: 'Apellidos', accessor: 'apellidos' },
    { header: 'Zona', accessor: 'zona' },
    { header: 'Teléfono', accessor: 'telefono' },
    { header: 'Condición', accessor: 'condicion_especial' }
  ];

  const filteredData = mockPersonas.filter(p => 
    p.nombres.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cedula.includes(searchTerm)
  );

  return (
    <>
      <div className="page-header">
        <h1>Gestión de Personas</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Nueva Persona
          </button>
        </div>
      </div>

      <div className="content-card">
        <div className="content-header">
          <SearchBar placeholder="Buscar por cédula o nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Table columns={columns} data={filteredData} onEdit={(row) => console.log('Edit', row)} onDelete={(row) => console.log('Delete', row)} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar Persona">
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Cédula</label>
          <input type="text" className="search-input" placeholder="Ingrese cédula" />
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Nombres</label>
          <input type="text" className="search-input" placeholder="Nombres completos" />
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Apellidos</label>
          <input type="text" className="search-input" placeholder="Apellidos completos" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
          <button className="btn btn-primary">Guardar</button>
        </div>
      </Modal>
    </>
  );
};

export default Personas;
