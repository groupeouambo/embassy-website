import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { generateTrackingNumber } from '../../utils/BarcodeGenerator';
import ApplicationSuccess from './ApplicationSuccess';
import './applicationForms.css';

export default function BirthCertificateApplication() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [applicationId, setApplicationId] = useState(null);

  const [formData, setFormData] = useState({
    // Child Information
    child_first_name: '',
    child_last_name: '',
    child_middle_name: '',
    child_birth_date: '',
    child_birth_place: '',
    child_birth_country: '',
    child_gender: 'male',
    child_nationality: '',

    // Father Information
    father_first_name: '',
    father_last_name: '',
    father_birth_date: '',
    father_birth_place: '',
    father_nationality: '',
    father_occupation: '',
    father_address: '',

    // Mother Information
    mother_first_name: '',
    mother_last_name: '',
    mother_maiden_name: '',
    mother_birth_date: '',
    mother_birth_place: '',
    mother_nationality: '',
    mother_occupation: '',
    mother_address: '',

    // Applicant Information
    applicant_relationship: 'parent',
    applicant_first_name: '',
    applicant_last_name: '',
    applicant_phone: '',
    applicant_email: '',
    applicant_address: '',

    // Certificate Details
    certificate_purpose: '',
    is_minor: true,
    original_registration_number: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      const tracking = generateTrackingNumber('birth');
      const resp = await api.submitBirthCertificateApplication({ ...formData, tracking_number: tracking });
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
        applicationType="birth"
        applicationId={applicationId}
        onClose={() => navigate('/dashboard/applications')}
      />
    );
  }

  return (
    <div className="application-container">
      <div className="application-header">
        <h1>Birth Certificate Application</h1>
        <p>Please fill out all required information</p>
        <a
          href="/birth-certificate-form.pdf"
          download="birth-certificate-form.pdf"
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
        {/* Child Information Section */}
        <section className="form-section">
          <h2>Child Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="child_first_name"
                value={formData.child_first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="child_last_name"
                value={formData.child_last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="child_middle_name"
                value={formData.child_middle_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="child_birth_date"
                value={formData.child_birth_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Place of Birth *</label>
              <input
                type="text"
                name="child_birth_place"
                value={formData.child_birth_place}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Country of Birth *</label>
              <input
                type="text"
                name="child_birth_country"
                value={formData.child_birth_country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="child_gender"
                value={formData.child_gender}
                onChange={handleChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nationality *</label>
              <input
                type="text"
                name="child_nationality"
                value={formData.child_nationality}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        {/* Father Information Section */}
        <section className="form-section">
          <h2>Father Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="father_first_name"
                value={formData.father_first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="father_last_name"
                value={formData.father_last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="father_birth_date"
                value={formData.father_birth_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Place of Birth</label>
              <input
                type="text"
                name="father_birth_place"
                value={formData.father_birth_place}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Nationality *</label>
              <input
                type="text"
                name="father_nationality"
                value={formData.father_nationality}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="father_occupation"
                value={formData.father_occupation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                name="father_address"
                value={formData.father_address}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>
        </section>

        {/* Mother Information Section */}
        <section className="form-section">
          <h2>Mother Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="mother_first_name"
                value={formData.mother_first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="mother_last_name"
                value={formData.mother_last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Maiden Name</label>
              <input
                type="text"
                name="mother_maiden_name"
                value={formData.mother_maiden_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="mother_birth_date"
                value={formData.mother_birth_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Place of Birth</label>
              <input
                type="text"
                name="mother_birth_place"
                value={formData.mother_birth_place}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Nationality *</label>
              <input
                type="text"
                name="mother_nationality"
                value={formData.mother_nationality}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="mother_occupation"
                value={formData.mother_occupation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                name="mother_address"
                value={formData.mother_address}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>
        </section>

        {/* Applicant Information Section */}
        <section className="form-section">
          <h2>Applicant Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Relationship to Child *</label>
              <select
                name="applicant_relationship"
                value={formData.applicant_relationship}
                onChange={handleChange}
                required
              >
                <option value="parent">Parent</option>
                <option value="guardian">Legal Guardian</option>
                <option value="grandparent">Grandparent</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="applicant_first_name"
                value={formData.applicant_first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="applicant_last_name"
                value={formData.applicant_last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="applicant_phone"
                value={formData.applicant_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="applicant_email"
                value={formData.applicant_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Address *</label>
              <textarea
                name="applicant_address"
                value={formData.applicant_address}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>
          </div>
        </section>

        {/* Certificate Details Section */}
        <section className="form-section">
          <h2>Certificate Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Original Registration Number (if known)</label>
              <input
                type="text"
                name="original_registration_number"
                value={formData.original_registration_number}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="is_minor"
                  checked={formData.is_minor}
                  onChange={handleChange}
                />
                Child is a minor (under 18)
              </label>
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
