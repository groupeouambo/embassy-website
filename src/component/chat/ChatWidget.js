import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../../api';
import './chatWidget.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: 'Hello! Welcome to the Central African Republic Embassy. To better assist you, may I have your name?',
      sender_type: 'bot',
      sender_name: 'Embassy Bot',
      created_at: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [step, setStep] = useState('name'); // name, email, chat
  const [sessionId, setSessionId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  // Generate or retrieve session ID
  useEffect(() => {
    let storedSessionId = localStorage.getItem('chatSessionId');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatSessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const loadConversationHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const data = await api.getChatSession(sessionId);

      if (data.conversation && data.messages.length > 0) {
        // Conversation exists, load history
        setConversationId(data.conversation.id);
        setUserName(data.conversation.user_name);
        setUserEmail(data.conversation.user_email);
        setMessages(data.messages);
        setStep('chat');
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [sessionId]);

  // Load conversation history when opening chat
  useEffect(() => {
    if (isOpen && sessionId && !isLoadingHistory) {
      loadConversationHistory();
    }
  }, [isOpen, sessionId, isLoadingHistory, loadConversationHistory]);

  // Poll for new messages when in chat mode
  useEffect(() => {
    if (isOpen && conversationId && step === 'chat') {
      const interval = setInterval(async () => {
        try {
          const data = await api.getChatSession(sessionId);
          if (data.messages && data.messages.length > messages.length) {
            setMessages(data.messages);
          }
        } catch (err) {
          console.error('Failed to poll messages:', err);
        }
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isOpen, conversationId, step, sessionId, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessage = async (senderType, senderName, messageText) => {
    try {
      await api.saveChatMessage(sessionId, senderType, senderName, messageText);
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  };

  const createConversation = async (name, email) => {
    try {
      const data = await api.createChatConversation(sessionId, name, email);
      setConversationId(data.conversation.id);
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const getIntelligentResponse = (userText) => {
    const lowerText = userText.toLowerCase();

    // Visa-related queries
    if (lowerText.includes('visa') || (lowerText.includes('apply') && lowerText.includes('visa'))) {
      return {
        text: 'To apply for a visa, please visit our Visa Application page. You can find it in the Services menu at the top of the page. You\'ll need a valid passport, completed application form, passport photos, and supporting documents. Our team will reach out to you soon with more details!',
        link: '/visa',
        linkText: 'Go to Visa Application'
      };
    }

    // Visa requirements
    if (lowerText.includes('requirement') || lowerText.includes('document') || lowerText.includes('need')) {
      return {
        text: 'General visa requirements include:\n• Valid passport (at least 6 months validity)\n• Completed visa application form\n• 2 passport-size photos\n• Proof of travel purpose\n• Proof of accommodation\n• Financial statements\n\nWe will contact you shortly to assist further!',
        link: '/visa',
        linkText: 'View Visa Application'
      };
    }

    // Birth certificate
    if (lowerText.includes('birth') && (lowerText.includes('certificate') || lowerText.includes('cert'))) {
      return {
        text: 'For birth certificate applications, you can download the form and submit your application online. We will reach out to you as soon as possible to guide you through the process!',
        link: '/apply/birth-certificate',
        linkText: 'Go to Birth Certificate Application'
      };
    }

    // Marriage certificate
    if (lowerText.includes('marriage') && (lowerText.includes('certificate') || lowerText.includes('cert'))) {
      return {
        text: 'For marriage certificate applications, you can download the form and submit your application online. Our team will contact you shortly with further assistance!',
        link: '/apply/marriage',
        linkText: 'Go to Marriage Certificate Application'
      };
    }

    // Travel pass
    if (lowerText.includes('travel') && (lowerText.includes('pass') || lowerText.includes('passport') || lowerText.includes('emergency'))) {
      return {
        text: 'For emergency travel documents (Laissez-Passer), this is for situations where your passport is lost, stolen, or expired. We will reach out to you soon to help with your application!',
        link: '/apply/travel-pass',
        linkText: 'Go to Travel Pass Application'
      };
    }

    // Contact information
    if (lowerText.includes('contact') || lowerText.includes('phone') || lowerText.includes('email') || lowerText.includes('address')) {
      return {
        text: 'You can reach us at:\n📞 Phone: +1 (202) 483-7800\n📧 Email: info@rcaembassy.org\n📍 Address: 2704 Ontario Rd NW, Washington, DC 20009\n\nOur team will also reach out to you at the email you provided!'
      };
    }

    // Hours
    if (lowerText.includes('hour') || lowerText.includes('open') || lowerText.includes('time')) {
      return {
        text: 'Our embassy hours are Monday-Friday, 9:00 AM - 5:00 PM EST. We will contact you during business hours to assist you further!'
      };
    }

    // Appointment
    if (lowerText.includes('appointment') || lowerText.includes('schedule') || lowerText.includes('meeting')) {
      return {
        text: 'To schedule an appointment, please call us at +1 (202) 483-7800 or email info@rcaembassy.org. Our team will reach out to you shortly to help schedule a convenient time!'
      };
    }

    // Default response
    return {
      text: `Thank you for your message, ${userName}! Our team will review your inquiry and reach out to you at ${userEmail} as soon as possible. For immediate assistance, please call us at +1 (202) 483-7800.`
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentInput = inputValue;

    // Create user message with new format
    const userMessage = {
      id: Date.now(),
      message: currentInput,
      sender_type: 'user',
      sender_name: userName || 'Guest',
      created_at: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Handle different steps
    setTimeout(async () => {
      let botReplyText;
      let botLink = null;
      let botLinkText = null;

      if (step === 'name') {
        setUserName(currentInput);
        botReplyText = `Nice to meet you, ${currentInput}! Could you please provide your email address so we can reach out to you?`;
        setStep('email');
      } else if (step === 'email') {
        setUserEmail(currentInput);
        botReplyText = `Thank you, ${userName}! How can I assist you today? I can help you with:\n• Visa applications and requirements\n• Birth/Marriage certificates\n• Travel pass (emergency travel documents)\n• Contact information and hours\n• General inquiries`;
        setStep('chat');

        // Create conversation in database
        await createConversation(userName, currentInput);
      } else {
        // Regular chat with intelligent responses
        const response = getIntelligentResponse(currentInput);
        botReplyText = response.text;
        botLink = response.link;
        botLinkText = response.linkText;
      }

      const botReply = {
        id: Date.now() + 1,
        message: botReplyText,
        sender_type: 'bot',
        sender_name: 'Embassy Bot',
        created_at: new Date(),
        link: botLink,
        linkText: botLinkText,
      };

      setMessages((prev) => [...prev, botReply]);

      // Save messages to database if conversation exists
      if (conversationId || step === 'chat') {
        await saveMessage('user', userName || 'Guest', currentInput);
        await saveMessage('bot', 'Embassy Bot', botReplyText);
      }
    }, 800);
  };

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

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget-window">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="chat-widget-header-content">
              <h3>Embassy Chat</h3>
              <p>We're here to help</p>
            </div>
            <button onClick={toggleChat} className="chat-widget-close" aria-label="Close chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender_type === 'user' ? 'chat-message-user' : 'chat-message-bot'}`}
              >
                <div className="chat-message-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{message.message}</p>
                  {message.link && (
                    <a
                      href={message.link}
                      className="chat-message-link"
                      onClick={() => {
                        window.location.href = message.link;
                      }}
                    >
                      {message.linkText}
                    </a>
                  )}
                  <span className="chat-message-time">
                    {new Date(message.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-widget-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="chat-input-field"
            />
            <button type="submit" className="chat-send-button" aria-label="Send message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="22" y1="2" x2="11" y2="13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22l-4-9-9-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
