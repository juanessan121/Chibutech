import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { login as authLogin } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { allowAlphanumeric } from '../utils/validators';
import { User, Lock, LogIn, Droplet, AlertCircle, ArrowLeft } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import loginBg from '../assets/login-bg.png';

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Nielsen 5: Error prevention
    if (!username.trim()) {
      setErrorMsg('Por favor, ingresa tu número de cédula.');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      // Nielsen 1: Visibility of system status (Loading indicator active)
      const data = await authLogin(username, password);
      
      // Save global state
      login(data.user, data.token);
      
      // Nielsen 1: Feedback on success
      toast.success('¡Bienvenido al sistema!');
      
      // Si tiene contraseña temporal, redirigir a cambio de contraseña
      const destino = data.user?.password_temporal ? '/cambiar-password-temporal' : '/dashboard';
      setTimeout(() => navigate(destino), 800);
    } catch (error) {
      // Nielsen 9: Help users recognize, diagnose, and recover from errors
      setErrorMsg(error.message || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="login-container" 
      style={{
        backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.7) 100%), url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {/* Botón flotante para regresar al Landing Page */}
      <button 
        onClick={() => navigate('/')}
        className="btn-secondary-outline"
        style={{ 
          position: 'absolute', 
          top: '2rem', 
          left: '2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          zIndex: 10
        }}
      >
        <ArrowLeft size={18} />
        Volver al Inicio
      </button>

      {/* Toaster for elegant notifications */}
      <Toaster richColors position="top-right" />
      
      <div className="login-content animate-fade-in">
        <div className="login-header">
          <div className="logo-container">
            <Droplet size={40} className="logo-icon" />
          </div>
          <h1>Consejo de Gobierno Comunitario<br />Chibuleo-San Francisco</h1>
          <p>Gestión Inteligente de Juntas de Agua</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card login-form" noValidate>
          {errorMsg && (
            <div className="error-banner animate-fade-in" role="alert" aria-live="assertive">
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="username" className="input-label">Cédula de Identidad</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} aria-hidden="true" />
              <input
                id="username"
                type="text"
                className="input-field"
                placeholder="Ingresa tu número de cédula"
                value={username}
                onChange={(e) => setUsername(allowAlphanumeric(e.target.value))}
                onBlur={() => setUsernameTouched(true)}
                disabled={isLoading}
                aria-required="true"
                aria-invalid={errorMsg ? "true" : "false"}
                autoComplete="username"
              />
              {usernameTouched && !username.trim() && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Ingresa tu número de cédula.</span>
              )}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Contraseña <span style={{fontSize:'0.8em', color:'var(--text-muted)'}}>(Opcional para comuneros)</span></label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} aria-hidden="true" />
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.82rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Autenticando...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Ingresar al Sistema
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer" style={{ marginTop: '1rem' }}>
          <p>© {new Date().getFullYear()} Proyecto Bienestar. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
