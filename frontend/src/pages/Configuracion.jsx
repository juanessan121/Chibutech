import React, { useState } from 'react';
import { Settings, Save, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Simulación de los datos de Configuracion_Global
const configInicial = [
  { clave: 'valor_multa_minga_base', valor: '10.00', tipo_dato: 'decimal', descripcion: 'Valor base de multa por inasistencia a minga ($)' },
  { clave: 'valor_cuota_mensual', valor: '5.00', tipo_dato: 'decimal', descripcion: 'Cuota mensual de mantenimiento del sistema de agua ($)' },
  { clave: 'dias_gracia_pago', valor: '5', tipo_dato: 'entero', descripcion: 'Días de gracia antes de generar interés por mora' },
  { clave: 'nombre_junta', valor: 'Junta de Agua Chibuleo', tipo_dato: 'texto', descripcion: 'Nombre oficial de la organización' },
  { clave: 'ruc_junta', valor: '1891000000001', tipo_dato: 'texto', descripcion: 'RUC de la junta para facturación' },
  { clave: 'email_notificaciones', valor: 'notificaciones@chibuleo.gob.ec', tipo_dato: 'texto', descripcion: 'Correo de salida para alertas del sistema' },
  { clave: 'permitir_pago_parcial', valor: 'true', tipo_dato: 'booleano', descripcion: 'Permitir abonos parciales a deudas de multas' },
  { clave: 'tasa_interes_mora', valor: '0.05', tipo_dato: 'decimal', descripcion: 'Porcentaje de interés mensual por mora' },
];

export default function Configuracion() {
  const [config, setConfig] = useState(configInicial);
  const [editando, setEditando] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (clave, value) => {
    setEditando(prev => ({ ...prev, [clave]: value }));
  };

  const handleToggle = (clave, currentValue) => {
    const newVal = currentValue === 'true' ? 'false' : 'true';
    setConfig(prev => prev.map(c => c.clave === clave ? { ...c, valor: newVal } : c));
    toast.info(`Parámetro "${clave}" actualizado a: ${newVal}`);
  };

  const handleSave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setConfig(prev => prev.map(c => editando[c.clave] !== undefined ? { ...c, valor: editando[c.clave] } : c));
      setEditando({});
      setIsSubmitting(false);
      toast.success('Configuración guardada exitosamente');
    }, 800);
  };

  const renderInput = (item) => {
    const val = editando[item.clave] !== undefined ? editando[item.clave] : item.valor;
    if (item.tipo_dato === 'booleano') {
      return (
        <button
          onClick={() => handleToggle(item.clave, item.valor)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: item.valor === 'true' ? '#10b981' : '#64748b', fontWeight: 'bold' }}
        >
          {item.valor === 'true' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          {item.valor === 'true' ? 'Habilitado' : 'Deshabilitado'}
        </button>
      );
    }
    return (
      <input
        type={item.tipo_dato === 'decimal' || item.tipo_dato === 'entero' ? 'number' : 'text'}
        step={item.tipo_dato === 'decimal' ? '0.01' : undefined}
        className="input-field"
        value={val}
        onChange={e => handleChange(item.clave, e.target.value)}
        style={{ maxWidth: '250px', padding: '0.5rem 0.75rem' }}
      />
    );
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toaster richColors />
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Settings className="text-blue" /> Configuración Global del Sistema
            </h1>
            <p className="text-muted">Parámetros que controlan el comportamiento del ERP de la Junta.</p>
          </div>
          <button className="btn-primary" style={{ width: 'auto', gap: '0.5rem' }} onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <><RefreshCw size={16} className="spin" /> Guardando...</> : <><Save size={16} /> Guardar Cambios</>}
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {config.map((item, idx) => (
            <div
              key={item.clave}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.2rem 1rem',
                borderBottom: idx < config.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  {item.descripcion}
                </p>
                <code style={{ fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.7 }}>{item.clave}</code>
              </div>
              <div>{renderInput(item)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
