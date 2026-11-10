import React from 'react';
import { Icon } from './Icons';

export default function Automations({ state, openModal, showToast }) {
  const { rules, setRules } = state;

  const handleToggle = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    showToast('Automation status updated.');
  };

  const handleTest = (r) => {
    if (!r.enabled) {
      showToast('Enable the rule first.');
      return;
    }
    setRules(prev => prev.map(rule => rule.id === r.id ? { ...rule, runs: (rule.runs || 0) + 1 } : rule));
    openModal('rule-test-result', r);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this rule?')) {
      setRules(prev => prev.filter(r => r.id !== id));
      showToast('Rule deleted.');
    }
  };

  const enabledCount = rules.filter(r => r.enabled).length;
  const totalRuns = rules.reduce((n, r) => n + (r.runs || 0), 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Smart Workflows</div>
          <h1>Automations</h1>
          <p className="subtitle">Active CRM event triggers: follow-ups, timeline logs, and celebratory alerts.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('rule-new')}>
            <Icon name="plus" /> Create rule
          </button>
        </div>
      </div>

      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Total rules</span>
            <span className="metric-icon"><Icon name="automations" /></span>
          </div>
          <strong>{rules.length}</strong>
          <small>Configured triggers</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Enabled</span>
            <span className="metric-icon"><Icon name="check" /></span>
          </div>
          <strong>{enabledCount}</strong>
          <small>Live triggers in workspace</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Active Executions</span>
            <span className="metric-icon"><Icon name="analytics" /></span>
          </div>
          <strong>{totalRuns}</strong>
          <small>Total triggered events</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Time saved</span>
            <span className="metric-icon"><Icon name="workboard" /></span>
          </div>
          <strong>{(totalRuns * 0.25 + 2).toFixed(1)} h</strong>
          <small>Automated follow-up hours</small>
        </div>
      </div>

      <div className="three-col">
        {rules.map(r => (
          <section key={r.id} className="card">
            <div className="card-head">
              <h3>{r.name}</h3>
              <button
                className={`switch ${r.enabled ? 'on' : ''}`}
                onClick={() => handleToggle(r.id)}
                role="switch"
                aria-checked={r.enabled}
              >
                <i></i>
              </button>
            </div>

            <div className="rule">
              <Icon name="automations" />
              <div>
                <small className="muted">WHEN</small>
                <p style={{ margin: '3px 0', fontWeight: 600 }}>{r.trigger}</p>
              </div>
            </div>

            <div className="rule">
              <Icon name="arrow" />
              <div>
                <small className="muted">THEN</small>
                <p style={{ margin: '3px 0', fontWeight: 600 }}>{r.action}</p>
              </div>
            </div>

            <p className="muted small-text">{r.runs || 0} real executions logged</p>

            <div className="actions">
              <button
                className="btn small"
                onClick={() => handleTest(r)}
                disabled={!r.enabled}
              >
                Test rule
              </button>
              <button className="icon-btn" onClick={() => handleDelete(r.id)} title="Delete rule">
                <Icon name="trash" />
              </button>
            </div>
          </section>
        ))}
      </div>

      <div className="notice" style={{ marginTop: '22px' }}>
        ✦ Live Automations: When "New lead added" fires, a follow-up date 2 days out and a timeline note are created automatically. When a lead is moved to "Won", a congratulations notification and customer onboarding log are posted.
      </div>
    </div>
  );
}
