import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './signup.css';
import { useI18n } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError('Please enter email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const resp = await api.login({ username: form.username, password: form.password });

      // Store token and user info using auth context
      login(resp.token, resp.user);

      // Navigate to the page they were trying to access, or default based on admin status
      const from = location.state?.from || (resp.user.isAdmin ? '/admin' : '/dashboard');
      navigate(from);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-shell">
      <h1>{t('auth.signinTitle')}</h1>
      <p className="signup-lead">{t('auth.signinLead')}</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            name="username"
            type="email"
            value={form.username}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            disabled={loading}
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </label>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '0.875rem',
            marginTop: '-8px'
          }}>
            {error}
          </div>
        )}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Signing in...' : t('auth.signin')}
        </button>
      </form>

      <p className="signup-lead" style={{ marginTop: '16px', marginBottom: '8px' }}>
        <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          Forgot Password?
        </Link>
      </p>

      <p className="signup-lead" style={{ marginTop: '8px', marginBottom: 0 }}>
        {t('auth.dontHave')}{' '}
        <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          {t('auth.signup')}
        </Link>
      </p>
    </div>
  );
}
