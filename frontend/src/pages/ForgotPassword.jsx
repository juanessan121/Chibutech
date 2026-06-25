import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Droplet, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../services/authService';
import { Toaster, toast } from 'sonner';
import { allowAlphanumeric } from '../utils/validators';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState('');
  const [cedulaTouched, setCedulaTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cedula.trim()) {
      setCedulaTouched(true);
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(cedula.trim());
      setEnviado(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
    >
      <Toaster richColors position="top-right" />

      <button
        onClick={() => navigate('/login')}
        className="btn-secondary-outline"
        style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 }}
      >
        <ArrowLeft size={18} /> Volver al Login
      </button>

      <div className="login-content animate-fade-in" style={{ maxWidth: '480px' }}>
        <div className="login-header">
          <div className="logo-container">
            <Droplet size={40} className="logo-icon" />
          </div>
          <h1>Consejo de Gobierno Comunitario<br />Chibuleo-San Francisco</h1>
          <p>Recuperar acceso a tu cuenta</p>
        </div>

        <div className="glass-card login-form">
          {enviado ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <CheckCircle size={52} style={{ color: '#22d3ee', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--text-main)', marginBottom: '0.75rem' }}>¡Correo enviado!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Hemos enviado una <strong style={{ color: 'var(--text-main)' }}>contraseña temporal</strong> al correo electrónico registrado para la cédula <strong style={{ color: '#22d3ee' }}>{cedula}</strong>.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Revisa tu bandeja de entrada (y la carpeta de spam). Al ingresar con esa contraseña, el sistema te pedirá que establezcas una nueva.
              </p>
              <button className="btn-primary" onClick={() => navigate('/login')}>
                Ir al Login
              </button>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Ingresa tu número de cédula y te enviaremos una contraseña temporal a tu correo electrónico registrado.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} noValidate>
                <div className="input-group">
                  <label className="input-label">Número de Cédula *</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Ej. 1805123456"
                      value={cedula}
                      onChange={(e) => setCedula(allowAlphanumeric(e.target.value))}
                      onBlur={() => setCedulaTouched(true)}
                      disabled={isLoading}
                      autoComplete="username"
                    />
                    {cedulaTouched && !cedula.trim() && (
                      <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Ingresa tu número de cédula.</span>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Enviar contraseña temporal
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
