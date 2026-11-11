import React from 'react';

export function Card({ children, className = '', interactive = false, style = {}, ...props }) {
  return (
    <div className={`ui-card ${interactive ? 'interactive' : ''} ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', style = {}, ...props }) {
  return (
    <div className={`ui-card-header ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', style = {}, ...props }) {
  return (
    <h3 className={`ui-card-title ${className}`} style={style} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', style = {}, ...props }) {
  return (
    <p className={`ui-card-description ${className}`} style={style} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', style = {}, ...props }) {
  return (
    <div className={`ui-card-content ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', style = {}, ...props }) {
  return (
    <div className={`ui-card-footer ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}

export default Card;

