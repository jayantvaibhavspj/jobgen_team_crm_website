import React from 'react';
import { Icon } from './Icons';

export default function Automations({ state, openModal, showToast }) {
  const { rules, setRules } = state;

  const handleToggle = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    showToast('Rule status updated.');
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
          <p className="subtitle">Let the small things take care of themselves.</p>
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
          <small>Your rule collection</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Enabled</span>
            <span className="metric-icon"><Icon name="check" /></span>
          </div>
          <strong>{enabledCount}</strong>
          <small>Active workflow triggers</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Simulated runs</span>
            <span className="metric-icon"><Icon name="analytics" /></span>
          </div>
          <strong>{totalRuns}</strong>
          <small>Automated executions</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Time saved</span>
            <span className="metric-icon"><Icon name="workboard" /></span>
          </div>
          <strong>2.4 h</strong>
          <small>Estimated efficiency gain</small>
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
                <p style={{ margin: '3px 0' }}>{r.trigger}</p>
              </div>
            </div>

            <div className="rule">
              <Icon name="arrow" />
              <div>
                <small className="muted">THEN</small>
                <p style={{ margin: '3px 0' }}>{r.action}</p>
              </div>
            </div>

            <p className="muted small-text">{r.runs || 0} simulated runs</p>

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
        Rules run inside your unified workspace. Enabling a rule simulates automatic actions across your marketing stack.
      </div>
    </div>
  );
}
