import { AlertTriangle, Info, Trash2 } from 'lucide-react';

const VARIANTS = {
  info: {
    Icon: Info,
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.12)',
    btnBg: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
  },
  warning: {
    Icon: AlertTriangle,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    btnBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  danger: {
    Icon: Trash2,
    color: '#f87171',
    bg: 'rgba(248,113,113,0.12)',
    btnBg: 'linear-gradient(135deg, #f87171, #dc2626)',
  },
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  detail,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'info',
}) {
  if (!isOpen) return null;

  const { Icon, color, bg, btnBg } = VARIANTS[variant] ?? VARIANTS.info;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="glass-card animate-fade-in"
        style={{ width: '100%', maxWidth: '420px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icono + Título + Mensaje */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ background: bg, borderRadius: '0.875rem', padding: '0.75rem', flexShrink: 0 }}>
            <Icon size={22} style={{ color, display: 'block' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
              {title}
            </h3>
            {message && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Detalle secundario */}
        {detail && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '0.75rem',
            padding: '0.875rem 1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
          }}>
            {detail}
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            className="btn-secondary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem', borderRadius: '0.65rem' }}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            style={{
              padding: '0.6rem 1.4rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: btnBg,
              color: 'white',
              border: 'none',
              borderRadius: '0.65rem',
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${color}33`,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
