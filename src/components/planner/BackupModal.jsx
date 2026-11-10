import React, { useState, useEffect } from 'react';

export default function BackupModal({ isOpen, onClose, tasks, onRestore }) {
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(tasks, null, 2));
      setCopied(false);
    }
  }, [isOpen, tasks]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestore = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        onRestore(parsed);
        alert('Tasks successfully restored!');
        onClose();
      } else {
        alert('Invalid format: Must be an array of task objects.');
      }
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Backup & Sync Tasks</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
          Export your tasks as JSON for backup, or paste your saved JSON to restore across browsers.
        </p>

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          spellCheck="false"
        />

        <div className="modal-actions">
          <button className="btn-glass" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-glass" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
          <button className="btn-primary" onClick={handleRestore}>
            Restore
          </button>
        </div>
      </div>
    </div>
  );
}

