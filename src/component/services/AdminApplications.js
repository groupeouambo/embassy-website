import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaChartLine, FaUsers, FaCog, FaFileAlt, FaComments, FaDownload } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './adminDashboard.css';

export default function AdminApplicationsNew() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('visa');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({ id: null, status: '', loading: false });
  const [trackingUpdate, setTrackingUpdate] = useState({ id: null, number: '', carrier: '', loading: false });

  useEffect(() => {
    loadApplications();
  }, [activeTab]);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      switch (activeTab) {
        case 'visa':
          data = await api.getAllApplications();
          break;
        case 'marriage':
          data = await api.getMarriageApplications();
          break;
        case 'birth':
          data = await api.getBirthCertificateApplications();
          break;
        case 'travel':
          data = await api.getTravelPassApplications();
          break;
        default:
          data = [];
      }
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
      switch (activeTab) {
        case 'visa':
          await api.updateApplicationStatus(id, newStatus);
          break;
        case 'marriage':
          await api.updateMarriageStatus(id, newStatus);
          break;
        case 'birth':
          await api.updateBirthCertificateStatus(id, newStatus);
          break;
        case 'travel':
          await api.updateTravelPassStatus(id, newStatus);
          break;
      }
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
      switch (activeTab) {
        case 'visa':
          await api.updateApplicationTracking(id, trackingUpdate.number, trackingUpdate.carrier);
          break;
        case 'marriage':
          await api.updateMarriageTracking(id, trackingUpdate.number, trackingUpdate.carrier);
          break;
        case 'birth':
          await api.updateBirthCertificateTracking(id, trackingUpdate.number, trackingUpdate.carrier);
          break;
        case 'travel':
          await api.updateTravelPassTracking(id, trackingUpdate.number, trackingUpdate.carrier);
          break;
      }
      await loadApplications();
      setTrackingUpdate({ id: null, number: '', carrier: '', loading: false });
    } catch (err) {
      setError(err.message || 'Failed to update tracking number');
      setTrackingUpdate({ ...trackingUpdate, loading: false });
    }
  };

  const handleDownload = async (id) => {
    try {
      let endpoint;
      let fileName;

      switch (activeTab) {
        case 'visa':
          endpoint = `/api/visa-applications/${id}/pdf`;
          fileName = `visa-application-${id}.pdf`;
          break;
        case 'marriage':
          endpoint = `/api/marriage-applications/${id}/pdf`;
          fileName = `marriage-application-${id}.pdf`;
          break;
        case 'birth':
          endpoint = `/api/birth-certificate-applications/${id}/pdf`;
          fileName = `birth-certificate-${id}.pdf`;
          break;
        case 'travel':
          endpoint = `/api/travel-pass-applications/${id}/pdf`;
          fileName = `travel-pass-${id}.pdf`;
          break;
        default:
          return;
      }

      const response = await fetch(`http://localhost:4000${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download application');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message || 'Failed to download application');
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

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'visa':
        return (
          <>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Applicant</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Visa Type</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Tracking</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Submitted</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Actions</th>
          </>
        );
      case 'marriage':
        return (
          <>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Spouse 1</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Spouse 2</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Marriage Date</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Tracking</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Submitted</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Actions</th>
          </>
        );
      case 'birth':
        return (
          <>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Child Name</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Birth Date</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Tracking</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Submitted</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Actions</th>
          </>
        );
      case 'travel':
        return (
          <>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Applicant</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Nationality</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Destination</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Departure</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Tracking</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Submitted</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Actions</th>
          </>
        );
    }
  };

  const renderTableRow = (app) => {
    switch (activeTab) {
      case 'visa':
        return (
          <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '12px', color: '#1f2937' }}>#{app.id}</td>
            <td style={{ padding: '12px', color: '#1f2937' }}>
              {app.firstName} {app.lastName}
            </td>
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>{app.userName}</td>
            <td style={{ padding: '12px', color: '#1f2937' }}>{app.visaType}</td>
            {renderStatusCell(app)}
            {renderTrackingCell(app)}
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
              {new Date(app.createdAt).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px' }}>
              <button
                onClick={() => handleDownload(app.id)}
                style={{
                  padding: '8px 16px',
                  background: '#4285f4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500
                }}
                title="Download full application data"
              >
                <FaDownload size={14} /> Download
              </button>
            </td>
          </tr>
        );
      case 'marriage':
        return (
          <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '12px', color: '#1f2937' }}>#{app.id}</td>
            <td style={{ padding: '12px', color: '#1f2937' }}>
              {app.firstName} {app.lastName}
            </td>
            <td style={{ padding: '12px', color: '#1f2937' }}>
              {app.spouse2_first_name} {app.spouse2_last_name}
            </td>
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
              {new Date(app.marriage_date).toLocaleDateString()}
            </td>
            {renderStatusCell(app)}
            {renderTrackingCell(app)}
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
              {new Date(app.createdAt).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px' }}>
              <button
                onClick={() => handleDownload(app.id)}
                style={{
                  padding: '8px 16px',
                  background: '#4285f4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500
                }}
                title="Download full application data"
              >
                <FaDownload size={14} /> Download
              </button>
            </td>
          </tr>
        );
      case 'birth':
        return (
          <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '12px', color: '#1f2937' }}>#{app.id}</td>
            <td style={{ padding: '12px', color: '#1f2937' }}>
              {app.firstName} {app.lastName}
            </td>
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
              {new Date(app.child_birth_date).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>{app.userName}</td>
            {renderStatusCell(app)}
            {renderTrackingCell(app)}
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
              {new Date(app.createdAt).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px' }}>
              <button
                onClick={() => handleDownload(app.id)}
                style={{
                  padding: '8px 16px',
                  background: '#4285f4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500
                }}
                title="Download full application data"
              >
                <FaDownload size={14} /> Download
              </button>
            </td>
          </tr>
        );
      case 'travel':
        return (
          <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ padding: '12px', color: '#1f2937' }}>#{app.id}</td>
            <td style={{ padding: '12px', color: '#1f2937' }}>
              {app.first_name} {app.last_name}
            </td>
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>{app.nationality}</td>
            <td style={{ padding: '12px', color: '#1f2937' }}>{app.destination_country}</td>
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
              {new Date(app.departure_date).toLocaleDateString()}
            </td>
            {renderStatusCell(app)}
            {renderTrackingCell(app)}
            <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
              {new Date(app.created_at).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px' }}>
              <button
                onClick={() => handleDownload(app.id)}
                style={{
                  padding: '8px 16px',
                  background: '#4285f4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500
                }}
                title="Download full application data"
              >
                <FaDownload size={14} /> Download
              </button>
            </td>
          </tr>
        );
    }
  };

  const renderStatusCell = (app) => (
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
  );

  const renderTrackingCell = (app) => (
    <td style={{ padding: '12px' }}>
      {trackingUpdate.id === app.id ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            <select
              value={trackingUpdate.carrier}
              onChange={(e) => setTrackingUpdate({ ...trackingUpdate, carrier: e.target.value })}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #e5e7eb',
                fontSize: '0.875rem',
                width: '120px',
                cursor: 'pointer',
              }}
            >
              <option value="">Select Carrier</option>
              <option value="usps">USPS</option>
              <option value="ups">UPS</option>
              <option value="fedex">FedEx</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
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
              onClick={() => setTrackingUpdate({ id: null, number: '', carrier: '', loading: false })}
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
        </div>
      ) : app.tracking_number ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {app.shipping_carrier && (
              <div style={{
                padding: '6px 10px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                color: '#1e40af',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}>
                {app.shipping_carrier}
              </div>
            )}
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
              onClick={() => setTrackingUpdate({ id: app.id, number: app.tracking_number, carrier: app.shipping_carrier || '', loading: false })}
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
        </div>
      ) : (
        <button
          onClick={() => setTrackingUpdate({ id: app.id, number: '', carrier: '', loading: false })}
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
          <button onClick={() => navigate('/admin')}>
            <FaChartLine /> Overview
          </button>
          <button className="active" onClick={() => navigate('/admin/applications')}>
            <FaFileAlt /> Applications
          </button>
          <button onClick={() => navigate('/admin/messages')}>
            <FaComments /> Messages
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
            <h1>Applications</h1>
            <p>Manage all applications and update their status</p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '24px',
            borderBottom: '2px solid #e5e7eb',
          }}>
            <button
              onClick={() => setActiveTab('visa')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: activeTab === 'visa' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'visa' ? '#ffffff' : '#6b7280',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.2s ease',
              }}
            >
              Visa Applications
            </button>
            <button
              onClick={() => setActiveTab('marriage')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: activeTab === 'marriage' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'marriage' ? '#ffffff' : '#6b7280',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.2s ease',
              }}
            >
              Marriage Certificates
            </button>
            <button
              onClick={() => setActiveTab('birth')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: activeTab === 'birth' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'birth' ? '#ffffff' : '#6b7280',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.2s ease',
              }}
            >
              Birth Certificates
            </button>
            <button
              onClick={() => setActiveTab('travel')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: activeTab === 'travel' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'travel' ? '#ffffff' : '#6b7280',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.2s ease',
              }}
            >
              Travel Pass
            </button>
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
                    {renderTableHeaders()}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => renderTableRow(app))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
