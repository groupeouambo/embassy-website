import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { generateTrackingNumber } from '../../utils/BarcodeGenerator';
import ApplicationSuccess from './ApplicationSuccess';
import './applicationForms.css';

export default function MarriageApplication() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [applicationId, setApplicationId] = useState(null);

  const [formData, setFormData] = useState({
    // Spouse 1
    spouse1_first_name: '',
    spouse1_last_name: '',
    spouse1_birth_date: '',
    spouse1_birth_place: '',
    spouse1_nationality: '',
    spouse1_passport_number: '',
    spouse1_address: '',
    spouse1_phone: '',
    spouse1_email: '',
    spouse1_occupation: '',
    spouse1_father_name: '',
    spouse1_mother_name: '',

    // Spouse 2
    spouse2_first_name: '',
    spouse2_last_name: '',
    spouse2_birth_date: '',
    spouse2_birth_place: '',
    spouse2_nationality: '',
    spouse2_passport_number: '',
    spouse2_address: '',
    spouse2_phone: '',
    spouse2_email: '',
    spouse2_occupation: '',
    spouse2_father_name: '',
    spouse2_mother_name: '',

    // Marriage Details
    marriage_date: '',
    marriage_place: '',
    marriage_country: '',
    marriage_type: 'civil',
    certificate_purpose: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tracking = generateTrackingNumber('marriage');
      const resp = await api.submitMarriageApplication({ ...formData, tracking_number: tracking });
      setTrackingNumber(tracking);
      setApplicationId(resp.id);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit application');
      setLoading(false);
    }
  };

  if (success && trackingNumber) {
    return (
      <ApplicationSuccess
        trackingNumber={trackingNumber}
        applicationType="marriage"
        applicationId={applicationId}
        onClose={() => navigate('/dashboard/applications')}
      />
    );
  }

  return (
    <div className="application-container">
      <div className="application-header">
        <h1>Marriage Certificate Application</h1>
        <p>Please fill out all required information for both spouses</p>
        <a
          href="/marriage-certificate-form.pdf"
          download="marriage-certificate-form.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '12px',
            padding: '10px 20px',
            background: 'var(--primary)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.95rem'
          }}
        >
          📄 Download PDF Form
        </a>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="application-form">
        {/* Spouse 1 Section */}
        <section className="form-section">
          <h2>Spouse 1 Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="spouse1_first_name"
                value={formData.spouse1_first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="spouse1_last_name"
                value={formData.spouse1_last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="spouse1_birth_date"
                value={formData.spouse1_birth_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Place of Birth *</label>
              <input
                type="text"
                name="spouse1_birth_place"
                value={formData.spouse1_birth_place}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Nationality *</label>
              <input
                type="text"
                name="spouse1_nationality"
                value={formData.spouse1_nationality}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Passport Number</label>
              <input
                type="text"
                name="spouse1_passport_number"
                value={formData.spouse1_passport_number}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Address *</label>
              <textarea
                name="spouse1_address"
                value={formData.spouse1_address}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="spouse1_phone"
                value={formData.spouse1_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="spouse1_email"
                value={formData.spouse1_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="spouse1_occupation"
                value={formData.spouse1_occupation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Father's Full Name</label>
              <input
                type="text"
                name="spouse1_father_name"
                value={formData.spouse1_father_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mother's Full Name</label>
              <input
                type="text"
                name="spouse1_mother_name"
                value={formData.spouse1_mother_name}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Spouse 2 Section */}
        <section className="form-section">
          <h2>Spouse 2 Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="spouse2_first_name"
                value={formData.spouse2_first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="spouse2_last_name"
                value={formData.spouse2_last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="spouse2_birth_date"
                value={formData.spouse2_birth_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Place of Birth *</label>
              <input
                type="text"
                name="spouse2_birth_place"
                value={formData.spouse2_birth_place}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Nationality *</label>
              <input
                type="text"
                name="spouse2_nationality"
                value={formData.spouse2_nationality}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Passport Number</label>
              <input
                type="text"
                name="spouse2_passport_number"
                value={formData.spouse2_passport_number}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Address *</label>
              <textarea
                name="spouse2_address"
                value={formData.spouse2_address}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="spouse2_phone"
                value={formData.spouse2_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="spouse2_email"
                value={formData.spouse2_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="spouse2_occupation"
                value={formData.spouse2_occupation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Father's Full Name</label>
              <input
                type="text"
                name="spouse2_father_name"
                value={formData.spouse2_father_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mother's Full Name</label>
              <input
                type="text"
                name="spouse2_mother_name"
                value={formData.spouse2_mother_name}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Marriage Details Section */}
        <section className="form-section">
          <h2>Marriage Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Marriage Date *</label>
              <input
                type="date"
                name="marriage_date"
                value={formData.marriage_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Place of Marriage *</label>
              <input
                type="text"
                name="marriage_place"
                value={formData.marriage_place}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Country of Marriage *</label>
              <input
                type="text"
                name="marriage_country"
                value={formData.marriage_country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Marriage Type *</label>
              <select
                name="marriage_type"
                value={formData.marriage_type}
                onChange={handleChange}
                required
              >
                <option value="civil">Civil</option>
                <option value="religious">Religious</option>
                <option value="traditional">Traditional</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Purpose of Certificate *</label>
              <textarea
                name="certificate_purpose"
                value={formData.certificate_purpose}
                onChange={handleChange}
                rows="3"
                placeholder="Please explain why you need this certificate"
                required
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}
