import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import { useI18n } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!PASSWORD_REGEX.test(password)) {
      return 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&#)';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const resp = await api.signup({
        username: form.username,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });

      // Auto-login after successful signup
      login(resp.token, resp.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-shell">
      <h1>{t('auth.signupTitle')}</h1>
      <p className="signup-lead">{t('auth.signupLead')}</p>
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
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label>
            First Name
            <input
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              placeholder="John"
              required
              disabled={loading}
            />
          </label>
          <label>
            Last Name
            <input
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
              disabled={loading}
            />
          </label>
        </div>

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
          />
          <small style={{ display: 'block', marginTop: '4px', color: '#9ca3af', fontSize: '0.75rem' }}>
            Min 8 characters, with uppercase, lowercase, number, and special character
          </small>
        </label>

        <label>
          Confirm Password
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={loading}
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
          {loading ? 'Creating account...' : t('auth.signup')}
        </button>
      </form>

      <p className="signup-lead" style={{ marginTop: '24px', marginBottom: 0 }}>
        {t('auth.haveAccount')}{' '}
        <Link to="/signin" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          {t('auth.signin')}
        </Link>
      </p>
    </div>
  );
}
