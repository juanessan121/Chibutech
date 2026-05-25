import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function CoordinateCapture({ onCapture }) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const handleCapture = (e) => {
    e.preventDefault();
    if (onCapture) {
      onCapture({ lat, lon });
    } else {
      console.log('Coordenadas capturadas en el frontend:', { lat, lon });
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h4 className="text-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <MapPin size={18} /> Captura de Coordenadas
      </h4>
      <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Ingrese las coordenadas geográficas de la ubicación.
      </p>
      <div className="form-grid">
        <div className="input-group">
          <label className="input-label">Latitud</label>
          <input 
            type="number" 
            step="any"
            className="input-field" 
            placeholder="Ej: -1.3281"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">Longitud</label>
          <input 
            type="number" 
            step="any"
            className="input-field" 
            placeholder="Ej: -78.5528"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
          />
        </div>
      </div>
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
        <button type="button" onClick={handleCapture} className="btn-secondary hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Navigation size={16} /> Capturar Coordenadas
        </button>
      </div>
    </div>
  );
}
