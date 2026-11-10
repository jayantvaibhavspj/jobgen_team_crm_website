import React, { useState } from 'react';
import { Icon } from './Icons';

export default function LoginView({ setView, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(`Welcome, ${name || email || 'User'}!`);
    setView('dashboard');
  };

  return (
    <div className="login">
      <section className="login-art">
        <div className="brand" style={{ paddingLeft: 0 }}>
          <span className="brand-icon">j</span>
          <span>Jobgen<small>Marketing OS</small></span>
        </div>

        <div>
          <div className="eyebrow" style={{ color: '#b9b0ff' }}>MAKE ROOM FOR BETTER MARKETING</div>
          <h1>Your ideas.<br />Your team.<br />One unified workspace.</h1>
          <p>Create with confidence, plan with purpose and keep your daily workflow moving.</p>
        </div>

        <small style={{ color: '#9ca5bd' }}>Jobgen.ai Marketing & Workflow Planner · Unified Edition</small>
      </section>

      <section className="login-form">
        <div>
          <h1>{isRegister ? 'A fresh start awaits.' : 'Welcome back.'}</h1>
          <p className="subtitle">
            {isRegister ? 'Create your local workspace profile.' : 'Your workspace is ready for you.'}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="field">
                <label>Display name</label>
                <input
                  required
                  maxLength={80}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>
            )}

            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@jobgen.ai"
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            <div className="notice">
              Demo mode. No authentication server needed.
            </div>

            <button className="btn primary" type="submit" style={{ width: '100%' }}>
              {isRegister ? 'Create workspace profile' : 'Sign in to workspace'} <Icon name="arrow" />
            </button>
          </form>

          <p className="muted small-text" style={{ textAlign: 'center', marginTop: '24px' }}>
            {isRegister ? 'Already have an account?' : 'New to Jobgen?'}
            <button
              className="login-toggle"
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{ marginLeft: '6px' }}
            >
              {isRegister ? 'Sign in' : 'Create profile'}
            </button>
          </p>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="btn small" onClick={() => setView('dashboard')}>
              Continue without signing in
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
