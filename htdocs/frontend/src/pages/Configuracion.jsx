import React from 'react';
import { Save } from 'lucide-react';
import './Configuracion.css';

const Configuracion = () => {
  return (
    <>
      <div className="page-header">
        <h1>Configuración Global</h1>
        <div className="page-actions">
          <button className="btn btn-primary">
            <Save size={18} />
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="config-grid">
        <div className="content-card config-card">
          <h3>Módulo de Mingas</h3>
          <div className="config-item">
             <div className="config-info">
                <h4>Permitir inscripciones tardías</h4>
                <p>Habilitar el registro a mingas después de la fecha límite.</p>
             </div>
             <label className="switch">
               <input type="checkbox" defaultChecked />
               <span className="slider round"></span>
             </label>
          </div>
          <div className="config-item">
             <div className="config-info">
                <h4>Valor por defecto Multa (Minga)</h4>
                <p>Monto automático a cobrar por inasistencia.</p>
             </div>
             <input type="number" className="search-input" style={{ width: '100px' }} defaultValue={20} />
          </div>
        </div>

        <div className="content-card config-card">
          <h3>Sistema</h3>
          <div className="config-item">
             <div className="config-info">
                <h4>Modo Mantenimiento</h4>
                <p>Deshabilita el acceso a usuarios regulares.</p>
             </div>
             <label className="switch">
               <input type="checkbox" />
               <span className="slider round"></span>
             </label>
          </div>
          <div className="config-item">
             <div className="config-info">
                <h4>Notificaciones por SMS</h4>
                <p>Enviar alertas de multas y mingas por SMS.</p>
             </div>
             <label className="switch">
               <input type="checkbox" defaultChecked />
               <span className="slider round"></span>
             </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuracion;
