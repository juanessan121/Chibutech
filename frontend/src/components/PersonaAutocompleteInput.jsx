import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/axiosConfig';

export default function PersonaAutocompleteInput({ value, onChange, placeholder, includeDependents = false }) {
  const [query, setQuery] = useState(value?.cedula || value?.nombre || '');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rect, setRect] = useState(null);
  const wrapperRef = useRef(null);

  // Sincronizar el estado interno de "query" cuando el prop "value" se limpia externamente
  useEffect(() => {
    if (value === null || value === '') {
      setQuery('');
    } else if (value && value.cedula) {
      setQuery(`${value.nombre} ${value.apellido}`);
    }
  }, [value]);

  const updateRect = () => {
    if (wrapperRef.current) {
      setRect(wrapperRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateRect();
      window.addEventListener('scroll', updateRect, true);
      window.addEventListener('resize', updateRect);
      return () => {
        window.removeEventListener('scroll', updateRect, true);
        window.removeEventListener('resize', updateRect);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignoramos si el click es dentro del input
      if (wrapperRef.current && wrapperRef.current.contains(event.target)) {
        return;
      }
      // Ignoramos si el click es en la lista flotante del portal
      if (event.target.closest('[data-autocomplete-portal]')) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query && query.length >= 2 && isOpen) {
        setLoading(true);
        try {
          const url = `/personas?search=${query}${includeDependents ? '&include_dependents=1' : ''}`;
          const response = await api.get(url);
          if (response.data.status === 'ok') {
            setResults(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching personas", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, isOpen]);

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
        }}
        onFocus={() => {
          if (query.length >= 2) setIsOpen(true);
        }}
      />
      
      {loading && (
        <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
          <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
        </div>
      )}
      
      {isOpen && results.length > 0 && rect && createPortal(
        <ul 
          data-autocomplete-portal="true"
          style={{
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
          background: 'rgba(15, 23, 42, 0.98)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.2) transparent'
        }}>
          {results.map((item) => (
            <li
              key={item.id_persona}
              style={{
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                borderRadius: '0.25rem',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              onMouseDown={(e) => {
                e.preventDefault(); // Evita que se dispare eventos de pérdida de foco si los hay
                setQuery(`${item.nombre} ${item.apellido}`);
                setIsOpen(false);
                onChange(item); // Retornar objeto completo al form
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500', color: '#f8fafc' }}>{item.nombre} {item.apellido}</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>CC: {item.cedula}</span>
              </div>
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}
