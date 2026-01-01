import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './serviceInfo.css';

export default function VisaInfo() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleApplyOnline = () => {
    if (isAuthenticated()) {
      navigate('/visaapplication');
    } else {
      navigate('/signin', { state: { from: '/visaapplication' } });
    }
  };

  return (
    <div className="service-info-container">
      <div className="service-info-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Visa Application</h1>
        <p>Choose how you would like to apply</p>
      </div>

      <div className="service-info-content">
        <div className="info-section">
          <h2>Visa Types Available</h2>
          <ul>
            <li><strong>Tourist Visa:</strong> For leisure travel and tourism purposes</li>
            <li><strong>Business Visa:</strong> For business meetings, conferences, and trade</li>
            <li><strong>Student Visa:</strong> For academic study and educational programs</li>
            <li><strong>Work Visa:</strong> For employment and professional work</li>
            <li><strong>Transit Visa:</strong> For passing through CAR to another destination</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Required Documents</h2>
          <ul>
            <li>Valid passport (must be valid for at least 6 months)</li>
            <li>Recent passport-size photograph (2x2 inches)</li>
            <li>Completed visa application form</li>
            <li>Proof of travel arrangements (flight tickets, itinerary)</li>
            <li>Proof of accommodation in CAR</li>
            <li>Proof of sufficient funds</li>
            <li>Additional documents based on visa type</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Processing Information</h2>
          <ul>
            <li>Standard processing time: 5-10 business days</li>
            <li>Application fee: Varies by visa type ($100-$250 USD)</li>
            <li>Express processing available for additional fee</li>
            <li>All fees are non-refundable</li>
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
                href="/forms/visa-application.pdf"
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
            <li>All information must be accurate and match your passport</li>
            <li>False information may result in visa denial and future ineligibility</li>
            <li>Interview may be required for certain visa types</li>
            <li>Additional documentation may be requested during processing</li>
            <li>Visa approval is not guaranteed</li>
            <li>Processing times may vary during peak seasons</li>
          </ul>
        </div>

        <div className="contact-section">
          <h2>Need Help?</h2>
          <p>If you have questions about the application process, please contact us:</p>
          <div className="contact-info">
            <p><strong>Email:</strong> visa@car-embassy.us</p>
            <p><strong>Phone:</strong> +1 (202) 483-7800</p>
            <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM EST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
