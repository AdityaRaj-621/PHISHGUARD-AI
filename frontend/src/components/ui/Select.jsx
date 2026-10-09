import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import './Input.css';

export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const generatedId = useId();
  const selectId = name || generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${disabled ? 'form-field--disabled' : ''} ${className}`}>
      {label && (
        <div className="form-field__header">
          <label htmlFor={selectId} className="form-field__label">
            {label} {required && <span className="form-field__required" aria-hidden="true">*</span>}
          </label>
        </div>
      )}

      {hint && (
        <p id={hintId} className="form-field__hint">
          {hint}
        </p>
      )}

      <div className="input-wrapper">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={[error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined}
          className="form-select"
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="form-field__footer">
          <p id={errorId} className="form-field__error" role="alert">
            <AlertCircle size={14} aria-hidden="true" />
            <span>{error}</span>
          </p>
        </div>
      )}
    </div>
  );
}
