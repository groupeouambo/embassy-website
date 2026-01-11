// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './component/navbar/Navbar';
import Contact from './component/contact/Contact';
import Home from './component/home/Home';
import Footer from './component/footer/Footer';
import Ambassador from './component/ambassador/Ambassador';
import Registration from './component/services/Registration';
import Visa from './component/services/Visa';
import VisaApplication from './component/visaapplication/VisaApplication';
import VisaApplications from './component/visaapplication/VisaApplications';
import Signup from './component/services/Signup';
import Signin from './component/services/Signin';
import ForgotPassword from './component/services/ForgotPassword';
import ResetPassword from './component/services/ResetPassword';
import Dashboard from './component/services/Dashboard';
import AdminDashboard from './component/services/AdminDashboard';
import AdminApplications from './component/services/AdminApplications';
import AdminChat from './component/services/AdminChat';
import AdminUsers from './component/services/AdminUsers';
import AdminSettings from './component/services/AdminSettings';
import AdminSite from './component/services/AdminSite';
import UserApplications from './component/services/UserApplications';
import StarlinkAnnouncement from './component/pages/StarlinkAnnouncement';
import MarriageApplication from './component/services/MarriageApplication';
import BirthCertificateApplication from './component/services/BirthCertificateApplication';
import TravelPassApplication from './component/services/TravelPassApplication';
import VisaInfo from './component/services/VisaInfo';
import MarriageInfo from './component/services/MarriageInfo';
import BirthCertificateInfo from './component/services/BirthCertificateInfo';
import TravelPassInfo from './component/services/TravelPassInfo';
import ChatWidget from './component/chat/ChatWidget';
import { initialVisaFormData } from './component/visaapplication/visaFormState';
import { api } from './api';
import AdminVisitors from './component/services/AdminVisitors';

const infoPages = [
  { path: '/embassy/mission', title: 'Embassy Mission', description: 'Learn about the objectives and responsibilities of the Central African Republic Embassy.' },
  { path: '/embassy/staff', title: 'Embassy Staff', description: 'Meet the team serving at the embassy and their areas of responsibility.' },
  { path: '/embassy/events', title: 'Embassy Events', description: 'Upcoming and recent events organized by the embassy.' },
  { path: '/about/history', title: 'About C.A.R - History', description: 'A brief overview of the history of the Central African Republic.' },
  { path: '/about/geography', title: 'About C.A.R - Geography', description: 'Key facts about the geography of the Central African Republic.' },
  { path: '/about/culture', title: 'About C.A.R - Culture', description: 'Learn about the culture, traditions, and people of the Central African Republic.' },
  { path: '/consular/visa-information', title: 'Consular - Visa Information', description: 'Guidance on visa categories, requirements, and processing timelines.', redirectTo: '/visa' },
  { path: '/consular/passports', title: 'Consular - Passports', description: 'Passport services and renewal information.' },
  { path: '/consular/forms', title: 'Consular - Forms', description: 'Download and review consular forms and instructions.' },
  { path: '/tourism/attractions', title: 'Tourism - Attractions', description: 'Discover top destinations and attractions across the Central African Republic.' },
  { path: '/tourism/guidelines', title: 'Tourism - Guidelines', description: 'Travel guidance and best practices for visitors.' },
  { path: '/tourism/hotels', title: 'Tourism - Hotels', description: 'Suggested accommodations and partner hotels.' },
  { path: '/diaspora/programs', title: 'Diaspora - Programs', description: 'Programs and initiatives for the diaspora community.' },
  { path: '/diaspora/events', title: 'Diaspora - Events', description: 'Events and gatherings for Central Africans abroad.' },
  { path: '/diaspora/news', title: 'Diaspora - News', description: 'News and updates for the diaspora.' },
  { path: '/media/press-releases', title: 'Media - Press Releases', description: 'Official press releases from the embassy.' },
  { path: '/media/gallery', title: 'Media - Gallery', description: 'Photo and video highlights.' },
  { path: '/media/publications', title: 'Media - Publications', description: 'Reports, publications, and bulletins.' },
];

const servicePages = [
  { path: '/services/passport', title: 'Passport', description: 'Information and steps to apply for or renew a passport.' },
  { path: '/services/consular-id', title: 'Consular ID', description: 'Eligibility and application process for consular ID.' },
  { path: '/services/birth-certificate', title: 'Birth Certificate', description: 'How to request a birth certificate.' },
  { path: '/services/minor-birth-certificate', title: 'Minor Child Birth Certificate', description: 'Birth certificate requests for minors.' },
  { path: '/services/emergency-certificate', title: 'Emergency Certificate', description: 'Travel document guidance for emergencies.' },
  { path: '/services/marriage-certificate', title: 'Marriage Certificate', description: 'Requesting a marriage certificate.' },
  { path: '/services/document-authentication', title: 'Document Authentication', description: 'Authentication and legalization of documents.' },
  { path: '/services/transport-deceased', title: 'Transport of Deceased', description: 'Support and requirements for transporting a loved one.' },
  { path: '/services/passport-appointment', title: 'Passport Appointment', description: 'Schedule and prepare for a passport appointment.' },
  { path: '/services/diaspora-organization', title: 'Diaspora Organization', description: 'Resources for diaspora organization and participation.' },
];

// Visitor tracking component
function VisitorTracker() {
  const { user } = useAuth();

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Check if we've already tracked in the last 5 minutes
        const lastTracked = sessionStorage.getItem('visitor_last_tracked');
        const now = Date.now();

        if (lastTracked && (now - parseInt(lastTracked)) < 5 * 60 * 1000) {
          // Skip tracking if within 5 minutes
          return;
        }

        // Generate or retrieve session ID
        let sessionId = sessionStorage.getItem('visitor_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('visitor_session_id', sessionId);
        }

        await api.trackVisitor({
          page_url: window.location.href,
          referrer: document.referrer || 'Direct',
          session_id: sessionId,
          user_id: user?.id || null, // Include user ID if logged in
        });

        // Mark as tracked
        sessionStorage.setItem('visitor_last_tracked', now.toString());
      } catch (error) {
        // Silently fail - tracking is non-critical
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Visitor tracking skipped:', error.message);
        }
      }
    };

    trackVisitor();

    // Send heartbeat every 30 seconds to show user is still active
    const heartbeatInterval = setInterval(async () => {
      const sessionId = sessionStorage.getItem('visitor_session_id');
      if (sessionId) {
        try {
          await api.sendHeartbeat({
            session_id: sessionId,
            page_url: window.location.href,
            user_id: user?.id || null, // Include user ID if logged in
          });
        } catch (error) {
          // Silently fail
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Heartbeat failed:', error.message);
          }
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(heartbeatInterval);
  }, [user?.id]); // Re-run when user login state changes

  return null;
}

function App() {
  const [visaFormData, setVisaFormData] = useState(() => {
    const saved = sessionStorage.getItem('visaFormData');
    return saved ? JSON.parse(saved) : { ...initialVisaFormData };
  });

  useEffect(() => {
    sessionStorage.setItem('visaFormData', JSON.stringify(visaFormData));
  }, [visaFormData]);

  return (
    <AuthProvider>
      <I18nProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <VisitorTracker />
          <div className="App">
            <Navbar />
         
          <Routes>
            <Route path="/contact" element={<Contact />} />
            <Route path="/visaapplication" element={<VisaApplication formData={visaFormData} setFormData={setVisaFormData} />} />
            <Route path="/visaapplications" element={<VisaApplications formData={visaFormData} setFormData={setVisaFormData} />} />
            <Route path="/visa" element={<Visa />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/applications" element={<UserApplications />} />
            <Route path="/apply-info/visa" element={<VisaInfo />} />
            <Route path="/apply-info/marriage" element={<MarriageInfo />} />
            <Route path="/apply-info/birth-certificate" element={<BirthCertificateInfo />} />
            <Route path="/apply-info/travel-pass" element={<TravelPassInfo />} />
            <Route path="/apply/marriage" element={<MarriageApplication />} />
            <Route path="/apply/birth-certificate" element={<BirthCertificateApplication />} />
            <Route path="/apply/travel-pass" element={<TravelPassApplication />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <AdminRoute>
                  <AdminApplications />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <AdminRoute>
                  <AdminChat />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/site"
              element={
                <AdminRoute>
                  <AdminSite />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/visitors"
              element={
                <AdminRoute>
                  <AdminVisitors />
                </AdminRoute>
              }
            />
            <Route path="/registration" element={<Registration />} />
            <Route path="/services/registration" element={<Registration />} />
            <Route path="/download" element={<DownloadPage />} />
            {servicePages.map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={<InfoPage title={page.title} description={page.description} />}
              />
            ))}
            {infoPages.map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={
                  page.redirectTo ? (
                    <Navigate to={page.redirectTo} replace />
                  ) : (
                    <InfoPage title={page.title} description={page.description} />
                  )
                }
              />
            ))}
            <Route path="/highlights/:id" element={<HighlightPage />} />
            <Route path="/news/starlink-agreement" element={<StarlinkAnnouncement />} />
            <Route path="/ambassador" element={<Ambassador />} />
            <Route path="/" element={<Home/>} />
          </Routes>
          <Footer/>
          <ChatWidget />
        </div>
      </Router>
    </I18nProvider>
    </AuthProvider>
  );
}

export default App;

const InfoPage = ({ title, description }) => (
  <div className="page-shell">
    <h1>{title}</h1>
    {description && <p>{description}</p>}
  </div>
);

const DownloadPage = () => {
  const fileUrl = `${process.env.PUBLIC_URL}/Visa_Application_Form.pdf`;

  return (
    <div className="page-shell">
      <h1>Visa Application Form</h1>
      <p>Download the official visa application form below.</p>
      <a className="primary-link" href={fileUrl} download>
        Download PDF
      </a>
    </div>
  );
};

const HighlightPage = () => {
  const { id } = useParams();

  return (
    <div className="page-shell">
      <h1>Highlight {id}</h1>
      <p>Details for this highlight will be available soon.</p>
    </div>
  );
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="page-shell">Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};