import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './serviceInfo.css';

export default function MarriageInfo() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleApplyOnline = () => {
    if (isAuthenticated()) {
      navigate('/apply/marriage');
    } else {
      navigate('/signin', { state: { from: '/apply/marriage' } });
    }
  };

  return (
    <div className="service-info-container">
      <div className="service-info-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Marriage Certificate Application</h1>
        <p>Choose how you would like to apply</p>
      </div>

      <div className="service-info-content">
        <div className="info-section">
          <h2>Required Documents</h2>
          <ul>
            <li>Valid identification documents for both spouses</li>
            <li>Original marriage certificate or certified copy</li>
            <li>Birth certificates for both spouses</li>
            <li>Divorce decree or death certificate (if previously married)</li>
            <li>Proof of payment of applicable fees</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Processing Information</h2>
          <ul>
            <li>Standard processing time: 4-6 weeks</li>
            <li>Application fee: $75 USD</li>
            <li>Shipping fee: Additional $25 USD for international delivery</li>
            <li>All documents must be original or certified copies</li>
            <li>Documents in languages other than French or English must be translated</li>
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
                href="/forms/marriage-certificate-application.pdf"
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
            <li>All information must be accurate and match official documents</li>
            <li>False information may result in application rejection</li>
            <li>Both spouses must provide consent for the certificate issuance</li>
            <li>Marriages performed outside CAR must be legally recognized</li>
            <li>Additional documentation may be requested during processing</li>
            <li>Fees are non-refundable once processing begins</li>
          </ul>
        </div>

        <div className="contact-section">
          <h2>Need Help?</h2>
          <p>If you have questions about the application process, please contact us:</p>
          <div className="contact-info">
            <p><strong>Email:</strong> consular@car-embassy.us</p>
            <p><strong>Phone:</strong> +1 (202) 483-7800</p>
            <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM EST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
