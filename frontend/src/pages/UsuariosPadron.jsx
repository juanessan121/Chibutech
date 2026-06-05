import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../services/userService';
import { Users, Trash2, CheckCircle, XCircle, ArrowLeft, Search, Edit2, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';

const ROLES = [
  'Usuario Regular',
  'Vocal Suplente 2',
  'Vocal Suplente 1',
  'Vocal Principal 3',
  'Vocal Principal 2',
  'Vocal Principal 1',
  'Tesorero',
  'Secretario',
  'Vicepresidente',
  'Presidente',
  'Administrador',
];

export default function UsuariosPadron() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [modalRol, setModalRol] = useState(null); // { id_persona, nombre, rol_actual }
  const [nuevoRol, setNuevoRol] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [guardandoRol, setGuardandoRol] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
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
      } catch {
        toast.error('Error al eliminar');
      }
    }
  };

  const abrirModalRol = (user) => {
    setModalRol({ id_persona: user.id_persona, nombre: user.nombre_completo, rol_actual: user.rol });
    setNuevoRol(user.rol);
    setNuevaPassword('');
  };

  const handleCambiarRol = async () => {
    if (!nuevoRol) return;
    setGuardandoRol(true);
    try {
      await api.post('/auth/cambiar-rol', {
        id_persona: modalRol.id_persona,
        rol: nuevoRol,
        password: nuevaPassword || undefined,
      });
      toast.success(`Rol actualizado a "${nuevoRol}" correctamente.`);
      setModalRol(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar el rol');
    } finally {
      setGuardandoRol(false);
    }
  };

  return (
    <div className="animate-fade-in">

      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/usuarios')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users className="text-purple" /> Padrón General
          </h1>
          <p className="text-muted">Listado completo y búsqueda de miembros registrados.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="search-bar" style={{ position: 'relative', width: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por cédula, nombre o sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.2rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}
            />
          </div>
          <span className="badge" style={{ margin: 0 }}>Total: {users.length}</span>
        </div>
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
                {users
                  .filter(u =>
                    (u.nombre_completo || `${u.nombre} ${u.apellido || ''}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.cedula.includes(searchTerm) ||
                    (u.sector || '').toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(user => (
                    <tr key={user.id}>
                      <td className="fw-500">{user.cedula}</td>
                      <td>{user.nombre_completo || `${user.nombre} ${user.apellido || ''}`}</td>
                      <td>{user.sector}</td>
                      <td>
                        <span className={`role-badge role-${(user.rol || 'comunero').toLowerCase().replace(/\s+/g, '-')}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td>
                        {user.estado === 'Activo' ? (
                          <span className="status-badge success"><CheckCircle size={14} /> Activo</span>
                        ) : user.estado === 'Pendiente' ? (
                          <span className="status-badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                            ⏳ Pendiente
                          </span>
                        ) : (
                          <span className="status-badge error"><XCircle size={14} /> Suspendido</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button className="btn-icon text-blue" onClick={() => navigate(`/dashboard/usuarios/editar/${user.id}`)} title="Editar datos"><Edit2 size={16} /></button>
                        <button className="btn-icon" style={{ color: '#a78bfa' }} onClick={() => abrirModalRol(user)} title="Cambiar rol / permisos"><ShieldCheck size={16} /></button>
                        <button className="btn-icon text-red" onClick={() => handleDelete(user.id)} title="Eliminar"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CAMBIAR ROL */}
      {modalRol && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} /> Cambiar Rol
              </h3>
              <button onClick={() => setModalRol(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Modificar permisos de <strong style={{ color: 'var(--text-main)' }}>{modalRol.nombre}</strong>
            </p>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Rol / Cargo en el sistema *</label>
              <select className="form-select" value={nuevoRol} onChange={e => setNuevoRol(e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem', display: 'block' }}>
                {nuevoRol === 'Administrador' || nuevoRol === 'Presidente'
                  ? '⚠️ Acceso total al sistema'
                  : nuevoRol === 'Usuario Regular'
                  ? 'Solo ve sus propios datos'
                  : 'Acceso según cargo directivo'}
              </span>
            </div>

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Nueva Contraseña <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(dejar vacío para no cambiar)</span></label>
              <input
                type="password"
                className="input-field"
                placeholder="Mín. 4 caracteres"
                value={nuevaPassword}
                onChange={e => setNuevaPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ width: 'auto' }} onClick={() => setModalRol(null)}>Cancelar</button>
              <button
                className="btn-primary"
                style={{ width: 'auto', background: '#a78bfa', color: '#fff' }}
                disabled={guardandoRol || nuevoRol === modalRol.rol_actual && !nuevaPassword}
                onClick={handleCambiarRol}
              >
                {guardandoRol ? 'Guardando...' : 'Confirmar Cambio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
