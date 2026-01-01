// home.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

import carousel1 from '../../assets/photo1.jpg';
import carousel2 from '../../assets/photo2.jpg';
import carousel3 from '../../assets/photo3.jpg';
import carousel4 from '../../assets/photo4.jpg';
import carousel5 from '../../assets/photo5.jpg';
import dzanga from '../../assets/Dzanga.mp4';
import dzanga3 from '../../assets/Dzanga3.mp4';
import photo from '../../assets/sema3.JPG';
import elephant from '../../assets/elephant.jpg';
import starlinkImage from '../../assets/startlinkrca.jpeg';

const Home = () => {
  const carouselItems = [
    { src: carousel1, title: 'CAR Signs Historic Starlink Agreement', link: '/news/starlink-agreement' },
    { src: carousel2, title: 'Highlight 2', link: '/highlights/2' },
    { src: carousel3, title: 'Highlight 3', link: '/highlights/3' },
    { src: carousel4, title: 'Highlight 4', link: '/highlights/4' },
    { src: carousel5, title: 'Highlight 5', link: '/highlights/5' },
  ];

  const galleryItems = [
    { src: elephant, title: 'Dzanga Bai Elephants' },
    { src: carousel2, title: 'Bangui Riverfront' },
    { src: carousel3, title: 'Cultural Celebration' },
    { src: carousel4, title: 'Sunset over CAR' },
    { src: carousel5, title: 'Cityscape at Dusk' },
    { src: carousel1, title: 'Community Gathering' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGalleryIndex((prevIndex) =>
        prevIndex === galleryItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [galleryItems.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="home-container">
      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-frame">
          <div className="gallery-image-wrapper">
            <img src={galleryItems[galleryIndex].src} alt={galleryItems[galleryIndex].title} />
            <span className="gallery-overlay"></span>
          </div>
          <p className="gallery-caption">{galleryItems[galleryIndex].title}</p>
        </div>
      </section>

      <section className="container">
        <img src={photo} alt="Placeholder" className="image" />
        <div className="text-content">
          <h2 className="photo-title">
            BIENVENUE / WELCOME
            <br />
            NZONI GA NGO NA NDO TI GBANDA TERE
            <br />
            TI DA LEMBE TI KODRO TI BE AFRICA
            <br />
            NA KODRO SESSE TI AMERICA
          </h2>
          <p className="paragraph">
            Dear Americans, Dear Users, In my capacity as Representative of the Central African
            Republic of the United States of America with jurisdiction over Canada and Mexico and
            on behalf of the entire mission team, I would like to welcome you to our new website.
            This new website meets three main objectives: Facilitate the administrative and consular
            procedures of our compatriots; Improve the quality of our services to all our users;
            Present the economic opportunities of our country. Our constant concern is to serve
            you efficiently. All your contributions are welcome.
          </p>
          <p>
            <strong>His Excellency Ambassador Martial NDOUBOU</strong>
          </p>
        </div>
      </section>

      {/* Consular Services Section */}
      <section className="consular-section">
        <h2>Consular Services</h2>
        <div className="service-category-container">
          <div className="service-category">
            <h3>Passport & Citizenship</h3>
            <Link to="/services/passport">Passport</Link>
            <Link to="/services/consular-id">Consular ID</Link>
          </div>
          <div className="service-category">
            <h3>Certificates</h3>
            <Link to="/apply-info/birth-certificate" style={{ fontWeight: 600, color: 'var(--primary)' }}>📋 Apply for Birth Certificate</Link>
            <Link to="/services/birth-certificate">Birth Certificate Information</Link>
            <Link to="/services/minor-birth-certificate">Minor Child Birth Certificate</Link>
            <Link to="/apply-info/marriage" style={{ fontWeight: 600, color: 'var(--primary)' }}>💍 Apply for Marriage Certificate</Link>
            <Link to="/services/marriage-certificate">Marriage Certificate Information</Link>
            <Link to="/apply-info/travel-pass" style={{ fontWeight: 600, color: 'var(--primary)' }}>🛂 Apply for Travel Pass (Emergency)</Link>
            <Link to="/services/emergency-certificate">Emergency Certificate Information</Link>
          </div>
          <div className="service-category">
            <h3>Other Services</h3>
            <Link to="/services/document-authentication">Document Authentication/Legalization</Link>
            <Link to="/services/transport-deceased">Transport of Deceased</Link>
          </div>
          <div className="service-category">
            <h3>Important Links</h3>
            <Link to="/visa">Visa</Link>
            <Link to="/apply-info/visa" style={{ fontWeight: 600, color: 'var(--primary)' }}>✈️ Apply for Visa</Link>
            <Link to="/services/passport-appointment">Passport Appointment</Link>
            <Link to="/services/diaspora-organization">Diaspora Organization</Link>
            <Link to="/registration">Registration of Central African Republic Nationals (USA, Mexico, and Canada)</Link>
          </div>
        </div>
      </section>

      {/* Economic Cooperation Section */}
      <section className="economic-section">
        <h2>CAR - USA Economic Cooperation</h2>
        <div className="economic-content">
          <div className="economic-intro">
            <p>
              The Central African Republic and the United States share a commitment to fostering
              economic development, sustainable growth, and mutual prosperity. Our bilateral relationship
              focuses on key sectors that drive economic transformation and create opportunities for both nations.
            </p>
          </div>

          {/* Starlink News Highlight */}
          <div className="starlink-highlight">
            <div className="starlink-content">
              <div className="starlink-badge">Latest News</div>
              <h3>🚀 CAR Signs Historic Starlink Agreement</h3>
              <p>
                The Central African Republic has taken a decisive step in its digital modernization with the signing
                of the agreement granting a satellite communications operator license to Starlink, authorizing the
                operation of its services throughout the national territory.
              </p>
              <Link to="/news/starlink-agreement" className="starlink-read-more">
                Read Full Announcement →
              </Link>
            </div>
            <div className="starlink-image">
              <img src={starlinkImage} alt="CAR Starlink Agreement Signing" />
            </div>
          </div>

          <div className="economic-pillars">
            <div className="pillar-card">
              <h3>🌾 Agriculture & Food Security</h3>
              <p>
                Partnership in agricultural development, sustainable farming practices, and food security
                initiatives to support CAR's agricultural potential and ensure nutritional well-being.
              </p>
            </div>

            <div className="pillar-card">
              <h3>💎 Mining & Natural Resources</h3>
              <p>
                Collaboration on responsible mining practices, resource management, and value chain
                development in diamonds, gold, and other minerals while ensuring environmental sustainability.
              </p>
            </div>

            <div className="pillar-card">
              <h3>⚡ Energy & Infrastructure</h3>
              <p>
                Joint investments in renewable energy, power generation, and critical infrastructure
                to support economic growth and improve quality of life for Central Africans.
              </p>
            </div>

            <div className="pillar-card">
              <h3>📚 Education & Capacity Building</h3>
              <p>
                Exchange programs, technical training, and educational partnerships to develop
                human capital and strengthen institutional capacity across sectors.
              </p>
            </div>

            <div className="pillar-card">
              <h3>🏥 Healthcare & Development</h3>
              <p>
                Cooperation in healthcare infrastructure, disease prevention, and medical training
                to improve health outcomes and build resilient health systems.
              </p>
            </div>

            <div className="pillar-card">
              <h3>📱 Technology & Innovation</h3>
              <p>
                Fostering digital transformation, telecommunications development, and technological
                innovation to drive economic modernization and connectivity.
              </p>
            </div>
          </div>

          <div className="economic-footer">
            <p>
              <strong>For investment opportunities and partnership inquiries, please contact our economic affairs office.</strong>
            </p>
            <Link to="/contact" className="economic-cta">Get In Touch</Link>
          </div>
        </div>
      </section>

      {/* Carousel Section */}

      <section className="carousel-section">
        <h2>Highlights</h2>
        <div className="carousel">
          {currentIndex > 0 && (
            <button className="carousel-arrow left-arrow" onClick={goToPrevious}>
              &lt;
            </button>
          )}
          <div className="carousel-wrapper">
            <div className="carousel-images">
              {carouselItems.slice(currentIndex, currentIndex + 3).map((item, index) => (
                <div key={index} className="carousel-item">
                  <Link to={item.link}>
                    <img src={item.src} alt={item.title} />
                    <p className="carousel-title">{item.title}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {currentIndex + 3 < carouselItems.length && (
            <button className="carousel-arrow right-arrow" onClick={goToNext}>
              &gt;
            </button>
          )}
        </div>
      </section>

  
      {/* Tourism Section */}
      <section className="tourism-section">
        <h2> The world-famous Dzanga Bai</h2>
        <div className="tourism-videos">
          <video className="video-item" controls src={dzanga}>
            Your browser does not support the video tag.
          </video>

          <video className="video-item" controls src={dzanga3}>
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </div>
  );
};

export default Home;
