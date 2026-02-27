import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getServiceData } from './servicePageData';
import './serviceInfo.css';

export default function ServiceInfoPage({ serviceId }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const data = getServiceData(serviceId);

  if (!data) {
    return (
      <div className="page-shell">
        <h1>Service Not Found</h1>
        <p>The requested service page could not be found.</p>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  const handleApplyOnline = () => {
    if (!data.applicationOptions || !data.applicationOptions.onlineRoute) return;
    if (isAuthenticated()) {
      navigate(data.applicationOptions.onlineRoute);
    } else {
      navigate('/signin', { state: { from: data.applicationOptions.onlineRoute } });
    }
  };

  return (
    <div className="service-info-container">
      <div className="service-info-header">
        <Link to="/" className="back-link">&larr; Back to Home</Link>
        <h1>{data.title}</h1>
        <p>{data.subtitle}</p>
      </div>

      <div className="service-info-content">
        {data.overview && (
          <div className="info-section">
            <h2>{data.overview.heading}</h2>
            <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '0.95rem' }}>
              {data.overview.text}
            </p>
          </div>
        )}

        {data.eligibility && (
          <div className="info-section">
            <h2>{data.eligibility.heading}</h2>
            <ul>
              {data.eligibility.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.requiredDocuments && (
          <div className="info-section">
            <h2>{data.requiredDocuments.heading}</h2>
            <ul>
              {data.requiredDocuments.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.processSteps && (
          <div className="info-section">
            <h2>{data.processSteps.heading}</h2>
            <ul>
              {data.processSteps.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.processingInfo && (
          <div className="info-section">
            <h2>{data.processingInfo.heading}</h2>
            <ul>
              {data.processingInfo.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.applicationOptions && (
          <div className="application-options">
            <h2>How would you like to proceed?</h2>
            <div className="options-grid">
              {data.applicationOptions.pdfDownloadPath && (
                <div className="option-card">
                  <div className="option-icon">&#128229;</div>
                  <h3>Download Form</h3>
                  <p>Download the PDF form, fill it out manually, and submit by mail or in person at the embassy.</p>
                  <a
                    href={data.applicationOptions.pdfDownloadPath}
                    download
                    className="option-button secondary"
                  >
                    Download PDF Form
                  </a>
                </div>
              )}

              {data.applicationOptions.hasOnlineApplication && (
                <div className="option-card featured">
                  <div className="option-badge">Recommended</div>
                  <div className="option-icon">&#128187;</div>
                  <h3>Apply Online</h3>
                  <p>Fill out the application online for faster processing and real-time status tracking.</p>
                  <button
                    onClick={handleApplyOnline}
                    className="option-button primary"
                  >
                    {isAuthenticated() ? 'Start Application' : 'Sign In to Apply'}
                  </button>
                  {!isAuthenticated() && (
                    <p className="option-note">
                      Don't have an account? <Link to="/signup">Create one here</Link>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {data.importantNotes && (
          <div className="info-section important">
            <h2>{data.importantNotes.heading}</h2>
            <ul>
              {data.importantNotes.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {data.contact && (
          <div className="contact-section">
            <h2>{data.contact.heading}</h2>
            <p>{data.contact.description}</p>
            <div className="contact-info">
              {data.contact.facebook && (
                <p>
                  <a
                    href={data.contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1877f2', fontWeight: '600', textDecoration: 'none', fontSize: '1rem' }}
                  >
                    <FaFacebook size={24} />
                    {data.contact.facebookLabel || 'Facebook'}
                  </a>
                </p>
              )}
              {data.contact.email && <p><strong>Email:</strong> {data.contact.email}</p>}
              {data.contact.phone && <p><strong>Phone:</strong> {data.contact.phone}</p>}
              {data.contact.hours && <p><strong>Hours:</strong> {data.contact.hours}</p>}
              {data.contact.afterHours && (
                <p><strong>After Hours:</strong> {data.contact.afterHours}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
