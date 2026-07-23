import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/core/i18n';
import './offre.css';

gsap.registerPlugin(ScrollTrigger);

export default function Offre() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftImageRef = useRef<HTMLImageElement | null>(null);
  const rightImageRef = useRef<HTMLImageElement | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!sectionRef.current || !leftImageRef.current || !rightImageRef.current) return;


    const tlLeft = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    tlLeft
      .fromTo(
        leftImageRef.current,
        { rotation: 33.25 },
        { rotation: 0, ease: 'power2.inOut', duration: 0.5 }
      )
      .to(leftImageRef.current, {
        rotation: -33.25,
        ease: 'power2.inOut',
        duration: 0.5,
      });

    const tlRight = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    tlRight
      .fromTo(
        rightImageRef.current,
        { rotation: -22.74 },
        { rotation: 0, ease: 'power2.inOut', duration: 0.5 }
      )
      .to(rightImageRef.current, {
        rotation: 22.74,
        ease: 'power2.inOut',
        duration: 0.5,
      });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="offre-section">
      <div className="offre-container">
        <div className="offre-image-left">
          <img 
            ref={leftImageRef}
            src="/assets/offre/im1.png" 
            alt="Offre Image 1" 
          />
        </div>
        <div className="offre-content">
          <h2>{t('sections.specialOffer')}</h2>
          <p>{t('sections.sale')}</p>
          <button className="offre-button">{t('sections.learnMore')}</button>
        </div>
        <div className="offre-image-right">
          <img 
            ref={rightImageRef}
            src="/assets/offre/im2.png" 
            alt="Offre Image 2" 
          />
        </div>
      </div>
    </section>
  );
}
