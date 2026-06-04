import React from 'react';
import './CardSlider.css';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function CardSlider({ children, steps, currentStep, onNext, onPrev, onSubmit, isSubmitting }) {
  return (
    <div className="card-slider-container">
      {/* Indicadores de paso */}
      <div className="slider-indicators">
        {steps.map((step, idx) => (
          <div key={idx} className={`indicator ${currentStep === idx + 1 ? 'active' : ''} ${currentStep > idx + 1 ? 'completed' : ''}`}>
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
