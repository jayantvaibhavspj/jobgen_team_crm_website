import React from 'react';
import { Icon } from './Icons';

export default function Analytics({ state }) {
  const { analyticsRange, setAnalyticsRange } = state;
  const scale = analyticsRange / 30;

  const rawValues = [34, 47, 42, 65, 58, 76, 88];
  const points = rawValues.map((v, i) => `${15 + i * 65},${190 - v * 1.8}`).join(' ');

  const channelEngagement = [
    { platform: 'Instagram', value: 82, opacity: 0.85 },
    { platform: 'Facebook', value: 46, opacity: 0.5 },
    { platform: 'LinkedIn', value: 68, opacity: 0.85 }
  ];

  const topContent = [
    { title: 'Hiring, made human', platform: 'LinkedIn', rate: '6.8%' },
    { title: 'A day at Jobgen', platform: 'Instagram', rate: '5.4%' },
    { title: 'Your next chapter', platform: 'Facebook', rate: '4.2%' }
  ];

  const conversionFunnel = [
    { label: 'Visitors', width: 100, count: 4820 },
    { label: 'Leads', width: 70, count: 124 },
    { label: 'Qualified', width: 45, count: 48 },
    { label: 'Won', width: 22, count: 16 }
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Performance Metrics</div>
          <h1>Analytics</h1>
          <p className="subtitle">Understand what’s working. Make your next move count.</p>
        </div>
        <div className="actions">
          <select
            value={analyticsRange}
            onChange={e => setAnalyticsRange(Number(e.target.value))}
            style={{ width: '155px' }}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Total reach</span>
            <span className="metric-icon"><Icon name="social" /></span>
          </div>
          <strong>{Math.round(48200 * scale).toLocaleString()}</strong>
          <small className="positive">↑ 18.6% from prior period</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Engagements</span>
            <span className="metric-icon"><Icon name="studio" /></span>
          </div>
          <strong>{Math.round(2840 * scale).toLocaleString()}</strong>
          <small className="positive">↑ 12.4% from prior period</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>New leads</span>
            <span className="metric-icon"><Icon name="leads" /></span>
          </div>
          <strong>{Math.round(124 * scale)}</strong>
          <small className="positive">↑ 8.2% from prior period</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Content published</span>
            <span className="metric-icon"><Icon name="calendar" /></span>
          </div>
          <strong>{Math.round(32 * scale)}</strong>
          <small>A consistent brand presence</small>
        </div>
      </div>

      <div className="two-col equal">
        <section className="card">
          <div className="card-head">
            <h2>Audience growth</h2>
            <span className="badge">Performance curve</span>
          </div>

          <svg className="line-chart" viewBox="0 0 440 220" role="img">
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--primary)" stopOpacity="0.22" />
                <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[40, 90, 140, 190].map(y => (
              <line key={y} x1="10" y1={y} x2="425" y2={y} stroke="var(--border)" />
            ))}
            <polygon points={`15,190 ${points} 405,190`} fill="url(#chart-grad)" />
            <polyline points={points} stroke="var(--primary)" strokeWidth="3" fill="none" />
            {rawValues.map((v, i) => (
              <circle
                key={i}
                cx={15 + i * 65}
                cy={190 - v * 1.8}
                r="4"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth="2"
              />
            ))}
          </svg>
          <div className="chart-key">
            ● Followers · seven periods across {analyticsRange} days · trend analysis
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Engagement by channel</h2>
            <span className="badge">Cross-platform</span>
          </div>

          <div className="chart">
            {channelEngagement.map(item => (
              <div key={item.platform} className="chart-group">
                <span className="small-text">{Math.round(item.value * scale * 10)}</span>
                <div
                  className="chart-bar"
                  style={{ height: `${item.value * 1.5}px`, opacity: item.opacity }}
                ></div>
                <small>{item.platform}</small>
              </div>
            ))}
          </div>
          <div className="chart-key">Interactive metrics tailored to selected date range.</div>
        </section>
      </div>

      <div className="two-col" style={{ marginTop: '22px' }}>
        <section className="card">
          <h2>Top-performing content</h2>
          {topContent.map(item => (
            <div key={item.title} className="row">
              <div>
                <div className="row-title">{item.title}</div>
                <div className="row-meta">{item.platform}</div>
              </div>
              <span className="badge success">{item.rate}</span>
            </div>
          ))}
        </section>

        <section className="card">
          <h2>Lead conversion funnel</h2>
          {conversionFunnel.map(item => (
            <div key={item.label} style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <span>{item.label}</span>
                <b>{Math.round(item.count * scale).toLocaleString()}</b>
              </div>
              <div className="progress" style={{ margin: '8px 0' }}>
                <i style={{ width: `${item.width}%` }}></i>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
