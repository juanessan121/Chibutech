import React from 'react';
import { FileQuestion } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ title, message, icon: Icon = FileQuestion, actionButton }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={48} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionButton && <div className="empty-state-action">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
