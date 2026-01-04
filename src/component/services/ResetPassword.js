import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './signup.css';
import { api } from '../../api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.newPassword || !form.confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const resp = await api.resetPassword(token, form.newPassword);
      setMessage(resp.message);
      setForm({ newPassword: '', confirmPassword: '' });

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="signup-shell">
        <h1>Invalid Reset Link</h1>
        <p className="signup-lead">
          This password reset link is invalid or has expired. Please request a new password reset.
        </p>
        <button className="primary-btn" onClick={() => navigate('/forgot-password')}>
          Request New Reset Link
        </button>
      </div>
    );
  }

  return (
    <div className="signup-shell">
      <h1>Reset Password</h1>
      <p className="signup-lead">Enter your new password below.</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          New Password
          <input
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete="new-password"
            minLength={6}
          />
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
            autoComplete="new-password"
            minLength={6}
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

        {message && (
          <div style={{
            padding: '12px 16px',
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            color: '#166534',
            fontSize: '0.875rem',
            marginTop: '-8px'
          }}>
            {message}
            <br />
            <small>Redirecting to sign in...</small>
          </div>
        )}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
