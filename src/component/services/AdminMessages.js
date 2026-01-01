import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaChartLine, FaUsers, FaCog, FaFileAlt, FaComments, FaSync, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './adminDashboard.css';

export default function AdminMessages() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const data = await api.getChatConversations();
      setConversations(data.conversations || []);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const data = await api.getChatMessages(conversationId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
      if (selectedConversation) {
        fetchMessages(selectedConversation.id);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedConversation]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConversation) return;

    setSendingReply(true);
    try {
      await api.sendAdminReply(selectedConversation.id, replyText);
      setReplyText('');
      // Refresh messages
      await fetchMessages(selectedConversation.id);
      // Refresh conversations to update last_message_at
      await fetchConversations();
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConversation) return;

    if (!window.confirm('Are you sure you want to close this conversation?')) {
      return;
    }

    try {
      await api.closeChatConversation(selectedConversation.id);
      setSelectedConversation(null);
      setMessages([]);
      await fetchConversations();
    } catch (err) {
      console.error('Failed to close conversation:', err);
      alert('Failed to close conversation. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchConversations();
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
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
          <button className="active" onClick={() => navigate('/admin/messages')}>
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
            <div>
              <h1>Message Center</h1>
              <p>Manage customer chat conversations</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                🔄 Auto-updates every 10 seconds • Last updated: {formatLastUpdate()}
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

          {loading && conversations.length === 0 ? (
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
              <p style={{ color: '#6b7280' }}>Loading conversations...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', height: '70vh' }}>
              {/* Conversations List */}
              <div style={{
                flex: '0 0 350px',
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid #e5e7eb',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}>
                  Conversations ({conversations.length})
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {conversations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                      No conversations yet
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        style={{
                          padding: '16px',
                          borderBottom: '1px solid #e5e7eb',
                          cursor: 'pointer',
                          background: selectedConversation?.id === conv.id ? '#f3f4f6' : '#fff',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedConversation?.id !== conv.id) {
                            e.currentTarget.style.background = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedConversation?.id !== conv.id) {
                            e.currentTarget.style.background = '#fff';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{conv.user_name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                              {conv.user_email}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                              {conv.message_count} message{conv.message_count !== 1 ? 's' : ''} • {formatTimestamp(conv.last_message_at)}
                            </div>
                          </div>
                          <div>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: conv.status === 'active' ? '#dcfce7' : '#f3f4f6',
                              color: conv.status === 'active' ? '#166534' : '#6b7280'
                            }}>
                              {conv.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Messages Panel */}
              <div style={{
                flex: 1,
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {selectedConversation ? (
                  <>
                    {/* Header */}
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedConversation.user_name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{selectedConversation.user_email}</div>
                      </div>
                      {selectedConversation.status === 'active' && (
                        <button
                          onClick={handleCloseConversation}
                          style={{
                            padding: '8px 16px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          Close Conversation
                        </button>
                      )}
                    </div>

                    {/* Messages */}
                    <div style={{
                      flex: 1,
                      overflowY: 'auto',
                      padding: '20px',
                      background: '#f9fafb'
                    }}>
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          style={{
                            marginBottom: '16px',
                            display: 'flex',
                            justifyContent: msg.sender_type === 'admin' ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div style={{
                            maxWidth: '70%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: msg.sender_type === 'admin' ? '#2563eb' : '#fff',
                            color: msg.sender_type === 'admin' ? '#fff' : '#000',
                            border: msg.sender_type === 'admin' ? 'none' : '1px solid #e5e7eb'
                          }}>
                            <div style={{
                              fontSize: '0.75rem',
                              marginBottom: '4px',
                              opacity: 0.8,
                              fontWeight: 600
                            }}>
                              {msg.sender_type === 'admin' ? `Admin: ${msg.sender_name}` :
                               msg.sender_type === 'bot' ? 'Bot' : msg.sender_name || 'User'}
                            </div>
                            <div style={{ whiteSpace: 'pre-line' }}>{msg.message}</div>
                            <div style={{
                              fontSize: '0.7rem',
                              marginTop: '6px',
                              opacity: 0.7
                            }}>
                              {formatTimestamp(msg.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Input */}
                    {selectedConversation.status === 'active' && (
                      <form onSubmit={handleSendReply} style={{
                        padding: '16px',
                        borderTop: '1px solid #e5e7eb',
                        display: 'flex',
                        gap: '12px'
                      }}>
                        <input
                          type="text"
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="submit"
                          disabled={sendingReply || !replyText.trim()}
                          style={{
                            padding: '12px 24px',
                            background: sendingReply || !replyText.trim() ? '#d1d5db' : 'var(--primary)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: sendingReply || !replyText.trim() ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <FaPaperPlane /> {sendingReply ? 'Sending...' : 'Send'}
                        </button>
                      </form>
                    )}
                  </>
                ) : (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '1.1rem'
                  }}>
                    Select a conversation to view messages
                  </div>
                )}
              </div>
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
