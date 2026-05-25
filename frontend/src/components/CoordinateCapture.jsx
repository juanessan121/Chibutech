import React, { useState } from 'react';
import { MapPin, Navigation, Map, Loader2, AlertCircle } from 'lucide-react';

export default function CoordinateCapture({ onCapture }) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCapture = (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (!navigator.geolocation) {
      setErrorMsg('La geolocalización no es soportada por tu navegador.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Redondear a 6 decimales es estándar para precisión de ~11 centímetros
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        setLat(latitude);
        setLon(longitude);
        setIsLoading(false);
        if (onCapture) {
          onCapture({ lat: latitude, lon: longitude });
        }
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMsg('Permiso denegado para acceder a la ubicación.');
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMsg('Información de ubicación no disponible.');
            break;
          case error.TIMEOUT:
            setErrorMsg('La solicitud para obtener la ubicación ha caducado.');
            break;
          default:
            setErrorMsg('Ocurrió un error desconocido al obtener la ubicación.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const openGoogleMaps = () => {
    if (lat && lon) {
      window.open(`https://maps.google.com/?q=${lat},${lon}`, '_blank', 'noopener,noreferrer');
    }
  };

  const hasValidCoords = lat !== '' && lon !== '' && !isNaN(lat) && !isNaN(lon);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h4 className="text-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <MapPin size={18} /> Ubicación Geográfica
      </h4>
      <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Ingrese las coordenadas geográficas de la ubicación o captúrelas automáticamente.
      </p>

      {errorMsg && (
        <div className="animate-fade-in" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: hasValidCoords ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start', transition: 'all 0.3s ease' }}>
        
        {/* Formulario Izquierdo */}
        <div>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Latitud</label>
              <input 
                type="number" 
                step="any"
                className="input-field" 
                placeholder="Ej: -1.3281"
                value={lat}
                onChange={(e) => { setLat(e.target.value); setErrorMsg(null); }}
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
                onChange={(e) => { setLon(e.target.value); setErrorMsg(null); }}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={handleCapture} 
              disabled={isLoading}
              className="btn-secondary hover-scale" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />} 
              {isLoading ? 'Obteniendo...' : 'Capturar Coordenadas'}
            </button>

            <button 
              type="button" 
              onClick={openGoogleMaps} 
              disabled={!hasValidCoords}
              className="btn-primary hover-scale" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                opacity: hasValidCoords ? 1 : 0.5,
                cursor: hasValidCoords ? 'pointer' : 'not-allowed',
                background: hasValidCoords ? '#3b82f6' : 'rgba(255,255,255,0.1)'
              }}
            >
              <Map size={16} /> Abrir Externo
            </button>
          </div>
        </div>

        {/* Mapa Derecho (Solo si hay coordenadas válidas) */}
        {hasValidCoords && (
          <div className="animate-fade-in" style={{ height: '100%', minHeight: '220px', borderRadius: '0.75rem', overflow: 'hidden', border: '2px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <iframe 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '220px' }} 
              loading="lazy" 
              allowFullScreen 
              referrerPolicy="no-referrer-when-downgrade" 
              src={`https://maps.google.com/maps?q=${lat},${lon}&z=16&output=embed`}
            ></iframe>
          </div>
        )}

      </div>
    </div>
  );
}
