import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronDown, ChevronUp, Bell, CheckCircle } from 'lucide-react';
import { sound } from '../../utils/sound';
import { triggerCompletionConfetti } from '../../utils/confetti';

const MODES = {
  focus: { label: 'Deep Focus', duration: 25 * 60, color: 'var(--pri-gradient)' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'var(--emerald-gradient)' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: 'var(--amber-gradient)' }
};

export default function PomodoroTimer({ activeFocusTask, onCompleteTask, onClearFocusTask }) {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Switch mode
  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
  };

  // Timer tick
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      sound.playBell();
      triggerCompletionConfetti();

      if (mode === 'focus') {
        setSessionsCompleted((s) => s + 1);
        // Prompt break
        switchMode('shortBreak');
      } else {
        switchMode('focus');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const toggleRun = () => {
    sound.init();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = MODES[mode].duration;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className={`pomodoro-widget ${isMinimized ? 'minimized' : ''}`}>
      {/* Header bar */}
      <div className="pomo-header">
        <div className="pomo-title">
          <span className="pomo-pulse" style={{ background: isRunning ? 'var(--color-ok)' : 'var(--color-indigo)' }} />
          <span>Focus Station</span>
          {sessionsCompleted > 0 && (
            <span className="pomo-sessions-badge">{sessionsCompleted} session{sessionsCompleted > 1 ? 's' : ''} done</span>
          )}
        </div>

        <div className="pomo-header-actions">
          <button
            className="btn-action"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand Timer' : 'Minimize Timer'}
          >
            {isMinimized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {!isMinimized ? (
        <>
          {/* Mode Tabs */}
          <div className="pomo-modes">
            <button
              className={`pomo-mode-btn ${mode === 'focus' ? 'active' : ''}`}
              onClick={() => switchMode('focus')}
            >
              Deep Focus (25m)
            </button>
            <button
              className={`pomo-mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
              onClick={() => switchMode('shortBreak')}
            >
              Short Break (5m)
            </button>
            <button
              className={`pomo-mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
              onClick={() => switchMode('longBreak')}
            >
              Long Break (15m)
            </button>
          </div>

          {/* Active linked task indicator */}
          {activeFocusTask && (
            <div className="pomo-linked-task">
              <div className="pomo-task-info">
                <span className="pomo-task-label">🎯 Target:</span>
                <span className="pomo-task-name">{activeFocusTask.title}</span>
              </div>
              <div className="pomo-task-actions">
                <button
                  className="btn-glass"
                  style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--color-ok)' }}
                  onClick={() => onCompleteTask(activeFocusTask.id)}
                  title="Mark task completed"
                >
                  <CheckCircle size={13} /> Complete
                </button>
                <button
                  className="btn-action"
                  onClick={onClearFocusTask}
                  title="Detach task"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Main Countdown Display */}
          <div className="pomo-timer-display">
            <div className="pomo-time">{formattedTime}</div>
            <div className="pomo-progress-track">
              <div
                className="pomo-progress-fill"
                style={{ width: `${progressPercent}%`, background: MODES[mode].color }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="pomo-controls">
            <button className={`btn-primary pomo-play-btn ${isRunning ? 'running' : ''}`} onClick={toggleRun}>
              {isRunning ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              {isRunning ? 'Pause' : 'Start Focus'}
            </button>
            <button className="btn-glass btn-icon" onClick={resetTimer} title="Reset Timer">
              <RotateCcw size={16} />
            </button>
          </div>
        </>
      ) : (
        /* Minimized Mini View */
        <div className="pomo-mini-view" onClick={() => setIsMinimized(false)}>
          <span className="pomo-mini-time">{formattedTime}</span>
          <span className="pomo-mini-mode">{MODES[mode].label}</span>
          <button
            className="btn-action"
            onClick={(e) => {
              e.stopPropagation();
              toggleRun();
            }}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
          </button>
        </div>
      )}
    </div>
  );
}

