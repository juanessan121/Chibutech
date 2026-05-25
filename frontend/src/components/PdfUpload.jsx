import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, X, AlertCircle } from 'lucide-react';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfUpload({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setError('');
    setSelectedFile(null);

    // Validación 1: Solo formato PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Formato no válido. Solo se aceptan archivos con extensión .pdf');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    // Validación 2: Tamaño máximo 10 MB
    if (file.size > MAX_SIZE_BYTES) {
      setError(
        `El archivo excede el límite permitido de ${MAX_SIZE_MB} MB. El archivo seleccionado pesa ${formatBytes(file.size)}.`
      );
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    // Archivo válido
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  // Colores del borde según el estado
  const borderColor = error
    ? 'rgba(239, 68, 68, 0.6)'
    : dragActive
    ? '#10b981'
    : selectedFile
    ? 'rgba(16, 185, 129, 0.5)'
    : 'rgba(255,255,255,0.18)';

  const bgColor = error
    ? 'rgba(239, 68, 68, 0.05)'
    : dragActive
    ? 'rgba(16, 185, 129, 0.07)'
    : selectedFile
    ? 'rgba(16, 185, 129, 0.05)'
    : 'rgba(0,0,0,0.1)';

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      {/* Label con indicaciones */}
      <label
        className="input-label"
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', cursor: 'default' }}
      >
        <FileText size={15} />
        Escritura y Planimetría
        <span
          className="text-muted"
          style={{ fontWeight: 'normal', fontStyle: 'italic', fontSize: '0.78rem' }}
        >
          (Opcional — solo .pdf · máx. {MAX_SIZE_MB} MB)
        </span>
      </label>

      {/* Zona de drop */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
        style={{
          border: `2px dashed ${borderColor}`,
          borderRadius: '0.75rem',
          padding: '1.75rem 1.5rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          background: bgColor,
          cursor: selectedFile ? 'default' : 'pointer',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {/* ── Estado: ARCHIVO VÁLIDO SELECCIONADO ── */}
        {selectedFile && (
          <div
            className="animate-fade-in"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <CheckCircle size={34} style={{ color: '#10b981', flexShrink: 0 }} />
              <div style={{ textAlign: 'left', minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '380px',
                  }}
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#10b981' }}>
                  {formatBytes(selectedFile.size)} — PDF listo para enviar ✓
                </p>
              </div>
            </div>

            {/* Botón quitar */}
            <button
              type="button"
              onClick={handleRemove}
              title="Eliminar archivo"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* ── Estado: ERROR DE VALIDACIÓN ── */}
        {!selectedFile && error && (
          <div
            className="animate-fade-in"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
          >
            <XCircle size={40} style={{ color: '#ef4444' }} />
            <p style={{ margin: 0, color: '#fca5a5', fontWeight: '500', fontSize: '0.88rem', maxWidth: '360px' }}>
              {error}
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={(e) => { e.stopPropagation(); setError(''); inputRef.current?.click(); }}
              style={{ marginTop: '0.25rem', fontSize: '0.82rem', padding: '0.5rem 1rem' }}
            >
              Seleccionar otro archivo
            </button>
          </div>
        )}

        {/* ── Estado: VACÍO / INICIAL ── */}
        {!selectedFile && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <UploadCloud
              size={44}
              style={{ color: dragActive ? '#10b981' : 'var(--text-muted)', transition: 'color 0.3s' }}
            />
            <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: '500' }}>
              Arrastra y suelta tu archivo aquí
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              o haz clic para explorar — solo <strong>.pdf</strong>, máx. <strong>{MAX_SIZE_MB} MB</strong>
            </p>
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '0.25rem', pointerEvents: 'none', fontSize: '0.82rem', padding: '0.5rem 1rem' }}
            >
              Seleccionar PDF
            </button>
          </div>
        )}
      </div>

      {/* Banner de error compacto debajo (accesibilidad extra) */}
      {error && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: '#fca5a5',
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
