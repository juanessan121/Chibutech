import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Inbox } from 'lucide-react';

/**
 * DataTable — Tabla reutilizable con búsqueda, ordenamiento y estados de carga/vacío
 *
 * Props:
 *  - columns: Array<{ key, label, render?, sortable?, width? }>
 *  - data: Array<object>
 *  - loading: bool
 *  - emptyMessage: string
 *  - emptyIcon: LucideIcon
 *  - searchable: bool (default: true)
 *  - searchPlaceholder: string
 *  - actions: (row) => ReactNode  → Columna de acciones por fila
 *  - rowKey: string               → Campo único por fila (default: 'id')
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No hay datos disponibles.',
  emptyIcon: EmptyIcon = Inbox,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  actions = null,
  rowKey = 'id',
}) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrado local
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  // Ordenamiento local
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), 'es', { numeric: true });
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const SortIcon = ({ colKey }) => {
    if (sortConfig.key !== colKey) return <ChevronsUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp size={14} style={{ color: 'var(--primary)' }} />
      : <ChevronDown size={14} style={{ color: 'var(--primary)' }} />;
  };

  // Skeleton rows
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div style={styles.wrapper}>
      {/* Barra de búsqueda */}
      {searchable && (
        <div style={styles.searchBar}>
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch('')} style={styles.clearBtn}>
              ✕
            </button>
          )}
        </div>
      )}

      {/* Tabla */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ ...styles.th, width: col.width || 'auto', cursor: col.sortable !== false ? 'pointer' : 'default' }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div style={styles.thContent}>
                    {col.label}
                    {col.sortable !== false && <SortIcon colKey={col.key} />}
                  </div>
                </th>
              ))}
              {actions && <th style={styles.th}>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              skeletonRows.map((_, i) => (
                <tr key={i} style={styles.tr}>
                  {columns.map((col) => (
                    <td key={col.key} style={styles.td}>
                      <div style={{ ...styles.skeleton, width: `${60 + Math.random() * 30}%` }} />
                    </td>
                  ))}
                  {actions && <td style={styles.td}><div style={{ ...styles.skeleton, width: '80px' }} /></td>}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} style={styles.emptyCell}>
                  <div style={styles.emptyState}>
                    <EmptyIcon size={40} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                    <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 0 0', fontSize: '0.9rem' }}>
                      {search ? `Sin resultados para "${search}"` : emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={row[rowKey] ?? idx}
                  style={{ ...styles.tr, background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                  className="table-row-hover"
                >
                  {columns.map((col) => (
                    <td key={col.key} style={styles.td}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  {actions && <td style={{ ...styles.td, textAlign: 'right' }}>{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con conteo */}
      {!loading && sortedData.length > 0 && (
        <div style={styles.footer}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {search
              ? `${sortedData.length} de ${data.length} resultados`
              : `${data.length} ${data.length === 1 ? 'registro' : 'registros'} en total`}
          </span>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.75rem',
    padding: '0.6rem 1rem',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '0 0.25rem',
    lineHeight: 1,
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '0.75rem',
    border: '1px solid var(--border-color)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  th: {
    padding: '0.9rem 1rem',
    textAlign: 'left',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(255,255,255,0.03)',
    whiteSpace: 'nowrap',
  },
  thContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  tr: {
    transition: 'background 0.15s ease',
  },
  td: {
    padding: '0.85rem 1rem',
    color: 'var(--text-main)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    verticalAlign: 'middle',
  },
  emptyCell: {
    padding: '3rem 1rem',
    textAlign: 'center',
    borderBottom: 'none',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  skeleton: {
    height: '0.85rem',
    borderRadius: '0.4rem',
    background: 'rgba(255,255,255,0.06)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  footer: {
    paddingTop: '0.5rem',
    paddingLeft: '0.25rem',
  },
};
