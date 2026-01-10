import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaChartLine, FaUsers, FaCog, FaFileAlt, FaComments, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import './adminDashboard.css';

export default function AdminChat() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const loadConversations = async () => {
    try {
      const data = await api.getChatConversations();
      const list = Array.isArray(data) ? data : data?.conversations;
      setConversations(Array.isArray(list) ? list : []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId, shouldScroll = true) => {
    try {
      const data = await api.getChatMessages(conversationId);
      const list = Array.isArray(data) ? data : data?.messages;
      setMessages(Array.isArray(list) ? list : []);
      if (shouldScroll) {
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    loadConversations();

    // Auto-refresh conversations every 5 seconds
    const interval = setInterval(() => {
      loadConversations();
      if (selectedConversation) {
        loadMessages(selectedConversation.id, false); // Don't auto-scroll on refresh
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
    // Focus input field after a short delay
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    setSending(true);
    try {
      await api.sendAdminChatReply(selectedConversation.id, user.fullName || 'Admin', messageInput);
      setMessageInput('');
      await loadMessages(selectedConversation.id);
      await loadConversations(); // Refresh to update last_message_at
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleCloseConversation = async (conversationId) => {
    try {
      await api.closeChatConversation(conversationId);
      await loadConversations();
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to close conversation:', err);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
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
            {conversations.filter(c => c.status === 'active').length > 0 && (
              <span className="nav-badge">{conversations.filter(c => c.status === 'active').length}</span>
            )}
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
        <div className="admin-section">
          <div className="analytics-header">
            <div>
              <div className="analytics-title-row">
                <h1 className="analytics-title">Chat Messages</h1>
                <span className="analytics-pill">Real-time</span>
              </div>
              <div className="analytics-sub">
                <span>Manage customer conversations and provide support</span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '350px 1fr',
            gap: '20px',
            height: 'calc(100vh - 200px)',
            marginTop: '20px'
          }}>
            {/* Conversations List */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}>
                Conversations ({conversations.length})
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    Loading conversations...
                  </div>
                ) : conversations.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f3f4f6',
                        cursor: 'pointer',
                        background: selectedConversation?.id === conv.id ? '#eff6ff' : '#ffffff',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedConversation?.id !== conv.id) {
                          e.currentTarget.style.background = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedConversation?.id !== conv.id) {
                          e.currentTarget.style.background = '#ffffff';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
                          {conv.user_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {formatDate(conv.last_message_at)}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
                        {conv.user_email}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: conv.status === 'active' ? '#dbeafe' : '#f3f4f6',
                          color: conv.status === 'active' ? '#1e40af' : '#6b7280',
                        }}>
                          {conv.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937' }}>
                        {selectedConversation.user_name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {selectedConversation.user_email}
                      </div>
                    </div>
                    {selectedConversation.status === 'active' && (
                      <button
                        onClick={() => handleCloseConversation(selectedConversation.id)}
                        style={{
                          padding: '8px 16px',
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <FaCheckCircle /> Mark as Resolved
                      </button>
                    )}
                  </div>

                  {/* Messages */}
                  <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    background: '#f9fafb',
                  }}>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          marginBottom: '16px',
                          display: 'flex',
                          justifyContent: msg.sender_type === 'user' ? 'flex-start' : 'flex-end',
                        }}
                      >
                        <div style={{
                          maxWidth: '70%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: msg.sender_type === 'user' ? '#ffffff' :
                                     msg.sender_type === 'admin' ? '#2563eb' : '#e5e7eb',
                          color: msg.sender_type === 'admin' ? '#ffffff' : '#1f2937',
                          border: msg.sender_type === 'user' ? '1px solid #e5e7eb' : 'none',
                        }}>
                          <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            marginBottom: '4px',
                            color: msg.sender_type === 'admin' ? '#bfdbfe' : '#6b7280',
                          }}>
                            {msg.sender_name}
                          </div>
                          <div style={{
                            fontSize: '0.9rem',
                            whiteSpace: 'pre-line',
                            lineHeight: '1.5',
                          }}>
                            {msg.message}
                          </div>
                          <div style={{
                            fontSize: '0.7rem',
                            marginTop: '6px',
                            color: msg.sender_type === 'admin' ? '#bfdbfe' : '#9ca3af',
                          }}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  {selectedConversation.status === 'active' && (
                    <form onSubmit={handleSendMessage} style={{
                      padding: '16px',
                      borderTop: '1px solid #e5e7eb',
                      background: '#ffffff',
                      display: 'flex',
                      gap: '12px',
                    }}>
                      <input
                        ref={inputRef}
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="submit"
                        disabled={sending || !messageInput.trim()}
                        style={{
                          padding: '12px 24px',
                          background: sending || !messageInput.trim() ? '#d1d5db' : '#2563eb',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: sending || !messageInput.trim() ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <FaPaperPlane /> {sending ? 'Sending...' : 'Send'}
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#9ca3af',
                  fontSize: '1rem',
                }}>
                  Select a conversation to view messages
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
