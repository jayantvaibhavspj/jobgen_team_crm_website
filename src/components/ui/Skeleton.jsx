import React from 'react';

export function Skeleton({ width = '100%', height = '16px', borderRadius = 'var(--radius-sm)', className = '', style = {} }) {
  return (
    <div
      className={`ui-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
      aria-hidden="true"
    />
  );
}

export default Skeleton;

