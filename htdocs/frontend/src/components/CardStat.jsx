import React from 'react';
import './CardStat.css';

const CardStat = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className={`card-stat ${colorClass}`}>
      <div className="card-stat-info">
        <h3>{title}</h3>
        <p className="card-stat-value">{value}</p>
      </div>
      <div className="card-stat-icon">
        <Icon size={32} />
      </div>
    </div>
  );
};

export default CardStat;
