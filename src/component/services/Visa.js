import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillFilePdf } from 'react-icons/ai';
import { useI18n } from '../../i18n';

import './visa.css';

export default function Visa() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleApplyClick = () => {
    navigate('/signin');
  };

  const handleDownloadClick = () => {
    const fileUrl = `${process.env.PUBLIC_URL}/forms/visa-application.pdf`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'visa-application.pdf';
    link.click();
  };

  return (
    <div className="visa-container">
      <h1 className="visa-title">{t('visa.title')}</h1>

      <div className="visa-content">
        <h3 className="visa-notice">{t('visa.notice')}</h3>
        <h3>
          <span>{t('visa.country')}</span>
        </h3>

        <p>
          {t('visa.notice')}
        </p>

        <p><strong>{t('visa.processTitle')}</strong></p>
        <p><strong>{t('visa.officialTravelers')}</strong></p>
        <p>{t('visa.officialNoChange')}</p>

        <p>{t('visa.tourismPolicy')}</p>
        <p>
          {t('visa.orgTravelers')}
        </p>

        <p>
          <strong>{t('visa.process')}</strong> {t('visa.processDesc')}
        </p>

        <p><strong>{t('visa.requiredDocs')}</strong></p>
        <ul>
          <li>{t('visa.docPassport')}</li>
          <li>{t('visa.docForm')}</li>
          <li>{t('visa.docPhoto')}</li>
          <li>{t('visa.docEmployer')}</li>
          <li>
            {t('visa.docFees')}
            <ul>
              <li>{t('visa.feeShort')}</li>
              <li>{t('visa.feeMedium')}</li>
              <li>{t('visa.feeLong')}</li>
            </ul>
          </li>
          <li>{t('visa.docEnvelope')}</li>
          <li>{t('visa.docVaccination')}</li>
          <li>{t('visa.docFlight')}</li>
          <li>{t('visa.docInvitation')}</li>
          <li>{t('visa.docOfficial')}</li>
        </ul>

        <p>{t('visa.processing48h')}</p>
        <p>
          {t('visa.downloadForm')} <Link to="/download">{t('visa.here')}</Link>.
        </p>
      </div>

      <div className="visa-buttons">
        <button className="apply-button" onClick={handleApplyClick}>{t('visa.apply')}</button>
        <button className="download-button" onClick={handleDownloadClick}>
          <AiFillFilePdf className="pdf-icon" /> {t('visa.download')}
        </button>
      </div>

      <div className="visa-content">
        <h3>{t('visa.contactUs')}</h3>
        <p>{t('visa.contactAdviser')}</p>
        <p><strong>{t('visa.address')}</strong> {t('visa.addressValue')}</p>
        <p><strong>{t('visa.callCenter')}</strong></p>
        <p><strong>{t('visa.phone')}</strong> {t('visa.phoneValue')}</p>
        <p><strong>{t('visa.hours')}</strong> {t('visa.hoursValue')}</p>
        <p><strong>{t('visa.emailConsular')}</strong> {t('visa.emailValue')}</p>
      </div>
    </div>
  );
}
