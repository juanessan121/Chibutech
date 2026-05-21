import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, ArrowLeft, Calendar, DollarSign, Check, Users, FileText } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function CobrosPlanilla() {
  const navigate = useNavigate();
  const [tipoEmision, setTipoEmision] = useState('masiva'); // masiva | individual
  const [formData, setFormData] = useState({
    mes_correspondiente: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    fecha_emision: new Date().toISOString().split('T')[0],
    id_terreno: '' // Solo para individual
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerar = (e) => {
    e.preventDefault();
    // Simulate generation
    toast.success(`Planilla${tipoEmision === 'masiva' ? 's' : ''} de agua generada${tipoEmision === 'masiva' ? 's' : ''} correctamente.`);
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toaster richColors />
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <button className="btn-back" onClick={() => navigate('/dashboard/cobros')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={18} /> Volver al Menú
          </button>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Droplets className="text-blue" /> Emisión de Planillas de Agua
          </h1>
          <p className="text-muted">Genera los cobros mensuales del servicio de agua por consumo básico.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button"
            className={tipoEmision === 'masiva' ? "btn-primary" : "btn-secondary"} 
            onClick={() => setTipoEmision('masiva')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Users size={18} /> Emisión Masiva (Todo el Padrón)
          </button>
          <button 
            type="button"
            className={tipoEmision === 'individual' ? "btn-primary" : "btn-secondary"} 
            onClick={() => setTipoEmision('individual')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <FileText size={18} /> Emisión Individual
          </button>
        </div>

        <form onSubmit={handleGenerar} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Mes Correspondiente</label>
              <select className="input-field" name="mes_correspondiente" value={formData.mes_correspondiente} onChange={handleChange} required>
                <option value={1}>Enero</option>
                <option value={2}>Febrero</option>
                <option value={3}>Marzo</option>
                <option value={4}>Abril</option>
                <option value={5}>Mayo</option>
                <option value={6}>Junio</option>
                <option value={7}>Julio</option>
                <option value={8}>Agosto</option>
                <option value={9}>Septiembre</option>
                <option value={10}>Octubre</option>
                <option value={11}>Noviembre</option>
                <option value={12}>Diciembre</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Año</label>
              <input type="number" className="input-field" name="anio" value={formData.anio} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Fecha de Emisión</label>
              <input type="date" className="input-field" name="fecha_emision" value={formData.fecha_emision} onChange={handleChange} required />
            </div>
            {tipoEmision === 'individual' && (
              <div className="input-group">
                <label className="input-label">ID Terreno / Medidor (Requerido)</label>
                <input type="text" className="input-field" name="id_terreno" value={formData.id_terreno} onChange={handleChange} placeholder="Ej: TER-1001" required={tipoEmision === 'individual'} />
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            <Check size={20} /> Generar {tipoEmision === 'masiva' ? 'Planillas Masivas' : 'Planilla Individual'}
          </button>
        </form>
      </div>
    </div>
  );
}
