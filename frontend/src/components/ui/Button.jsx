import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  as = null,
  to = null,
  onClick,
  className = '',
  loadingLabel = null,
  ...rest
}) {
  const isButtonDisabled = disabled || loading;
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    loading ? 'btn--loading' : '',
    className
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {loading ? (
        <Spinner size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} color="currentColor" />
      ) : (
        icon && iconPosition === 'left' && <span className="btn__icon btn__icon--left">{icon}</span>
      )}
      <span className="btn__label">{loading && loadingLabel ? loadingLabel : children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn__icon btn__icon--right">{icon}</span>
      )}
    </>
  );

  if (as === Link || to) {
    if (disabled) {
      return (
        <span className={classes} aria-disabled="true" role="link" tabIndex={-1}>
          {content}
        </span>
      );
    }
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={isButtonDisabled}
      aria-busy={loading}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
}
