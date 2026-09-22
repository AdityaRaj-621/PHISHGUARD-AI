import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import './Input.css';

export default function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  hint,
  required = false,
  maxLength,
  showCounter = false,
  prefixIcon = null,
  suffixAction = null,
  mono = false,
  disabled = false,
  autoComplete,
  inputMode,
  autoCapitalize,
  autoCorrect,
  spellCheck,
  className = '',
  ...rest
}) {
  const generatedId = useId();
  const inputId = name || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const charCount = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && charCount >= maxLength * 0.9 && charCount < maxLength;
  const isAtLimit = maxLength && charCount >= maxLength;

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${disabled ? 'form-field--disabled' : ''} ${className}`}>
      {label && (
        <div className="form-field__header">
          <label htmlFor={inputId} className="form-field__label">
            {label} {required && <span className="form-field__required" aria-hidden="true">*</span>}
          </label>
        </div>
      )}

      {hint && (
        <p id={hintId} className="form-field__hint">
          {hint}
        </p>
      )}

      <div className={`input-wrapper ${mono ? 'input-wrapper--mono' : ''} ${prefixIcon ? 'input-wrapper--with-prefix' : ''} ${suffixAction ? 'input-wrapper--with-suffix' : ''}`}>
        {prefixIcon && <span className="input-wrapper__prefix">{prefixIcon}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          spellCheck={spellCheck}
          aria-invalid={Boolean(error)}
          aria-describedby={[error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined}
          className={`form-input ${mono ? 'font-mono' : ''}`}
          {...rest}
        />
        {suffixAction && <div className="input-wrapper__suffix">{suffixAction}</div>}
      </div>

      <div className="form-field__footer">
        {error ? (
          <p id={errorId} className="form-field__error" role="alert">
            <AlertCircle size={14} aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : <div />}

        {showCounter && maxLength && (
          <span className={`form-field__counter ${isAtLimit ? 'counter--limit' : isNearLimit ? 'counter--warning' : ''}`}>
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
