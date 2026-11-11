import React from 'react';

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className = '',
  style = {}
}) {
  return (
    <div className={`ui-page-header ${className}`} style={style}>
      <div className="ui-page-header-left">
        {eyebrow && <div className="ui-page-header-eyebrow">{eyebrow}</div>}
        <h1 className="ui-page-header-title">{title}</h1>
        {description && <p className="ui-page-header-desc">{description}</p>}
      </div>
      {actions && <div className="ui-page-header-actions">{actions}</div>}
    </div>
  );
}

export default PageHeader;

