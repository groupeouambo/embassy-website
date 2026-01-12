import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './chatWidget.css';

export default function ChatWidget() {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Don't show chat widget for admins
  if (isAdmin()) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          className="chat-widget-button"
          onClick={toggleChat}
          aria-label="Chat with us"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Chat Window with iframe */}
      {isOpen && (
        <div className="chat-widget-window">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="chat-widget-header-content">
              <h3>ConnectNow Chat</h3>
              <p>We're here to help</p>
            </div>
            <button onClick={toggleChat} className="chat-widget-close" aria-label="Close chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* iframe content */}
          <div className="chat-iframe-container">
            <iframe
              src="https://6000-firebase-studio-1768047378237.cluster-vaxpk4ituncuosfn5e3k7xrloi.cloudworkstations.dev/embed"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '0 0 12px 12px'
              }}
              title="ConnectNow Chat"
            />
          </div>
        </div>
      )}
    </>
  );
}