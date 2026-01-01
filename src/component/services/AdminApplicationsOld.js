import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaChartLine, FaUsers, FaCog, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './adminDashboard.css';

export default function AdminApplications() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({ id: null, status: '', loading: false });
  const [trackingUpdate, setTrackingUpdate] = useState({ id: null, number: '', loading: false });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAllApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdate({ id, status: newStatus, loading: true });
    try {
      await api.updateApplicationStatus(id, newStatus);
      await loadApplications();
      setStatusUpdate({ id: null, status: '', loading: false });
    } catch (err) {
      setError(err.message || 'Failed to update status');
      setStatusUpdate({ id: null, status: '', loading: false });
    }
  };

  const handleTrackingSubmit = async (id) => {
    if (!trackingUpdate.number.trim()) {
      setError('Tracking number cannot be empty');
      return;
    }

    setTrackingUpdate({ ...trackingUpdate, loading: true });
    try {
      await api.updateApplicationTracking(id, trackingUpdate.number);
      await loadApplications();
      setTrackingUpdate({ id: null, number: '', loading: false });
    } catch (err) {
      setError(err.message || 'Failed to update tracking number');
      setTrackingUpdate({ ...trackingUpdate, loading: false });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      under_review: '#3b82f6',
      approved: '#10b981',
      denied: '#ef4444',
      shipped: '#8b5cf6',
    };
    return colors[status] || '#6b7280';
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
          <button onClick={() => navigate('/admin')}>
            <FaChartLine /> Overview
          </button>
          <button className="active" onClick={() => navigate('/admin/applications')}>
            <FaFileAlt /> Applications
          </button>
          <button onClick={() => navigate('/admin/users')}>
            <FaUsers /> Users
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
          <div className="section-header">
            <h1>Visa Applications</h1>
            <p>Manage all visa applications and update their status</p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.875rem',
              marginTop: '16px'
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No applications found
            </div>
          ) : (
            <div style={{ marginTop: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Applicant</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Visa Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Tracking</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', color: '#1f2937' }}>#{app.id}</td>
                      <td style={{ padding: '12px', color: '#1f2937' }}>
                        {app.firstName} {app.lastName}
                      </td>
                      <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>{app.userName}</td>
                      <td style={{ padding: '12px', color: '#1f2937' }}>{app.visaType}</td>
                      <td style={{ padding: '12px' }}>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          disabled={statusUpdate.id === app.id && statusUpdate.loading}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #e5e7eb',
                            background: '#fff',
                            color: getStatusColor(app.status),
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            minWidth: '140px',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="approved">Approved</option>
                          <option value="denied">Denied</option>
                          <option value="shipped">Shipped</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {trackingUpdate.id === app.id ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="text"
                              value={trackingUpdate.number}
                              onChange={(e) => setTrackingUpdate({ ...trackingUpdate, number: e.target.value })}
                              placeholder="Tracking number"
                              style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1.5px solid #e5e7eb',
                                fontSize: '0.875rem',
                                width: '160px',
                              }}
                            />
                            <button
                              onClick={() => handleTrackingSubmit(app.id)}
                              disabled={trackingUpdate.loading}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#10b981',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                              }}
                            >
                              {trackingUpdate.loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setTrackingUpdate({ id: null, number: '', loading: false })}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                color: '#6b7280',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : app.tracking_number ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{
                              padding: '8px 12px',
                              background: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              borderRadius: '8px',
                              color: '#166534',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              fontFamily: 'monospace',
                            }}>
                              {app.tracking_number}
                            </div>
                            <button
                              onClick={() => setTrackingUpdate({ id: app.id, number: app.tracking_number, loading: false })}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                color: '#6b7280',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setTrackingUpdate({ id: app.id, number: '', loading: false })}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              color: '#0b2f63',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                            }}
                          >
                            Add Tracking
                          </button>
                        )}
                      </td>
                      <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
