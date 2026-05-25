import React, { useState } from 'react';
import { MapPin, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CoordinateCapture from '../components/CoordinateCapture';
import PdfUpload from '../components/PdfUpload';

export default function TerrenosRegistro() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [terrenoData, setTerrenoData] = useState(null);

  const onSubmitStep1 = (data) => {
    console.log("Datos del terreno (Fase 1):", data);
    setTerrenoData(data);
    toast.success('Datos del terreno guardados correctamente. Continúe con la ubicación y documentos.');
    setStep(2);
  };

  const handleFinalize = () => {
    toast.success('¡Registro completado con éxito!');
    setTimeout(() => {
      navigate('/dashboard/catastro');
    }, 1500);
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
        
        <form onSubmit={handleSubmit(onSubmitStep1)}>
          <div className="form-grid">
            {/* Clave catastral */}
            <div className="input-group">
              <label className="input-label">Clave Catastral / No. Identificación *</label>
              <input 
                type="text" 
                className={`input-field ${errors.clave_catastral ? 'error' : ''}`} 
                placeholder="Ej. 180101..." 
                disabled={step === 2}
                {...register("clave_catastral", { required: "Este campo es requerido" })} 
              />
              {errors.clave_catastral && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '-0.25rem' }}>{errors.clave_catastral.message}</span>}
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
                  disabled={step === 2}
                  style={{ paddingRight: '3rem' }}
                  {...register("area", { required: "El área es requerida", valueAsNumber: true, min: { value: 0.01, message: "El área debe ser mayor a 0" } })} 
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
              {errors.area && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '-0.25rem' }}>{errors.area.message}</span>}
            </div>

            {/* Estado del Terreno */}
            <div className="input-group">
              <label className="input-label">Estado del Terreno *</label>
              <select 
                className={`form-select ${errors.estado_terreno ? 'error' : ''}`} 
                disabled={step === 2}
                {...register("estado_terreno", { required: "Seleccione un estado" })}
              >
                <option value="">-- Seleccione el estado --</option>
                <option value="Sembrio">Sembrío</option>
                <option value="Construccion">Construcción</option>
                <option value="Abandonado">Abandonado</option>
              </select>
              {errors.estado_terreno && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '-0.25rem' }}>{errors.estado_terreno.message}</span>}
            </div>
          </div>

          {step === 1 && (
            <div style={{ marginTop: '2rem' }}>
              <button type="button" onClick={handleSubmit(onSubmitStep1)} className="btn-primary">
                <Save size={18} /> Guardar Terreno
              </button>
            </div>
          )}
        </form>

        {step === 2 && (
          <div className="animate-fade-in" style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h3 className="text-primary" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              Ubicación y Documentos Adicionales
            </h3>
            
            <CoordinateCapture onCapture={(coords) => console.log('Coordenadas capturadas:', coords)} />
            
            <PdfUpload onFileSelect={(file) => console.log('PDF seleccionado:', file.name)} />

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                Volver
              </button>
              <button type="button" className="btn-primary" onClick={handleFinalize} style={{ width: 'auto', padding: '1rem 2rem' }}>
                <CheckCircle size={18} /> Finalizar Registro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
