import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { generateTrackingNumber } from '../../utils/BarcodeGenerator';
import ApplicationSuccess from './ApplicationSuccess';
import './applicationForms.css';

export default function TravelPassApplication() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [applicationId, setApplicationId] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    last_name: '',
    maiden_name: '',
    date_of_birth: '',
    place_of_birth: '',
    country_of_birth: '',
    gender: 'male',
    nationality: '',

    // Physical Description
    height: '',
    eye_color: '',
    hair_color: '',
    distinguishing_marks: '',

    // Contact Information
    current_address: '',
    city: '',
    country: '',
    phone: '',
    email: '',

    // Family Information
    father_name: '',
    mother_name: '',
    mother_maiden_name: '',
    marital_status: 'single',
    spouse_name: '',

    // Travel Details
    travel_reason: '',
    destination_country: '',
    destination_city: '',
    departure_date: '',
    return_date: '',
    travel_duration: '',

    // Emergency Contact
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    emergency_contact_address: '',

    // Document Information
    passport_lost: false,
    passport_stolen: false,
    passport_expired: false,
    previous_passport_number: '',
    passport_issue_date: '',
    passport_expiry_date: '',
    police_report_number: '',
    police_report_date: '',
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
      const tracking = generateTrackingNumber('travel');
      const resp = await api.submitTravelPassApplication({ ...formData, tracking_number: tracking });
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
        applicationType="travel"
        applicationId={applicationId}
        onClose={() => navigate('/dashboard/applications')}
      />
    );
  }

  return (
    <div className="application-container">
      <div className="application-header">
        <h1>Travel Pass (Laissez-Passer) Application</h1>
        <p>Emergency travel document - Please fill out all required information</p>
        <a
          href="/travel-pass-form.pdf"
          download="travel-pass-form.pdf"
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
        {/* Personal Information Section */}
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Maiden Name (if applicable)</label>
              <input
                type="text"
                name="maiden_name"
                value={formData.maiden_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Place of Birth *</label>
              <input
                type="text"
                name="place_of_birth"
                value={formData.place_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Country of Birth *</label>
              <input
                type="text"
                name="country_of_birth"
                value={formData.country_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
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
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        {/* Physical Description Section */}
        <section className="form-section">
          <h2>Physical Description</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Height</label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g., 175 cm"
              />
            </div>

            <div className="form-group">
              <label>Eye Color</label>
              <input
                type="text"
                name="eye_color"
                value={formData.eye_color}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Hair Color</label>
              <input
                type="text"
                name="hair_color"
                value={formData.hair_color}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Distinguishing Marks</label>
              <textarea
                name="distinguishing_marks"
                value={formData.distinguishing_marks}
                onChange={handleChange}
                rows="2"
                placeholder="Scars, tattoos, birthmarks, etc."
              />
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="form-section">
          <h2>Contact Information</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Current Address *</label>
              <textarea
                name="current_address"
                value={formData.current_address}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        {/* Family Information Section */}
        <section className="form-section">
          <h2>Family Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Father's Name</label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mother's Name</label>
              <input
                type="text"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mother's Maiden Name</label>
              <input
                type="text"
                name="mother_maiden_name"
                value={formData.mother_maiden_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Marital Status *</label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                required
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            {formData.marital_status === 'married' && (
              <div className="form-group">
                <label>Spouse Name</label>
                <input
                  type="text"
                  name="spouse_name"
                  value={formData.spouse_name}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </section>

        {/* Travel Details Section */}
        <section className="form-section">
          <h2>Travel Details</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Reason for Travel *</label>
              <textarea
                name="travel_reason"
                value={formData.travel_reason}
                onChange={handleChange}
                rows="3"
                required
                placeholder="Please explain why you need this emergency travel document"
              />
            </div>

            <div className="form-group">
              <label>Destination Country *</label>
              <input
                type="text"
                name="destination_country"
                value={formData.destination_country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Destination City</label>
              <input
                type="text"
                name="destination_city"
                value={formData.destination_city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Departure Date *</label>
              <input
                type="date"
                name="departure_date"
                value={formData.departure_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Expected Return Date</label>
              <input
                type="date"
                name="return_date"
                value={formData.return_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Travel Duration</label>
              <input
                type="text"
                name="travel_duration"
                value={formData.travel_duration}
                onChange={handleChange}
                placeholder="e.g., 2 weeks, 1 month"
              />
            </div>
          </div>
        </section>

        {/* Emergency Contact Section */}
        <section className="form-section">
          <h2>Emergency Contact</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Contact Name *</label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Relationship *</label>
              <input
                type="text"
                name="emergency_contact_relationship"
                value={formData.emergency_contact_relationship}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                name="emergency_contact_address"
                value={formData.emergency_contact_address}
                onChange={handleChange}
                rows="2"
              />
            </div>
          </div>
        </section>

        {/* Document Information Section */}
        <section className="form-section">
          <h2>Previous Passport Information</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label style={{ fontWeight: '700', marginBottom: '12px', display: 'block' }}>
                Reason for Travel Pass Application *
              </label>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal' }}>
                  <input
                    type="checkbox"
                    name="passport_lost"
                    checked={formData.passport_lost}
                    onChange={handleChange}
                  />
                  Passport Lost
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal' }}>
                  <input
                    type="checkbox"
                    name="passport_stolen"
                    checked={formData.passport_stolen}
                    onChange={handleChange}
                  />
                  Passport Stolen
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal' }}>
                  <input
                    type="checkbox"
                    name="passport_expired"
                    checked={formData.passport_expired}
                    onChange={handleChange}
                  />
                  Passport Expired
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Previous Passport Number</label>
              <input
                type="text"
                name="previous_passport_number"
                value={formData.previous_passport_number}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Passport Issue Date</label>
              <input
                type="date"
                name="passport_issue_date"
                value={formData.passport_issue_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Passport Expiry Date</label>
              <input
                type="date"
                name="passport_expiry_date"
                value={formData.passport_expiry_date}
                onChange={handleChange}
              />
            </div>

            {(formData.passport_lost || formData.passport_stolen) && (
              <>
                <div className="form-group">
                  <label>Police Report Number</label>
                  <input
                    type="text"
                    name="police_report_number"
                    value={formData.police_report_number}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Police Report Date</label>
                  <input
                    type="date"
                    name="police_report_date"
                    value={formData.police_report_date}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
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
