import React from 'react';

/**
 * BadgeEstado — Badge de estado visual reutilizable
 *
 * Props:
 *  - estado: string  → 'Activo' | 'Suspendido' | 'Pendiente' | 'Pagado' | 'En Mora' | 'Inactivo' | string libre
 *  - size: 'sm' | 'md' (default: 'md')
 */

const ESTADO_CONFIG = {
  // Usuarios
  'Activo':       { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  color: '#10b981', dot: '#10b981' },
  'Inactivo':     { bg: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.4)', color: '#94a3b8', dot: '#94a3b8' },
  'Suspendido':   { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   color: '#ef4444', dot: '#ef4444' },
  // Financiero
  'Pagado':       { bg: 'rgba(14,165,233,0.15)',  border: 'rgba(14,165,233,0.4)',  color: '#0ea5e9', dot: '#0ea5e9' },
  'Pendiente':    { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)',  color: '#f59e0b', dot: '#f59e0b' },
  'En Mora':      { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   color: '#ef4444', dot: '#ef4444' },
  'Vencido':      { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   color: '#ef4444', dot: '#ef4444' },
  // Mingas / Asistencia
  'Asistió':      { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  color: '#10b981', dot: '#10b981' },
  'Falta':        { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   color: '#ef4444', dot: '#ef4444' },
  'Justificado':  { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)',  color: '#f59e0b', dot: '#f59e0b' },
  // Roles
  'Administrador':{ bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.4)',  color: '#a78bfa', dot: '#a78bfa' },
  'Directiva':    { bg: 'rgba(14,165,233,0.15)',  border: 'rgba(14,165,233,0.4)',  color: '#0ea5e9', dot: '#0ea5e9' },
  'Usuario':      { bg: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.4)', color: '#94a3b8', dot: '#94a3b8' },
};

const DEFAULT_CONFIG = {
  bg: 'rgba(100,116,139,0.15)',
  border: 'rgba(100,116,139,0.4)',
  color: '#94a3b8',
  dot: '#94a3b8',
};

export default function BadgeEstado({ estado, size = 'md' }) {
  const config = ESTADO_CONFIG[estado] ?? DEFAULT_CONFIG;

  const padding = size === 'sm' ? '0.2rem 0.6rem' : '0.3rem 0.8rem';
  const fontSize = size === 'sm' ? '0.7rem' : '0.78rem';
  const dotSize = size === 'sm' ? '6px' : '7px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        padding,
        borderRadius: '2rem',
        fontSize,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: config.dot,
          flexShrink: 0,
          boxShadow: `0 0 6px ${config.dot}80`,
        }}
      />
      {estado}
    </span>
  );
}
