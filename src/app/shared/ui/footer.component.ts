import { Component, inject } from '@angular/core';
import { LanguageService } from '../../core/language.service';
@Component({
  selector: 'k-footer',
  standalone: true,
  template: ` <footer class="footer">
    <div class="footer-container">
      <div class="footer-column">
        <div class="footer-section">
          <h3 class="footer-heading">{{ t('footer.help') }}</h3>
          <p class="footer-text">{{ t('footer.support') }}</p>
        </div>
        <div class="footer-section">
          <h3 class="footer-heading">{{ t('footer.faq') }}</h3>
          <ul class="footer-list">
            @for (key of ['customerService', 'contact', 'giftCards', 'returns', 'delivery']; track key) {
              <li>{{ t('footer.' + key) }}</li>
            }
          </ul>
        </div>
      </div>
      <div class="footer-column footer-center">
        <div class="footer-logo"><img src="/assets/logo-small.webp" alt="KUKUZA Logo" /></div>
        <h3 class="footer-about">{{ t('footer.about') }}</h3>
        <ul class="footer-nav">
          @for (
            key of ['fashionShows', 'artsCulture', 'decorLifestyle', 'newArrivals', 'skincare'];
            track key
          ) {
            <li>{{ t('footer.' + key) }}</li>
          }
        </ul>
      </div>
      <div class="footer-column">
        <div class="footer-newsletter">
          <p class="newsletter-text">{{ t('footer.newsletter') }}</p>
          <form class="newsletter-form" (submit)="$event.preventDefault(); newsletter.reset()" #newsletter>
            <label for="newsletter-email" class="sr-only">{{ t('footer.email') }}</label
            ><input
              id="newsletter-email"
              type="email"
              [placeholder]="t('footer.email')"
              class="newsletter-input"
              required
            /><button type="submit" class="newsletter-button">{{ t('footer.subscribe') }}</button>
          </form>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-container">
        <div class="footer-contact">
          <a href="tel:+33637783872" class="contact-item">+33 637783872</a
          ><a href="mailto:contact@kukuza.com" class="contact-item">contact&#64;kukuza.com</a>
        </div>
        <div class="footer-social">
          @for (name of ['Instagram', 'X (Twitter)', 'TikTok', 'Facebook']; track name) {
            <a href="#" [attr.aria-label]="name" class="social-icon">{{ name.charAt(0) }}</a>
          }
        </div>
      </div>
    </div>
    <div class="footer-links">
      @for (key of ['terms', 'privacy', 'legal']; track key) {
        <a href="#">{{ t('footer.' + key) }}</a>
      }
    </div>
  </footer>`,
})
export class FooterComponent {
  readonly t = inject(LanguageService).t;
}
