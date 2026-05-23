import React from 'react';

/**
 * PageHeader — Header de página consistente
 *
 * Props:
 *  - title: string           → Título principal
 *  - description: string     → Subtexto descriptivo
 *  - icon: LucideIcon        → Ícono decorativo
 *  - iconColor: string       → Color del ícono (default: 'var(--primary)')
 *  - actions: ReactNode      → Slot para botones (ej: <button>Agregar</button>)
 *  - breadcrumb: string      → Ruta de navegación (ej: "Usuarios / Padrón")
 */
export default function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = 'var(--primary)',
  actions,
  breadcrumb,
}) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        {breadcrumb && (
          <p style={styles.breadcrumb}>{breadcrumb}</p>
        )}
        <div style={styles.titleRow}>
          {Icon && (
            <div style={{ ...styles.iconWrapper, background: `${iconColor}18`, border: `1px solid ${iconColor}35`, color: iconColor }}>
              <Icon size={22} strokeWidth={1.8} />
            </div>
          )}
          <h1 style={styles.title}>{title}</h1>
        </div>
        {description && (
          <p style={styles.description}>{description}</p>
        )}
      </div>

      {actions && (
        <div style={styles.actions}>
          {actions}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  left: {
    flex: 1,
    minWidth: 0,
  },
  breadcrumb: {
    color: 'var(--text-muted)',
    fontSize: '0.78rem',
    margin: '0 0 0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    flexWrap: 'wrap',
  },
  iconWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '0.65rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    margin: 0,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  description: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    margin: '0.5rem 0 0 0',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    flexShrink: 0,
  },
};
