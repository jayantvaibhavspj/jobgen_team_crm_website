import React from 'react';

export function IconButton({
  icon: IconComponent,
  children,
  onClick,
  title,
  ariaLabel,
  bordered = false,
  className = '',
  style = {},
  disabled = false,
  ...props
}) {
  return (
    <button
      type="button"
      className={`ui-icon-btn ${bordered ? 'bordered' : ''} ${className}`}
      onClick={onClick}
      title={title || ariaLabel}
      aria-label={ariaLabel || title}
      disabled={disabled}
      style={style}
      {...props}
    >
      {IconComponent || children}
    </button>
  );
}

export default IconButton;

