import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatCard — Tarjeta estadística reutilizable
 *
 * Props:
 *  - title: string           → Etiqueta de la métrica
 *  - value: number | string  → Valor principal (si es number, se anima)
 *  - prefix: string          → Texto antes del valor (ej: "$")
 *  - suffix: string          → Texto después del valor (ej: "%", "usuarios")
 *  - icon: LucideIcon        → Componente ícono de lucide-react
 *  - color: string           → Color de acento CSS (ej: "#0ea5e9", "var(--primary)")
 *  - trend: number           → Porcentaje de cambio (+12, -5, 0) — opcional
 *  - trendLabel: string      → Texto del trend (ej: "vs. mes anterior")
 *  - subtext: string         → Texto secundario debajo del valor
 *  - loading: bool           → Mostrar skeleton
 */
export default function StatCard({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  color = 'var(--primary)',
  trend = null,
  trendLabel = 'vs. mes anterior',
  subtext = '',
  loading = false,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const isNumeric = typeof value === 'number';
  const animRef = useRef(null);

  // Animación de contador
  useEffect(() => {
    if (!isNumeric || loading) {
      setDisplayValue(value);
      return;
    }
    const duration = 1000;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [value, loading, isNumeric]);

  const getTrendIcon = () => {
    if (trend === null) return null;
    if (trend > 0) return <TrendingUp size={14} />;
    if (trend < 0) return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendColor = () => {
    if (trend > 0) return '#10b981';
    if (trend < 0) return '#ef4444';
    return '#94a3b8';
  };

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.skeletonIcon} />
        <div style={{ flex: 1 }}>
          <div style={styles.skeletonText} />
          <div style={{ ...styles.skeletonText, width: '50%', height: '2rem', marginTop: '0.5rem' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${color}` }} className="glass-card hover-glow">
      {/* Glow de fondo */}
      <div
        style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '120px', height: '120px',
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Ícono */}
      {Icon && (
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '0.75rem',
            background: `${color}20`,
            border: `1px solid ${color}40`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={26} strokeWidth={1.8} />
        </div>
      )}

      {/* Contenido */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={styles.title}>{title}</p>
        <div style={styles.valueRow}>
          {prefix && <span style={{ ...styles.prefix, color }}>{prefix}</span>}
          <span style={{ ...styles.value, color: 'var(--text-main)' }}>
            {isNumeric ? displayValue.toLocaleString('es-EC') : value}
          </span>
          {suffix && <span style={styles.suffix}>{suffix}</span>}
        </div>
        {subtext && <p style={styles.subtext}>{subtext}</p>}

        {/* Trend */}
        {trend !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            <span style={{ color: getTrendColor(), display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', fontWeight: 700 }}>
              {getTrendIcon()}
              {Math.abs(trend)}%
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '1.5rem',
    borderRadius: '1rem',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
    marginBottom: '0.25rem',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
  },
  prefix: {
    fontSize: '1.5rem',
    fontWeight: 700,
    lineHeight: 1,
  },
  value: {
    fontSize: '2.2rem',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },
  suffix: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '0.2rem',
  },
  subtext: {
    color: 'var(--text-muted)',
    fontSize: '0.78rem',
    margin: '0.3rem 0 0 0',
  },
  skeletonIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '0.75rem',
    background: 'rgba(255,255,255,0.06)',
    animation: 'pulse 1.5s ease-in-out infinite',
    flexShrink: 0,
  },
  skeletonText: {
    height: '1rem',
    width: '80%',
    borderRadius: '0.5rem',
    background: 'rgba(255,255,255,0.06)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};
