import React from 'react';
import { CheckCircle, Printer } from 'lucide-react';

export default function ShortcutsFooter({ onClearCompleted, onPrint }) {
  return (
    <footer className="app-footer">
      <div className="shortcuts-hint">
        <span>
          <span className="kbd">N</span> New Task
        </span>
        <span>
          <span className="kbd">/</span> Search
        </span>
        <span>
          <span className="kbd">Esc</span> Close
        </span>
        <span
          style={{
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <CheckCircle size={12} />
          Auto-Saved
        </span>
      </div>

      <div className="footer-tools">
        {onPrint && (
          <button className="btn-glass" onClick={onPrint} title="Print Daily Checklist">
            <Printer size={13} />
            Print
          </button>
        )}
        <button className="btn-glass" onClick={onClearCompleted}>
          Clear Completed
        </button>
      </div>
    </footer>
  );
}
