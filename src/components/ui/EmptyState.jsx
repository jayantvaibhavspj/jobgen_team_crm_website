import React from 'react';

export function EmptyState({
  icon = null,
  title,
  description,
  action = null,
  className = '',
  style = {}
}) {
  return (
    <div className={`ui-empty-state ${className}`} style={style}>
      {icon && <div className="ui-empty-icon">{icon}</div>}
      {title && <h4 className="ui-empty-title">{title}</h4>}
      {description && <p className="ui-empty-desc">{description}</p>}
      {action && <div className="ui-empty-action">{action}</div>}
    </div>
  );
}

export default EmptyState;

