import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../services/userService';
import { Users, Trash2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function UsuariosPadron() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
        toast.success('Usuario eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <Toaster richColors />
      
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/usuarios')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users className="text-purple" /> Padrón General
          </h1>
          <p className="text-muted">Listado completo de todos los miembros registrados.</p>
        </div>
        <span className="badge" style={{ margin: 0 }}>Total: {users.length}</span>
      </div>

      <div className="glass-card table-container">
        {isLoading ? (
          <div className="loading-state">
            <svg className="spinner" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p>Cargando padrón...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre Completo</th>
                  <th>Sector</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
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
                    <td className="actions-cell">
                      <button className="btn-icon text-red" onClick={() => handleDelete(user.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
