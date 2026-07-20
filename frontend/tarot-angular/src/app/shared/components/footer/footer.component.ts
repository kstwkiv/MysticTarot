import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-inner">

        <!-- Brand -->
        <div class="footer-brand">
          <span class="brand-logo">
            <span class="logo-symbol">☽</span>
            <span class="logo-text">Mystic Tarot</span>
            <span class="logo-symbol">☾</span>
          </span>
          <p class="brand-tagline">Ancient wisdom, modern magic.</p>
        </div>

        <!-- Links -->
        <nav class="footer-nav" aria-label="Footer navigation">
          <a routerLink="/" class="footer-link">Home</a>
          <a routerLink="/ai-reading" class="footer-link">AI Reading</a>
          <a routerLink="/book-reading" class="footer-link">Book a Reading</a>
          <a routerLink="/auth/register" class="footer-link">Get Started</a>
        </nav>

        <!-- Instagram CTA -->
        <div class="footer-social">
          <p class="social-label">Follow the journey ✦</p>
          <a
            href="https://www.instagram.com/witchy.bitchy.baddie/"
            target="_blank"
            rel="noopener noreferrer"
            class="instagram-cta"
            aria-label="Follow witchy.bitchy.baddie on Instagram"
          >
            <svg class="ig-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
            </svg>
            <span>&#64;witchy.bitchy.baddie</span>
          </a>
        </div>

      </div>

      <div class="footer-bottom">
        <span>© {{ year }} Mystic Tarot by KS. All rights reserved.</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: relative;
      z-index: 1;
      background: rgba(15, 10, 30, 0.8);
      border-top: 1px solid rgba(196, 181, 253, 0.12);
      padding: 3rem 2rem 0;
      margin-top: auto;
      backdrop-filter: blur(20px);
    }

    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: start;
      gap: 2rem;
      padding-bottom: 2.5rem;

      @media (max-width: 700px) {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    /* ── Brand ─────────────────────────────────── */
    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      font-weight: 700;
      background: linear-gradient(90deg, #c4b5fd, #7feeff, #f9a8d4);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;

      @media (max-width: 700px) {
        justify-content: center;
      }
    }

    .logo-symbol {
      font-size: 1rem;
      opacity: 0.8;
    }

    .logo-text {
      letter-spacing: 0.05em;
    }

    .brand-tagline {
      font-size: 0.8rem;
      color: rgba(245, 240, 235, 0.4);
      margin: 0;
      font-style: italic;
    }

    /* ── Nav ───────────────────────────────────── */
    .footer-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
    }

    .footer-link {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(245, 240, 235, 0.4);
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: #ff2d78;
      }
    }

    /* ── Social ────────────────────────────────── */
    .footer-social {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.75rem;

      @media (max-width: 700px) {
        align-items: center;
      }
    }

    .social-label {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      color: rgba(245, 240, 235, 0.4);
      margin: 0;
    }

    .instagram-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      border: 1px solid rgba(225, 48, 108, 0.4);
      color: #f5f0eb;
      text-decoration: none;
      font-family: 'Raleway', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      background: rgba(225, 48, 108, 0.05);
      transition: all 0.3s ease;

      &:hover {
        color: #fff;
        border-color: #e1306c;
        background: linear-gradient(135deg, rgba(131, 58, 180, 0.3), rgba(225, 48, 108, 0.3), rgba(253, 88, 33, 0.3));
        box-shadow: 0 0 20px rgba(225, 48, 108, 0.3);
        transform: translateY(-2px);
      }
    }

    .ig-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    /* ── Bottom bar ────────────────────────────── */
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 1rem 0;
      text-align: center;
      font-size: 0.75rem;
      color: rgba(245, 240, 235, 0.25);
      max-width: 1100px;
      margin: 0 auto;
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
