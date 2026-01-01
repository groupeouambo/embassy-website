import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './serviceInfo.css';

export default function TravelPassInfo() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleApplyOnline = () => {
    if (isAuthenticated()) {
      navigate('/apply/travel-pass');
    } else {
      navigate('/signin', { state: { from: '/apply/travel-pass' } });
    }
  };

  return (
    <div className="service-info-container">
      <div className="service-info-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Travel Pass (Laissez-Passer) Application</h1>
        <p>Emergency travel document for urgent situations</p>
      </div>

      <div className="service-info-content">
        <div className="info-section">
          <h2>What is a Travel Pass (Laissez-Passer)?</h2>
          <p style={{ color: '#374151', lineHeight: '1.7', marginBottom: '16px' }}>
            A Travel Pass (Laissez-Passer) is an emergency travel document issued when a passport
            is lost, stolen, expired, or cannot be obtained in time for urgent travel. It is
            valid for a single journey to the destination country or back to the Central African Republic.
          </p>
        </div>

        <div className="info-section">
          <h2>When You Need a Travel Pass</h2>
          <ul>
            <li>Your passport has been lost or stolen</li>
            <li>Your passport has expired and you need to travel urgently</li>
            <li>You cannot obtain a regular passport in time for essential travel</li>
            <li>Emergency situations requiring immediate international travel</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Required Documents</h2>
          <ul>
            <li>Valid identification document (national ID card, driver's license)</li>
            <li>Police report (if passport was lost or stolen)</li>
            <li>Previous passport copy (if available)</li>
            <li>Proof of travel urgency (flight tickets, medical documents, etc.)</li>
            <li>Two recent passport-size photographs</li>
            <li>Proof of Central African nationality (birth certificate, etc.)</li>
            <li>Proof of payment of applicable fees</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Processing Information</h2>
          <ul>
            <li>Emergency processing: 24-48 hours (subject to approval)</li>
            <li>Standard processing: 3-5 business days</li>
            <li>Application fee: $75 USD</li>
            <li>Validity: Single journey, typically 30 days</li>
            <li>Not renewable - a new application is required for each journey</li>
          </ul>
        </div>

        <div className="application-options">
          <h2>How would you like to apply?</h2>

          <div className="options-grid">
            <div className="option-card">
              <div className="option-icon">📥</div>
              <h3>Download Form</h3>
              <p>Download the PDF form, fill it out manually, and submit by mail or in person at the embassy.</p>
              <a
                href="/forms/travel-pass-application.pdf"
                download
                className="option-button secondary"
              >
                Download PDF Form
              </a>
            </div>

            <div className="option-card featured">
              <div className="option-badge">Recommended</div>
              <div className="option-icon">💻</div>
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
          </div>
        </div>

        <div className="info-section important">
          <h2>Important Notes</h2>
          <ul>
            <li>Travel Pass is for emergency use only and not a replacement for a regular passport</li>
            <li>You must apply for a new passport as soon as possible</li>
            <li>Some countries may not accept Travel Pass - verify with destination country</li>
            <li>If passport was stolen, file a police report immediately</li>
            <li>Travel Pass is valid for single journey only</li>
            <li>Processing time may be longer during peak periods</li>
            <li>All information must be accurate and match official documents</li>
          </ul>
        </div>

        <div className="contact-section">
          <h2>Need Help?</h2>
          <p>For urgent travel pass inquiries or emergency assistance, please contact us:</p>
          <div className="contact-info">
            <p><strong>Email:</strong> emergency@car-embassy.us</p>
            <p><strong>Phone:</strong> +1 (202) 483-7800 (Emergency Hotline)</p>
            <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM EST</p>
            <p><strong>After Hours:</strong> Emergency hotline available 24/7 for urgent cases</p>
          </div>
        </div>
      </div>
    </div>
  );
}
