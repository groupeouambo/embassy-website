import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaComments, FaSync } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './adminDashboard.css';

export default function AdminSite() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchAnalytics = async () => {
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAnalytics();
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'AD';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderMiniChart = (color) => (
    <svg className="stat-spark" width="64" height="26" viewBox="0 0 64 26" fill="none">
      <path d="M2 22 L12 18 L22 16 L32 12 L42 14 L52 10 L62 6" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand">Embassy Admin</div>
        <div className="sidebar-user">
          <div className="avatar-placeholder">{getInitials(user?.fullName)}</div>
          <div>
            <div className="user-name">{user?.fullName || 'Admin User'}</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
        <nav className="admin-nav">
          <button onClick={() => navigate('/admin')}>Overview</button>
          <button onClick={() => navigate('/admin/applications')}>Applications</button>
          <button onClick={() => navigate('/admin/messages')}>
            <FaComments className="nav-icon" /> Messages
          </button>
          <button onClick={() => navigate('/admin/users')}>Users</button>
          <button onClick={() => navigate('/admin/settings')}>Settings</button>
          <button className="active" onClick={() => navigate('/admin/site')}>
            <FaGlobe className="nav-icon" /> Site Analytics
          </button>
        </nav>
        <div className="sidebar-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <section className="admin-section">
          <div className="analytics-header">
          <div>
            <div className="analytics-title-row">
              <h1 className="analytics-title">Analytics</h1>
              <span className="analytics-pill">Site</span>
            </div>
            <div className="analytics-sub">
              <span>Your key stats for the last 30 days</span>
              <span>Updated {formatLastUpdate()}</span>
            </div>
          </div>
          <div className="analytics-actions">
            <button onClick={handleRefresh} className="refresh-btn">
              <FaSync /> Refresh
            </button>
          </div>
        </div>

        {loading && !analytics ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #e5e7eb',
                borderTopColor: '#4285f4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto'
              }}></div>
              <p style={{ color: '#6b7280' }}>Loading analytics...</p>
            </div>
          ) : analytics ? (
            <>
              <div className="stats-row">
                <div className="stat-tile">
                  <div className="stat-kicker">Total Users</div>
                  <div className="stat-value">{analytics.overview.totalUsers}</div>
                  <div className="stat-foot">{analytics.overview.usersLast7Days} this week</div>
                  {renderMiniChart('#2563eb')}
                </div>
                <div className="stat-tile">
                  <div className="stat-kicker">Total Applications</div>
                  <div className="stat-value">{analytics.overview.totalApplications}</div>
                  <div className="stat-foot">{analytics.overview.applicationsLast30Days} this month</div>
                  {renderMiniChart('#7c3aed')}
                </div>
                <div className="stat-tile">
                  <div className="stat-kicker">Chat Conversations</div>
                  <div className="stat-value">{analytics.overview.totalConversations}</div>
                  <div className="stat-foot">{analytics.overview.activeConversations} active</div>
                  {renderMiniChart('#f59e0b')}
                </div>
                <div className="stat-tile">
                  <div className="stat-kicker">Total Messages</div>
                  <div className="stat-value">{analytics.overview.totalMessages}</div>
                  <div className="stat-foot">
                    {analytics.overview.totalConversations > 0
                      ? Math.round(analytics.overview.totalMessages / analytics.overview.totalConversations)
                      : 0} avg per conversation
                  </div>
                  {renderMiniChart('#10b981')}
                </div>
              </div>

              <div className="panel-grid">
                <div className="panel-card">
                  <div className="panel-head">
                    <h3 className="panel-title">Application Submissions</h3>
                    <p className="panel-subtitle">Last 12 months</p>
                  </div>
                  {analytics.trends.applications.length === 0 ? (
                    <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>No data available</p>
                  ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {analytics.trends.applications.slice(-6).map((item, index) => {
                        const date = new Date(item.month + '-01');
                        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                        const maxValue = Math.max(...analytics.trends.applications.map(i => i.total));
                        const percentage = (item.total / maxValue) * 100;

                        return (
                          <div key={item.month} style={{
                            padding: '16px 0',
                            borderBottom: index < 5 ? '1px solid #f3f4f6' : 'none'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.875rem', color: '#5f6368' }}>{monthName}</span>
                              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#202124' }}>{item.total}</span>
                            </div>
                            <div style={{
                              width: '100%',
                              height: '6px',
                              background: '#f3f4f6',
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${percentage}%`,
                                height: '100%',
                                background: '#4285f4',
                                transition: 'width 0.3s ease'
                              }}></div>
                            </div>
                            <div style={{
                              display: 'flex',
                              gap: '16px',
                              marginTop: '8px',
                              fontSize: '0.75rem',
                              color: '#9ca3af'
                            }}>
                              <span>Visa: {item.visa}</span>
                              <span>Marriage: {item.marriage}</span>
                              <span>Birth: {item.birth}</span>
                              <span>Travel: {item.travel}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="panel-card">
                  <div className="panel-head">
                    <h3 className="panel-title">Most Popular Services</h3>
                    <p className="panel-subtitle">By submissions</p>
                  </div>
                  <div>
                    {analytics.applicationTypes.map((app, index) => {
                      const total = analytics.applicationTypes.reduce((sum, a) => sum + a.count, 0);
                      const percentage = total > 0 ? Math.round((app.count / total) * 100) : 0;
                      const colors = ['#4285f4', '#ea4335', '#fbbc04', '#34a853'];

                      return (
                        <div key={app.type} style={{ marginBottom: index < analytics.applicationTypes.length - 1 ? '20px' : '0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: colors[index]
                              }}></div>
                              <span style={{ fontSize: '0.875rem', color: '#202124' }}>{app.type}</span>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#202124' }}>
                              {app.count} ({percentage}%)
                            </span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '6px',
                            background: '#f3f4f6',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${percentage}%`,
                              height: '100%',
                              background: colors[index],
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="panel-card" style={{ marginBottom: '24px' }}>
                <div className="panel-head">
                  <h3 className="panel-title">User Registrations</h3>
                  <p className="panel-subtitle">Last 12 months</p>
                </div>
                {analytics.trends.userRegistrations.length === 0 ? (
                  <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>No data available</p>
                ) : (
                  <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {analytics.trends.userRegistrations.map((item) => {
                      const date = new Date(item.month + '-01');
                      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                      const maxValue = Math.max(...analytics.trends.userRegistrations.map(i => i.count));
                      const heightPercentage = maxValue > 0 ? (item.count / maxValue) * 100 : 0;

                      return (
                        <div key={item.month} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          minWidth: '60px'
                        }}>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#5f6368',
                            marginBottom: '8px',
                            fontWeight: 500
                          }}>
                            {item.count}
                          </div>
                          <div style={{
                            width: '40px',
                            height: '120px',
                            background: '#f3f4f6',
                            borderRadius: '4px 4px 0 0',
                            display: 'flex',
                            alignItems: 'flex-end',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: '100%',
                              height: `${heightPercentage}%`,
                              background: '#4285f4',
                              transition: 'height 0.3s ease'
                            }}></div>
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#5f6368',
                            marginTop: '8px'
                          }}>
                            {monthName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="panel-card" style={{ background: '#111827', color: '#fff' }}>
                <div className="panel-head" style={{ marginBottom: '16px' }}>
                  <h3 className="panel-title" style={{ color: '#fff' }}>Quick Insights</h3>
                  <p className="panel-subtitle" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Performance snapshot
                  </p>
                </div>
                <div className="insight-grid">
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 500, marginBottom: '4px' }}>
                      {analytics.overview.totalUsers > 0
                        ? (analytics.overview.totalApplications / analytics.overview.totalUsers).toFixed(1)
                        : 0}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      Avg applications per user
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 500, marginBottom: '4px' }}>
                      {analytics.overview.totalConversations > 0
                        ? (analytics.overview.totalMessages / analytics.overview.totalConversations).toFixed(1)
                        : 0}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      Avg messages per chat
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 500, marginBottom: '4px' }}>
                      {analytics.overview.totalConversations > 0
                        ? Math.round((analytics.overview.activeConversations / analytics.overview.totalConversations) * 100)
                        : 0}%
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      Active conversation rate
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 500, marginBottom: '4px' }}>
                      {analytics.applicationTypes[0]?.type || 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      Most popular service
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ color: '#6b7280' }}>Failed to load analytics. Please try again.</p>
              <button onClick={handleRefresh} style={{
                marginTop: '16px',
                padding: '10px 20px',
                background: '#4285f4',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Retry
              </button>
            </div>
          )}
        </section>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    </div>
  );
}

