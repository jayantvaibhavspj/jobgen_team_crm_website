import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';
import { dataLayer } from '../../lib/data';

const stages = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];

export default function LeadDrawer({ lead, isOpen, onClose, onUpdateLead, onDeleteLead, teamMembers = [], showToast }) {
  const [currentLead, setCurrentLead] = useState(lead);
  const [timeline, setTimeline] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  useEffect(() => {
    setCurrentLead(lead);
    if (lead?.id) {
      dataLayer.fetchLeadTimeline(lead.id).then(setTimeline);
    }
  }, [lead]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentLead) return null;

  const handleStageClick = async (stage) => {
    const updated = { ...currentLead, stage };
    setCurrentLead(updated);
    onUpdateLead(updated);

    // Record timeline entry
    await dataLayer.addTimelineEntry({
      lead_id: currentLead.id,
      title: `Stage updated to ${stage}`,
      note: `Moved lead to ${stage} stage.`,
      type: 'status_change'
    });
    const refreshed = await dataLayer.fetchLeadTimeline(currentLead.id);
    setTimeline(refreshed);
    showToast(`Lead stage updated to ${stage}.`);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      const entry = await dataLayer.addTimelineEntry({
        lead_id: currentLead.id,
        title: 'Note added',
        note: newNote.trim(),
        type: 'note'
      });
      setTimeline(prev => [entry, ...prev]);
      setNewNote('');
      showToast('Note added to lead timeline.');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleSaveField = (field, val) => {
    const updated = { ...currentLead, [field]: val };
    setCurrentLead(updated);
    onUpdateLead(updated);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Lead details">
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow">{currentLead.company}</div>
            <h2 style={{ fontSize: '22px', margin: '4px 0' }}>{currentLead.name}</h2>
            <span className={`badge ${currentLead.stage === 'Won' ? 'success' : currentLead.stage === 'Lost' ? 'error' : 'primary'}`}>
              {currentLead.stage} Stage
            </span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close drawer">
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer-body">
          {/* Stage Progression Pills */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)' }}>PIPELINE STAGE</label>
            <div className="stage-pills">
              {stages.map(st => (
                <button
                  key={st}
                  type="button"
                  className={`stage-pill ${currentLead.stage === st ? 'active' : ''}`}
                  onClick={() => handleStageClick(st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="field">
              <label>Deal Value ($)</label>
              <input
                type="number"
                value={currentLead.value || 0}
                onChange={e => handleSaveField('value', Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Win Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={currentLead.probability || 20}
                onChange={e => handleSaveField('probability', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Assigned To</label>
              <select
                value={currentLead.assigned_to || currentLead.assigned_to_name || ''}
                onChange={e => {
                  const member = teamMembers.find(m => m.id === e.target.value || m.full_name === e.target.value);
                  handleSaveField('assigned_to', member?.id || null);
                  handleSaveField('assigned_to_name', member?.full_name || e.target.value);
                  showToast(`Assigned to ${member?.full_name || e.target.value}.`);
                }}
              >
                <option value="">Unassigned</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id || m.full_name}>{m.full_name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Follow-up Date</label>
              <input
                type="date"
                value={currentLead.follow_up_date || ''}
                onChange={e => handleSaveField('follow_up_date', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                value={currentLead.email || ''}
                placeholder="contact@company.com"
                onChange={e => handleSaveField('email', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={currentLead.phone || ''}
                placeholder="+1 (555) 000-0000"
                onChange={e => handleSaveField('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Lead Source</label>
            <select
              value={currentLead.source || 'Website'}
              onChange={e => handleSaveField('source', e.target.value)}
            >
              <option>Website</option>
              <option>LinkedIn</option>
              <option>Referral</option>
              <option>Campaign</option>
              <option>Cold Outreach</option>
            </select>
          </div>

          <div className="field">
            <label>Notes & Background</label>
            <textarea
              rows={3}
              value={currentLead.notes || ''}
              placeholder="Background notes on pain points, tech stack, budget..."
              onChange={e => handleSaveField('notes', e.target.value)}
            />
          </div>

          {/* Activity Timeline & Notes */}
          <div style={{ marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Activity & Timeline</h3>

            <form onSubmit={handleAddNote} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  placeholder="Log a call, email, or meeting note..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn primary" disabled={isSubmittingNote || !newNote.trim()}>
                  Add note
                </button>
              </div>
            </form>

            <div className="timeline-list">
              {timeline.map(entry => (
                <div key={entry.id} className="timeline-entry">
                  <div className="timeline-dot"></div>
                  <div className="timeline-box">
                    <div className="timeline-meta">
                      <b>{entry.title}</b>
                      <span>{new Date(entry.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                    <div>{entry.note}</div>
                  </div>
                </div>
              ))}

              {timeline.length === 0 && (
                <p className="muted small-text" style={{ paddingLeft: '8px' }}>
                  No timeline events recorded yet. Add your first note above.
                </p>
              )}
            </div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn danger small"
              onClick={() => {
                if (window.confirm(`Delete ${currentLead.name}?`)) {
                  onDeleteLead(currentLead.id);
                  onClose();
                }
              }}
            >
              Delete lead
            </button>
            <button type="button" className="btn primary small" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
