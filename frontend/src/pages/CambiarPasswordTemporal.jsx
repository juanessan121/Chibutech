import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Droplet, LogOut } from 'lucide-react';
import { cambiarPasswordTemporal } from '../services/authService';
import useAuthStore from '../store/useAuthStore';
import { Toaster, toast } from 'sonner';

export default function CambiarPasswordTemporal() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearPasswordTemporal = useAuthStore((state) => state.clearPasswordTemporal);
  const logout = useAuthStore((state) => state.logout);

  const [passNew, setPassNew] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [touched, setTouched] = useState({ passNew: false, passConfirm: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ passNew: true, passConfirm: true });

    if (!passNew || passNew.length < 6) return;
    if (passNew !== passConfirm) return;

    setIsLoading(true);
    try {
      await cambiarPasswordTemporal(passNew, passConfirm);
      clearPasswordTemporal();
      toast.success('¡Contraseña actualizada exitosamente!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="login-container"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
    >
      <Toaster richColors position="top-right" />

      <button
        onClick={handleLogout}
        className="btn-secondary-outline"
        style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}
      >
        <LogOut size={18} /> Cerrar sesión
      </button>

      <div className="login-content animate-fade-in" style={{ maxWidth: '480px' }}>
        <div className="login-header">
          <div className="logo-container">
            <Droplet size={40} className="logo-icon" />
          </div>
          <h1>Chibutech ERP</h1>
          <p>Establece tu nueva contraseña</p>
        </div>

        <div className="glass-card login-form">
          {/* Banner informativo */}
          <div style={{
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.35)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}>
            <ShieldCheck size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ color: '#fcd34d', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                Contraseña temporal activa
              </p>
              <p style={{ color: '#f59e0b', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Hola <strong>{user?.nombre_completo || user?.username}</strong>, ingresaste con una contraseña temporal. Por seguridad, debes establecer una nueva contraseña antes de continuar.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} noValidate>
            <div className="input-group">
              <label className="input-label">Nueva contraseña *</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type="password"
                  className="input-field"
                  placeholder="Mínimo 6 caracteres"
                  value={passNew}
                  onChange={(e) => setPassNew(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, passNew: true }))}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                {touched.passNew && !passNew && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>La nueva contraseña es obligatoria.</span>
                )}
                {touched.passNew && passNew && passNew.length < 6 && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Debe tener al menos 6 caracteres.</span>
                )}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Confirmar nueva contraseña *</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type="password"
                  className="input-field"
                  placeholder="Repite la contraseña"
                  value={passConfirm}
                  onChange={(e) => setPassConfirm(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, passConfirm: true }))}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                {touched.passConfirm && !passConfirm && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Confirma tu nueva contraseña.</span>
                )}
                {touched.passConfirm && passConfirm && passNew !== passConfirm && (
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Las contraseñas no coinciden.</span>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
              {isLoading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> Guardar nueva contraseña
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
