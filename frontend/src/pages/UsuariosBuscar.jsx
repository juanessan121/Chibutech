import { useEffect, useState } from 'react';
import { getUsers } from '../services/userService';
import { Search, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UsuariosBuscar() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Solo cargamos la data base para poder filtrar en memoria por ahora
    getUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cedula.includes(searchTerm)
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/usuarios')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search className="text-blue" /> Buscar Usuario
          </h1>
          <p className="text-muted">Busca por cédula, nombre o apellido.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div className="input-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Search className="input-icon" size={24} style={{ left: '1.5rem' }} />
          <input 
            type="text" 
            className="input-field" 
            style={{ padding: '1.5rem 1.5rem 1.5rem 4rem', fontSize: '1.25rem', borderRadius: '1rem' }}
            placeholder="Escribe la cédula o nombre..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHasSearched(e.target.value.length > 0);
            }}
          />
        </div>
      </div>

      {hasSearched && (
        <div className="glass-card table-container animate-fade-in">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre Completo</th>
                  <th>Sector</th>
                  <th>Rol</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="fw-500">{user.cedula}</td>
                      <td>{user.nombre}</td>
                      <td>{user.sector}</td>
                      <td>
                        <span className={`role-badge role-${user.rol.toLowerCase()}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td>
                        {user.estado === 'Activo' ? (
                          <span className="status-badge success"><CheckCircle size={14} /> Activo</span>
                        ) : (
                          <span className="status-badge error"><XCircle size={14} /> Suspendido</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted" style={{ padding: '3rem' }}>
                      No se encontró a nadie con "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
