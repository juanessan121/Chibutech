
import { Download, Loader2 } from 'lucide-react';

/**
 * PDFDownloadButton — Botón reutilizable para generar y descargar PDF
 *
 * Props:
 *  - onGenerate: () => Promise<void>  → Función del hook usePDF
 *  - isGenerating: bool               → Estado de carga del hook
 *  - label: string                    → Texto del botón (default: 'Descargar PDF')
 *  - variant: 'primary' | 'outline'   → Estilo del botón
 *  - disabled: bool                   → Desactivar externamente
 */
export default function PDFDownloadButton({
  onGenerate,
  isGenerating = false,
  label = 'Descargar PDF',
  variant = 'primary',
  disabled = false,
}) {
  const isPrimary = variant === 'primary';

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.4rem',
    borderRadius: '0.6rem',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: disabled || isGenerating ? 'not-allowed' : 'pointer',
    opacity: disabled || isGenerating ? 0.6 : 1,
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none',
  };

  const primaryStyle = {
    ...baseStyle,
    background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    color: '#fff',
    boxShadow: isGenerating ? 'none' : '0 4px 15px rgba(14,165,233,0.3)',
  };

  const outlineStyle = {
    ...baseStyle,
    background: 'transparent',
    color: '#0ea5e9',
    border: '1px solid rgba(14,165,233,0.5)',
  };

  return (
    <button
      onClick={onGenerate}
      disabled={disabled || isGenerating}
      style={isPrimary ? primaryStyle : outlineStyle}
      className={isPrimary ? 'hover-scale' : ''}
    >
      {isGenerating ? (
        <>
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          Generando PDF...
        </>
      ) : (
        <>
          <Download size={16} />
          {label}
        </>
      )}
    </button>
  );
}
