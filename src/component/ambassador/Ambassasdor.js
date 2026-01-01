// Ambassasdor.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ambassade.css';

import photo from '../../assets/sema.jpg';
import carousel1 from '../../assets/photo1.jpg';
import carousel2 from '../../assets/photo2.jpg';
import carousel3 from '../../assets/photo3.jpg';
import carousel4 from '../../assets/photo4.jpg';
import carousel5 from '../../assets/photo5.jpg';
import dzanga from '../../assets/Dzanga.mp4';

export default function Ambassador() {
  const carouselItems = [
    { src: carousel1, title: 'Highlight 1', link: '/highlights/1' },
    { src: carousel2, title: 'Highlight 2', link: '/highlights/2' },
    { src: carousel3, title: 'Highlight 3', link: '/highlights/3' },
    { src: carousel4, title: 'Highlight 4', link: '/highlights/4' },
    { src: carousel5, title: 'Highlight 5', link: '/highlights/5' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  const goToNext = () => {
    if (currentIndex + 3 < carouselItems.length) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  return (
    <div className="home-container">
      {/* Centered Image Section */}
      <section className="centered-photo">
        <h2>Ambassador</h2>
        <img src={photo} alt="Central view" />
        <p>H.E had the honor to present his credential to H.E President Donald J. Trump during a ceremony held at the White House.</p>
        <p>In a private audience after the ceremony, the Ambassador conveyed greetings from the President and the people of the Central African Republic and committed to fostering and deepening the bilateral relationship between the two countries.</p>
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
            <Link to="/services/birth-certificate">Birth Certificate</Link>
            <Link to="/services/minor-birth-certificate">Minor Child Birth Certificate</Link>
            <Link to="/services/emergency-certificate">Emergency Certificate (Travel Document)</Link>
            <Link to="/services/marriage-certificate">Marriage Certificate</Link>
          </div>
          <div className="service-category">
            <h3>Other Services</h3>
            <Link to="/services/document-authentication">Document Authentication/Legalization</Link>
            <Link to="/services/transport-deceased">Transport of Deceased</Link>
          </div>
          <div className="service-category">
            <h3>Important Links</h3>
            <Link to="/services/passport-appointment">Passport Appointment</Link>
            <Link to="/services/diaspora-organization">Diaspora Organization</Link>
            <Link to="/registration">Registration of Central African Republic Nationals (USA, Mexico, and Canada)</Link>
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
          {currentIndex + 3 < carouselItems.length && (
            <button className="carousel-arrow right-arrow" onClick={goToNext}>
              &gt;
            </button>
          )}
        </div>
      </section>

      {/* Tourism Section */}
      <section className="tourism-section">
        <h2>Tourism</h2>
        <div className="tourism-videos">
          <video className="video-item" controls src={dzanga}>
            Your browser does not support the video tag.
          </video>
          <div className="video-placeholder">Video 2 Placeholder</div>
          <div className="video-placeholder">Video 3 Placeholder</div>
        </div>
      </section>
    </div>
  );
}
