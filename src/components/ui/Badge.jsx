import React from 'react';

export function Badge({
  children,
  variant = 'default', // default | primary | success | warning | danger | info
  dot = false,
  className = '',
  style = {},
  ...props
}) {
  return (
    <span className={`ui-badge ui-badge-${variant} ${className}`} style={style} {...props}>
      {dot && <span className="ui-badge-dot" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
