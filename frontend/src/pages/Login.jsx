import React, { useState } from 'react';
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
  
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      
      // Slight delay to show the success animation before redirect
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (error) {
      // Nielsen 9: Help users recognize, diagnose, and recover from errors
      setErrorMsg(error.message || 'Credenciales incorrectas. Intenta de nuevo.');
      toast.error('Error de autenticación');
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
          <h1>Chibutech ERP</h1>
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
                disabled={isLoading}
                aria-required="true"
                aria-invalid={errorMsg ? "true" : "false"}
                autoComplete="username"
              />
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
        
        {/* Test Credentials Hint */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s', maxWidth: '800px', width: '100%' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.1rem' }}>Cuentas de Acceso al Sistema</h3>
          <table className="credentials-table" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th>Cargo / Rol</th>
                <th>Usuario</th>
                <th>Contraseña</th>
                <th>Nivel de Acceso (Permisos)</th>
              </tr>
            </thead>
            <tbody>
              {/* ADMINISTRACIÓN */}
              <tr style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                <td style={{ fontWeight: 'bold', color: '#f59e0b' }}>Administrador del Sistema</td>
                <td><code style={{color: '#f59e0b'}}>admin</code></td>
                <td><code style={{color: '#f59e0b'}}>admin</code></td>
                <td><span className="badge" style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: '0.7rem' }}>ACCESO TOTAL</span> (Configuración, Todo)</td>
              </tr>
              
              {/* DIRECTIVA */}
              <tr>
                <td style={{ fontWeight: 'bold' }}>Presidente</td>
                <td><code style={{color: 'var(--primary)'}}>presidente</code></td>
                <td><code style={{color: 'var(--primary)'}}>admin123</code></td>
                <td>Gestión total (Multas, Mingas, Reportes, Usuarios)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Vicepresidente</td>
                <td><code style={{color: 'var(--primary)'}}>vicepresidente</code></td>
                <td><code style={{color: 'var(--primary)'}}>chibuleo2024</code></td>
                <td>Solo Lectura (Reportes, Usuarios)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Tesorero</td>
                <td><code style={{color: 'var(--primary)'}}>tesorero</code></td>
                <td><code style={{color: 'var(--primary)'}}>caja2024</code></td>
                <td>Finanzas (Multas, Cobros, Reportes Económicos)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Secretario</td>
                <td><code style={{color: 'var(--primary)'}}>secretario</code></td>
                <td><code style={{color: 'var(--primary)'}}>actas2024</code></td>
                <td>Operativo (Mingas, Asistencia, Padrón de Usuarios)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Vocal</td>
                <td><code style={{color: 'var(--primary)'}}>vocal</code></td>
                <td><code style={{color: 'var(--primary)'}}>vocal2024</code></td>
                <td>Solo Lectura (Apoyo en Mingas, Búsqueda Básica)</td>
              </tr>

              {/* USUARIO BASE */}
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <td style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Usuario / Comunero</td>
                <td><code style={{color: 'var(--text-muted)'}}>usuario</code></td>
                <td><code style={{color: 'var(--text-muted)'}}>usuario</code></td>
                <td>Solo ver su perfil personal y sus deudas.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="login-footer" style={{ marginTop: '1rem' }}>
          <p>© {new Date().getFullYear()} Proyecto Bienestar. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
