import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Map as MapIcon, Loader2, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icono Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clics en el mapa
function ClickableMap({ position, setPosition }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (position && position.lat && position.lng) {
      map.flyTo(position, 16);
    }
  }, [position, map]);

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);

  return position ? <Marker position={position} /> : null;
}

export default function CoordinateCapture({ onCapture, initialLat, initialLon }) {
  const [position, setPosition] = useState(
    initialLat && initialLon ? { lat: parseFloat(initialLat), lng: parseFloat(initialLon) } : null
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Efecto para reportar al form padre cuando cambian
  useEffect(() => {
    if (position && onCapture) {
      onCapture({ lat: position.lat.toFixed(6), lon: position.lng.toFixed(6) });
    }
  }, [position]);

  const handleGPSCapture = (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (!navigator.geolocation) {
      setErrorMsg('La geolocalización no es soportada.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(latlng);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setErrorMsg('Error obteniendo GPS: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const defaultCenter = { lat: -1.3281, lng: -78.5528 }; // Ambato/Chibuleo approx

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h4 className="text-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <MapPin size={18} /> Ubicación en Mapa (Interactivo)
      </h4>
      <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
        Haz clic en cualquier punto del mapa para colocar el pin rojo, o usa el botón para detectar tu GPS.
      </p>

      {errorMsg && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button 
          type="button" 
          onClick={handleGPSCapture} 
          disabled={isLoading}
          className="btn-secondary hover-scale" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />} 
          Usar mi GPS actual
        </button>

        {position && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            <span><b>Lat:</b> {position.lat.toFixed(6)}</span>
            <span><b>Lng:</b> {position.lng.toFixed(6)}</span>
          </div>
        )}
      </div>

      <div style={{ height: '350px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
        <MapContainer center={position || defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickableMap position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
    </div>
  );
}
