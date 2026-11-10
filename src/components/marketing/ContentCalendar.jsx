import React, { useState } from 'react';
import { Icon } from './Icons';
import { dateKey, today } from '../../hooks/useMarketingState';

export default function ContentCalendar({ state, openModal, showToast }) {
  const { events, setEvents, month, setMonth } = state;

  const [calendarView, setCalendarView] = useState('month'); // 'month' | 'week'
  const [draggingEventId, setDraggingEventId] = useState(null);

  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(1 - firstDayOfMonth.getDay());

  // Month days (42 cells)
  const monthDays = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = dateKey(d);
    const isOutside = d.getMonth() !== firstDayOfMonth.getMonth();
    const isToday = dateStr === today;
    const dayEvents = events.filter(e => e.date === dateStr);

    monthDays.push({
      dateStr,
      dayNumber: d.getDate(),
      isOutside,
      isToday,
      events: dayEvents,
      dateObj: d
    });
  }

  // Week days (7 days based on current selected date or today)
  const curr = new Date();
  const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(firstDayOfWeek);
    d.setDate(firstDayOfWeek.getDate() + i);
    const dateStr = dateKey(d);
    weekDays.push({
      dateStr,
      dayNumber: d.getDate(),
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      isToday: dateStr === today,
      events: events.filter(e => e.date === dateStr),
      dateObj: d
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

  // Drag & drop reschedule
  const handleDragStart = (e, eventId) => {
    setDraggingEventId(eventId);
    e.dataTransfer.setData('text/plain', eventId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    const eventId = draggingEventId || e.dataTransfer.getData('text/plain');
    if (eventId) {
      setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, date: targetDate } : ev));
      showToast(`Post rescheduled to ${targetDate}.`);
    }
    setDraggingEventId(null);
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
          <p className="subtitle">Plan with intention. Drag posts between dates to reschedule.</p>
        </div>
        <div className="actions">
          <div className="crm-view-toggles" style={{ marginRight: '8px' }}>
            <button
              type="button"
              className={`crm-view-btn ${calendarView === 'month' ? 'active' : ''}`}
              onClick={() => setCalendarView('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={`crm-view-btn ${calendarView === 'week' ? 'active' : ''}`}
              onClick={() => setCalendarView('week')}
            >
              Week
            </button>
          </div>

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

      {calendarView === 'month' ? (
        <section className="card calendar-card">
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="day-name">{d}</div>
            ))}

            {monthDays.map(d => (
              <div
                key={d.dateStr}
                className={`day ${d.isOutside ? 'outside' : ''} ${d.isToday ? 'today' : ''}`}
                onClick={() => openModal('event-new', { date: d.dateStr })}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, d.dateStr)}
                role="button"
                tabIndex={0}
              >
                <span className="date-number">{d.dayNumber}</span>
                {d.events.map(e => (
                  <button
                    key={e.id}
                    className="event"
                    draggable
                    onDragStart={ev => handleDragStart(ev, e.id)}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      openModal('event-edit', e);
                    }}
                    title={`${e.title} (Drag to reschedule)`}
                    style={{ cursor: 'grab' }}
                  >
                    {e.time} {e.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="card calendar-card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {weekDays.map(d => (
              <div
                key={d.dateStr}
                className="column"
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, d.dateStr)}
                onClick={() => openModal('event-new', { date: d.dateStr })}
                style={{ minHeight: '340px' }}
              >
                <div className="column-head">
                  <span>{d.dayName} {d.dayNumber}</span>
                  {d.isToday && <span className="badge primary">Today</span>}
                </div>

                {d.events.map(e => (
                  <div
                    key={e.id}
                    className="task"
                    draggable
                    onDragStart={ev => handleDragStart(ev, e.id)}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      openModal('event-edit', e);
                    }}
                    style={{ cursor: 'grab' }}
                  >
                    <span className="badge" style={{ fontSize: '9px' }}>{e.platform}</span>
                    <h3 style={{ fontSize: '12px', margin: '6px 0' }}>{e.title}</h3>
                    <div className="muted" style={{ fontSize: '10px' }}>⏰ {e.time}</div>
                  </div>
                ))}

                {d.events.length === 0 && (
                  <p className="muted small-text" style={{ textAlign: 'center', marginTop: '20px' }}>
                    + Schedule
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

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
