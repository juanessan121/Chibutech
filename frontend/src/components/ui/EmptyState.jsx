import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * EmptyState — Componente de estado vacío
 *
 * Props:
 *  - icon: LucideIcon     → Ícono principal (default: Inbox)
 *  - title: string        → Título del estado vacío
 *  - message: string      → Descripción
 *  - action: ReactNode    → Botón o acción opcional
 *  - compact: bool        → Versión compacta sin tanto padding
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Sin datos',
  message = 'No hay información disponible.',
  action = null,
  compact = false,
}) {
  return (
    <div style={{ ...styles.wrapper, padding: compact ? '2rem' : '4rem 2rem' }}>
      <div style={styles.iconCircle}>
        <Icon size={compact ? 32 : 48} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
      </div>
      <h3 style={{ ...styles.title, fontSize: compact ? '1rem' : '1.15rem' }}>{title}</h3>
      <p style={{ ...styles.message, fontSize: compact ? '0.8rem' : '0.875rem' }}>{message}</p>
      {action && <div style={{ marginTop: '1.5rem' }}>{action}</div>}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '0.5rem',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px dashed rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
  },
  title: {
    color: 'var(--text-main)',
    fontWeight: 700,
    margin: 0,
  },
  message: {
    color: 'var(--text-muted)',
    margin: 0,
    lineHeight: 1.5,
    maxWidth: '320px',
  },
};
