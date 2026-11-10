import React, { useState } from 'react';
import { Icon } from './Icons';
import { uid, today } from '../../hooks/useMarketingState';

export default function Modals({ modalType, modalData, closeModal, state, showToast }) {
  if (!modalType) return null;

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {modalType === 'task-new' && (
          <TaskModalForm
            isNew
            closeModal={closeModal}
            tasks={state.tasks}
            setTasks={state.setTasks}
            showToast={showToast}
          />
        )}
        {modalType === 'task-edit' && (
          <TaskModalForm
            task={modalData}
            closeModal={closeModal}
            tasks={state.tasks}
            setTasks={state.setTasks}
            showToast={showToast}
          />
        )}
        {modalType === 'event-new' && (
          <EventModalForm
            isNew
            initialDate={modalData?.date}
            closeModal={closeModal}
            events={state.events}
            setEvents={state.setEvents}
            showToast={showToast}
          />
        )}
        {modalType === 'event-edit' && (
          <EventModalForm
            event={modalData}
            closeModal={closeModal}
            events={state.events}
            setEvents={state.setEvents}
            showToast={showToast}
          />
        )}
        {modalType === 'lead-new' && (
          <LeadModalForm
            isNew
            closeModal={closeModal}
            leads={state.leads}
            setLeads={state.setLeads}
            showToast={showToast}
          />
        )}
        {modalType === 'lead-edit' && (
          <LeadModalForm
            lead={modalData}
            closeModal={closeModal}
            leads={state.leads}
            setLeads={state.setLeads}
            showToast={showToast}
          />
        )}
        {modalType === 'campaign-new' && (
          <CampaignModalForm
            isNew
            closeModal={closeModal}
            campaigns={state.campaigns}
            setCampaigns={state.setCampaigns}
            showToast={showToast}
          />
        )}
        {modalType === 'campaign-edit' && (
          <CampaignModalForm
            campaign={modalData}
            closeModal={closeModal}
            campaigns={state.campaigns}
            setCampaigns={state.setCampaigns}
            showToast={showToast}
          />
        )}
        {modalType === 'competitor-new' && (
          <CompetitorModalForm
            closeModal={closeModal}
            competitors={state.competitors}
            setCompetitors={state.setCompetitors}
            showToast={showToast}
          />
        )}
        {modalType === 'rule-new' && (
          <RuleModalForm
            closeModal={closeModal}
            rules={state.rules}
            setRules={state.setRules}
            showToast={showToast}
          />
        )}
        {modalType === 'rule-test-result' && (
          <div>
            <div className="modal-head">
              <h2>Simulation complete</h2>
              <button className="icon-btn" onClick={closeModal}><Icon name="close" /></button>
            </div>
            <div className="notice">Automatic trigger evaluated successfully.</div>
            <p><b>Trigger:</b> {modalData?.trigger}</p>
            <p><b>Prepared action:</b> {modalData?.action}</p>
            <div className="assistant-response">
              Hi there! Thanks for connecting with Jobgen.ai. We’re here to help you discover your next great opportunity.
            </div>
            <div className="modal-foot">
              <button className="btn primary" onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
        {modalType === 'brief' && (
          <div>
            <div className="modal-head">
              <h2>Your AI Daily Brief</h2>
              <button className="icon-btn" onClick={closeModal}><Icon name="close" /></button>
            </div>
            <div className="notice">Daily Marketing Intelligence Brief</div>
            <p><b>Today’s focus:</b> move your highest-impact work from review to ready.</p>
            <p>
              Finish the LinkedIn carousel, review this week’s creative direction and follow up with qualified leads.
              Your strongest content combines useful hiring insights with a human story.
            </p>
            <p><b>One idea to try:</b> ask your audience which part of hiring they would simplify first.</p>
            <div className="modal-foot">
              <button className="btn primary" onClick={closeModal}>Got it</button>
            </div>
          </div>
        )}
        {modalType === 'assistant' && (
          <AssistantModal closeModal={closeModal} />
        )}
      </div>
    </div>
  );
}

function TaskModalForm({ isNew, task, closeModal, tasks, setTasks, showToast }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'Medium');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [assignee, setAssignee] = useState(task?.assignee || 'You');
  const [due, setDue] = useState(task?.due || today);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isNew) {
      setTasks([...tasks, { id: uid(), title: title.trim(), description, priority, status, assignee, due }]);
      showToast('New task added.');
    } else {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, title: title.trim(), description, priority, status, assignee, due } : t));
      showToast('Task updated.');
    }
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-head">
        <h2>{isNew ? 'Create a task' : 'Edit task'}</h2>
        <button type="button" className="icon-btn" onClick={closeModal}><Icon name="close" /></button>
      </div>

      <div className="field">
        <label>Task title</label>
        <input required value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="field">
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="field">
          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="field">
          <label>Assignee</label>
          <input value={assignee} onChange={e => setAssignee(e.target.value)} />
        </div>

        <div className="field">
          <label>Due date</label>
          <input type="date" value={due} onChange={e => setDue(e.target.value)} />
        </div>
      </div>

      <div className="modal-foot">
        <button type="button" className="btn" onClick={closeModal}>Cancel</button>
        <button type="submit" className="btn primary">Save task</button>
      </div>
    </form>
  );
}

function EventModalForm({ isNew, event, initialDate, closeModal, events, setEvents, showToast }) {
  const [title, setTitle] = useState(event?.title || '');
  const [platform, setPlatform] = useState(event?.platform || 'LinkedIn');
  const [date, setDate] = useState(event?.date || initialDate || today);
  const [time, setTime] = useState(event?.time || '09:00');
  const [caption, setCaption] = useState(event?.caption || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isNew) {
      setEvents([...events, { id: uid(), title: title.trim(), platform, date, time, caption }]);
      showToast('Post scheduled.');
    } else {
      setEvents(events.map(ev => ev.id === event.id ? { ...ev, title: title.trim(), platform, date, time, caption } : ev));
      showToast('Schedule updated.');
    }
    closeModal();
  };

  const handleDelete = () => {
    if (window.confirm('Delete this scheduled post?')) {
      setEvents(events.filter(ev => ev.id !== event.id));
      showToast('Scheduled post deleted.');
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-head">
        <h2>{isNew ? 'Schedule a post' : 'Edit scheduled post'}</h2>
        <button type="button" className="icon-btn" onClick={closeModal}><Icon name="close" /></button>
      </div>

      <div className="field">
        <label>Post title</label>
        <input required value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="field">
        <label>Platform</label>
        <select value={platform} onChange={e => setPlatform(e.target.value)}>
          <option>LinkedIn</option>
          <option>Instagram</option>
          <option>Facebook</option>
        </select>
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label>Time</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Caption / notes</label>
        <textarea value={caption} onChange={e => setCaption(e.target.value)} />
      </div>

      <div className="modal-foot">
        {!isNew && (
          <button type="button" className="btn danger" onClick={handleDelete}>Delete post</button>
        )}
        <button type="button" className="btn" onClick={closeModal}>Cancel</button>
        <button type="submit" className="btn primary">Save schedule</button>
      </div>
    </form>
  );
}

function LeadModalForm({ isNew, lead, closeModal, leads, setLeads, showToast }) {
  const [name, setName] = useState(lead?.name || '');
  const [company, setCompany] = useState(lead?.company || '');
  const [stage, setStage] = useState(lead?.stage || 'New');
  const [value, setValue] = useState(lead?.value || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isNew) {
      setLeads([...leads, { id: uid(), name: name.trim(), company, stage, value: Number(value) }]);
      showToast('Lead added.');
    } else {
      setLeads(leads.map(l => l.id === lead.id ? { ...l, name: name.trim(), company, stage, value: Number(value) } : l));
      showToast('Lead updated.');
    }
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-head">
        <h2>{isNew ? 'Add lead' : 'Edit lead'}</h2>
        <button type="button" className="icon-btn" onClick={closeModal}><Icon name="close" /></button>
      </div>

      <div className="field">
        <label>Name</label>
        <input required value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="field">
        <label>Company</label>
        <input required value={company} onChange={e => setCompany(e.target.value)} />
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Stage</label>
          <select value={stage} onChange={e => setStage(e.target.value)}>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Won</option>
          </select>
        </div>

        <div className="field">
          <label>Estimated value ($)</label>
          <input type="number" min="0" value={value} onChange={e => setValue(e.target.value)} />
        </div>
      </div>

      <div className="modal-foot">
        <button type="button" className="btn" onClick={closeModal}>Cancel</button>
        <button type="submit" className="btn primary">Save lead</button>
      </div>
    </form>
  );
}

function CampaignModalForm({ isNew, campaign, closeModal, campaigns, setCampaigns, showToast }) {
  const [name, setName] = useState(campaign?.name || '');
  const [platform, setPlatform] = useState(campaign?.platform || 'LinkedIn');
  const [status, setStatus] = useState(campaign?.status || 'Draft');
  const [budget, setBudget] = useState(campaign?.budget || 1000);
  const [progress, setProgress] = useState(campaign?.progress || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isNew) {
      setCampaigns([...campaigns, { id: uid(), name: name.trim(), platform, status, budget: Number(budget), progress: 0 }]);
      showToast('Campaign created.');
    } else {
      setCampaigns(campaigns.map(c => c.id === campaign.id ? { ...c, name: name.trim(), platform, status, budget: Number(budget), progress: Number(progress) } : c));
      showToast('Campaign updated.');
    }
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-head">
        <h2>{isNew ? 'New campaign' : 'Edit campaign'}</h2>
        <button type="button" className="icon-btn" onClick={closeModal}><Icon name="close" /></button>
      </div>

      <div className="field">
        <label>Campaign name</label>
        <input required value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Platform</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)}>
            <option>LinkedIn</option>
            <option>Instagram</option>
            <option>Facebook</option>
          </select>
        </div>

        <div className="field">
          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option>Draft</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="field">
          <label>Budget ($)</label>
          <input type="number" min="0" value={budget} onChange={e => setBudget(e.target.value)} />
        </div>

        {!isNew && (
          <div className="field">
            <label>Progress (%)</label>
            <input type="number" min="0" max="100" value={progress} onChange={e => setProgress(e.target.value)} />
          </div>
        )}
      </div>

      <div className="modal-foot">
        <button type="button" className="btn" onClick={closeModal}>Cancel</button>
        <button type="submit" className="btn primary">Save campaign</button>
      </div>
    </form>
  );
}

function CompetitorModalForm({ closeModal, competitors, setCompetitors, showToast }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCompetitors([...competitors, { id: uid(), name: name.trim(), url, notes }]);
    showToast('Competitor added to watchlist.');
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-head">
        <h2>Add competitor</h2>
        <button type="button" className="icon-btn" onClick={closeModal}><Icon name="close" /></button>
      </div>

      <div className="field">
        <label>Brand name</label>
        <input required value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="field">
        <label>Website URL</label>
        <input type="url" placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)} />
      </div>

      <div className="field">
        <label>Notes</label>
        <textarea placeholder="Storytelling patterns, positioning, observations..." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <div className="modal-foot">
        <button type="button" className="btn" onClick={closeModal}>Cancel</button>
        <button type="submit" className="btn primary">Save competitor</button>
      </div>
    </form>
  );
}

function RuleModalForm({ closeModal, rules, setRules, showToast }) {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('New lead added');
  const [action, setAction] = useState('Prepare a welcome message');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setRules([...rules, { id: uid(), name: name.trim(), trigger, action, enabled: true, runs: 0 }]);
    showToast('Automation rule created.');
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-head">
        <h2>Create automation rule</h2>
        <button type="button" className="icon-btn" onClick={closeModal}><Icon name="close" /></button>
      </div>

      <div className="field">
        <label>Rule name</label>
        <input required value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="field">
        <label>Trigger (WHEN)</label>
        <select value={trigger} onChange={e => setTrigger(e.target.value)}>
          <option>New lead added</option>
          <option>Task moved to Review</option>
          <option>Every Monday at 09:00</option>
        </select>
      </div>

      <div className="field">
        <label>Action (THEN)</label>
        <select value={action} onChange={e => setAction(e.target.value)}>
          <option>Prepare a welcome message</option>
          <option>Prepare a review reminder</option>
          <option>Prepare analytics summary</option>
        </select>
      </div>

      <div className="modal-foot">
        <button type="button" className="btn" onClick={closeModal}>Cancel</button>
        <button type="submit" className="btn primary">Save rule</button>
      </div>
    </form>
  );
}

function AssistantModal({ closeModal }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const chips = [
    'Give me 5 LinkedIn post ideas',
    'Plan a hiring campaign',
    'Improve my next caption'
  ];

  const handleAsk = (q) => {
    const askText = q || question;
    if (!askText.trim()) return;

    setLoading(true);
    setAnswer('');

    setTimeout(() => {
      let res = '';
      if (/campaign/i.test(askText)) {
        res = `A simple hiring campaign plan:

1. Lead with a human story: a team member’s next chapter.
2. Share one concrete hiring challenge and a useful insight.
3. Publish a product walkthrough focused on outcomes.
4. Invite your audience to explore Jobgen.ai.
5. Review saves, conversations and qualified leads after a week.`;
      } else if (/caption/i.test(askText)) {
        res = `Make your caption feel clear and human:

Start with one specific problem your audience recognizes. Keep the middle focused on a useful takeaway. End with a single action.

Example: “The right opportunity can change everything. At Jobgen.ai, we help talent and teams find that next chapter. What does a better hiring experience look like to you?”`;
      } else {
        res = `Five LinkedIn ideas for Jobgen.ai:

1. Three hiring habits worth leaving behind.
2. A founder’s lesson about building people-first teams.
3. A carousel: what candidates wish employers knew.
4. A behind-the-scenes look at making hiring simpler.
5. A question: what made your best career move possible?

Pick one story, one useful insight and one clear call to action.`;
      }
      setAnswer(res);
      setLoading(false);
    }, 700);
  };

  return (
    <div>
      <div className="modal-head">
        <h2>Your creative thinking partner</h2>
        <button type="button" className="icon-btn" onClick={closeModal}><Icon name="close" /></button>
      </div>

      <label>What would you like to work on?</label>
      <textarea
        placeholder="Ask for post ideas, campaign angles or a clearer plan…"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />

      <div className="assistant-chips">
        {chips.map(chip => (
          <button
            key={chip}
            type="button"
            className="btn small"
            onClick={() => {
              setQuestion(chip);
              handleAsk(chip);
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn primary"
        onClick={() => handleAsk()}
        disabled={loading}
      >
        <Icon name="studio" /> {loading ? 'Thinking...' : 'Ask assistant'}
      </button>

      {answer && (
        <div className="assistant-response" style={{ marginTop: '16px' }}>
          {answer}
        </div>
      )}
    </div>
  );
}

