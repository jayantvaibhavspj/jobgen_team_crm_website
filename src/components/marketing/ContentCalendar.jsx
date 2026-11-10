import React from 'react';
import { Icon } from './Icons';
import { dateKey, today } from '../../hooks/useMarketingState';

export default function ContentCalendar({ state, openModal }) {
  const { events, month, setMonth } = state;

  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(1 - firstDayOfMonth.getDay());

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = dateKey(d);
    const isOutside = d.getMonth() !== firstDayOfMonth.getMonth();
    const isToday = dateStr === today;
    const dayEvents = events.filter(e => e.date === dateStr);

    days.push({
      dateStr,
      dayNumber: d.getDate(),
      isOutside,
      isToday,
      events: dayEvents
    });
  }

  const prevMonth = () => {
    setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const resetToday = () => {
    setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  };

  const sortedUpcoming = events
    .slice()
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Content Strategy</div>
          <h1>Content Calendar</h1>
          <p className="subtitle">Plan with intention. Show up consistently.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('event-new')}>
            <Icon name="plus" /> Schedule post
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="calendar-toolbar">
          <button className="icon-btn" onClick={prevMonth} aria-label="Previous month">
            <Icon name="left" />
          </button>
          <h2>
            {firstDayOfMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
          </h2>
          <button className="icon-btn" onClick={nextMonth} aria-label="Next month">
            <Icon name="right" />
          </button>
          <button className="btn small" onClick={resetToday}>Today</button>
        </div>
        <span className="muted small-text">{events.length} locally scheduled posts</span>
      </div>

      <section className="card calendar-card">
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="day-name">{d}</div>
          ))}

          {days.map(d => (
            <div
              key={d.dateStr}
              className={`day ${d.isOutside ? 'outside' : ''} ${d.isToday ? 'today' : ''}`}
              onClick={() => openModal('event-new', { date: d.dateStr })}
              role="button"
              tabIndex={0}
            >
              <span className="date-number">{d.dayNumber}</span>
              {d.events.map(e => (
                <button
                  key={e.id}
                  className="event"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    openModal('event-edit', e);
                  }}
                  title={e.title}
                >
                  {e.time} {e.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ marginTop: '22px' }}>
        <div className="card-head">
          <h2>Upcoming schedule</h2>
          <span className="badge">Local planner</span>
        </div>

        {sortedUpcoming.length > 0 ? (
          sortedUpcoming.map(e => (
            <div key={e.id} className="row">
              <div>
                <div className="row-title">{e.title}</div>
                <div className="row-meta">{e.platform} · {e.date} at {e.time}</div>
              </div>
              <button className="btn small" onClick={() => openModal('event-edit', e)}>Edit</button>
            </div>
          ))
        ) : (
          <div className="empty">
            <Icon name="calendar" />
            <h3>Make room for your next idea</h3>
            <p>Click a date to schedule a post.</p>
          </div>
        )}
      </section>
    </div>
  );
}
