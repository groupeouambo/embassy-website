// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter } from 'react-icons/fa';
import './footer.css';
import { useI18n } from '../../i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>{t('footer.contactInfo')}</h3>
        <p><strong>{t('footer.address')}:</strong> 2704 Ontario Rd NW, Washington, DC</p>
        <p><strong>{t('footer.phone')}:</strong> (202) 483-7800</p>
        <p><strong>{t('footer.email')}:</strong> <a href="mailto:infos@usrcaembassy.org">infos@usrcaembassy.org</a></p>
      </div>
      
      <div className="footer-section footer-nav">
        <h3>Menu</h3>
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/ambassador">Ambassador</Link></li>
          <li><Link to="/visa">Visa</Link></li>
          <li><Link to="/registration">Registration</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>

      <div className="footer-section">
        <h3>{t('footer.followUs')}</h3>
        <div className="social-row">
          <a href="https://www.facebook.com/profile.php?id=100079690925264" target="_blank" rel="noopener noreferrer" className="social-pill">
            <FaFacebookF /> <span>Facebook</span>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-pill">
            <FaTwitter /> <span>Twitter</span>
          </a>
        </div>
      </div>

      <div className="footer-section">
        <h3>{t('footer.location')}</h3>
        <iframe
          title="Embassy Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.0133202805165!2d-77.03826132419791!3d38.92238345116456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7c0f3b4a3dbff%3A0x4d6e501f1d01b6e3!2s2704%20Ontario%20Rd%20NW%2C%20Washington%2C%20DC%2020009%2C%20USA!5e0!3m2!1sen!2s!4v1634899450923!5m2!1sen!2s"
          width="100%"
          height="150"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} {t('footer.copyright')}
      </div>
    </footer>
  );
}
