import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaTiktok, FaFacebookF } from 'react-icons/fa6';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [footerRef, isVisible] = useScrollAnimation({ threshold: 0.05 });

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer 
      ref={footerRef}
      className={`footer ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="footer-container">
        {/* Left Column - Aide & FAQ */}
        <div className={`footer-column ${isVisible ? 'fade-in-left' : ''}`}>
          <div className="footer-section">
            <h3 className="footer-heading">Aide</h3>
            <p className="footer-text">
              Service client disponible 7j/7, au +221 772873827,
              ou par Whatsapp
            </p>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">FAQ</h3>
            <ul className="footer-list">
              <li>Service client</li>
              <li>Nous contacter</li>
              <li>Cartes cadeaux et avoirs en magasin</li>
              <li>Retours</li>
              <li>Livraison</li>
            </ul>
          </div>
        </div>

        {/* Center Column - Logo & Navigation */}
        <div className={`footer-column footer-center ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '200ms' }}>
          <div className="footer-logo">
            <img src="/assets/logo.png" alt="KUKUZA Logo" />
          </div>
          <h3 className="footer-about">A Propos De KUKUZA</h3>
          <ul className="footer-nav">
            <li>Défilés</li>
            <li>Arts & Culture</li>
            <li>Décor et Lifestyke</li>
            <li>Nouveautés</li>
            <li>SkinCare</li>
          </ul>
        </div>

        {/* Right Column - Newsletter */}
        <div className={`footer-column ${isVisible ? 'fade-in-right' : ''}`} style={{ animationDelay: '400ms' }}>
          <div className="footer-newsletter">
            <p className="newsletter-text">
              Inscrivez-vous à notre newsletter et restez informé(e)
              des nouvelles collections, des idées de tenues, des
              soldes et bien plus encore.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                S'abonner
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section - Contact & Social */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-contact">
            <a href="tel:+33637783872" className="contact-item">
              <Phone size={20} />
              <span>+33 637783872</span>
            </a>
            <a href="mailto:contact@kukuza.com" className="contact-item">
              <Mail size={20} />
              <span>contact@kukuza.com</span>
            </a>
          </div>

          <div className="footer-social">
            <a href="#" aria-label="Instagram" className="social-icon">
              <FaInstagram size={24} />
            </a>
            <a href="#" aria-label="X (Twitter)" className="social-icon">
              <FaXTwitter size={24} />
            </a>
            <a href="#" aria-label="TikTok" className="social-icon">
              <FaTiktok size={24} />
            </a>
            <a href="#" aria-label="Facebook" className="social-icon">
              <FaFacebookF size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="footer-links">
        <a href="#">Conditions d'utilisation</a>
        <a href="#">Politique de confidentialité</a>
        <a href="#">Mentions légales</a>
      </div>
    </footer>
  );
}
