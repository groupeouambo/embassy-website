import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaChartLine, FaUsers, FaCog, FaFileAlt, FaSync, FaComments, FaEye, FaDesktop, FaMobileAlt, FaTabletAlt, FaMapMarkerAlt, FaChrome } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './adminDashboard.css';

export default function AdminVisitors() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const visitorsPerPage = 50;

  // Function to fetch statistics and visitors
  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, visitorsData] = await Promise.all([
        api.getVisitorStats(),
        api.getRecentVisitors(visitorsPerPage, (currentPage - 1) * visitorsPerPage)
      ]);

      setStats(statsData);
      setVisitors(visitorsData.visitors || []);
      setTotalVisitors(visitorsData.total || 0);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Failed to load visitor data:', err);
      setLoading(false);
    }
  }, [currentPage]);

  // Initial load and page change
  useEffect(() => {
    fetchData();
  }, [currentPage, fetchData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = () => {
    fetchData();
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

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <FaMobileAlt />;
      case 'tablet':
        return <FaTabletAlt />;
      default:
        return <FaDesktop />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(totalVisitors / visitorsPerPage);

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
          <button onClick={() => navigate('/admin/applications')}>
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
          <button className="active" onClick={() => navigate('/admin/visitors')}>
            <FaEye /> Visitors
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
                <h1 className="analytics-title">Visitor Analytics</h1>
                <span className="analytics-pill">Live Tracking</span>
              </div>
              <p className="analytics-subtitle">
                Monitor website visitors, their locations, and devices
              </p>
            </div>
            <div className="analytics-controls">
              <span className="last-update">Updated {formatLastUpdate()}</span>
              <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
                <FaSync className={loading ? 'spinning' : ''} /> Refresh
              </button>
            </div>
          </div>

          {loading && !stats ? (
            <div className="loading-state">Loading visitor data...</div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="stats-grid">
                <div className="stat-card stat-card-primary">
                  <div className="stat-header">
                    <span className="stat-label">Total Visitors</span>
                    <FaEye className="stat-icon" />
                  </div>
                  <div className="stat-value">{stats?.total?.toLocaleString() || 0}</div>
                  <div className="stat-footer">All time</div>
                </div>

                <div className="stat-card stat-card-success">
                  <div className="stat-header">
                    <span className="stat-label">Unique Visitors</span>
                    <FaUsers className="stat-icon" />
                  </div>
                  <div className="stat-value">{stats?.unique?.toLocaleString() || 0}</div>
                  <div className="stat-footer">By IP address</div>
                </div>

                <div className="stat-card stat-card-info">
                  <div className="stat-header">
                    <span className="stat-label">Today</span>
                    <FaChartLine className="stat-icon" />
                  </div>
                  <div className="stat-value">{stats?.today?.toLocaleString() || 0}</div>
                  <div className="stat-footer">Last 24 hours</div>
                </div>
              </div>

              {/* Device Types */}
              <div className="analytics-row">
                <div className="analytics-card">
                  <h2 className="card-title">Device Types</h2>
                  <div className="device-stats">
                    {stats?.byDevice?.map((device, index) => (
                      <div key={index} className="device-stat-item">
                        <div className="device-stat-header">
                          <span className="device-icon">{getDeviceIcon(device.device_type)}</span>
                          <span className="device-name">{device.device_type || 'Unknown'}</span>
                        </div>
                        <div className="device-stat-bar">
                          <div
                            className="device-stat-fill"
                            style={{
                              width: `${(device.count / stats.total) * 100}%`,
                              backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'
                            }}
                          ></div>
                        </div>
                        <span className="device-stat-count">{device.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analytics-card">
                  <h2 className="card-title">Top Countries</h2>
                  <div className="country-stats">
                    {stats?.byCountry?.slice(0, 5).map((country, index) => (
                      <div key={index} className="country-stat-item">
                        <div className="country-stat-left">
                          <FaMapMarkerAlt className="country-icon" />
                          <span className="country-name">{country.country || 'Unknown'}</span>
                        </div>
                        <span className="country-count">{country.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analytics-card">
                  <h2 className="card-title">Browsers</h2>
                  <div className="browser-stats">
                    {stats?.byBrowser?.slice(0, 5).map((browser, index) => (
                      <div key={index} className="browser-stat-item">
                        <div className="browser-stat-left">
                          <FaChrome className="browser-icon" />
                          <span className="browser-name">{browser.browser || 'Unknown'}</span>
                        </div>
                        <span className="browser-count">{browser.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Visitors Table */}
              <div className="analytics-card">
                <h2 className="card-title">Recent Visitors</h2>
                <div className="table-container">
                  <table className="visitors-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>IP Address</th>
                        <th>Location</th>
                        <th>Device</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th>Page</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((visitor) => (
                        <tr key={visitor.id}>
                          <td className="time-cell">{formatDate(visitor.visited_at)}</td>
                          <td className="ip-cell">{visitor.ip_address || 'N/A'}</td>
                          <td className="location-cell">
                            {visitor.city && visitor.country
                              ? `${visitor.city}, ${visitor.country}`
                              : visitor.country || 'Unknown'}
                          </td>
                          <td className="device-cell">
                            <span className="device-badge">
                              {getDeviceIcon(visitor.device_type)}
                              <span>{visitor.device_type || 'Unknown'}</span>
                            </span>
                          </td>
                          <td className="browser-cell">{visitor.browser || 'Unknown'}</td>
                          <td className="os-cell">{visitor.os || 'Unknown'}</td>
                          <td className="page-cell" title={visitor.page_url}>
                            {visitor.page_url ? new URL(visitor.page_url).pathname : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages} ({totalVisitors.toLocaleString()} total)
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
