import React, { useState, useRef, useEffect } from 'react';
import { Plus, Clock, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import { readFileAsDataUrl, formatFileSize } from '../../utils/fileUtils';

export default function QuickAdd({ isOpen, setIsOpen, onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [dueTime, setDueTime] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadError('');

    try {
      const readResults = [];
      for (const file of files) {
        const att = await readFileAsDataUrl(file);
        readResults.push(att);
      }
      setAttachments((prev) => [...prev, ...readResults]);
    } catch (err) {
      setUploadError(err.message || 'Error reading file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onAdd(title.trim(), priority, category, dueTime, attachments);
    setTitle('');
    setDueTime('');
    setAttachments([]);
    setUploadError('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button className="btn-add-toggle" onClick={() => setIsOpen(true)}>
        <Plus size={15} strokeWidth={2} />
        Add a new task (Press N)
      </button>
    );
  }

  return (
    <div className="add-task-box">
      <div className="add-input-row">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a task and press Enter..."
        />
        <button className="btn-primary" onClick={handleSubmit}>
          <Plus size={14} strokeWidth={2} />
          Add
        </button>
      </div>

      {/* Uploaded attachments preview chips */}
      {attachments.length > 0 && (
        <div className="add-attachments-preview">
          {attachments.map((att) => (
            <div key={att.id} className="attachment-chip">
              {att.type.startsWith('image/') ? (
                <ImageIcon size={12} className="att-chip-icon" />
              ) : (
                <FileText size={12} className="att-chip-icon" />
              )}
              <span className="att-chip-name">{att.name}</span>
              <span className="att-chip-size">({formatFileSize(att.size)})</span>
              <button
                type="button"
                className="att-chip-remove"
                onClick={() => removeAttachment(att.id)}
                title="Remove file"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadError && (
        <div style={{ color: 'var(--color-danger)', fontSize: '11.5px', marginTop: '4px' }}>
          {uploadError}
        </div>
      )}

      <div className="add-options-row">
        {/* Priority Chips */}
        <div className="add-chips">
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '2px' }}>
            Priority:
          </span>
          {['low', 'medium', 'high'].map((p) => (
            <button
              key={p}
              type="button"
              className={`chip-select ${priority === p ? 'active' : ''}`}
              onClick={() => setPriority(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Tag Chips */}
        <div className="add-chips">
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '2px' }}>
            Tag:
          </span>
          {['Work', 'Personal', 'Focus', 'Urgent'].map((c) => (
            <button
              key={c}
              type="button"
              className={`chip-select ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* File Attach Button */}
        <div className="add-chips">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="chip-select"
            onClick={() => fileInputRef.current?.click()}
            title="Attach images, PDFs, or files (max 2.5MB)"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Paperclip size={12} />
            <span>Attach File</span>
          </button>
        </div>

        {/* Due Time */}
        <div className="add-chips" style={{ marginLeft: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Due time (e.g. 10:00 AM)"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                padding: '3px 7px',
                fontSize: '11.5px',
                width: '130px',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
