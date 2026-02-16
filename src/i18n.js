import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const defaultLang =
  sessionStorage.getItem('language') || localStorage.getItem('language') || 'English';

const translations = {
  English: {
    nav: {
      embassy: 'THE EMBASSY',
      about: 'ABOUT C.A.R',
      consular: 'CONSULAR',
      tourism: 'TOURISM',
      diaspora: 'DIASPORA',
      media: 'MEDIA',
      contact: 'CONTACT US',
      account: 'Account',
      myDashboard: 'My Dashboard',
      applications: 'Applications',
      logout: 'Log Out',
      language: 'Language',
      site: 'Site',
    },
    home: {
      welcomeTitle:
        'BIENVENUE / WELCOME\nNZONI GA NGO NA NDO TI GBANDA TERE\nTI DA LEMBE TI KODRO TI BE AFRICA\nNA KODRO SESSE TI AMERICA',
      welcomeBody:
        'Dear Americans, Dear Users, In my capacity as Representative of the Central African Republic of the United States of America with jurisdiction over Canada and Mexico and on behalf of the entire mission team, I would like to welcome you to our new website. This new website meets three main objectives: Facilitate the administrative and consular procedures of our compatriots; Improve the quality of our services to all our users; Present the economic opportunities of our country. Our constant concern is to serve you efficiently. All your contributions are welcome.',
      servicesTitle: 'Consular Services',
      highlights: 'Highlights',
      tourism: 'The world-famous Dzanga Bai',
      passport: 'Passport',
      consularId: 'Consular ID',
      certificates: 'Certificates',
      otherServices: 'Other Services',
      importantLinks: 'Important Links',
    },
    footer: {
      contactInfo: 'Contact Information',
      followUs: 'Follow Us',
      location: 'Location',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      copyright: 'Central African Republic Embassy',
    },
    contact: {
      title: 'SEND US YOUR QUERY/FEEDBACK',
      quick: 'For quick response please direct your queries to the correct department as listed below:',
      formTitle: 'Contact Form',
      email: 'Email',
      feedback: 'Your Feedback',
      send: 'Send',
      hours: 'Hours',
    },
    visa: {
      title: 'Visa Application',
      notice: 'Notice for new visa requirements for U.S. citizens and other travelers',
      contactUs: 'Contact Us',
      apply: 'Sign in to Apply',
      download: 'Download',
      country: 'Central African Republic (R.C.A)',
      processTitle: 'Visa application processing procedure:',
      officialTravelers: 'Official travelers with official or diplomatic passport:',
      officialNoChange: 'No change. Visa applications will be processed by the Embassy.',
      tourismPolicy: 'The visa policy for tourism, visit, and personal convenience remains unchanged.',
      orgTravelers: 'Travelers on behalf of international organizations (UN, EU, WB, IMF) and NGOs or anyone entering CAR to work for an embassy (including contractors) must first request authorization from the Ministry of Foreign Affairs.',
      process: 'Process:',
      processDesc: 'The inviting/sponsoring organization submits the request to the MFA in Bangui.',
      requiredDocs: 'Required documents:',
      docPassport: 'Valid passport',
      docForm: 'Completed visa application form',
      docPhoto: 'White background ID photo',
      docEmployer: 'Letter from employer confirming return to USA',
      docFees: 'Visa fees:',
      feeShort: 'Short stay (0-1 month): $150',
      feeMedium: 'Medium stay (2-3 months): $200',
      feeLong: 'Long stay (3+ months): $250',
      docEnvelope: 'Prepaid return envelope (applications by mail)',
      docVaccination: 'Copy of yellow fever vaccination card',
      docFlight: 'Flight itinerary',
      docInvitation: 'Invitation letter (from tourism agencies) and hotel reservation',
      docOfficial: 'For official passports: letter from the State Department or a diplomatic mission',
      processing48h: 'All visa applications are processed within 48 hours.',
      downloadForm: 'You can download the official visa application form',
      here: 'here',
      contactAdviser: 'To contact an adviser, visit the Contact page or use the information below:',
      address: 'Address:',
      addressValue: '2704 Ontario Rd NW, Washington, DC 20009',
      callCenter: 'Call center:',
      phone: 'Phone:',
      phoneValue: '(202) 483-7800',
      hours: 'Hours:',
      hoursValue: 'Monday-Friday, 09:00 AM to 04:00 PM',
      emailConsular: 'Consular Section Email:',
      emailValue: 'centrafricwashington@yahoo.com',
    },
    auth: {
      signupTitle: 'Create an Account',
      signupLead: 'Sign up to submit your visa application online.',
      signinTitle: 'Sign In',
      signinLead: 'Access your account to continue your visa application.',
      dontHave: "Don't have an account?",
      haveAccount: 'Already have an account?',
      signup: 'Sign Up',
      signin: 'Sign In',
      logout: 'Log Out',
    },
    dashboard: {
      userTitle: 'Your Dashboard',
      userLead: 'Manage your visa applications and downloads.',
      adminTitle: 'Admin Dashboard',
      applications: 'Applications',
      users: 'Users',
      settings: 'Settings',
      site: 'Site',
      overview: 'Overview',
      start: 'Start / Continue Visa Application',
      download: 'Download Visa Form',
      viewApps: 'View My Applications',
    },
  },
  Français: {
    nav: {
      embassy: "L'AMBASSADE",
      about: 'À PROPOS R.C.A',
      consular: 'CONSULAIRE',
      tourism: 'TOURISME',
      diaspora: 'DIASPORA',
      media: 'MÉDIAS',
      contact: 'CONTACTEZ-NOUS',
      account: 'Compte',
      myDashboard: 'Mon tableau de bord',
      applications: 'Dossiers',
      logout: 'Déconnexion',
      language: 'Langue',
      site: 'Site',
    },
    home: {
      welcomeTitle:
        'BIENVENUE / WELCOME\nNZONI GA NGO NA NDO TI GBANDA TERE\nTI DA LEMBE TI KODRO TI BE AFRICA\nNA KODRO SESSE TI AMERICA',
      welcomeBody:
        "Chers Américains, chers utilisateurs, en ma qualité de Représentant de la République Centrafricaine auprès des États-Unis d'Amérique avec juridiction sur le Canada et le Mexique et au nom de toute l'équipe de la mission, je vous souhaite la bienvenue sur notre nouveau site. Ce nouveau site répond à trois objectifs : faciliter les démarches administratives et consulaires de nos compatriotes ; améliorer la qualité de nos services pour tous nos usagers ; présenter les opportunités économiques de notre pays. Notre préoccupation constante est de vous servir efficacement. Toutes vos contributions sont les bienvenues.",
      servicesTitle: 'Services consulaires',
      highlights: 'À la une',
      tourism: 'Le célèbre Dzanga Bai',
      passport: 'Passeport',
      consularId: 'Carte consulaire',
      certificates: 'Certificats',
      otherServices: 'Autres services',
      importantLinks: 'Liens importants',
    },
    footer: {
      contactInfo: 'Informations de contact',
      followUs: 'Suivez-nous',
      location: 'Localisation',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      copyright: "Ambassade de la République Centrafricaine",
    },
    contact: {
      title: 'ENVOYEZ-NOUS VOTRE DEMANDE/AVIS',
      quick: 'Pour une réponse rapide, veuillez adresser vos demandes au service approprié ci-dessous :',
      formTitle: 'Formulaire de contact',
      email: 'Email',
      feedback: 'Votre message',
      send: 'Envoyer',
      hours: 'Horaires',
    },
    visa: {
      title: 'Demande de visa',
      notice: 'Avis sur les nouvelles exigences de visa pour les voyageurs',
      contactUs: 'Contactez-nous',
      apply: 'Se connecter pour postuler',
      download: 'Télécharger',
      country: 'République Centrafricaine (R.C.A)',
      processTitle: 'Procédure de traitement des demandes de visa :',
      officialTravelers: 'Voyageurs officiels avec passeport officiel ou diplomatique :',
      officialNoChange: 'Aucun changement. Les demandes de visa seront traitées par l\'Ambassade.',
      tourismPolicy: 'La politique de visa pour tourisme, visite et convenance personnelle reste inchangée.',
      orgTravelers: 'Les voyageurs au nom d\'organisations internationales (ONU, UE, BM, FMI) et ONG ou toute personne entrant en RCA pour travailler pour une ambassade (y compris sous-traitants) doivent d\'abord demander l\'autorisation au Ministère des Affaires Étrangères.',
      process: 'Processus :',
      processDesc: 'L\'organisation invitante/sponsorisante soumet la demande au MAE à Bangui.',
      requiredDocs: 'Pièces requises :',
      docPassport: 'Passeport valide',
      docForm: 'Formulaire de demande de visa complété',
      docPhoto: 'Photo d\'identité fond blanc',
      docEmployer: 'Lettre de l\'employeur confirmant le retour aux USA',
      docFees: 'Frais de visa :',
      feeShort: 'Court séjour (0-1 mois) : $150',
      feeMedium: 'Séjour moyen (2-3 mois) : $200',
      feeLong: 'Long séjour (3+ mois) : $250',
      docEnvelope: 'Enveloppe retour prépayée (dossiers par courrier)',
      docVaccination: 'Copie du carnet de vaccination fièvre jaune',
      docFlight: 'Itinéraire de vol',
      docInvitation: 'Lettre d\'invitation(par les agences touristique)  et réservation d\'hôtel',
      docOfficial: 'Pour passeports officiels : lettre du Département d\'État ou d\'une mission diplomatique',
      processing48h: 'Toutes les demandes de visa sont traitées sous 48h.',
      downloadForm: 'Vous pouvez télécharger le formulaire officiel de demande de visa',
      here: 'ici',
      contactAdviser: 'Pour contacter un conseiller, consultez la page Contact ou utilisez les informations ci-dessous :',
      address: 'Adresse :',
      addressValue: '2704 Ontario Rd NW, Washington, DC 20009',
      callCenter: 'Centre d\'appels :',
      phone: 'Tél :',
      phoneValue: '(202) 483-7800',
      hours: 'Heures :',
      hoursValue: 'Lundi-Vendredi, 09:00 à 16:00',
      emailConsular: 'Email Section Consulaire :',
      emailValue: 'centrafricwashington@yahoo.com',
    },
    auth: {
      signupTitle: 'Créer un compte',
      signupLead: 'Inscrivez-vous pour soumettre votre demande de visa en ligne.',
      signinTitle: 'Se connecter',
      signinLead: 'Accédez à votre compte pour poursuivre votre demande de visa.',
      dontHave: "Vous n'avez pas de compte ?",
      haveAccount: 'Vous avez déjà un compte ?',
      signup: "S'inscrire",
      signin: 'Se connecter',
      logout: 'Déconnexion',
    },
    dashboard: {
      userTitle: 'Votre tableau de bord',
      userLead: 'Gérez vos demandes de visa et vos téléchargements.',
      adminTitle: "Tableau de bord d'administration",
      applications: 'Dossiers',
      users: 'Utilisateurs',
      settings: 'Paramètres',
      site: 'Site',
      overview: 'Vue d’ensemble',
      start: 'Démarrer / poursuivre une demande de visa',
      download: 'Télécharger le formulaire de visa',
      viewApps: 'Voir mes dossiers',
    },
  },
};

const I18nContext = createContext({
  language: defaultLang,
  setLanguage: () => {},
  t: (key) => key,
});

export const I18nProvider = ({ children }) => {
  const [language, setLanguageState] = useState(defaultLang);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    sessionStorage.setItem('language', lang);
    localStorage.setItem('language', lang);
  }, []);

  const t = useCallback(
    (key) => {
      const parts = key.split('.');
      let ref = translations[language] || translations.English;
      for (const part of parts) {
        ref = ref?.[part];
      }
      return ref || key;
    },
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
