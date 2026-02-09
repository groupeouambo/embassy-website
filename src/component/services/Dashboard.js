import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ModernDashboard.css';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { downloadBarcode } from '../../utils/BarcodeGenerator';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);
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

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, navigate, authLoading]);

  useEffect(() => {
    if (authLoading || !isAuthenticated() || !user) return;

    const interval = setInterval(() => {
      fetchApplications();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const diff = Math.floor((now - lastUpdate) / 1000);

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

  const stats = [
    {
      label: 'Total applications',
      value: apps.length,
      tone: 'indigo'
    },
    {
      label: 'Pending',
      value: apps.filter(a => a.status === 'pending').length,
      tone: 'amber'
    },
    {
      label: 'Under review',
      value: apps.filter(a => a.status === 'under_review').length,
      tone: 'violet'
    },
    {
      label: 'Approved',
      value: apps.filter(a => a.status === 'approved').length,
      tone: 'emerald'
    },
  ];

  const quickActions = [
    {
      title: 'Visa Application',
      description: 'Apply for a visa',
      path: '/visaapplication',
      tone: 'sky'
    },
    {
      title: 'Birth Certificate',
      description: 'Request certificate',
      path: '/apply/birth-certificate',
      tone: 'rose'
    },
    {
      title: 'Marriage Certificate',
      description: 'Request certificate',
      path: '/apply/marriage',
      tone: 'amber'
    },
    {
      title: 'Travel Pass',
      description: 'Emergency document',
      path: '/apply/travel-pass',
      tone: 'indigo'
    },
  ];

  const downloadDocuments = [
    {
      title: 'Visa Application Form',
      description: 'Download blank visa application form',
      file: '/Visa_Application_Form.pdf',
      type: 'PDF'
    },
    {
      title: 'Birth Certificate Form',
      description: 'Download birth certificate application',
      file: '/birth-certificate-form.pdf',
      type: 'PDF'
    },
    {
      title: 'Marriage Certificate Form',
      description: 'Download marriage certificate form',
      file: '/marriage-certificate-form.pdf',
      type: 'PDF'
    },
    {
      title: 'Travel Pass Form',
      description: 'Download travel pass application',
      file: '/travel-pass-form.pdf',
      type: 'PDF'
    },
  ];

  const handleDownloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = file.split('/').pop();
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const recentApps = apps.slice(0, 5);
  const activityItems = recentApps.map((app) => ({
    title: `Application #${app.id}`,
    subtitle: `${getStatusLabel(app.status)} - ${formatDate(app.createdAt)}`
  }));

  const upcomingSessions = [
    {
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      title: 'No bookings scheduled yet',
      note: 'New sessions will appear here'
    }
  ];

  const sidebarItems = [
    { label: 'Home', active: true },
    { label: 'AI Agents', badge: 'NEW' },
    { label: 'Booking Calendar' },
    { label: 'Sales' },
    { label: 'Catalog' },
    { label: 'Apps', badge: '3' },
    { label: 'Site & Mobile App' },
    { label: 'Marketing' },
    { label: 'Getting Paid' },
    { label: 'Inbox' },
    { label: 'Customers & Leads' },
    { label: 'Analytics' },
  ];

  const topMenus = [
    {
      label: 'Resources',
      items: ['Wix Studio Blog', 'App Market', 'Partner Directory', 'Templates', 'Branding Studio']
    },
    {
      label: 'Community',
      items: ['Forum', 'Events', 'Academy', 'Community Groups', 'Inspiration']
    },
    {
      label: 'Help',
      items: ['Support Center', 'Contact Us', 'Status', 'Upgrade', 'Keyboard Shortcuts']
    }
  ];

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com';

  return (
    <div className="studio-dashboard">
      <header className="studio-topbar">
        <div className="topbar-left">
          <span className="studio-brand">Ambassade Studio</span>
          <div className="studio-site">
            <span className="site-avatar">{getUserInitials()}</span>
            <span className="site-name">{user?.firstname || user?.username || 'Your Site'}</span>
          </div>
        </div>
        <div className="topbar-center">
          <nav className="topbar-links">
            {topMenus.map((menu) => (
              <div key={menu.label} className="topbar-menu">
                <button className="topbar-menu-button" type="button">
                  {menu.label}
                  <span className="menu-caret">v</span>
                </button>
                <div className="topbar-dropdown" role="menu" aria-label={`${menu.label} menu`}>
                  {menu.items.map((item) => (
                    <button key={item} className="topbar-dropdown-item" type="button">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="topbar-search">
            <input type="search" placeholder="Search..." aria-label="Search" />
          </div>
        </div>
        <div className="topbar-right">
          <button className="topbar-pill">Upgrade</button>
          <button className="topbar-icon" aria-label="Notifications">
            <span className="icon-dot" />
          </button>
          <button className="topbar-icon" aria-label="Messages">
            <span className="icon-dot amber" />
          </button>
          <button className="topbar-icon" aria-label="Profile">
            <span className="avatar-mini">{getUserInitials()}</span>
          </button>
          <button className="topbar-ai">AI</button>
        </div>
      </header>

      <div className="studio-body">
        <aside className="studio-sidebar">
          <button className="quick-actions-button">
            Quick Actions
            <span className="chevron">v</span>
          </button>
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className={`sidebar-item ${item.active ? 'active' : ''}`}
                type="button"
              >
                <span className="sidebar-dot" />
                <span>{item.label}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <button className="sidebar-footer" onClick={() => navigate('/dashboard/applications')}>
            Edit Site
          </button>
        </aside>

        <main className="studio-main">
          <div className="welcome-bar">
            <div>
              <h1>Welcome back, {user?.firstname || user?.username || 'User'}</h1>
              <p>Keep track of your applications and recent activity.</p>
            </div>
            <div className="welcome-actions">
              <button className="primary-light" onClick={() => navigate('/dashboard/applications')}>
                My Applications
              </button>
              <button className="ghost-light" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <section className="studio-card site-card">
            <div className="site-card-left">
              <div className="site-card-avatar">{getUserInitials()}</div>
              <div>
                <div className="site-card-title">Core</div>
                <button className="site-card-link">Manage Plan</button>
              </div>
            </div>
            <div className="site-card-center">
              <div className="site-card-url">{siteUrl}</div>
              <button className="site-card-link">Manage Domain</button>
            </div>
            <div className="site-card-center">
              <div className="site-card-muted">No business email</div>
              <button className="site-card-link">Connect</button>
            </div>
            <div className="site-card-center">
              <div className="site-card-muted">No business phone number</div>
              <button className="site-card-link">Get Google Voice</button>
            </div>
            <div className="site-card-right">
              <button className="ghost-light">Edit Business Info</button>
            </div>
          </section>

          <section className="studio-card analytics-card">
            <div className="card-header">
              <div className="card-title">
                <h2>Analytics</h2>
                <span className="card-pill">No visitors at the moment</span>
              </div>
              <div className="card-actions">
                <button className="link-button">View Your Site Analytics</button>
                <button className="link-button" onClick={handleRefresh}>
                  Refresh
                </button>
              </div>
            </div>
            <p className="card-subtitle">Your key stats for the last 7 days</p>
            <div className="analytics-grid">
              {stats.map((stat) => (
                <div key={stat.label} className={`metric-card ${stat.tone}`}>
                  <div className="metric-label">{stat.label}</div>
                  <div className="metric-value">{loading ? '...' : stat.value}</div>
                  <div className="metric-line" />
                </div>
              ))}
            </div>
            <div className="card-footer">
              <button className="link-button">Help me grow my site traffic</button>
              <span className="muted">Updated {formatLastUpdate()}</span>
            </div>
          </section>

          <div className="studio-grid">
            <section className="studio-card activity-card">
              <div className="card-header">
                <h2>Activity feed</h2>
                <div className="segment-control">
                  <button className="segment active" type="button">Priority</button>
                  <button className="segment" type="button">Date</button>
                </div>
              </div>
              {activityItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-title">No updates yet</div>
                  <div className="empty-subtitle">New activity will appear here.</div>
                </div>
              ) : (
                <div className="activity-list">
                  {activityItems.map((item) => (
                    <div key={item.title} className="activity-item">
                      <span className="activity-dot" />
                      <div>
                        <div className="activity-title">{item.title}</div>
                        <div className="activity-subtitle">{item.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="studio-card sessions-card">
              <div className="card-header">
                <h2>Upcoming sessions</h2>
                <button className="link-button">View All</button>
              </div>
              <div className="sessions-list">
                {upcomingSessions.map((session) => (
                  <div key={session.title} className="session-item">
                    <span className="session-date">{session.date}</span>
                    <div>
                      <div className="session-title">{session.title}</div>
                      <div className="session-subtitle">{session.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="studio-grid">
            <section className="studio-card quick-actions-card">
              <div className="card-header">
                <h2>Quick actions</h2>
                <button className="link-button" onClick={() => navigate('/dashboard/applications')}>
                  View all
                </button>
              </div>
              <div className="actions-grid">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.path}
                    className={`action-chip ${action.tone}`}
                  >
                    <span className="chip-dot" />
                    <div>
                      <div className="chip-title">{action.title}</div>
                      <div className="chip-subtitle">{action.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="studio-card downloads-card">
              <div className="card-header">
                <h2>Downloads</h2>
                <button className="link-button">Add files</button>
              </div>
              <div className="downloads-list">
                {downloadDocuments.map((doc) => (
                  <button
                    key={doc.title}
                    className="download-row"
                    onClick={() => handleDownloadFile(doc.file)}
                    type="button"
                  >
                    <div>
                      <div className="download-title">{doc.title}</div>
                      <div className="download-subtitle">{doc.description}</div>
                    </div>
                    <span className="download-pill">{doc.type}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section className="studio-card applications-card">
            <div className="card-header">
              <div>
                <h2>Recent applications</h2>
                <p className="card-subtitle">Last updated {formatLastUpdate()}</p>
              </div>
              <div className="card-actions">
                <button className="link-button" onClick={handleRefresh}>
                  Refresh
                </button>
                {apps.length > 0 && (
                  <button className="link-button" onClick={() => navigate('/dashboard/applications')}>
                    View All Applications
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading your applications...</p>
              </div>
            ) : apps.length === 0 ? (
              <div className="empty-state">
                <div className="empty-title">No applications yet</div>
                <div className="empty-subtitle">Start your first application to get started.</div>
                <button className="primary-light" onClick={() => navigate('/visaapplication')}>
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
                            <span className="meta-dot" />
                            {formatDate(app.createdAt)}
                          </div>
                          <div className="meta-item">
                            <span className="meta-dot" />
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
                        <div className="tracking-actions">
                          <button
                            className="copy-btn"
                            onClick={() => copyToClipboard(app.trackingNumber, app.id)}
                          >
                            {copied === app.id ? 'Copied!' : 'Copy'}
                          </button>
                          <button
                            className="copy-btn secondary"
                            onClick={() => downloadBarcode(app.trackingNumber, `application-${app.id}`)}
                            title="Download Barcode"
                          >
                            Barcode
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

