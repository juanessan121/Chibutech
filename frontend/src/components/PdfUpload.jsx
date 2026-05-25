import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

export default function PdfUpload({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
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
    if (file.type === "application/pdf") {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    } else {
      alert("Formato no válido. Por favor, suba únicamente archivos PDF.");
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h4 className="text-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <FileText size={18} /> Subida de Documento (PDF)
      </h4>
      <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Adjunte la documentación de respaldo necesaria.
      </p>
      
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: '0.75rem',
          padding: '2rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          background: dragActive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".pdf,application/pdf" 
          onChange={handleChange} 
          style={{ display: 'none' }} 
        />
        
        {selectedFile ? (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={48} style={{ color: '#10b981' }} />
            <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)' }}>Archivo seleccionado:</p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{selectedFile.name}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <UploadCloud size={48} className="text-muted" />
            <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: '500' }}>
              Arrastra y suelta tu archivo PDF aquí
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              o haz clic en esta área para explorar tus archivos
            </p>
            <button type="button" className="btn-secondary" style={{ marginTop: '0.5rem', pointerEvents: 'none' }}>
              Seleccionar PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
