import React, { useState } from 'react';
import { User, Phone, Mail, Award, Lock, Save, Droplets, Shield, Calendar } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import useAuthStore from '../store/useAuthStore';

export default function PerfilUsuario() {
  const user = useAuthStore((state) => state.user);

  // Estados locales para los formularios interactivos
  const [telefono, setTelefono] = useState('0998765432');
  const [correo, setCorreo] = useState(user?.email || 'comunero.chibuleo@gmail.com');
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  const [passCurrent, setPassCurrent] = useState('');
  const [passNew, setPassNew] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [isSavingPass, setIsSavingPass] = useState(false);

  const [touchedInfo, setTouchedInfo] = useState({ telefono: false, correo: false });
  const [touchedPass, setTouchedPass] = useState({ passCurrent: false, passNew: false, passConfirm: false });

  const handleSaveInfo = (e) => {
    e.preventDefault();
    if (!telefono || !correo) {
      toast.error('Por favor, completa los campos requeridos.');
      return;
    }
    setIsSavingInfo(true);
    setTimeout(() => {
      setIsSavingInfo(false);
      toast.success('¡Datos de contacto actualizados correctamente!', {
        description: 'La información se ha guardado temporalmente en tu sesión.'
      });
    }, 1000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passCurrent || !passNew || !passConfirm) {
      toast.error('Todos los campos de contraseña son obligatorios.');
      return;
    }
    if (passNew !== passConfirm) {
      toast.error('Las contraseñas nuevas no coinciden.');
      return;
    }
    if (passNew.length < 6) {
      toast.error('La contraseña nueva debe tener al menos 6 caracteres.');
      return;
    }
    setIsSavingPass(true);
    setTimeout(() => {
      setIsSavingPass(false);
      setPassCurrent('');
      setPassNew('');
      setPassConfirm('');
      toast.success('¡Contraseña actualizada con éxito!', {
        description: 'Las credenciales de acceso se han actualizado.'
      });
    }, 1000);
  };

  return (
    <div className="page-slide-in pb-10">
      

      {/* Cabecera */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User className="text-primary" /> Mi Expediente de Comunero
          </h1>
          <p className="text-muted">Gestiona tus datos personales, información de contacto y revisa tus derechos de riego vigentes.</p>
        </div>
      </div>

      <div className="details-grid">
        {/* COLUMNA IZQUIERDA: DATOS GENERALES Y DERECHOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tarjeta Perfil Ficha */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div className="profile-card-header">
              <div className="profile-avatar-container">
                {user?.username?.substring(0, 2).toUpperCase() || 'US'}
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)', fontSize: '1.4rem', fontWeight: 700 }}>
                  {user?.username ? user.username.toUpperCase() : 'COMUNERO REGISTRADO'}
                </h3>
                <span className="badge" style={{ background: 'var(--primary)', color: '#000', fontWeight: 'bold', fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                  {user?.rol || 'Usuario Regular'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="detail-row">
                <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={16} /> Identificación (C.I.)
                </span>
                <span className="detail-value">{user?.cedula || '1805123456'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} /> Nombres Completos
                </span>
                <span className="detail-value">{user?.username || 'Juan Gabriel Pérez'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> Fecha de Nacimiento
                </span>
                <span className="detail-value">15 de Mayo de 1988</span>
              </div>
              <div className="detail-row">
                <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} /> Estado en el Padrón
                </span>
                <span className="detail-value" style={{ color: 'var(--green)', fontWeight: 'bold' }}>ACTIVO / AL DÍA</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Derechos de Agua */}
          <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--primary)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Droplets size={20} /> Derechos de Riego Asignados
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Información oficial del caudal y turnos registrados en la Junta de Agua Chibuleo.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="detail-row">
                <span className="detail-label">Ramal / Acequia Asignada</span>
                <span className="detail-value" style={{ color: 'var(--primary)' }}>Ramal 3 — Acequia Principal Alta</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Turno Semanal Autorizado</span>
                <span className="detail-value" style={{ fontWeight: 'bold' }}>Viernes: 14:00 a 16:30 (2.5 horas)</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Caudal Concedido</span>
                <span className="detail-value">3.0 Litros / segundo (L/s)</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Cuota de Mantenimiento ERP</span>
                <span className="detail-value">$3.00 / mes</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Vocal del Ramal Responsable</span>
                <span className="detail-value">Por definir</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: CONFIGURACIÓN / FORMULARIOS INTERACTIVOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tarjeta Editar Datos de Contacto */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 700 }}>
              Actualizar Datos de Contacto
            </h3>

            <form onSubmit={handleSaveInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Número de Teléfono Celular *</label>
                <div className="input-wrapper">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="text"
                    className="input-field"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    onBlur={() => setTouchedInfo(t => ({ ...t, telefono: true }))}
                    placeholder="Ej. 0998765432"
                    required
                  />
                  {touchedInfo.telefono && !telefono.trim() && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El teléfono es obligatorio.</span>
                  )}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Correo Electrónico de Alertas *</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    className="input-field"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onBlur={() => setTouchedInfo(t => ({ ...t, correo: true }))}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                  {touchedInfo.correo && !correo.trim() && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>El correo electrónico es obligatorio.</span>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary hover-scale" disabled={isSavingInfo} style={{ marginTop: '0.5rem' }}>
                <Save size={18} /> {isSavingInfo ? 'Guardando...' : 'Guardar Información'}
              </button>
            </form>
          </div>

          {/* Tarjeta Seguridad: Cambio de Contraseña */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 700 }}>
              Cambiar Contraseña de Acceso
            </h3>

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Contraseña Actual *</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    className="input-field"
                    value={passCurrent}
                    onChange={(e) => setPassCurrent(e.target.value)}
                    onBlur={() => setTouchedPass(t => ({ ...t, passCurrent: true }))}
                    placeholder="••••••••"
                    required
                  />
                  {touchedPass.passCurrent && !passCurrent && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>La contraseña actual es obligatoria.</span>
                  )}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Contraseña Nueva *</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    className="input-field"
                    value={passNew}
                    onChange={(e) => setPassNew(e.target.value)}
                    onBlur={() => setTouchedPass(t => ({ ...t, passNew: true }))}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                  {touchedPass.passNew && !passNew && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>La nueva contraseña es obligatoria.</span>
                  )}
                  {touchedPass.passNew && passNew && passNew.length < 6 && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Debe tener al menos 6 caracteres.</span>
                  )}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Confirmar Contraseña Nueva *</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    className="input-field"
                    value={passConfirm}
                    onChange={(e) => setPassConfirm(e.target.value)}
                    onBlur={() => setTouchedPass(t => ({ ...t, passConfirm: true }))}
                    placeholder="Repite la contraseña nueva"
                    required
                  />
                  {touchedPass.passConfirm && !passConfirm && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Debe confirmar la nueva contraseña.</span>
                  )}
                  {touchedPass.passConfirm && passConfirm && passNew !== passConfirm && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Las contraseñas no coinciden.</span>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary hover-scale" disabled={isSavingPass} style={{ marginTop: '0.5rem' }}>
                <Lock size={18} /> {isSavingPass ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
