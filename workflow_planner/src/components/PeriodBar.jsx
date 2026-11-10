import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPeriodLabel } from '../utils/dateUtils';

export default function PeriodBar({
  scope,
  currentPeriodKey,
  offset,
  onPrev,
  onNext,
  onReset
}) {
  const titles = {
    day: "Today's Focus",
    week: 'Weekly Goals',
    month: 'Monthly Targets'
  };

  const formattedLabel =
    formatPeriodLabel(scope, currentPeriodKey) +
    (offset === 0 ? ' (Current)' : '');

  return (
    <div className="period-bar">
      <div className="period-title">
        <h2>{titles[scope]}</h2>
        <span className="period-badge">{formattedLabel}</span>
      </div>

      <div className="period-controls">
        <button
          className="btn-glass btn-icon"
          onClick={onPrev}
          title="Previous Period"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className="btn-glass"
          onClick={onReset}
          style={{ fontWeight: offset === 0 ? 600 : 400 }}
        >
          Current
        </button>
        <button
          className="btn-glass btn-icon"
          onClick={onNext}
          title="Next Period"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

