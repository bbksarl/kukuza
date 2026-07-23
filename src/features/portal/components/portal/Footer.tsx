import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaTiktok, FaFacebookF } from 'react-icons/fa6';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/core/i18n';
import './footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [footerRef, isVisible] = useScrollAnimation({ threshold: 0.05 });
  const { t } = useLanguage();

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
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
            <h3 className="footer-heading">{t('footer.help')}</h3>
            <p className="footer-text">{t('footer.support')}</p>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">{t('footer.faq')}</h3>
            <ul className="footer-list">
              <li>{t('footer.customerService')}</li>
              <li>{t('footer.contact')}</li>
              <li>{t('footer.giftCards')}</li>
              <li>{t('footer.returns')}</li>
              <li>{t('footer.delivery')}</li>
            </ul>
          </div>
        </div>

        {/* Center Column - Logo & Navigation */}
        <div className={`footer-column footer-center ${isVisible ? 'fade-in-up' : ''}`} style={{ animationDelay: '200ms' }}>
          <div className="footer-logo">
            <img src="/assets/logo.png" alt="KUKUZA Logo" />
          </div>
          <h3 className="footer-about">{t('footer.about')}</h3>
          <ul className="footer-nav">
            <li>{t('footer.fashionShows')}</li>
            <li>{t('footer.artsCulture')}</li>
            <li>{t('footer.decorLifestyle')}</li>
            <li>{t('footer.newArrivals')}</li>
            <li>{t('footer.skincare')}</li>
          </ul>
        </div>

        {/* Right Column - Newsletter */}
        <div className={`footer-column ${isVisible ? 'fade-in-right' : ''}`} style={{ animationDelay: '400ms' }}>
          <div className="footer-newsletter">
            <p className="newsletter-text">{t('footer.newsletter')}</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.email')}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                {t('footer.subscribe')}
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
        <a href="#">{t('footer.terms')}</a>
        <a href="#">{t('footer.privacy')}</a>
        <a href="#">{t('footer.legal')}</a>
      </div>
    </footer>
  );
}
