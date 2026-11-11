import React, { useState } from 'react';
import { Icon } from './Icons';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function LoginView({ setView, showToast, user, userRole, onSignOut }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'magiclink'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      // Local fallback mode
      setTimeout(() => {
        setLoading(false);
        showToast(`Signed in as ${fullName || email || 'Demo User'}`);
        setView('dashboard');
      }, 500);
      return;
    }

    try {
      if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (error) throw error;
        showToast('Welcome back! Signed in successfully.');
        setView('dashboard');
      } else if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() }
          }
        });
        if (error) throw error;
        showToast('Account created! Please check your email for the confirmation link.');
        setView('dashboard');
      } else if (authMode === 'magiclink') {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim()
        });
        if (error) throw error;
        setMagicLinkSent(true);
        showToast('Magic login link sent to your email.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show account management
  if (user) {
    return (
      <div className="login">
        <section className="login-art">
          <div className="brand" style={{ paddingLeft: 0 }}>
            <span className="brand-icon">j</span>
            <span>Jobgen<small>Marketing OS & CRM</small></span>
          </div>
          <div>
            <div className="eyebrow" style={{ color: '#b9b0ff' }}>TEAM COLLABORATION WORKSPACE</div>
            <h1>Active Session</h1>
            <p>You are authenticated into your team workspace.</p>
          </div>
          <small style={{ color: '#9ca5bd' }}>Connected to {isSupabaseConfigured ? 'Supabase Cloud' : 'Local Offline Workspace'}</small>
        </section>

        <section className="login-form">
          <div style={{ width: '380px' }}>
            <h2>Workspace Profile</h2>
            <p className="subtitle">Account and permissions</p>

            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <span className="avatar" style={{ width: '42px', height: '42px', fontSize: '16px' }}>
                  {(user.user_metadata?.full_name || user.email || 'U').slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 style={{ margin: 0 }}>{user.user_metadata?.full_name || 'Team Member'}</h3>
                  <div className="muted" style={{ fontSize: '11px' }}>{user.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <span>Workspace Role:</span>
                <span className="badge primary">{userRole?.toUpperCase() || 'MEMBER'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn primary"
                style={{ flex: 1 }}
                onClick={() => setView('dashboard')}
              >
                Go to Workspace
              </button>

              <button
                type="button"
                className="btn danger"
                onClick={onSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="login">
      <section className="login-art">
        <div className="brand" style={{ paddingLeft: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Jobgen" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
          <span>Jobgen<small>Marketing OS & Team CRM</small></span>
        </div>

        <div>
          <div className="eyebrow" style={{ color: '#b9b0ff' }}>SHARED TEAM CRM & SPRINT PLANNER</div>
          <h1>Your pipeline.<br />Your team.<br />One unified workspace.</h1>
          <p>Realtime lead tracking, collaborative sprint boards, and growth analytics in one place.</p>
        </div>

        <small style={{ color: '#9ca5bd' }}>
          {isSupabaseConfigured ? '✦ Powered by Supabase Backend' : 'Offline local-first mode'}
        </small>
      </section>

      <section className="login-form">
        <div style={{ width: '380px' }}>
          <h1>
            {authMode === 'signup'
              ? 'Create team account'
              : authMode === 'magiclink'
              ? 'Magic link sign in'
              : 'Sign in to workspace'}
          </h1>
          <p className="subtitle">
            {authMode === 'signup'
              ? 'Join your company CRM workspace'
              : 'Enter your credentials to access team data'}
          </p>

          {!isSupabaseConfigured && (
            <div className="notice" style={{ marginBottom: '16px' }}>
              ℹ️ Supabase environment variables not detected. Running in offline demo mode. Any login credentials will work!
            </div>
          )}

          {errorMsg && (
            <div className="badge error" style={{ display: 'block', padding: '10px 14px', marginBottom: '16px', whiteSpace: 'normal', lineHeight: 1.5 }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {magicLinkSent ? (
            <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <Icon name="check" style={{ width: '32px', height: '32px', color: 'var(--success)', margin: '0 auto 12px' }} />
              <h3>Check your inbox</h3>
              <p className="muted small-text">We sent a magic sign-in link to <b>{email}</b>. Click the link to log in directly.</p>
              <button
                type="button"
                className="btn small"
                style={{ marginTop: '14px' }}
                onClick={() => setMagicLinkSent(false)}
              >
                Try password instead
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth}>
              {authMode === 'signup' && (
                <div className="field">
                  <label>Full name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jayant Vaibhav"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
              )}

              <div className="field">
                <label>Email address</label>
                <input
                  type="email"
                  required
                  placeholder="you@jobgen.ai"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {authMode !== 'magiclink' && (
                <div className="field">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              )}

              <button
                className="btn primary"
                type="submit"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={loading}
              >
                {loading
                  ? 'Verifying...'
                  : authMode === 'signup'
                  ? 'Create account'
                  : authMode === 'magiclink'
                  ? 'Send magic link'
                  : 'Sign in to workspace'}{' '}
                <Icon name="arrow" />
              </button>
            </form>
          )}

          <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
            {authMode === 'signin' && (
              <>
                <p className="muted small-text">
                  Don't have an account?{' '}
                  <button type="button" className="login-toggle" onClick={() => setAuthMode('signup')}>
                    Create account
                  </button>
                </p>
                <button
                  type="button"
                  className="login-toggle"
                  style={{ fontSize: '11px' }}
                  onClick={() => setAuthMode('magiclink')}
                >
                  Sign in with email magic link instead
                </button>
              </>
            )}

            {authMode === 'signup' && (
              <p className="muted small-text">
                Already registered?{' '}
                <button type="button" className="login-toggle" onClick={() => setAuthMode('signin')}>
                  Sign in
                </button>
              </p>
            )}

            {authMode === 'magiclink' && (
              <button
                type="button"
                className="login-toggle"
                onClick={() => setAuthMode('signin')}
              >
                Back to password sign in
              </button>
            )}

            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="btn small"
                onClick={() => setView('dashboard')}
              >
                Continue in demo mode
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
