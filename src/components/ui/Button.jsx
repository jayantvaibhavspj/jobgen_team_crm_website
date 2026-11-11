import React from 'react';

export function Button({
  children,
  variant = 'secondary', // primary | secondary | ghost | danger
  size = 'md',          // sm | md | lg
  icon: IconComponent = null,
  iconRight = null,
  loading = false,
  disabled = false,
  className = '',
  style = {},
  type = 'button',
  onClick,
  ...props
}) {
  const variantClass = `ui-btn-${variant}`;
  const sizeClass = `ui-btn-${size}`;

  return (
    <button
      type={type}
      className={`ui-btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      style={style}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="ui-btn-spinner" aria-hidden="true" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'uiSpin 0.7s linear infinite' }} />
      ) : IconComponent ? (
        <span className="ui-btn-icon" aria-hidden="true">{IconComponent}</span>
      ) : null}

      <span>{children}</span>

      {iconRight && <span className="ui-btn-icon-right" aria-hidden="true">{iconRight}</span>}
    </button>
  );
}

export default Button;
