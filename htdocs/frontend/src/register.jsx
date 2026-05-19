// src/register.jsx
import React, { useState } from 'react';
import './login.css'; // Reutilizamos el mismo CSS

const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    comunidad: 'Chibuleo',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error de contraseña cuando el usuario escriba
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    if (!acceptTerms) {
      alert('Por favor acepta los términos y condiciones');
      return;
    }
    
    console.log('Registro intentado:', formData);
    if (onRegisterSuccess) {
      onRegisterSuccess(); // Simular registro exitoso
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      <div className="login-card register-card">
        <div className="login-header">
          <div className="chibuleo-symbol">
            <span className="symbol-icon">🏔️</span>
            <span className="symbol-text">Chibuleo</span>
          </div>
          <h2>Únete a la comunidad</h2>
          <p>Crea tu cuenta y participa en las mingas</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="nombres">
                <span className="label-icon">👤</span>
                Nombres
              </label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Juan"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="apellidos">
                <span className="label-icon">👥</span>
                Apellidos
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Perez"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">
              <span className="label-icon">📧</span>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@chibuleo.ec"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="telefono">
                <span className="label-icon">📱</span>
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="099 123 4567"
              />
            </div>

            <div className="input-group">
              <label htmlFor="comunidad">
                <span className="label-icon">🏘️</span>
                Comunidad
              </label>
              <select
                id="comunidad"
                name="comunidad"
                value={formData.comunidad}
                onChange={handleChange}
              >
                <option value="Chibuleo">Chibuleo</option>
                <option value="Otros">Otras comunidades</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Contraseña
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">
                <span className="label-icon">✓</span>
                Confirmar Contraseña
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>
            </div>
          </div>

          {passwordError && (
            <div className="error-message">
              ⚠️ {passwordError}
            </div>
          )}

          <div className="show-password-option">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <span>Mostrar contraseñas</span>
            </label>
          </div>

          <div className="terms-conditions">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
              <span>
                Acepto los <a href="#">términos y condiciones</a> y la 
                <a href="#"> política de privacidad</a>
              </span>
            </label>
          </div>

          <button type="submit" className="btn-login">
            <span>Crear Cuenta</span>
            <span className="btn-arrow">✨</span>
          </button>

          <div className="login-divider">
            <span>ya tengo cuenta</span>
          </div>

          <button 
            type="button" 
            className="btn-register-redirect back-to-login"
            onClick={onSwitchToLogin}
          >
            <span>←</span>
            Volver a Iniciar Sesión
          </button>
        </form>

        <div className="login-footer">
          <p>Al crear una cuenta, podrás:</p>
          <ul className="benefits-list">
            <li>✓ Participar en mingas comunitarias</li>
            <li>✓ Recibir notificaciones importantes</li>
            <li>✓ Acceder a reportes y beneficios</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;