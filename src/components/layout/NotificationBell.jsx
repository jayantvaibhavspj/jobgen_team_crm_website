import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../marketing/Icons';
import { today } from '../../hooks/useMarketingState';

export default function NotificationBell({ state, setView, openModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { leads, tasks } = state;

  // Filter overdue lead follow-ups
  const overdueFollowUps = (leads || []).filter(l => l.follow_up_date && l.follow_up_date < today && l.stage !== 'Won' && l.stage !== 'Lost');
  // Tasks due today or overdue
  const dueTasks = (tasks || []).filter(t => t.due && t.due <= today && t.status !== 'done');

  const totalAlerts = overdueFollowUps.length + dueTasks.length;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="notif-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${totalAlerts} pending)`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {totalAlerts > 0 && <span className="notif-badge">{totalAlerts}</span>}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-head">
            <span>Action Required</span>
            <span className="badge">{totalAlerts} items</span>
          </div>

          <div className="notif-list">
            {overdueFollowUps.map(lead => (
              <div
                key={`overdue-${lead.id}`}
                className="notif-item overdue"
                onClick={() => {
                  setView('leads');
                  openModal('lead-drawer', lead);
                  setIsOpen(false);
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>Follow-up overdue: {lead.name}</div>
                  <div className="muted" style={{ fontSize: '11px', marginTop: '2px' }}>
                    {lead.company} · Due was {lead.follow_up_date}
                  </div>
                </div>
              </div>
            ))}

            {dueTasks.map(task => (
              <div
                key={`task-${task.id}`}
                className="notif-item today"
                onClick={() => {
                  setView('workboard');
                  openModal('task-edit', task);
                  setIsOpen(false);
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>Task due: {task.title}</div>
                  <div className="muted" style={{ fontSize: '11px', marginTop: '2px' }}>
                    Assignee: {task.assignee || 'You'} · {task.due === today ? 'Due today' : `Overdue (${task.due})`}
                  </div>
                </div>
              </div>
            ))}

            {totalAlerts === 0 && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '12px' }}>
                All caught up! No overdue follow-ups or pending tasks for today.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
