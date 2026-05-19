// src/login.jsx
import React, { useState } from 'react';
import './login.css';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora solo simulación, sin base de datos
    console.log('Login intentado:', formData);
    if (onLoginSuccess) {
      onLoginSuccess(); // Simular login exitoso
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="chibuleo-symbol">
            <span className="symbol-icon">🏔️</span>
            <span className="symbol-text">Chibuleo</span>
          </div>
          <h2>Bienvenido de vuelta</h2>
          <p>Accede a tu cuenta comunitaria</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
              placeholder="tucorreo@chibuleo.ec"
              required
              autoComplete="email"
            />
          </div>

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
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Recordarme</span>
            </label>
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn-login">
            <span>Iniciar Sesión</span>
            <span className="btn-arrow">→</span>
          </button>

          <div className="login-divider">
            <span>o</span>
          </div>

          <button 
            type="button" 
            className="btn-register-redirect"
            onClick={onSwitchToRegister}
          >
            <span>📝</span>
            Crear una cuenta nueva
          </button>
        </form>

        <div className="login-footer">
          <p>¿Eres miembro de la comunidad Chibuleo?</p>
          <p className="community-note">Accede a mingas, reportes y beneficios</p>
        </div>
      </div>
    </div>
  );
};

export default Login;