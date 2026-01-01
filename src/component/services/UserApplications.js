import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './signup.css';

export default function UserApplications() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchApplications = async () => {
    if (authLoading) {
      return;
    }
    if (!isAuthenticated() || !user) {
      navigate('/signin');
      return;
    }

    try {
      const data = await api.getUserAllApplications(user.username);
      setApps(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Failed to load applications:', err);
      setApps([]);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchApplications();
  }, [user, isAuthenticated, navigate, authLoading]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (authLoading || !isAuthenticated() || !user) return;

    const interval = setInterval(() => {
      fetchApplications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, isAuthenticated, authLoading]);

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      under_review: 'Under Review',
      approved: 'Approved',
      denied: 'Denied',
      shipped: 'Shipped',
      issued: 'Issued',
      collected: 'Collected',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      under_review: '#3b82f6',
      approved: '#10b981',
      denied: '#ef4444',
      shipped: '#8b5cf6',
      issued: '#2563eb',
      collected: '#16a34a',
    };
    return colors[status] || '#6b7280';
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchApplications();
  };

  return (
    <div className="signup-shell">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>Your Applications</h1>
          <p className="signup-lead" style={{ marginBottom: '8px' }}>
            Track the status of all your applications in real-time.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            🔄 Auto-updates every 30 seconds • Last updated: {formatLastUpdate()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleRefresh}
            className="outline-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
          <button onClick={() => navigate('/dashboard')} className="primary-btn">
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading your applications...</p>
        </div>
      ) : apps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9fafb', borderRadius: '12px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.3 }}>📋</div>
          <h3 style={{ color: '#1f2937', marginBottom: '8px' }}>No Applications Yet</h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Start your first application to get started with embassy services
          </p>
          <button onClick={() => navigate('/visaapplication')} className="primary-btn">
            Start New Application
          </button>
        </div>
      ) : (
        <div className="table">
          <div className="table-head">
            <span>ID</span>
            <span>Type</span>
            <span>Name</span>
            <span>Status</span>
            <span>Tracking Number</span>
            <span>Submitted</span>
            <span>Updated</span>
          </div>
          {apps.map((app) => (
            <div className="table-row" key={app.id}>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>#{app.id}</span>
              <span>{app.subtype ? `${app.type} - ${app.subtype}` : app.type}</span>
              <span>{app.displayName}</span>
              <span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: getStatusColor(app.status),
                  background: `${getStatusColor(app.status)}15`,
                  border: `1px solid ${getStatusColor(app.status)}40`
                }}>
                  {getStatusLabel(app.status)}
                </span>
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--primary)' }}>
                {app.trackingNumber || 'N/A'}
              </span>
              <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</span>
              <span>{app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
