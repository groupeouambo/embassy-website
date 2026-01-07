import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaChartLine, FaUsers, FaCog, FaFileAlt, FaSync, FaComments } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './adminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Function to fetch statistics
  const fetchStatistics = async () => {
    try {
      const data = await api.getAdminStatistics();
      setStats(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Failed to load statistics:', err);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Auto-refresh every 2 minutes (reduced from 30 seconds to avoid rate limiting)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatistics();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchStatistics();
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
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderSparkline = (color) => (
    <svg className="stat-spark" width="64" height="26" viewBox="0 0 64 26" fill="none">
      <path d="M2 22 L12 18 L22 16 L32 12 L42 14 L52 10 L62 6" stroke={color} strokeWidth="2" />
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
          <button className="active" onClick={() => navigate('/admin')}>
            <FaChartLine /> Overview
          </button>
          <button onClick={() => navigate('/admin/applications')}>
            <FaFileAlt /> Applications
          </button>
          <button onClick={() => navigate('/admin/messages')}>
            <FaComments /> Messages
          </button>
          <button onClick={() => navigate('/admin/users')}>
            <FaUsers /> Users
            {stats?.users?.total !== undefined && (
              <span className="nav-badge">{stats.users.total}</span>
            )}
          </button>
          <button onClick={() => navigate('/admin/settings')}>
            <FaCog /> Settings
          </button>
          <button onClick={() => navigate('/admin/site')}>
            <FaGlobe /> Site
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
                <span className="analytics-pill">Overview</span>
              </div>
              <div className="analytics-sub">
                <span>Your key stats for the last 30 days</span>
                <span>Updated {formatLastUpdate()}</span>
                <button className="analytics-link" onClick={() => navigate('/admin/site')}>
                  View Your Site Analytics
                </button>
              </div>
            </div>
            <div className="analytics-actions">
              <button onClick={handleRefresh} className="refresh-btn">
                <FaSync /> Refresh
              </button>
            </div>
          </div>

          {loading && !stats ? (
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
              <p style={{ color: '#6b7280' }}>Loading statistics...</p>
            </div>
          ) : stats ? (
            <>
              <div className="stats-row">
                <div className="stat-tile">
                  <div className="stat-kicker">Total Applications</div>
                  <div className="stat-value">{stats.totals.applications}</div>
                  <div className="stat-foot">All time</div>
                  {renderSparkline('#2563eb')}
                </div>
                <div className="stat-tile">
                  <div className="stat-kicker">Total Users</div>
                  <div className="stat-value">{stats.users?.total || 0}</div>
                  <div className="stat-foot">Signed up</div>
                  {renderSparkline('#7c3aed')}
                </div>
                <div className="stat-tile">
                  <div className="stat-kicker">Pending Review</div>
                  <div className="stat-value">{stats.totals.pending}</div>
                  <div className="stat-foot">Awaiting action</div>
                  {renderSparkline('#f59e0b')}
                </div>
                <div className="stat-tile">
                  <div className="stat-kicker">Approved</div>
                  <div className="stat-value">{stats.totals.approved}</div>
                  <div className="stat-foot">Completed</div>
                  {renderSparkline('#10b981')}
                </div>
              </div>

              <div className="panel-grid">
                <div className="panel-card">
                  <div className="panel-head">
                    <h2 className="panel-title">Activity Feed</h2>
                    <p className="panel-subtitle">Most recent updates</p>
                  </div>
                  <div className="feed-list">
                    <div className="feed-item">
                      <span>Pending applications</span>
                      <strong>{stats.totals.pending}</strong>
                    </div>
                    <div className="feed-item">
                      <span>Under review</span>
                      <strong>{stats.totals.underReview}</strong>
                    </div>
                    <div className="feed-item">
                      <span>Approved applications</span>
                      <strong>{stats.totals.approved}</strong>
                    </div>
                    <div className="feed-item">
                      <span>Visa applications</span>
                      <strong>{stats.byType.visa.total}</strong>
                    </div>
                  </div>
                </div>

                <div className="panel-card">
                  <div className="panel-head">
                    <h2 className="panel-title">Daily Insights</h2>
                    <p className="panel-subtitle">Based on totals</p>
                  </div>
                  <div className="insight-grid">
                    <div className="insight-tile">
                      <div className="insight-value">
                        {stats.totals.applications
                          ? Math.round((stats.totals.approved / stats.totals.applications) * 100)
                          : 0}%
                      </div>
                      <div className="insight-label">Approval rate</div>
                    </div>
                    <div className="insight-tile">
                      <div className="insight-value">
                        {stats.totals.applications
                          ? Math.round((stats.totals.pending / stats.totals.applications) * 100)
                          : 0}%
                      </div>
                      <div className="insight-label">Pending share</div>
                    </div>
                    <div className="insight-tile">
                      <div className="insight-value">
                        {stats.users?.total
                          ? (stats.totals.applications / stats.users.total).toFixed(1)
                          : '0.0'}
                      </div>
                      <div className="insight-label">Apps per user</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-head">
                  <h2 className="panel-title">Applications by Type</h2>
                  <p className="panel-subtitle">Current totals</p>
                </div>
                <div className="feed-list">
                  <div className="feed-item">
                    <span>Visa Applications</span>
                    <strong>{stats.byType.visa.total}</strong>
                  </div>
                  <div className="feed-item">
                    <span>Marriage Certificates</span>
                    <strong>{stats.byType.marriage.total}</strong>
                  </div>
                  <div className="feed-item">
                    <span>Birth Certificates</span>
                    <strong>{stats.byType.birth.total}</strong>
                  </div>
                  <div className="feed-item">
                    <span>Travel Passes</span>
                    <strong>{stats.byType.travel.total}</strong>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ color: '#6b7280' }}>Failed to load statistics. Please try again.</p>
              <button onClick={handleRefresh} className="refresh-btn" style={{ marginTop: '16px' }}>
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

