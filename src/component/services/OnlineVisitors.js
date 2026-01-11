import React, { useState, useEffect } from 'react';
import { FaCircle, FaDesktop, FaMobileAlt, FaTabletAlt } from 'react-icons/fa';
import { api } from '../../api';

export default function OnlineVisitors() {
  const [onlineVisitors, setOnlineVisitors] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOnlineVisitors = async () => {
    try {
      const data = await api.getOnlineVisitors();
      setOnlineVisitors(data.visitors || []);
      setCount(data.count || 0);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load online visitors:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineVisitors();

    // Refresh every 10 seconds
    const interval = setInterval(() => {
      fetchOnlineVisitors();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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

  const getTimeAgo = (lastActive) => {
    if (!lastActive) return 'Just now';
    const now = new Date();
    const active = new Date(lastActive);
    const diffSeconds = Math.floor((now - active) / 1000);

    if (diffSeconds < 30) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  const getCurrentPage = (url) => {
    if (!url) return '/';
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="online-visitors-widget">
        <div className="widget-header">
          <h3>
            <FaCircle className="online-indicator" />
            Online Now
          </h3>
        </div>
        <div className="widget-body">
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="online-visitors-widget">
      <div className="widget-header">
        <h3>
          <FaCircle className="online-indicator" />
          Online Now
        </h3>
        <span className="online-count">{count} {count === 1 ? 'visitor' : 'visitors'}</span>
      </div>
      <div className="widget-body">
        {onlineVisitors.length === 0 ? (
          <p className="no-visitors">No visitors currently online</p>
        ) : (
          <div className="online-visitors-list">
            {onlineVisitors.map((visitor, index) => (
              <div key={index} className="online-visitor-item">
                <div className="visitor-info">
                  <div className="visitor-icon">{getDeviceIcon(visitor.device_type)}</div>
                  <div className="visitor-details">
                    <div className="visitor-name">
                      {visitor.full_name ? (
                        <strong>{visitor.full_name}</strong>
                      ) : visitor.username ? (
                        <strong>{visitor.username}</strong>
                      ) : (
                        <span className="visitor-anonymous">Anonymous</span>
                      )}
                    </div>
                    <div className="visitor-location">
                      {visitor.city && visitor.country
                        ? `${visitor.city}, ${visitor.country}`
                        : visitor.country || visitor.ip_address}
                    </div>
                  </div>
                </div>
                <div className="visitor-meta">
                  <div className="visitor-page" title={visitor.page_url}>
                    {getCurrentPage(visitor.page_url)}
                  </div>
                  <div className="visitor-time">{getTimeAgo(visitor.last_active)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}