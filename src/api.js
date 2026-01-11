const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

const jsonHeaders = { 'Content-Type': 'application/json' };

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...jsonHeaders, ...(options.headers || {}) };

  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for CORS
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Handle 401 Unauthorized - clear auth state
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  signup: (payload) => apiFetch('/api/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiFetch('/api/login', { method: 'POST', body: JSON.stringify(payload) }),

  // Visa Applications
  submitVisaApplication: (payload) =>
    apiFetch('/api/visa-applications', { method: 'POST', body: JSON.stringify(payload) }),
  getUserApplications: (username) =>
    apiFetch(`/api/visa-applications/user/${encodeURIComponent(username)}`),
  getUserAllApplications: async (username) => {
    const encoded = encodeURIComponent(username);
    const results = await Promise.allSettled([
      apiFetch(`/api/visa-applications/user/${encoded}`),
      apiFetch(`/api/marriage-applications/user/${encoded}`),
      apiFetch(`/api/birth-certificate-applications/user/${encoded}`),
      apiFetch(`/api/travel-pass-applications/user/${encoded}`),
    ]);
    if (process.env.NODE_ENV !== 'production') {
      console.log('[getUserAllApplications] raw results', results);
    }

    const unwrap = (result) =>
      result.status === 'fulfilled' && Array.isArray(result.value) ? result.value : [];

    const visaApps = unwrap(results[0]).map((item) => ({
      id: item.id,
      type: 'Visa',
      subtype: item.visaType || item.visa_type || null,
      displayName: `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Visa Applicant',
      status: item.status,
      trackingNumber: item.tracking_number || item.trackingNumber || null,
      createdAt: item.createdAt || item.created_at || null,
      updatedAt: item.updatedAt || item.updated_at || null,
    }));

    const marriageApps = unwrap(results[1]).map((item) => ({
      id: item.id,
      type: 'Marriage',
      subtype: null,
      displayName: `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Marriage Applicant',
      status: item.status,
      trackingNumber: item.tracking_number || item.trackingNumber || null,
      createdAt: item.createdAt || item.created_at || null,
      updatedAt: item.updatedAt || item.updated_at || null,
    }));

    const birthApps = unwrap(results[2]).map((item) => ({
      id: item.id,
      type: 'Birth Certificate',
      subtype: null,
      displayName: `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Birth Applicant',
      status: item.status,
      trackingNumber: item.tracking_number || item.trackingNumber || null,
      createdAt: item.createdAt || item.created_at || null,
      updatedAt: item.updatedAt || item.updated_at || null,
    }));

    const travelApps = unwrap(results[3]).map((item) => ({
      id: item.id,
      type: 'Travel Pass',
      subtype: null,
      displayName: `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Travel Pass Applicant',
      status: item.status,
      trackingNumber: item.tracking_number || null,
      createdAt: item.created_at || null,
      updatedAt: item.updated_at || null,
    }));

    const allApps = [...visaApps, ...marriageApps, ...birthApps, ...travelApps];
    allApps.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (process.env.NODE_ENV !== 'production') {
      console.log('[getUserAllApplications] normalized', allApps);
    }
    return allApps;
  },
  getAllApplications: () => apiFetch('/api/visa-applications'),
  updateApplicationStatus: (id, status) =>
    apiFetch(`/api/visa-applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateApplicationTracking: (id, trackingNumber, carrier) =>
    apiFetch(`/api/visa-applications/${id}/tracking`, { method: 'PUT', body: JSON.stringify({ trackingNumber, carrier }) }),

  // Marriage Applications
  submitMarriageApplication: (payload) =>
    apiFetch('/api/marriage-applications', { method: 'POST', body: JSON.stringify(payload) }),
  getMarriageApplications: () => apiFetch('/api/marriage-applications'),
  getUserMarriageApplications: (username) =>
    apiFetch(`/api/marriage-applications/user/${encodeURIComponent(username)}`),
  updateMarriageStatus: (id, status) =>
    apiFetch(`/api/marriage-applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateMarriageTracking: (id, trackingNumber, carrier) =>
    apiFetch(`/api/marriage-applications/${id}/tracking`, { method: 'PUT', body: JSON.stringify({ trackingNumber, carrier }) }),

  // Birth Certificate Applications
  submitBirthCertificateApplication: (payload) =>
    apiFetch('/api/birth-certificate-applications', { method: 'POST', body: JSON.stringify(payload) }),
  getBirthCertificateApplications: () => apiFetch('/api/birth-certificate-applications'),
  getUserBirthCertificateApplications: (username) =>
    apiFetch(`/api/birth-certificate-applications/user/${encodeURIComponent(username)}`),
  updateBirthCertificateStatus: (id, status) =>
    apiFetch(`/api/birth-certificate-applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateBirthCertificateTracking: (id, trackingNumber, carrier) =>
    apiFetch(`/api/birth-certificate-applications/${id}/tracking`, { method: 'PUT', body: JSON.stringify({ trackingNumber, carrier }) }),

  // Travel Pass Applications
  submitTravelPassApplication: (payload) =>
    apiFetch('/api/travel-pass-applications', { method: 'POST', body: JSON.stringify(payload) }),
  getTravelPassApplications: () => apiFetch('/api/travel-pass-applications'),
  getUserTravelPassApplications: (username) =>
    apiFetch(`/api/travel-pass-applications/user/${encodeURIComponent(username)}`),
  updateTravelPassStatus: (id, status) =>
    apiFetch(`/api/travel-pass-applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateTravelPassTracking: (id, trackingNumber, carrier) =>
    apiFetch(`/api/travel-pass-applications/${id}/tracking`, { method: 'PUT', body: JSON.stringify({ trackingNumber, carrier }) }),

  sendContact: (payload) =>
    apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin Statistics
  getAdminStatistics: () => apiFetch('/api/admin/statistics'),

  // Admin Users
  getAdminUsers: () => apiFetch('/api/admin/users'),

  // Admin Analytics
  getAdminAnalytics: () => apiFetch('/api/admin/analytics'),

  // Chat endpoints
  createChatConversation: (sessionId, userName, userEmail) =>
    apiFetch('/api/chat/conversation', {
      method: 'POST',
      body: JSON.stringify({ sessionId, userName, userEmail }),
    }),
  saveChatMessage: (sessionId, senderType, senderName, message) =>
    apiFetch('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ sessionId, senderType, senderName, message }),
    }),
  getChatSession: (sessionId) => apiFetch(`/api/chat/session/${sessionId}`),

  // Admin chat endpoints
  getChatConversations: () => apiFetch('/api/chat/conversations'),
  getChatMessages: (conversationId) => apiFetch(`/api/chat/conversations/${conversationId}/messages`),
  sendAdminReply: (conversationId, message) =>
    apiFetch('/api/chat/admin-reply', {
      method: 'POST',
      body: JSON.stringify({ conversationId, message }),
    }),
  sendAdminChatReply: (conversationId, senderName, message) =>
    apiFetch('/api/chat/admin-reply', {
      method: 'POST',
      body: JSON.stringify({ conversationId, message }),
    }),
  closeChatConversation: (conversationId) =>
    apiFetch(`/api/chat/conversations/${conversationId}/close`, { method: 'PUT' }),

  // Application tracking
  trackApplication: (trackingNumber) =>
    apiFetch(`/api/track/${encodeURIComponent(trackingNumber)}`),

  // Password recovery
  requestPasswordReset: (email) =>
    apiFetch('/api/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token, newPassword) =>
    apiFetch('/api/password-reset/reset', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  // Visitor tracking
  trackVisitor: (data) =>
    apiFetch('/api/track-visitor', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendHeartbeat: (data) =>
    apiFetch('/api/visitor/heartbeat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getVisitorStats: () => apiFetch('/api/admin/visitors/stats'),
  getRecentVisitors: (limit = 50, offset = 0) =>
    apiFetch(`/api/admin/visitors/recent?limit=${limit}&offset=${offset}`),
  getOnlineVisitors: () => apiFetch('/api/admin/visitors/online'),

  // Contact replies
  sendContactReply: (payload) =>
    apiFetch('/api/contact-replies', { method: 'POST', body: JSON.stringify(payload) }),
  getContactReplies: () => apiFetch('/api/contact-replies'),

  // Application replies
  sendApplicationReply: (payload) =>
    apiFetch('/api/application-replies', { method: 'POST', body: JSON.stringify(payload) }),
  getApplicationReplies: () => apiFetch('/api/application-replies'),
};

export { API_BASE };