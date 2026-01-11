import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaChartLine, FaUsers, FaCog, FaFileAlt, FaComments, FaReply, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './adminDashboard.css';

export default function AdminReplies() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'applications'
  const [contactReplies, setContactReplies] = useState([]);
  const [applicationReplies, setApplicationReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reply form states
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyType, setReplyType] = useState(''); // 'contact' or 'application'
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const scrollToBottom = useCallback(() => {
    // Scroll to reply form when it opens
    if (showReplyForm) {
      const formElement = document.getElementById('reply-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [showReplyForm]);

  useEffect(() => {
    scrollToBottom();
  }, [showReplyForm, scrollToBottom]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contactData, applicationData] = await Promise.all([
        api.getContactReplies(),
        api.getApplicationReplies()
      ]);
      setContactReplies(contactData || []);
      setApplicationReplies(applicationData || []);
    } catch (err) {
      console.error('Failed to load replies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!adminReply.trim() || !selectedItem) return;

    setSendingReply(true);
    try {
      if (replyType === 'contact') {
        await api.sendContactReply({
          contactEmail: selectedItem.contact_email,
          contactSubject: selectedItem.contact_subject,
          contactMessage: selectedItem.contact_message,
          adminReply: adminReply.trim()
        });
      } else if (replyType === 'application') {
        await api.sendApplicationReply({
          applicationId: selectedItem.application_id,
          applicationType: selectedItem.application_type,
          userEmail: selectedItem.user_email,
          adminReply: adminReply.trim()
        });
      }

      // Reset form and refresh data
      setShowReplyForm(false);
      setAdminReply('');
      setSelectedItem(null);
      setReplyType('');
      await fetchData();
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const openReplyForm = (type, item) => {
    setReplyType(type);
    setSelectedItem(item);
    setShowReplyForm(true);
    setAdminReply('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <button className="active" onClick={() => navigate('/admin/replies')}>
            <FaReply /> Replies
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
            <div>
              <h1>Reply Management</h1>
              <p>Send replies to contact forms and applications</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '0' }}>
              <button
                onClick={() => setActiveTab('contact')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  background: activeTab === 'contact' ? '#0b2f63' : '#f9fafb',
                  color: activeTab === 'contact' ? '#fff' : '#6b7280',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderBottom: activeTab === 'contact' ? '3px solid #0b2f63' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                Contact Forms ({contactReplies.length})
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  background: activeTab === 'applications' ? '#0b2f63' : '#f9fafb',
                  color: activeTab === 'applications' ? '#fff' : '#6b7280',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderBottom: activeTab === 'applications' ? '3px solid #0b2f63' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                Application Replies ({applicationReplies.length})
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
              <p style={{ color: '#6b7280' }}>Loading replies...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Content Area */}
              <div style={{ flex: 1 }}>
                {activeTab === 'contact' ? (
                  <div>
                    <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
                      Contact Form Submissions
                    </div>
                    {contactReplies.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', background: '#f9fafb', borderRadius: '8px' }}>
                        No contact form replies yet
                      </div>
                    ) : (
                      contactReplies.map((reply) => (
                        <div
                          key={reply.id}
                          style={{
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '16px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                {reply.contact_email}
                              </div>
                              {reply.contact_subject && (
                                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                  Subject: {reply.contact_subject}
                                </div>
                              )}
                              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                {formatTimestamp(reply.replied_at)}
                              </div>
                            </div>
                            <button
                              onClick={() => openReplyForm('contact', reply)}
                              style={{
                                padding: '8px 16px',
                                background: '#10b981',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <FaReply /> Reply Again
                            </button>
                          </div>

                          {reply.contact_message && (
                            <div style={{ marginBottom: '16px' }}>
                              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
                                Original Message:
                              </div>
                              <div style={{
                                background: '#f3f4f6',
                                padding: '12px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                color: '#4b5563',
                                whiteSpace: 'pre-wrap'
                              }}>
                                {reply.contact_message}
                              </div>
                            </div>
                          )}

                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#059669' }}>
                              Reply by {reply.admin_name}:
                            </div>
                            <div style={{
                              background: '#f0fdf4',
                              padding: '12px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              color: '#166534',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {reply.admin_reply}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
                      Application Replies
                    </div>
                    {applicationReplies.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', background: '#f9fafb', borderRadius: '8px' }}>
                        No application replies yet
                      </div>
                    ) : (
                      applicationReplies.map((reply) => (
                        <div
                          key={reply.id}
                          style={{
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '16px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                {reply.user_email}
                              </div>
                              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                Application #{reply.application_id} ({reply.application_type.replace('_', ' ')})
                              </div>
                              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                {formatTimestamp(reply.replied_at)}
                              </div>
                            </div>
                            <button
                              onClick={() => openReplyForm('application', reply)}
                              style={{
                                padding: '8px 16px',
                                background: '#10b981',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <FaReply /> Reply Again
                            </button>
                          </div>

                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#059669' }}>
                              Reply by {reply.admin_name}:
                            </div>
                            <div style={{
                              background: '#f0fdf4',
                              padding: '12px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              color: '#166534',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {reply.admin_reply}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <div id="reply-form" style={{
              marginTop: '20px',
              padding: '24px',
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '16px' }}>
                Send {replyType === 'contact' ? 'Contact' : 'Application'} Reply
              </h3>

              <form onSubmit={handleSendReply}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                    Reply Message:
                  </label>
                  <textarea
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    placeholder="Type your reply message here..."
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false);
                      setAdminReply('');
                      setSelectedItem(null);
                      setReplyType('');
                    }}
                    style={{
                      padding: '10px 20px',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingReply || !adminReply.trim()}
                    style={{
                      padding: '10px 20px',
                      background: sendingReply || !adminReply.trim() ? '#d1d5db' : '#0b2f63',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: sendingReply || !adminReply.trim() ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaPaperPlane />
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
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