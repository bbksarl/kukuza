import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaTiktok, FaFacebookF } from 'react-icons/fa6';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [footerRef, isVisible] = useScrollAnimation({ threshold: 0.05 });

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer 
      ref={footerRef}
      className={`bg-footer-bg text-white pt-[60px] ${isVisible ? 'fade-in' : ''}`}
    >
      <div className="max-w-[1400px] mx-auto px-10 pb-[60px] grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] gap-[60px] items-start">
        {/* Left Column - Aide & FAQ */}
        <div className={`flex flex-col gap-[36px] pt-0 md:pt-[150px] md:items-start items-center text-center md:text-left ${isVisible ? 'fade-in-left' : ''}`}>
          <div className="mb-5">
            <h3 className="text-lg font-bold mb-4 text-white tracking-wide">
              Aide
            </h3>
            <p className="text-sm leading-relaxed text-white opacity-90">
              Service client disponible 7j/7, au +221 772873827,
              ou par Whatsapp
            </p>
          </div>
          <div className="mb-5">
            <h3 className="text-lg font-bold mb-4 text-white tracking-wide">
              FAQ
            </h3>
            <ul className="list-none p-0 m-0">
              <li className="text-[0.9375rem] leading-[1.9] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100">
                Service client
              </li>
              <li className="text-[0.9375rem] leading-[1.9] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100">
                Nous contacter
              </li>
              <li className="text-[0.9375rem] leading-[1.9] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100">
                Cartes cadeaux et avoirs en magasin
              </li>
              <li className="text-[0.9375rem] leading-[1.9] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100">
                Retours
              </li>
              <li className="text-[0.9375rem] leading-[1.9] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100">
                Livraison
              </li>
            </ul>
          </div>
        </div>

        {/* Center Column - Logo & Navigation */}
        <div 
          className={`flex flex-col gap-[36px] items-center text-center order-first md:order-none ${isVisible ? 'fade-in-up' : ''}`}
          style={{ animationDelay: '200ms' }}
        >
          <div className="mb-[30px]">
            <img 
              src="/assets/logo.png" 
              alt="KUKUZA Logo" 
              className="h-[120px] md:h-[120px] sm:h-[90px] xs:h-20 w-auto brightness-0 invert"
            />
          </div>
          <h3 className="text-lg font-semibold mb-6 text-white tracking-wide">
            A Propos De KUKUZA
          </h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-[10px] items-center">
            <li className="text-[0.9375rem] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100 flex items-center gap-2 text-left before:content-['•'] before:text-white before:text-xl before:leading-none before:flex-shrink-0">
              Défilés
            </li>
            <li className="text-[0.9375rem] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100 flex items-center gap-2 text-left before:content-['•'] before:text-white before:text-xl before:leading-none before:flex-shrink-0">
              Arts & Culture
            </li>
            <li className="text-[0.9375rem] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100 flex items-center gap-2 text-left before:content-['•'] before:text-white before:text-xl before:leading-none before:flex-shrink-0">
              Décor et Lifestyke
            </li>
            <li className="text-[0.9375rem] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100 flex items-center gap-2 text-left before:content-['•'] before:text-white before:text-xl before:leading-none before:flex-shrink-0">
              Nouveautés
            </li>
            <li className="text-[0.9375rem] text-white opacity-95 cursor-pointer transition-opacity duration-200 hover:opacity-100 flex items-center gap-2 text-left before:content-['•'] before:text-white before:text-xl before:leading-none before:flex-shrink-0">
              SkinCare
            </li>
          </ul>
        </div>

        {/* Right Column - Newsletter */}
        <div 
          className={`flex flex-col gap-[36px] pt-0 md:pt-[150px] md:items-start items-center text-center md:text-left ${isVisible ? 'fade-in-right' : ''}`}
          style={{ animationDelay: '400ms' }}
        >
          <div className="flex flex-col gap-5">
            <p className="text-[0.9375rem] leading-[1.7] text-white opacity-95">
              Inscrivez-vous à notre newsletter et restez informé(e)
              des nouvelles collections, des idées de tenues, des
              soldes et bien plus encore.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="py-[14px] px-4 border-2 border-white/30 rounded-lg bg-transparent text-white text-[0.95rem] outline-none transition-colors duration-200 placeholder:text-white/60 focus:border-white/60"
                required
              />
              <button 
                type="submit" 
                className="py-[14px] px-6 bg-white text-footer-bg border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-[#f0f0f0] hover:-translate-y-0.5"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section - Contact & Social */}
      <div className="border-t border-white/20 py-[30px]">
        <div className="max-w-[1400px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-7">
          <div className="flex flex-col md:flex-row gap-10 md:gap-10 items-center w-full md:w-auto">
            <a 
              href="tel:+33637783872" 
              className="flex items-center gap-[10px] text-white no-underline text-[0.95rem] transition-opacity duration-200 hover:opacity-80"
            >
              <Phone size={20} />
              <span>+33 637783872</span>
            </a>
            <a 
              href="mailto:contact@kukuza.com" 
              className="flex items-center gap-[10px] text-white no-underline text-[0.95rem] transition-opacity duration-200 hover:opacity-80"
            >
              <Mail size={20} />
              <span>contact@kukuza.com</span>
            </a>
          </div>

          <div className="flex gap-7">
            <a 
              href="#" 
              aria-label="Instagram" 
              className="text-white transition-all duration-200 flex items-center justify-center text-[28px] hover:opacity-80 hover:-translate-y-0.5"
            >
              <FaInstagram size={28} />
            </a>
            <a 
              href="#" 
              aria-label="X (Twitter)" 
              className="text-white transition-all duration-200 flex items-center justify-center text-[28px] hover:opacity-80 hover:-translate-y-0.5"
            >
              <FaXTwitter size={28} />
            </a>
            <a 
              href="#" 
              aria-label="TikTok" 
              className="text-white transition-all duration-200 flex items-center justify-center text-[28px] hover:opacity-80 hover:-translate-y-0.5"
            >
              <FaTiktok size={28} />
            </a>
            <a 
              href="#" 
              aria-label="Facebook" 
              className="text-white transition-all duration-200 flex items-center justify-center text-[28px] hover:opacity-80 hover:-translate-y-0.5"
            >
              <FaFacebookF size={28} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-white/20 py-5 text-center flex justify-center gap-[30px] flex-wrap">
        <a 
          href="#" 
          className="text-white no-underline text-sm opacity-90 transition-opacity duration-200 hover:opacity-100"
        >
          Conditions d'utilisation
        </a>
        <a 
          href="#" 
          className="text-white no-underline text-sm opacity-90 transition-opacity duration-200 hover:opacity-100"
        >
          Politique de confidentialité
        </a>
        <a 
          href="#" 
          className="text-white no-underline text-sm opacity-90 transition-opacity duration-200 hover:opacity-100"
        >
          Mentions légales
        </a>
      </div>
    </footer>
  );
}