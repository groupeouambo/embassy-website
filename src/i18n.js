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
