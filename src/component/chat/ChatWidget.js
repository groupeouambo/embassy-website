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
  const [language, setLanguage] = useState(''); // en or fr
  const [step, setStep] = useState('language'); // language, name, email, chat
  const [sessionId, setSessionId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');
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
        // Assume language was selected if conversation exists
        const savedLang = localStorage.getItem('chatLanguage') || 'en';
        setLanguage(savedLang);
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

  const t = (key) => {
    const translations = {
      en: {
        welcome: 'Hello! Welcome to the Central African Republic Embassy.',
        selectLanguage: 'Please select your preferred language:',
        askName: 'To better assist you, may I have your name?',
        askEmail: 'Could you please provide your email address so we can reach out to you?',
        thanksWelcome: 'Thank you! How can I assist you today? I can help you with:',
        visaHelp: '• Visa applications and requirements',
        birthHelp: '• Birth/Marriage certificates',
        travelHelp: '• Travel pass (emergency travel documents)',
        contactHelp: '• Contact information and hours',
        trackingHelp: '• Track your application',
        generalHelp: '• General inquiries',
        trackApplication: 'Track Application',
        enterTracking: 'Enter your tracking number:',
        trackingNotFound: 'Application not found. Please check your tracking number and try again.',
        trackingFound: 'Application found!',
        visaResponse: 'To apply for a visa, please visit our Visa Application page. You can find it in the Services menu at the top of the page. You\'ll need a valid passport, completed application form, passport photos, and supporting documents. Our team will reach out to you soon with more details!',
        requirementResponse: 'General visa requirements include:\n• Valid passport (at least 6 months validity)\n• Completed visa application form\n• 2 passport-size photos\n• Proof of travel purpose\n• Proof of accommodation\n• Financial statements\n\nWe will contact you shortly to assist further!',
        birthResponse: 'For birth certificate applications, you can download the form and submit your application online. We will reach out to you as soon as possible to guide you through the process!',
        marriageResponse: 'For marriage certificate applications, you can download the form and submit your application online. Our team will contact you shortly with further assistance!',
        travelResponse: 'For emergency travel documents (Laissez-Passer), this is for situations where your passport is lost, stolen, or expired. We will reach out to you soon to help with your application!',
        contactResponse: 'You can reach us at:\n📞 Phone: +1 (202) 483-7800\n📧 Email: info@rcaembassy.org\n📍 Address: 2704 Ontario Rd NW, Washington, DC 20009\n\nOur team will also reach out to you at the email you provided!',
        hoursResponse: 'Our embassy hours are Monday-Friday, 9:00 AM - 5:00 PM EST. We will contact you during business hours to assist you further!',
        appointmentResponse: 'To schedule an appointment, please call us at +1 (202) 483-7800 or email info@rcaembassy.org. Our team will reach out to you shortly to help schedule a convenient time!',
      },
      fr: {
        welcome: 'Bonjour! Bienvenue à l\'Ambassade de la République Centrafricaine.',
        selectLanguage: 'Veuillez sélectionner votre langue préférée:',
        askName: 'Pour mieux vous aider, puis-je avoir votre nom?',
        askEmail: 'Pourriez-vous s\'il vous plaît fournir votre adresse e-mail afin que nous puissions vous contacter?',
        thanksWelcome: 'Merci! Comment puis-je vous aider aujourd\'hui? Je peux vous aider avec:',
        visaHelp: '• Demandes de visa et exigences',
        birthHelp: '• Actes de naissance/mariage',
        travelHelp: '• Laissez-passer (documents de voyage d\'urgence)',
        contactHelp: '• Informations de contact et horaires',
        trackingHelp: '• Suivre votre demande',
        generalHelp: '• Demandes générales',
        trackApplication: 'Suivre la demande',
        enterTracking: 'Entrez votre numéro de suivi:',
        trackingNotFound: 'Demande non trouvée. Veuillez vérifier votre numéro de suivi et réessayer.',
        trackingFound: 'Demande trouvée!',
        visaResponse: 'Pour demander un visa, veuillez visiter notre page de demande de visa. Vous la trouverez dans le menu Services en haut de la page. Vous aurez besoin d\'un passeport valide, d\'un formulaire de demande rempli, de photos d\'identité et de documents justificatifs. Notre équipe vous contactera bientôt avec plus de détails!',
        requirementResponse: 'Les exigences générales pour le visa incluent:\n• Passeport valide (au moins 6 mois de validité)\n• Formulaire de demande de visa rempli\n• 2 photos d\'identité\n• Preuve de motif de voyage\n• Preuve d\'hébergement\n• Relevés financiers\n\nNous vous contacterons sous peu pour vous aider davantage!',
        birthResponse: 'Pour les demandes d\'acte de naissance, vous pouvez télécharger le formulaire et soumettre votre demande en ligne. Nous vous contacterons dès que possible pour vous guider dans le processus!',
        marriageResponse: 'Pour les demandes d\'acte de mariage, vous pouvez télécharger le formulaire et soumettre votre demande en ligne. Notre équipe vous contactera sous peu pour vous aider!',
        travelResponse: 'Pour les documents de voyage d\'urgence (Laissez-Passer), c\'est pour les situations où votre passeport est perdu, volé ou expiré. Nous vous contacterons bientôt pour vous aider avec votre demande!',
        contactResponse: 'Vous pouvez nous joindre à:\n📞 Téléphone: +1 (202) 483-7800\n📧 Email: info@rcaembassy.org\n📍 Adresse: 2704 Ontario Rd NW, Washington, DC 20009\n\nNotre équipe vous contactera également à l\'e-mail que vous avez fourni!',
        hoursResponse: 'Les heures d\'ouverture de notre ambassade sont du lundi au vendredi, de 9h00 à 17h00 EST. Nous vous contacterons pendant les heures ouvrables pour vous aider davantage!',
        appointmentResponse: 'Pour planifier un rendez-vous, veuillez nous appeler au +1 (202) 483-7800 ou envoyer un e-mail à info@rcaembassy.org. Notre équipe vous contactera sous peu pour planifier un moment convenable!',
      },
    };
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    localStorage.setItem('chatLanguage', lang);

    const welcomeMsg = {
      id: Date.now(),
      message: t('askName'),
      sender_type: 'bot',
      sender_name: 'Embassy Bot',
      created_at: new Date(),
    };
    setMessages([...messages, welcomeMsg]);
    setStep('name');
  };

  const handleTrackApplication = async () => {
    if (!trackingCode.trim()) {
      setTrackingError(t('enterTracking'));
      return;
    }

    setTrackingError('');
    try {
      const result = await api.trackApplication(trackingCode.trim());
      setTrackingResult(result);
    } catch (err) {
      setTrackingError(t('trackingNotFound'));
      setTrackingResult(null);
    }
  };

  const getIntelligentResponse = (userText) => {
    const lowerText = userText.toLowerCase();

    // Check for tracking request
    if (lowerText.includes('track') || lowerText.includes('suivi')) {
      setShowTrackingModal(true);
      return {
        text: t('trackingHelp'),
        action: 'tracking'
      };
    }

    // Visa-related queries
    if (lowerText.includes('visa') || (lowerText.includes('apply') && lowerText.includes('visa')) || lowerText.includes('demande')) {
      return {
        text: t('visaResponse'),
        link: '/visa',
        linkText: 'Go to Visa Application'
      };
    }

    // Visa requirements
    if (lowerText.includes('requirement') || lowerText.includes('document') || lowerText.includes('need') || lowerText.includes('exigence')) {
      return {
        text: t('requirementResponse'),
        link: '/visa',
        linkText: 'View Visa Application'
      };
    }

    // Birth certificate
    if ((lowerText.includes('birth') || lowerText.includes('naissance')) && (lowerText.includes('certificate') || lowerText.includes('cert') || lowerText.includes('acte'))) {
      return {
        text: t('birthResponse'),
        link: '/apply/birth-certificate',
        linkText: 'Go to Birth Certificate Application'
      };
    }

    // Marriage certificate
    if ((lowerText.includes('marriage') || lowerText.includes('mariage')) && (lowerText.includes('certificate') || lowerText.includes('cert') || lowerText.includes('acte'))) {
      return {
        text: t('marriageResponse'),
        link: '/apply/marriage',
        linkText: 'Go to Marriage Certificate Application'
      };
    }

    // Travel pass
    if ((lowerText.includes('travel') || lowerText.includes('laissez')) && (lowerText.includes('pass') || lowerText.includes('passport') || lowerText.includes('emergency') || lowerText.includes('passer'))) {
      return {
        text: t('travelResponse'),
        link: '/apply/travel-pass',
        linkText: 'Go to Travel Pass Application'
      };
    }

    // Contact information
    if (lowerText.includes('contact') || lowerText.includes('phone') || lowerText.includes('email') || lowerText.includes('address') || lowerText.includes('téléphone') || lowerText.includes('adresse')) {
      return {
        text: t('contactResponse')
      };
    }

    // Hours
    if (lowerText.includes('hour') || lowerText.includes('open') || lowerText.includes('time') || lowerText.includes('heure') || lowerText.includes('ouvert')) {
      return {
        text: t('hoursResponse')
      };
    }

    // Appointment
    if (lowerText.includes('appointment') || lowerText.includes('schedule') || lowerText.includes('meeting') || lowerText.includes('rendez-vous')) {
      return {
        text: t('appointmentResponse')
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
        botReplyText = t('askEmail');
        setStep('email');
      } else if (step === 'email') {
        setUserEmail(currentInput);
        botReplyText = `${t('thanksWelcome')}\n${t('visaHelp')}\n${t('birthHelp')}\n${t('travelHelp')}\n${t('contactHelp')}\n${t('trackingHelp')}\n${t('generalHelp')}`;
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
            {step === 'language' ? (
              <div className="chat-language-selection">
                <p style={{ marginBottom: '16px', fontSize: '14px' }}>
                  Please select your preferred language / Veuillez sélectionner votre langue préférée:
                </p>
                <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                  <button
                    onClick={() => handleLanguageSelect('en')}
                    className="language-button"
                    style={{
                      padding: '12px 20px',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('fr')}
                    className="language-button"
                    style={{
                      padding: '12px 20px',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    🇫🇷 Français
                  </button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Input */}
          {step !== 'language' && (
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
          )}
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="tracking-modal-overlay" onClick={() => setShowTrackingModal(false)}>
          <div className="tracking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tracking-modal-header">
              <h3>{t('trackApplication')}</h3>
              <button onClick={() => setShowTrackingModal(false)} className="tracking-modal-close">×</button>
            </div>
            <div className="tracking-modal-body">
              <p style={{ marginBottom: '12px', fontSize: '14px' }}>{t('enterTracking')}</p>
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="TRACK-XXXXX-XXXXX"
                className="tracking-input"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              {trackingError && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{trackingError}</p>
              )}
              {trackingResult && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '6px',
                }}>
                  <p style={{ fontWeight: 600, color: '#166534', marginBottom: '8px' }}>{t('trackingFound')}</p>
                  <p style={{ fontSize: '13px' }}>Status: {trackingResult.status}</p>
                  <p style={{ fontSize: '13px' }}>Type: {trackingResult.type}</p>
                </div>
              )}
            </div>
            <div className="tracking-modal-footer" style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTrackingModal(false)}
                style={{
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                onClick={handleTrackApplication}
                style={{
                  padding: '8px 16px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Track
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
