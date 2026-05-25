import React from 'react';
import { MapPin, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CoordinateCapture from '../components/CoordinateCapture';
import PdfUpload from '../components/PdfUpload';

export default function TerrenosRegistro() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Datos del terreno (Fase 1):", data);
    // Para esta fase solo se requiere la parte visual
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/catastro')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver a Catastro
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin className="text-earth" /> Registro de Terrenos
          </h1>
          <p className="text-muted">Formulario base para la inscripción de un nuevo predio.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          Información del Terreno
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            {/* Clave catastral */}
            <div className="input-group">
              <label className="input-label">Clave Catastral / No. Identificación *</label>
              <input 
                type="text" 
                className={`input-field ${errors.clave_catastral ? 'error' : ''}`} 
                placeholder="Ej. 180101..." 
                {...register("clave_catastral", { required: true })} 
              />
            </div>

            {/* Área */}
            <div className="input-group">
              <label className="input-label">Área *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="number" 
                  step="0.01"
                  className={`input-field ${errors.area ? 'error' : ''}`} 
                  placeholder="0.00" 
                  style={{ paddingRight: '3rem' }}
                  {...register("area", { required: true, valueAsNumber: true })} 
                />
                <span style={{ 
                  position: 'absolute', 
                  right: '1rem', 
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  pointerEvents: 'none'
                }}>
                  m²
                </span>
              </div>
            </div>

            {/* Estado del Terreno */}
            <div className="input-group">
              <label className="input-label">Estado del Terreno *</label>
              <select 
                className={`form-select ${errors.estado_terreno ? 'error' : ''}`} 
                {...register("estado_terreno", { required: true })}
              >
                <option value="">-- Seleccione el estado --</option>
                <option value="Sembrio">Sembrío</option>
                <option value="Construccion">Construcción</option>
                <option value="Abandonado">Abandonado</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <CoordinateCapture onCapture={(coords) => console.log('Coordenadas capturadas:', coords)} />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <PdfUpload onFileSelect={(file) => console.log('PDF seleccionado:', file.name)} />
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> Guardar Terreno
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
