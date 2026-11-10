import React, { useState, useRef } from 'react';
import { Icon } from './Icons';
import LeadDrawer from './LeadDrawer';

const stages = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];

export default function LeadCRM({ state, openModal, showToast }) {
  const { leads, setLeads, teamMembers = [], user } = state;

  const [viewMode, setViewMode] = useState('board'); // 'board' | 'list'
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [myLeadsOnly, setMyLeadsOnly] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const fileInputRef = useRef(null);

  const currentUserName = user?.user_metadata?.full_name || 'Jayant Vaibhav';

  // Filters
  const filtered = (leads || []).filter(lead => {
    const matchesSearch =
      (lead.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (lead.company || '').toLowerCase().includes(search.toLowerCase());

    const matchesAssignee =
      assigneeFilter === 'All' ||
      lead.assigned_to === assigneeFilter ||
      lead.assigned_to_name === assigneeFilter;

    const matchesMyLeads =
      !myLeadsOnly ||
      lead.assigned_to === user?.id ||
      lead.assigned_to_name === currentUserName;

    return matchesSearch && matchesAssignee && matchesMyLeads;
  });

  // Calculate Weighted Forecast
  const totalPipelineValue = filtered
    .filter(l => l.stage !== 'Lost')
    .reduce((sum, l) => sum + Number(l.value || 0), 0);

  const weightedForecast = filtered
    .filter(l => l.stage !== 'Lost')
    .reduce((sum, l) => {
      const prob = l.stage === 'Won' ? 100 : Number(l.probability || 20);
      return sum + (Number(l.value || 0) * prob) / 100;
    }, 0);

  const handleStageChange = (id, newStage) => {
    setLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, stage: newStage } : l))
    );
    showToast(`Lead moved to ${newStage}.`);
  };

  const handleUpdateLead = (updated) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
  };

  const handleDeleteLead = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    showToast('Lead deleted.');
  };

  // Drag & drop handlers
  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    const id = draggingId || e.dataTransfer.getData('text/plain');
    if (id) {
      handleStageChange(id, stage);
    }
    setDraggingId(null);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Stage', 'Value', 'Probability', 'Source', 'Assigned To', 'Follow Up Date'];
    const rows = filtered.map(l => [
      `"${l.name || ''}"`,
      `"${l.company || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.stage || 'New'}"`,
      Number(l.value || 0),
      Number(l.probability || 20),
      `"${l.source || 'Website'}"`,
      `"${l.assigned_to_name || 'Unassigned'}"`,
      `"${l.follow_up_date || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Leads exported to CSV.');
  };

  // CSV Import
  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) throw new Error('CSV is empty or missing headers');

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
        const importedLeads = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
          const lead = {
            id: `lead-import-${Date.now()}-${i}`,
            name: values[headers.indexOf('name')] || `Imported Lead ${i}`,
            company: values[headers.indexOf('company')] || 'Unknown',
            email: values[headers.indexOf('email')] || '',
            phone: values[headers.indexOf('phone')] || '',
            stage: stages.includes(values[headers.indexOf('stage')]) ? values[headers.indexOf('stage')] : 'New',
            value: Number(values[headers.indexOf('value')]) || 1000,
            probability: Number(values[headers.indexOf('probability')]) || 20,
            source: values[headers.indexOf('source')] || 'Import',
            assigned_to_name: values[headers.indexOf('assigned to')] || 'Unassigned',
            created_at: new Date().toISOString()
          };
          importedLeads.push(lead);
        }

        setLeads(prev => [...importedLeads, ...prev]);
        showToast(`${importedLeads.length} leads imported successfully.`);
      } catch (err) {
        showToast('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Customer Acquisition</div>
          <h1>Lead CRM</h1>
          <p className="subtitle">Realtime team pipeline with weighted forecasting.</p>
        </div>

        <div className="actions">
          <button className="btn small" onClick={handleExportCSV}>
            <Icon name="upload" style={{ transform: 'rotate(180deg)' }} /> Export CSV
          </button>
          <button className="btn small" onClick={() => fileInputRef.current?.click()}>
            <Icon name="upload" /> Import CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImportCSV}
          />
          <button className="btn primary" onClick={() => openModal('lead-new')}>
            <Icon name="plus" /> Add lead
          </button>
        </div>
      </div>

      {/* Weighted Forecast Banner */}
      <div className="forecast-banner">
        <div className="forecast-stat">
          <small>TOTAL PIPELINE</small>
          <strong>${totalPipelineValue.toLocaleString()}</strong>
        </div>
        <div className="forecast-stat">
          <small>WEIGHTED FORECAST</small>
          <strong style={{ color: 'var(--primary)' }}>${Math.round(weightedForecast).toLocaleString()}</strong>
        </div>
        <div className="forecast-stat">
          <small>ACTIVE OPPORTUNITIES</small>
          <strong>{filtered.filter(l => l.stage !== 'Won' && l.stage !== 'Lost').length} deals</strong>
        </div>
        <div className="forecast-stat">
          <small>WON REVENUE</small>
          <strong className="positive">
            ${filtered.filter(l => l.stage === 'Won').reduce((s, l) => s + Number(l.value || 0), 0).toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Filters & View Controls */}
      <div className="toolbar">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search">
            <Icon name="search" />
            <input
              type="search"
              placeholder="Search leads, companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={`btn small ${myLeadsOnly ? 'primary' : ''}`}
            onClick={() => setMyLeadsOnly(!myLeadsOnly)}
          >
            My leads
          </button>

          <select
            value={assigneeFilter}
            onChange={e => setAssigneeFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="All">All Assignees</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.full_name}>{m.full_name}</option>
            ))}
          </select>
        </div>

        <div className="crm-view-toggles">
          <button
            type="button"
            className={`crm-view-btn ${viewMode === 'board' ? 'active' : ''}`}
            onClick={() => setViewMode('board')}
          >
            <Icon name="workboard" style={{ width: '14px', height: '14px' }} /> Board
          </button>
          <button
            type="button"
            className={`crm-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <Icon name="file" style={{ width: '14px', height: '14px' }} /> List
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'board' && (
        <div className="lead-board">
          {stages.map(stage => {
            const stageLeads = filtered.filter(l => l.stage === stage);
            const stageTotal = stageLeads.reduce((s, l) => s + Number(l.value || 0), 0);

            return (
              <section
                key={stage}
                className="lead-column"
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, stage)}
              >
                <div className="column-head">
                  <div>
                    <span style={{ fontWeight: 800 }}>{stage}</span>
                    <small className="muted" style={{ display: 'block', fontSize: '10px', marginTop: '2px' }}>
                      ${stageTotal.toLocaleString()}
                    </small>
                  </div>
                  <span className="badge">{stageLeads.length}</span>
                </div>

                {stageLeads.map(lead => (
                  <article
                    key={lead.id}
                    className="card lead-card"
                    draggable
                    onDragStart={e => handleDragStart(e, lead.id)}
                    onClick={() => setSelectedLead(lead)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '13px', margin: 0 }}>{lead.name}</h3>
                      <span className="badge" style={{ fontSize: '9px' }}>
                        {lead.probability || 20}%
                      </span>
                    </div>

                    <p style={{ margin: '4px 0 10px', color: 'var(--muted-foreground)', fontSize: '11px' }}>
                      {lead.company}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px' }}>
                        ${Number(lead.value || 0).toLocaleString()}
                      </strong>
                      <span className="badge" style={{ fontSize: '9px' }}>
                        {lead.assigned_to_name || 'Unassigned'}
                      </span>
                    </div>

                    {lead.follow_up_date && (
                      <div className="muted" style={{ fontSize: '9px', marginTop: '8px' }}>
                        📅 Follow-up: {lead.follow_up_date}
                      </div>
                    )}
                  </article>
                ))}

                {stageLeads.length === 0 && (
                  <p className="muted small-text" style={{ textAlign: 'center', marginTop: '24px' }}>
                    Drop leads here
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* TABLE / LIST VIEW */}
      {viewMode === 'list' && (
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Company</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Win Prob.</th>
                <th>Source</th>
                <th>Assigned To</th>
                <th>Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id} onClick={() => setSelectedLead(lead)}>
                  <td><b>{lead.name}</b></td>
                  <td>{lead.company}</td>
                  <td>
                    <span className={`badge ${lead.stage === 'Won' ? 'success' : lead.stage === 'Lost' ? 'error' : ''}`}>
                      {lead.stage}
                    </span>
                  </td>
                  <td><b>${Number(lead.value || 0).toLocaleString()}</b></td>
                  <td>{lead.probability || 20}%</td>
                  <td>{lead.source || 'Website'}</td>
                  <td>{lead.assigned_to_name || 'Unassigned'}</td>
                  <td>{lead.follow_up_date || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted-foreground)' }}>
                    No leads match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail & Timeline Drawer */}
      <LeadDrawer
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdateLead={handleUpdateLead}
        onDeleteLead={handleDeleteLead}
        teamMembers={teamMembers}
        showToast={showToast}
      />
    </div>
  );
}
