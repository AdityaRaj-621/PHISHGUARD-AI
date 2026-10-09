import React from 'react';
import './Card.css';

export default function Card({
  children,
  className = '',
  variant = 'default', // 'default', 'alt', 'elevated', 'bordered'
  padding = 'md', // 'none', 'sm', 'md', 'lg'
  onClick = null,
  role = null,
  tabIndex = null,
  ...rest
}) {
  const classes = [
    'ui-card',
    `ui-card--${variant}`,
    `ui-card--p-${padding}`,
    onClick ? 'ui-card--interactive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      {...rest}
    >
      {children}
    </div>
  );
}
