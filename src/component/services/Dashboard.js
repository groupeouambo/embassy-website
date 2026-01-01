import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ModernDashboard.css';
import { useI18n } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { downloadBarcode } from '../../utils/BarcodeGenerator';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Function to fetch applications
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
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user, isAuthenticated, authLoading]);

  const getUserInitials = () => {
    if (!user) return 'US';
    const first = user.firstname || user.username || 'U';
    const last = user.lastname || '';
    return (first[0] + (last[0] || first[1] || '')).toUpperCase();
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const stats = [
    {
      label: 'Total Applications',
      value: apps.length,
      icon: '📊',
      className: 'total',
      change: null
    },
    {
      label: 'Pending',
      value: apps.filter(a => a.status === 'pending').length,
      icon: '⏳',
      className: 'pending',
      change: null
    },
    {
      label: 'Under Review',
      value: apps.filter(a => a.status === 'under_review').length,
      icon: '🔍',
      className: 'review',
      change: null
    },
    {
      label: 'Approved',
      value: apps.filter(a => a.status === 'approved').length,
      icon: '✅',
      className: 'approved',
      change: null
    },
  ];

  const quickActions = [
    {
      title: 'Visa Application',
      description: 'Apply for a visa',
      icon: '✈️',
      path: '/visaapplication'
    },
    {
      title: 'Birth Certificate',
      description: 'Request certificate',
      icon: '👶',
      path: '/apply/birth-certificate'
    },
    {
      title: 'Marriage Certificate',
      description: 'Request certificate',
      icon: '💍',
      path: '/apply/marriage'
    },
    {
      title: 'Travel Pass',
      description: 'Emergency document',
      icon: '🛂',
      path: '/apply/travel-pass'
    },
  ];

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchApplications();
  };

  const recentApps = apps.slice(0, 5);

  const downloadDocuments = [
    {
      title: 'Visa Application Form',
      description: 'Download blank visa application form',
      icon: '✈️',
      file: '/Visa_Application_Form.pdf',
      type: 'PDF'
    },
    {
      title: 'Birth Certificate Form',
      description: 'Download birth certificate application',
      icon: '👶',
      file: '/birth-certificate-form.pdf',
      type: 'PDF'
    },
    {
      title: 'Marriage Certificate Form',
      description: 'Download marriage certificate form',
      icon: '💍',
      file: '/marriage-certificate-form.pdf',
      type: 'PDF'
    },
    {
      title: 'Travel Pass Form',
      description: 'Download travel pass application',
      icon: '🛂',
      file: '/travel-pass-form.pdf',
      type: 'PDF'
    },
  ];

  const handleDownloadFile = (file, title) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = file.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modern-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="user-info">
              <div className="user-avatar">
                {getUserInitials()}
              </div>
              <div className="user-details">
                <h1>Welcome back, {user?.firstname || user?.username || 'User'}!</h1>
                <p>Here's your application overview and quick actions</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn-header btn-white" onClick={() => navigate('/dashboard/applications')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                My Applications
              </button>
              <button className="btn-header btn-outline-white" onClick={handleLogout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className={`stat-card ${stat.className}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              {stat.change && (
                <div className={`stat-change ${stat.change > 0 ? 'positive' : 'neutral'}`}>
                  {stat.change > 0 ? '↑' : '–'} {stat.change > 0 ? `+${stat.change}` : 'No change'} this month
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="action-card"
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-title">{action.title}</div>
                <div className="action-desc">{action.description}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Downloads Section */}
        <div className="quick-actions">
          <h2>Available Downloads</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px', marginTop: '-8px' }}>
            Access and download application forms and your submitted documents
          </p>
          <div className="actions-grid">
            {downloadDocuments.map((doc) => (
              <div
                key={doc.title}
                className="action-card"
                onClick={() => handleDownloadFile(doc.file, doc.title)}
                style={{ cursor: 'pointer' }}
              >
                <div className="action-icon">{doc.icon}</div>
                <div className="action-title">{doc.title}</div>
                <div className="action-desc">{doc.description}</div>
                <div style={{
                  marginTop: '8px',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {doc.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="applications-section">
          <div className="section-header">
            <div>
              <h2>Recent Applications</h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Last updated: {formatLastUpdate()}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="view-all-btn"
                onClick={handleRefresh}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Refresh
              </button>
              {apps.length > 0 && (
                <button className="view-all-btn" onClick={() => navigate('/dashboard/applications')}>
                  View All Applications →
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p style={{ color: '#6b7280' }}>Loading your applications...</p>
            </div>
          ) : apps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Applications Yet</h3>
              <p>Start your first application to get started with embassy services</p>
              <button className="start-btn" onClick={() => navigate('/visaapplication')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Start New Application
              </button>
            </div>
          ) : (
            <div className="applications-list">
              {recentApps.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="app-header">
                    <div className="app-info">
                      <h3>Application #{app.id}</h3>
                  <div className="app-meta">
                    <div className="meta-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {formatDate(app.createdAt)}
                        </div>
                        <div className="meta-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {app.displayName}
                        </div>
                      </div>
                    </div>
                    <div className={`status-badge status-${app.status}`}>
                      {getStatusLabel(app.status)}
                    </div>
                  </div>

                  {app.trackingNumber && (
                    <div className="tracking-info">
                      <div>
                        <div className="tracking-label">Tracking Number</div>
                        <div className="tracking-number">{app.trackingNumber}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="copy-btn"
                          onClick={() => copyToClipboard(app.trackingNumber, app.id)}
                        >
                          {copied === app.id ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          className="copy-btn"
                          onClick={() => downloadBarcode(app.trackingNumber, `application-${app.id}`)}
                          title="Download Barcode"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Barcode
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
