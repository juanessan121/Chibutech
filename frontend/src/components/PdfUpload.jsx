import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Trash2 } from 'lucide-react';

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

  const removeFile = (e) => {
    e.stopPropagation(); // Evitar abrir el explorador de archivos al hacer clic en borrar
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        onDragEnter={!selectedFile ? handleDrag : undefined}
        onDragLeave={!selectedFile ? handleDrag : undefined}
        onDragOver={!selectedFile ? handleDrag : undefined}
        onDrop={!selectedFile ? handleDrop : undefined}
        style={{
          border: `2px dashed ${selectedFile ? 'rgba(16, 185, 129, 0.5)' : dragActive ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: '0.75rem',
          padding: '2rem',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          background: selectedFile ? 'rgba(16, 185, 129, 0.05)' : dragActive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0,0,0,0.1)',
          cursor: selectedFile ? 'default' : 'pointer',
          position: 'relative'
        }}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".pdf,application/pdf" 
          onChange={handleChange} 
          style={{ display: 'none' }} 
        />
        
        {selectedFile ? (
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                <CheckCircle size={24} style={{ color: '#10b981' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)', wordBreak: 'break-all' }}>{selectedFile.name}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={removeFile}
              className="btn-icon hover-scale"
              style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              title="Eliminar archivo"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <UploadCloud size={48} className="text-muted" style={{ color: dragActive ? '#10b981' : undefined }} />
            <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: '500' }}>
              {dragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta tu archivo PDF aquí'}
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
