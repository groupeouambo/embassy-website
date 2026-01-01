import React, { useState } from 'react';
import './contact.css';
import { useI18n } from '../../i18n';
import { api } from '../../api';

const contactChannels = [
  {
    label: 'General inquiries',
    email: 'inf@usrcaembassy.org',
    detail: 'Protocol, visas, public affairs, and administration requests.',
  },
  {
    label: 'IM / Consulate',
    email: 'im@usrcaembassy.org',
    detail: 'Passports, visas, civil status, and travel documentation.',
  },
  {
    label: 'Commerce',
    email: 'ce@usrcaembassy.org',
    detail: 'Trade missions, business partnerships, and investment support.',
  },
  {
    label: 'Tourism',
    email: 'ccs@usrcaembassy.org',
    detail: 'Travel guidance, cultural affairs, and visitor support.',
  },
];

const Contact = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ email: '', feedback: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSubmitted(false);

    try {
      await api.sendContact({ email: formData.email, message: formData.feedback });
      setSubmitted(true);
      setFormData({ email: '', feedback: '' });
    } catch (err) {
      setError(err.message || 'Unable to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-hero card">
        <div className="contact-hero__content">
          <p className="contact-eyebrow">{t('contact.quick')}</p>
          <h1>{t('contact.title')}</h1>
          <p className="contact-lede">
            Reach the Embassy team for consular services, trade inquiries, or cultural affairs. Most messages receive a response within one business day.
          </p>
          <div className="contact-hero__actions">
            <a className="btn primary" href="mailto:infos@usrcaembassy.org">{t('contact.email')}</a>
            <a className="btn ghost" href="tel:+12024837800">{t('footer.phone')}: (202) 483-7800</a>
          </div>
          <div className="contact-hero__meta">
            <span>24/7 emergency line available</span>
            <span>Located in Washington, DC</span>
          </div>
        </div>

        <div className="contact-hero__details">
          <div className="detail">
            <p className="label">{t('footer.address')}</p>
            <p>2704 Ontario Rd NW, Washington, DC</p>
          </div>
          <div className="detail">
            <p className="label">{t('contact.hours')}</p>
            <p>Monday - Friday, 9 am - 4 pm</p>
          </div>
          <div className="detail">
            <p className="label">{t('footer.phone')}</p>
            <p>(202) 483-7800</p>
          </div>
        </div>
      </div>

      <div className="contact-grid">
        {contactChannels.map((channel) => (
          <div className="contact-card" key={channel.email}>
            <p className="card-label">{channel.label}</p>
            <h3>{channel.label}</h3>
            <p className="card-copy">{channel.detail}</p>
            <a className="chip" href={`mailto:${channel.email}`}>{channel.email}</a>
          </div>
        ))}
      </div>

      <div className="contact-details card">
        <div className="contact-details__copy">
          <h3>{t('contact.formTitle')}</h3>
          <p className="card-copy">
            Share a few details so we can direct your request to the right desk. Include your preferred contact information and any reference numbers if applicable.
          </p>
          <ul className="checklist">
            <li>Consular: passport or visa number (if available)</li>
            <li>Commerce: company name and country</li>
            <li>Tourism: intended travel dates</li>
          </ul>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">
              {t('contact.email')}
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </label>
            
            <label htmlFor="feedback">
              {t('contact.feedback')}
              <textarea
                id="feedback"
                name="feedback"
                required
                placeholder="How can we help?"
                value={formData.feedback}
                onChange={handleChange}
              />
            </label>

            <button type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : t('contact.send')}
            </button>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            {submitted && (
              <div className="form-success" role="status" aria-live="polite">
                Thank you for reaching out. Your message has been received.
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="contact-bottom">
        <div className="alert card">
          <p>
            The mission remains closed on Central African Republic and U.S.A national holidays. During inclement weather conditions,
            the Embassy follows Federal Government opening schedule{' '}
            <a href="https://www.opm.gov/policy-data-oversight/snow-dismissal-procedures/current-status/" target="_blank" rel="noopener noreferrer">
              (OPM Status)
            </a>.
          </p>
          <p>We maintain a 24-hour, seven days a week emergency line.</p>
        </div>

        <div className="map-container card">
          <div className="map-header">
            <div>
              <p className="card-label">{t('footer.address')}</p>
              <h3>2704 Ontario Rd NW</h3>
              <p className="card-copy">Washington, DC</p>
            </div>
            <a className="btn ghost" href="https://maps.google.com/?q=2704+Ontario+Rd+NW,+Washington,+DC" target="_blank" rel="noopener noreferrer">
              Open in Maps
            </a>
          </div>
          <iframe
            title="Embassy Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.0133202805165!2d-77.03826132419791!3d38.92238345116456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7c0f3b4a3dbff%3A0x4d6e501f1d01b6e3!2s2704%20Ontario%20Rd%20NW%2C%20Washington%2C%20DC%2020009%2C%20USA!5e0!3m2!1sen!2s!4v1634899450923!5m2!1sen!2s"
            width="100%"
            height="400"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
