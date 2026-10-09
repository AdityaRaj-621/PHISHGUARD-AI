import React from 'react';
import './Badge.css';

export default function Badge({
  children,
  variant = 'neutral', // 'primary', 'success', 'warning', 'danger', 'critical', 'neutral'
  size = 'md', // 'sm', 'md', 'lg'
  icon = null,
  pattern = 'solid', // 'solid', 'dashed', 'double', 'dotted'
  className = '',
  ...rest
}) {
  const classes = [
    'ui-badge',
    `ui-badge--${variant}`,
    `ui-badge--${size}`,
    `ui-badge--pattern-${pattern}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...rest}>
      {icon && <span className="ui-badge__icon">{icon}</span>}
      <span className="ui-badge__text">{children}</span>
    </span>
  );
}
