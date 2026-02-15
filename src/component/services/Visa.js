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
          <span>Central African Republic (R.C.A)</span>
        </h3>

        <p>
          {t('visa.notice')}
        </p>

        <p><strong>Procédure de traitement des demandes de visa :</strong></p>
        <p><strong>Voyageurs officiels avec passeport officiel ou diplomatique :</strong></p>
        <p>Aucun changement. Les demandes de visa seront traitées par l’Ambassade.</p>

        <p>La politique de visa pour tourisme, visite et convenance personnelle reste inchangée.</p>
        <p>
          Les voyageurs au nom d’organisations internationales (ONU, UE, BM, FMI) et ONG ou toute personne entrant en RCA pour travailler pour une ambassade (y compris sous-traitants) doivent d’abord demander l’autorisation au Ministère des Affaires Étrangères.
        </p>

        <p>
          <strong>Processus :</strong> L’organisation invitante/sponsorisante soumet la demande au MAE à Bangui.
        </p>

        <p><strong>Pièces requises :</strong></p>
        <ul>
          <li>Passeport valide</li>
          <li>Formulaire de demande de visa complété</li>
          <li>Photo d’identité fond blanc</li>
          <li>Lettre de l’employeur confirmant le retour aux USA</li>
          <li>
            Frais de visa :
            <ul>
              <li>Court séjour (0-1 mois) : $150</li>
              <li>Séjour moyen (2-3 mois) : $200</li>
              <li>Long séjour (3+ mois) : $250</li>
            </ul>
          </li>
          <li>Enveloppe retour prépayée (dossiers par courrier)</li>
          <li>Copie du carnet de vaccination fièvre jaune</li>
          <li>Itinéraire de vol</li>
          <li>Lettre d'invitation(par les agences touristique)  et réservation d'hôtel</li>
          <li>Pour passeports officiels : lettre du Département d’État ou d’une mission diplomatique</li>
        </ul>

        <p>Toutes les demandes de visa sont traitées sous 48h.</p>
        <p>
          Vous pouvez télécharger le formulaire officiel de demande de visa <Link to="/download">ici</Link>.
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
        <p>Pour contacter un conseiller, consultez la page Contact ou utilisez les informations ci-dessous :</p>
        <p><strong>Adresse :</strong> 2704 Ontario Rd NW, Washington, DC 20009</p>
        <p><strong>Centre d’appels :</strong></p>
        <p><strong>Tél :</strong> (202) 483-7800</p>
        <p><strong>Heures :</strong> Lundi-Vendredi, 09:00 à 16:00</p>
        <p><strong>Email Section Consulaire :</strong> centrafricwashington@yahoo.com</p>
      </div>
    </div>
  );
}
