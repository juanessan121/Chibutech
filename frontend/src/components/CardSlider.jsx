import React from 'react';
import './CardSlider.css';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function CardSlider({ children, steps, currentStep, onNext, onPrev, onSubmit, isSubmitting }) {
  const progressPct = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="card-slider-container">
      {/* Barra de progreso */}
      <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, var(--primary), #10b981)', borderRadius: '999px', transition: 'width 0.4s cubic-bezier(0.25,1,0.5,1)' }} />
      </div>

      {/* Indicadores de paso */}
      <div className="slider-indicators">
        {steps.map((step, idx) => (
          <div key={idx} className={`indicator ${currentStep === idx + 1 ? 'active' : ''} ${currentStep > idx + 1 ? 'completed' : ''}`}>
            {currentStep > idx + 1 && <Check size={12} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />}
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      <div className="slider-viewport">
        <div className="slider-track">
          {React.Children.map(children, (child, idx) => (
            <div className={`slider-slide ${currentStep === idx + 1 ? 'active' : ''}`} key={idx}>
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="slider-navigation">
        <button type="button" className="btn-secondary" onClick={onPrev} disabled={currentStep === 1} style={{ opacity: currentStep === 1 ? 0 : 1 }}>
          <ArrowLeft size={18} /> Atrás
        </button>
        {currentStep < steps.length ? (
          <button type="button" className="btn-primary" onClick={onNext}>
            Siguiente <ArrowRight size={18} />
          </button>
        ) : (
          <button type="button" className="btn-primary" style={{ background: '#10b981' }} onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : <><Check size={18} /> Finalizar Registro</>}
          </button>
        )}
      </div>
    </div>
  );
}
