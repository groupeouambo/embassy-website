// Navbar.js
import React, { useState, useEffect } from 'react';
import './navbar.css';
import Logo from './logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = (menu) => setOpenDropdown(openDropdown === menu ? null : menu);
  const closeMenus = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };
  const handleLogoClick = () => {
    closeMenus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate('/');
  };
  const setLang = (lang) => {
    setLanguage(lang);
    setOpenDropdown(null);
  };

  const menuItems = [
    {
      label: 'THE EMBASSY',
      key: 'embassy',
      dropdownOptions: [
        { label: 'Mission', path: '/embassy/mission' },
        { label: 'Staff', path: '/embassy/staff' },
        { label: 'Events', path: '/embassy/events' },
      ],
    },
    {
      label: 'ABOUT C.A.R',
      key: 'about',
      dropdownOptions: [
        { label: 'History', path: '/about/history' },
        { label: 'Geography', path: '/about/geography' },
        { label: 'Culture', path: '/about/culture' },
      ],
    },
    {
      label: 'CONSULAR',
      key: 'consular',
      dropdownOptions: [
        { label: 'Visa Information', path: '/consular/visa-information' },
        { label: 'Passports', path: '/consular/passports' },
        { label: 'Forms', path: '/consular/forms' },
      ],
    },
    {
      label: 'TOURISM',
      key: 'tourism',
      dropdownOptions: [
        { label: 'Attractions', path: '/tourism/attractions' },
        { label: 'Guidelines', path: '/tourism/guidelines' },
        { label: 'Hotels', path: '/tourism/hotels' },
      ],
    },
    {
      label: 'DIASPORA',
      key: 'diaspora',
      dropdownOptions: [
        { label: 'Programs', path: '/diaspora/programs' },
        { label: 'Events', path: '/diaspora/events' },
        { label: 'News', path: '/diaspora/news' },
      ],
    },
    {
      label: 'MEDIA',
      key: 'media',
      dropdownOptions: [
        { label: 'Press Releases', path: '/media/press-releases' },
        { label: 'Gallery', path: '/media/gallery' },
        { label: 'Publications', path: '/media/publications' },
      ],
    },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-header">
        <Link to="/" onClick={handleLogoClick} className="navbar-logo-link">
          <img src={Logo} alt="Embassy Logo" className="navbar-logo" />
        </Link>
        <div className="navbar-titles-content">
          <Link to="/" onClick={handleLogoClick} className="navbar-title-link">
            <div className="navbar-title">Central African Republic Embassy in Washington, D.C.</div>
          </Link>
          <Link to="/" onClick={handleLogoClick} className="navbar-subtitle-link">
            <div className="navbar-subtitle">Official Representation in the United States, Canada and Mexico</div>
          </Link>
        </div>
      </div>
      <div className="navbar-menu-container">
        <div className="navbar-titles">
          <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="navbar-item"
                onMouseEnter={() => toggleDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button onClick={() => toggleDropdown(item.label)}>
                  {t(`nav.${item.key}`) || item.label}
                </button>
                {openDropdown === item.label && (
                  <div className="dropdown">
                    {item.dropdownOptions.map((option) => (
                      <Link
                        key={option.path}
                        to={option.path}
                        className="dropdown-link"
                        onClick={closeMenus}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
             <Link to="/contact" className="navbar-item" onClick={closeMenus}>{t('nav.contact')}</Link>
            <div
              className="navbar-item language-pill"
              onMouseEnter={() => toggleDropdown('LANG')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button onClick={() => toggleDropdown('LANG')}>
                {t('nav.language')}: {language}
              </button>
              {openDropdown === 'LANG' && (
                <div className="dropdown">
                  <button className="dropdown-link" onClick={() => setLang('English')}>English</button>
                  <button className="dropdown-link" onClick={() => setLang('Français')}>Français</button>
                </div>
              )}
            </div>
            {isAuthenticated() && (
              <div
                className="navbar-item account-pill"
                onMouseEnter={() => toggleDropdown('ACCOUNT')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button onClick={() => toggleDropdown('ACCOUNT')}>
                  {t('nav.account')}
                </button>
                {openDropdown === 'ACCOUNT' && (
                  <div className="dropdown">
                    <Link
                      to={isAdmin() ? '/admin' : '/dashboard'}
                      className="dropdown-link"
                      onClick={closeMenus}
                    >
                      {t('nav.myDashboard')}
                    </Link>
                    <Link
                      to={isAdmin() ? '/admin/applications' : '/dashboard/applications'}
                      className="dropdown-link"
                      onClick={closeMenus}
                    >
                      {t('nav.applications')}
                    </Link>
                    <button className="dropdown-link" onClick={handleLogout}>
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hamburger" onClick={toggleMobileMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
