import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ id, type = 'info', message, onClose }) {
  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <div
      className={`toast toast--${type}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <div className="toast__icon">
        {isSuccess && <CheckCircle2 size={18} />}
        {isError && <AlertCircle size={18} />}
        {!isSuccess && !isError && <Info size={18} />}
      </div>
      <div className="toast__content">
        <p className="toast__message">{message}</p>
      </div>
      <button
        type="button"
        className="toast__close"
        onClick={() => onClose(id)}
        aria-label="Dismiss message"
      >
        <X size={16} />
      </button>
    </div>
  );
}
