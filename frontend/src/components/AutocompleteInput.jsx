import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/axiosConfig';

// Caché global en memoria compartida para todos los inputs
let globalTitlesCache = null;
let isFetchingCache = false;

export default function AutocompleteInput({ value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTitles, setAllTitles] = useState(globalTitlesCache || []);
  const [rect, setRect] = useState(null);
  const wrapperRef = useRef(null);

  const updateRect = () => {
    if (wrapperRef.current) {
      setRect(wrapperRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateRect();
      // 'true' en scroll para capturar el evento en fase de captura (por si algún contenedor hace scroll)
      window.addEventListener('scroll', updateRect, true);
      window.addEventListener('resize', updateRect);
      return () => {
        window.removeEventListener('scroll', updateRect, true);
        window.removeEventListener('resize', updateRect);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    // Sincronizar estado interno si cambia el value externo
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Cargar catálogo completo una sola vez al montar
    if (globalTitlesCache) {
      if (allTitles.length === 0) setAllTitles(globalTitlesCache);
      return;
    }
    
    if (!isFetchingCache) {
      isFetchingCache = true;
      setLoading(true);
      api.get('/catalogos/titulos/todos').then(res => {
        if (res.data.status === 'ok') {
          globalTitlesCache = res.data.data;
          setAllTitles(globalTitlesCache);
        }
      }).catch(err => {
        console.error("Error fetching titles catalog", err);
      }).finally(() => {
        isFetchingCache = false;
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    // Filtrado ultra-rápido en RAM (0 ms de latencia)
    if (query && query.length >= 2 && isOpen && allTitles.length > 0) {
      const q = query.toLowerCase();
      const filtered = allTitles.filter(t => 
        t.nombre.toLowerCase().includes(q) || 
        (t.categoria && t.categoria.toLowerCase().includes(q))
      ).slice(0, 50);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, isOpen, allTitles]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', flex: 1 }}>
      <input
        type="text"
        className="input-field"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          onChange(e.target.value); // Reportar a React Hook Form
        }}
        onFocus={() => setIsOpen(true)}
      />
      {loading && (
        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
          <div style={{ width: '12px', height: '12px', border: '2px solid var(--text-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      )}
      
      {isOpen && results.length > 0 && rect && createPortal(
        <ul style={{
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 99999,
          maxHeight: '220px',
          overflowY: 'auto',
          listStyle: 'none',
          padding: '0.4rem',
          margin: 0,
          borderRadius: '0.5rem',
          background: 'rgba(15, 23, 42, 0.98)', // Más sólido para mejor visibilidad
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
          /* Ocultar barra de scroll para estética más limpia en Chrome/Firefox */
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.2) transparent'
        }}>
          {results.map((item) => (
            <li
              key={item.codigo}
              style={{
                padding: '0.6rem 0.8rem',
                cursor: 'pointer',
                borderRadius: '0.25rem',
                transition: 'background 0.2s',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              onClick={() => {
                setQuery(item.nombre);
                setIsOpen(false);
                onChange(item.nombre); // Reportar seleccion final a React Hook Form
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500', color: '#f8fafc', lineHeight: '1.2' }}>{item.nombre}</span>
                {item.categoria && (
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>{item.categoria}</span>
                )}
              </div>
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}
