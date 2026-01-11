import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './visaApplication.css';
import { initialVisaFormData } from './visaFormState';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';
import ApplicationSuccess from '../services/ApplicationSuccess';

export default function Visaaplications({ formData, setFormData }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!isAuthenticated() || !user?.username) {
      setError('Please sign in before submitting your application.');
      navigate('/signin');
      return;
    }
    setSubmitting(true);

    try {
      // Generate tracking number
      const tracking = `VISA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Submit application
      const resp = await api.submitVisaApplication({
        userName: user.username,
        ...formData,
        tracking_number: tracking
      });

      // Store application details for success screen
      setApplicationId(resp.id);
      setTrackingNumber(tracking);
      setSuccess(true);

      // Clear form data
      sessionStorage.removeItem('visaFormData');
      setFormData({ ...initialVisaFormData });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Show success screen if submission was successful
  if (success && trackingNumber) {
    return (
      <ApplicationSuccess
        trackingNumber={trackingNumber}
        applicationType="visa"
        applicationId={applicationId}
        onClose={() => navigate('/dashboard')}
      />
    );
  }

  return (
    <div className="visa-container">
      <form onSubmit={handleSubmit} className="visa-form">
        {/* Type of Visa */}
        <label htmlFor="visaType">TYPE DE VISA SOLLICITE / TYPE OF VISA REQUESTED</label>
        <select
          id="visaType"
          name="visaType"
          value={formData.visaType}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="shortStay">Court Sejour / Short Stay (&lt;1 month)</option>
          <option value="mediumStay">Moyen Sejour / Medium Stay (2 to 3 months)</option>
          <option value="longStay">Long Sejour / Long Stay (&gt;3 months)</option>
        </select>

        {/* Personal Information */}
        <h3>2. Document de Voyage / Travel Document </h3>
        <label htmlFor="firstName">PRENOM / FIRST NAME:</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="lastName">NOM / LAST NAME:</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label htmlFor="gender">Sex / Gender:</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="dateOfBirth">Date de Naissance / Date of Birth:</label>
        <input
          id="dateOfBirth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />

        <label htmlFor="placeOfBirth">Place de Naissance / Place of Birth:</label>
        <input
          id="placeOfBirth"
          type="text"
          name="placeOfBirth"
          value={formData.placeOfBirth}
          onChange={handleChange}
          required
        />

        <label htmlFor="city">Ville / Town:</label>
        <input
          id="city"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />

        <label htmlFor="countryOfBirth">Pays de naissance / Country of Birth:</label>
        <input
          id="countryOfBirth"
          type="text"
          name="countryOfBirth"
          value={formData.countryOfBirth}
          onChange={handleChange}
        />

        <label htmlFor="nationalityOrigin">Nationalite d'origine / Nationality of origin:</label>
        <input
          id="nationalityOrigin"
          type="text"
          name="nationalityOrigin"
          value={formData.nationalityOrigin}
          onChange={handleChange}
        />

        <label htmlFor="nationalityCurrent">Actuelle / Current:</label>
        <input
          id="nationalityCurrent"
          type="text"
          name="nationalityCurrent"
          value={formData.nationalityCurrent}
          onChange={handleChange}
        />

        <label htmlFor="address">Adresse / Address:</label>
        <input
          id="address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label htmlFor="cityAddress">Ville / City:</label>
        <input
          id="cityAddress"
          type="text"
          name="cityAddress"
          value={formData.cityAddress}
          onChange={handleChange}
        />

        <label htmlFor="countryAddress">Pays / Country:</label>
        <input
          id="countryAddress"
          type="text"
          name="countryAddress"
          value={formData.countryAddress}
          onChange={handleChange}
        />

        <label htmlFor="maritalStatus">Situation Matrimoniale / Marital Status:</label>
        <select
          id="maritalStatus"
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="single">Celibataire / Single</option>
          <option value="married">Marie(e) / Married</option>
          <option value="widowed">Veuf(ve) / Widowed</option>
        </select>

        <label htmlFor="profession">Profession / Occupation:</label>
        <input
          id="profession"
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
        />

        <label htmlFor="employer">Employeur / Employer:</label>
        <input
          id="employer"
          type="text"
          name="employer"
          value={formData.employer}
          onChange={handleChange}
        />

        <label htmlFor="employerAddress">Adresse / Address:</label>
        <input
          id="employerAddress"
          type="text"
          name="employerAddress"
          value={formData.employerAddress}
          onChange={handleChange}
        />

        <div className="action-row">
          <button type="button" className="submit-button" onClick={() => {
            sessionStorage.removeItem('visaFormData');
            setFormData({ ...initialVisaFormData });
            navigate('/');
          }}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Save & Submit'}
          </button>
        </div>
        {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
      </form>
    </div>
  );
}