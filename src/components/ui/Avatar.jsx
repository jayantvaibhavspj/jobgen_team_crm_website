import React from 'react';

export function Avatar({
  name = 'User',
  src = null,
  size = 'md', // xs | sm | md | lg
  className = '',
  style = {},
  ...props
}) {
  const initials = (name || 'U')
    .split(' ')
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`ui-avatar ui-avatar-${size} ${className}`} style={style} title={name} {...props}>
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default Avatar;
