import React, { useEffect, useRef, useState } from 'react';
import './chatWidget.css';

const quickActions = [
  { label: 'Visa info', prompt: 'I need visa information.' },
  { label: 'Passport services', prompt: 'Tell me about passport services.' },
  { label: 'Appointments', prompt: 'How do I book an appointment?' },
  { label: 'Contact hours', prompt: 'How can I contact the embassy?' },
];

const cannedReplies = [
  {
    match: /visa|travel|tourist|entry/i,
    text: 'Visa guidance is available on our visa page, including requirements and processing steps.',
    link: { label: 'Visa information', href: '/visa' },
  },
  {
    match: /passport|consular id|identity/i,
    text: 'Passport and consular ID services are listed on the services page with the required documents.',
    link: { label: 'Passport services', href: '/services/passport' },
  },
  {
    match: /appointment|schedule|booking|book/i,
    text: 'Appointments can be requested after registration. If you already have an account, check your dashboard.',
    link: { label: 'Registration', href: '/registration' },
  },
  {
    match: /application|status|track|tracking/i,
    text: 'You can review application status and updates from your user dashboard.',
    link: { label: 'User dashboard', href: '/dashboard' },
  },
  {
    match: /contact|phone|email|hours|office/i,
    text: 'Our contact page lists office hours, phone numbers, and email addresses.',
    link: { label: 'Contact page', href: '/contact' },
  },
];

const initialMessages = [
  {
    id: 'welcome',
    sender: 'bot',
    text: 'Hello! I am the embassy assistant. This chat is offline and does not send messages. Ask about visas, passports, appointments, or contact details.',
    time: new Date(),
  },
];

const formatTime = (date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const createMessage = (sender, text, link) => ({
  id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  sender,
  text,
  link,
  time: new Date(),
});

const getBotReply = (message) => {
  const match = cannedReplies.find((reply) => reply.match.test(message));
  if (match) {
    return match;
  }

  return {
    text: 'Thanks for reaching out. I can help with visa info, passport services, appointments, and contact details.',
  };
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const submitUserMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, createMessage('user', trimmed)]);

    setTimeout(() => {
      const reply = getBotReply(trimmed.toLowerCase());
      setMessages((prev) => [...prev, createMessage('bot', reply.text, reply.link)]);
    }, 500);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    submitUserMessage(input);
    setInput('');
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chat-widget-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 5.75C4 4.78 4.78 4 5.75 4h12.5C19.22 4 20 4.78 20 5.75v8.5c0 .97-.78 1.75-1.75 1.75H9.4L5.6 19.8a.75.75 0 0 1-1.29-.53v-3.27H5.75C4.78 16 4 15.22 4 14.25v-8.5z"
            />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="chat-widget-window" role="dialog" aria-label="Chat assistant">
          <div className="chat-widget-header">
            <div className="chat-widget-header-content">
              <h3>Embassy Chat</h3>
              <p>Offline assistant</p>
            </div>
            <div className="chat-widget-header-actions">
              <span className="chat-widget-status">Local only</span>
              <button
                className="chat-widget-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M6.22 6.22a.75.75 0 0 1 1.06 0L12 10.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L13.06 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L12 13.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L10.94 12 6.22 7.28a.75.75 0 0 1 0-1.06z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="chat-widget-quick-actions">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className="chat-widget-quick-button"
                onClick={() => submitUserMessage(action.prompt)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="chat-widget-messages" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message chat-message-${message.sender}`}
              >
                <div className="chat-message-content">
                  <p>{message.text}</p>
                  {message.link && (
                    <a
                      className="chat-message-link"
                      href={message.link.href}
                    >
                      {message.link.label}
                    </a>
                  )}
                  <span className="chat-message-time">
                    {formatTime(message.time)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-widget-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="chat-input-field"
              placeholder="Type a message..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              autoComplete="off"
            />
            <button
              className="chat-send-button"
              type="submit"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4.01 10.5l15.2-6.08c.6-.24 1.24.3 1 .9l-6.08 15.2c-.25.63-1.2.62-1.44-.01l-1.9-4.84-4.84-1.9c-.63-.25-.65-1.2-.01-1.44z"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
