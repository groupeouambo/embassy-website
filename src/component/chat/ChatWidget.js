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

      {/* Chat Window with iframe - full iframe without custom header */}
      {isOpen && (
        <div className="chat-widget-window-iframe">
          <iframe
            src="https://studio--studio-7902627835-94ba6.us-central1.hosted.app/embed"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '16px'
            }}
            title="ConnectNow Chat"
          />
        </div>
      )}
    </>
  );
}