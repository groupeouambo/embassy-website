import React from 'react';
import { Link } from 'react-router-dom';
import './NewsPage.css';
import starlinkImage from '../../assets/startlinkrca.jpeg';
import starlink2 from '../../assets/starlink2.jpeg';
import starlink3 from '../../assets/starlink3.jpeg';

export default function StarlinkAnnouncement() {
  return (
    <div className="news-page">
      <div className="news-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>CAR Signs Historic Starlink Agreement</h1>
        <p className="news-date">December 2025</p>
      </div>

      <div className="news-content">
        <div className="news-hero-image">
          <img src={starlinkImage} alt="CAR Starlink Agreement Signing Ceremony" />
        </div>

        <div className="news-intro">
          <p>
            The Central African Republic has taken a decisive step in its digital modernization with the signing
            of the agreement granting a satellite communications operator license to Starlink, authorizing the
            operation of its services throughout the national territory.
          </p>
        </div>

        <section className="news-section">
          <h2>A Strategic Milestone</h2>
          <p>
            This initiative, carried out under the high patronage of the President of the Republic, Head of State,
            Professor Faustin Archange TOUADÉRA, represents a major strategic advancement for the country.
          </p>
          <p>
            This success is also the result of the decisive role played by the Embassy of the Central African
            Republic in Washington DC, whose diplomatic engagement, facilitation of exchanges, and follow-up
            of negotiations largely contributed to the success of this structural project.
          </p>
        </section>

        <section className="news-section">
          <h2>Transforming Connectivity</h2>
          <p>
            This major advancement strengthens national connectivity, promotes digital inclusion, and actively
            contributes to opening up the country, particularly in rural areas and zones that have been difficult
            to access until now.
          </p>
        </section>

        <div className="news-image-grid">
          <img src={starlink2} alt="Starlink Technology" />
          <img src={starlink3} alt="Digital Connectivity" />
        </div>

        <section className="news-section">
          <h2>Key Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>📡 Enhanced Connectivity</h3>
              <p>High-speed internet access across the entire national territory, including remote regions.</p>
            </div>
            <div className="benefit-card">
              <h3>🌍 Digital Inclusion</h3>
              <p>Bridging the digital divide by providing connectivity to underserved communities.</p>
            </div>
            <div className="benefit-card">
              <h3>🏫 Educational Opportunities</h3>
              <p>Enabling online learning and access to global educational resources for students nationwide.</p>
            </div>
            <div className="benefit-card">
              <h3>💼 Economic Development</h3>
              <p>Facilitating e-commerce, remote work, and digital entrepreneurship opportunities.</p>
            </div>
            <div className="benefit-card">
              <h3>🏥 Healthcare Access</h3>
              <p>Supporting telemedicine and remote healthcare services in rural areas.</p>
            </div>
            <div className="benefit-card">
              <h3>🚀 Innovation & Growth</h3>
              <p>Fostering technological innovation and positioning CAR for the digital economy.</p>
            </div>
          </div>
        </section>

        <section className="news-section highlight-section">
          <h2>Embassy's Pivotal Role</h2>
          <p>
            The Embassy of the Central African Republic in Washington DC played a crucial role in this
            achievement through:
          </p>
          <ul>
            <li>Strategic diplomatic engagement with Starlink and U.S. stakeholders</li>
            <li>Facilitation of technical discussions and regulatory coordination</li>
            <li>Continuous follow-up and negotiation support throughout the process</li>
            <li>Advocacy for CAR's digital transformation objectives</li>
          </ul>
        </section>

        <section className="news-section">
          <h2>Looking Forward</h2>
          <p>
            This partnership marks the beginning of a new era for the Central African Republic's digital
            infrastructure. The deployment of Starlink services will accelerate the country's integration into
            the global digital economy and create unprecedented opportunities for citizens, businesses, and
            government services.
          </p>
          <p>
            The government remains committed to ensuring equitable access to these technologies and
            maximizing their impact on national development, education, healthcare, and economic prosperity.
          </p>
        </section>

        <div className="news-footer">
          <p><strong>For more information, please contact the Embassy of the Central African Republic in Washington DC.</strong></p>
          <Link to="/contact" className="contact-btn">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
