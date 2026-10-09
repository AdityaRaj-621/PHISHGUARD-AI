// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = null) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const autoDismissTime = duration || (type === 'error' ? 7000 : 4000);

    const newToast = { id, type, message, duration: autoDismissTime };

    setToasts((prev) => {
      const updated = [newToast, ...prev];
      return updated.slice(0, 3); // Max 3 stacked
    });

    if (autoDismissTime > 0) {
      setTimeout(() => {
        removeToast(id);
      }, autoDismissTime);
    }

    return id;
  }, [removeToast]);

  const notify = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur)
  };

  return (
    <ToastContext.Provider value={{ notify, addToast, removeToast }}>
      {children}
      {/* Global Toast Viewport */}
      {toasts.length > 0 && (
        <div className="toast-viewport" role="region" aria-label="Notifications">
          {toasts.map((t) => (
            <Toast
              key={t.id}
              id={t.id}
              type={t.type}
              message={t.message}
              onClose={removeToast}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
