import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaComments, FaSync } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './adminDashboard.css';

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchUsers = async () => {
    try {
      console.log('[AdminUsers] Fetching users...');
      const data = await api.getAdminUsers();
      console.log('[AdminUsers] Received data:', data);
      const list = Array.isArray(data) ? data : (data.users || []);
      console.log('[AdminUsers] Processed users list:', list);
      setUsers(list);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('[AdminUsers] Failed to load users:', err);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
          <button className="active" onClick={() => navigate('/admin/users')}>Users</button>
          <button onClick={() => navigate('/admin/settings')}>Settings</button>
          <button onClick={() => navigate('/admin/site')}>
            <FaGlobe className="nav-icon" /> Site
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
          <div className="section-header">
            <div>
              <h1>Users</h1>
              <p>Manage registered users ({users.length} total)</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                🔄 Auto-updates every 30 seconds • Last updated: {formatLastUpdate()}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="refresh-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <FaSync /> Refresh
            </button>
          </div>

          <div className="stat-grid" style={{ marginTop: '20px' }}>
            <div className="stat-card">
              <div className="stat-number">{loading ? '—' : users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>

          {loading && users.length === 0 ? (
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
              <p style={{ color: '#6b7280' }}>Loading users...</p>
            </div>
          ) : (
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              marginTop: '20px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>ID</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Username</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 16px', color: '#1f2937' }}>#{u.id}</td>
                        <td style={{ padding: '12px 16px', color: '#1f2937', fontWeight: 500 }}>
                          {u.firstname} {u.lastname}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{u.username}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '0.875rem' }}>
                          {formatDate(u.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
