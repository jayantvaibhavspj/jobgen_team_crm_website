import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export default function CampaignDrawer({ campaign, isOpen, onClose, onUpdateCampaign, onDeleteCampaign, showToast }) {
  const [data, setData] = useState(campaign);

  useEffect(() => {
    setData(campaign);
  }, [campaign]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const handleSave = (field, val) => {
    const updated = { ...data, [field]: val };
    setData(updated);
    onUpdateCampaign(updated);
  };

  const spent = Number(data.spent || 0);
  const budget = Number(data.budget || 1);
  const burnRate = Math.min(100, Math.round((spent / budget) * 100));

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Campaign details">
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow">{data.platform} Marketing</div>
            <h2 style={{ fontSize: '22px', margin: '4px 0' }}>{data.name}</h2>
            <span className={`badge ${data.status === 'Active' ? 'success' : ''}`}>
              {data.status} Status
            </span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close drawer">
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer-body">
          <div className="field">
            <label>Campaign Status</label>
            <select
              value={data.status}
              onChange={e => {
                handleSave('status', e.target.value);
                showToast(`Campaign status updated to ${e.target.value}.`);
              }}
            >
              <option>Draft</option>
              <option>Active</option>
              <option>Paused</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Budget ($)</label>
              <input
                type="number"
                value={data.budget || 0}
                onChange={e => handleSave('budget', Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Spent So Far ($)</label>
              <input
                type="number"
                value={data.spent || 0}
                onChange={e => handleSave('spent', Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
              <span>Budget Utilization</span>
              <b>{burnRate}% deployed</b>
            </div>
            <div className="progress">
              <i style={{ width: `${burnRate}%`, background: burnRate > 90 ? 'var(--error)' : 'var(--primary)' }}></i>
            </div>
          </div>

          <div className="field" style={{ marginTop: '18px' }}>
            <label>Campaign Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={data.progress || 0}
              onChange={e => handleSave('progress', Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Target Audience & Objectives</label>
            <textarea
              rows={4}
              placeholder="Target demographics, value prop, key performance indicators..."
              defaultValue="Targeting VP of Engineering & Heads of Talent across B2B SaaS in North America."
            />
          </div>

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn danger small"
              onClick={() => {
                if (window.confirm(`Delete campaign ${data.name}?`)) {
                  onDeleteCampaign(data.id);
                  onClose();
                }
              }}
            >
              Delete campaign
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
