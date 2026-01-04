import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './signup.css';
import { api } from '../../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const resp = await api.requestPasswordReset(email);
      setMessage(resp.message);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-shell" style={{ maxWidth: '500px' }}>
      <h1>Forgot Password</h1>
      <p className="signup-lead">Enter your email address and we'll send you a link to reset your password.</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            autoComplete="email"
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
          </div>
        )}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="signup-lead" style={{ marginTop: '24px', marginBottom: 0 }}>
        Remember your password?{' '}
        <Link to="/signin" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          Sign In
        </Link>
      </p>
    </div>
  );
}
