import React, { useId, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import './Input.css';

export default function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  maxLength = 5000,
  showCounter = true,
  autoGrow = true,
  minHeight = 240,
  maxHeight = 560,
  disabled = false,
  spellCheck = false,
  className = '',
  ...rest
}) {
  const generatedId = useId();
  const inputId = name || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const textareaRef = useRef(null);

  const charCount = typeof value === 'string' ? value.length : 0;
  const isNearLimit = maxLength && charCount >= maxLength * 0.9 && charCount < maxLength;
  const isAtLimit = maxLength && charCount >= maxLength;

  // Auto-grow calculation
  useEffect(() => {
    if (autoGrow && textareaRef.current) {
      textareaRef.current.style.height = `${minHeight}px`;
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight > minHeight) {
        textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
      }
    }
  }, [value, autoGrow, minHeight, maxHeight]);

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

      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          spellCheck={spellCheck}
          aria-invalid={Boolean(error)}
          aria-describedby={[error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined}
          className="form-textarea"
          style={{ minHeight: `${minHeight}px` }}
          {...rest}
        />
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
