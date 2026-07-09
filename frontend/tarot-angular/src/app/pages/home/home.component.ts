import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-particles">
          @for (i of particles; track i) {
            <div class="particle" [style]="getParticleStyle(i)"></div>
          }
        </div>

        <div class="hero-content">
          <div class="hero-badge">✦ Ancient Wisdom Meets Modern Magic ✦</div>
          <h1 class="hero-title">
            Unveil the Secrets<br>
            <span class="gold-gradient-text">of Your Destiny</span>
          </h1>
          <p class="hero-subtitle">
            Journey through the mystical realm of tarot. Let the cards illuminate your path,
            reveal hidden truths, and guide you toward your highest purpose.
          </p>

          <div class="hero-cta">
            @if (authService.isAuthenticated()) {
              <a routerLink="/ai-reading" class="btn-mystic hero-btn">
                ✦ Begin Your Reading
              </a>
              <a routerLink="/book-reading" class="btn-mystic-outline hero-btn">
                Book a Human Reader
              </a>
            } @else {
              <a routerLink="/auth/register" class="btn-mystic hero-btn">
                ✦ Start Your Journey
              </a>
              <a routerLink="/auth/login" class="btn-mystic-outline hero-btn">
                Sign In
              </a>
            }
          </div>

          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">78</span>
              <span class="stat-label">Sacred Cards</span>
            </div>
            <div class="stat-divider">✦</div>
            <div class="stat">
              <span class="stat-number">3</span>
              <span class="stat-label">Spread Types</span>
            </div>
            <div class="stat-divider">✦</div>
            <div class="stat">
              <span class="stat-number">∞</span>
              <span class="stat-label">Possibilities</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="moon-circle">
            <div class="moon-inner">
              <span class="moon-symbol">☽</span>
            </div>
          </div>
          <div class="floating-cards">
            @for (card of previewCards; track card.label) {
              <div class="preview-card" [style]="card.style">
                <div class="preview-card-inner">
                  <span class="preview-card-symbol">{{ card.symbol }}</span>
                  <span class="preview-card-name">{{ card.label }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="features-container">
          <h2 class="section-title">The Mystic Arts</h2>
          <p class="section-subtitle">Choose your path to enlightenment</p>

          <div class="features-grid">
            @for (feature of features; track feature.title) {
              <div class="feature-card mystic-card">
                <div class="feature-icon">{{ feature.icon }}</div>
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
                <a [routerLink]="feature.link" class="feature-link">
                  {{ feature.cta }} →
                </a>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Spreads Section -->
      <section class="spreads">
        <div class="spreads-container">
          <h2 class="section-title">Sacred Spreads</h2>
          <p class="section-subtitle">Each spread reveals a different dimension of your journey</p>

          <div class="spreads-grid">
            @for (spread of spreads; track spread.name) {
              <div class="spread-card">
                <div class="spread-cards-visual">
                  @for (pos of spread.positions; track pos) {
                    <div class="spread-card-slot">✦</div>
                  }
                </div>
                <h3 class="spread-name">{{ spread.name }}</h3>
                <p class="spread-description">{{ spread.description }}</p>
                <div class="spread-count">{{ spread.cardCount }} cards</div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-container">
          <div class="cta-glow"></div>
          <h2 class="cta-title">The Stars Are Aligned</h2>
          <p class="cta-text">
            The universe has been waiting to speak to you. Your reading awaits.
          </p>
          @if (!authService.isAuthenticated()) {
            <a routerLink="/auth/register" class="btn-mystic cta-btn">
              Begin Your Journey ✦
            </a>
          } @else {
            <a routerLink="/ai-reading" class="btn-mystic cta-btn">
              Draw Your Cards ✦
            </a>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
    }

    /* ── Hero ─────────────────────────────────────────────────────────────── */
    .hero {
      position: relative;
      min-height: calc(100vh - 70px);
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 4rem;
      padding: 4rem 6rem;
      overflow: hidden;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        padding: 3rem 2rem;
        text-align: center;
      }
    }

    .hero-particles {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      border-radius: 50%;
      background: rgba(201, 168, 76, 0.6);
      animation: float-particle linear infinite;
    }

    @keyframes float-particle {
      0% { transform: translateY(100vh) scale(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) scale(1); opacity: 0; }
    }

    .hero-content {
      position: relative;
      z-index: 2;
    }

    .hero-badge {
      display: inline-block;
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      color: #c9a84c;
      background: rgba(201, 168, 76, 0.1);
      border: 1px solid rgba(201, 168, 76, 0.3);
      padding: 0.4rem 1rem;
      border-radius: 20px;
      margin-bottom: 1.5rem;
    }

    .hero-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 900;
      color: #f0e6ff;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: #8b7aa8;
      line-height: 1.8;
      margin-bottom: 2.5rem;
      max-width: 500px;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 3rem;
    }

    .hero-btn {
      font-size: 0.9rem;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-number {
      font-family: 'Cinzel', serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: #c9a84c;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #8b7aa8;
      letter-spacing: 0.05em;
    }

    .stat-divider {
      color: rgba(201, 168, 76, 0.4);
      font-size: 0.75rem;
    }

    /* ── Hero Visual ──────────────────────────────────────────────────────── */
    .hero-visual {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 500px;

      @media (max-width: 900px) {
        display: none;
      }
    }

    .moon-circle {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, rgba(201, 168, 76, 0.15), rgba(45, 27, 105, 0.4));
      border: 1px solid rgba(201, 168, 76, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 6s ease-in-out infinite;
      box-shadow: 0 0 60px rgba(201, 168, 76, 0.15), inset 0 0 60px rgba(201, 168, 76, 0.05);
    }

    .moon-inner {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      border: 1px solid rgba(201, 168, 76, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .moon-symbol {
      font-size: 5rem;
      color: #c9a84c;
      text-shadow: 0 0 30px rgba(201, 168, 76, 0.8);
    }

    .floating-cards {
      position: absolute;
      inset: 0;
    }

    .preview-card {
      position: absolute;
      width: 80px;
      height: 130px;
      border-radius: 8px;
      background: linear-gradient(180deg, #2d1b69 0%, #1a0533 100%);
      border: 1px solid rgba(201, 168, 76, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 6s ease-in-out infinite;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .preview-card-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .preview-card-symbol {
      font-size: 1.5rem;
    }

    .preview-card-name {
      font-family: 'Cinzel', serif;
      font-size: 0.5rem;
      color: #c9a84c;
      text-align: center;
      letter-spacing: 0.05em;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }

    /* ── Features ─────────────────────────────────────────────────────────── */
    .features {
      padding: 6rem 2rem;
      background: rgba(26, 5, 51, 0.3);
    }

    .features-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .section-subtitle {
      text-align: center;
      color: #8b7aa8;
      margin-bottom: 3rem;
      font-size: 1rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      padding: 2rem;
      text-align: center;
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .feature-title {
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      color: #c9a84c;
      margin-bottom: 0.75rem;
    }

    .feature-description {
      color: #8b7aa8;
      font-size: 0.9rem;
      line-height: 1.7;
      margin-bottom: 1.25rem;
    }

    .feature-link {
      color: #c9a84c;
      font-family: 'Cinzel', serif;
      font-size: 0.8rem;
      letter-spacing: 0.05em;
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        text-shadow: 0 0 10px rgba(201, 168, 76, 0.8);
      }
    }

    /* ── Spreads ──────────────────────────────────────────────────────────── */
    .spreads {
      padding: 6rem 2rem;
    }

    .spreads-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .spreads-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }

    .spread-card {
      background: linear-gradient(135deg, rgba(45, 27, 105, 0.4) 0%, rgba(26, 5, 51, 0.6) 100%);
      border: 1px solid rgba(201, 168, 76, 0.2);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(201, 168, 76, 0.5);
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }
    }

    .spread-cards-visual {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .spread-card-slot {
      width: 30px;
      height: 50px;
      border: 1px solid rgba(201, 168, 76, 0.4);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6rem;
      color: rgba(201, 168, 76, 0.6);
      background: rgba(45, 27, 105, 0.3);
    }

    .spread-name {
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      color: #c9a84c;
      margin-bottom: 0.75rem;
    }

    .spread-description {
      color: #8b7aa8;
      font-size: 0.85rem;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .spread-count {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      color: rgba(201, 168, 76, 0.6);
      letter-spacing: 0.1em;
    }

    /* ── CTA ──────────────────────────────────────────────────────────────── */
    .cta-section {
      padding: 6rem 2rem;
      background: rgba(26, 5, 51, 0.5);
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .cta-container {
      position: relative;
      z-index: 1;
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201, 168, 76, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .cta-title {
      font-family: 'Cinzel', serif;
      font-size: 2.5rem;
      color: #c9a84c;
      margin-bottom: 1rem;
    }

    .cta-text {
      color: #8b7aa8;
      font-size: 1.1rem;
      margin-bottom: 2.5rem;
      line-height: 1.7;
    }

    .cta-btn {
      font-size: 1rem;
      padding: 1rem 2.5rem;
    }
  `]
})
export class HomeComponent {
  authService = inject(AuthService);

  particles = Array.from({ length: 20 }, (_, i) => i);

  previewCards = [
    { label: 'The Moon', symbol: '☽', style: 'top: 10%; left: 5%; animation-delay: 0s; animation-duration: 7s;' },
    { label: 'The Star', symbol: '✦', style: 'top: 60%; left: 0%; animation-delay: 1s; animation-duration: 8s;' },
    { label: 'The Sun', symbol: '☀', style: 'top: 15%; right: 5%; animation-delay: 2s; animation-duration: 6s;' },
    { label: 'The World', symbol: '🌍', style: 'bottom: 15%; right: 0%; animation-delay: 0.5s; animation-duration: 9s;' },
  ];

  features = [
    {
      icon: '🤖',
      title: 'AI-Powered Readings',
      description: 'Experience the fusion of ancient tarot wisdom and modern AI. Our mystical interpreter weaves your cards into a deeply personal narrative.',
      link: '/ai-reading',
      cta: 'Get an AI Reading'
    },
    {
      icon: '🔮',
      title: 'Human Readers',
      description: 'Connect with our gifted human tarot readers for a deeply personal, intuitive reading experience that goes beyond algorithms.',
      link: '/book-reading',
      cta: 'Book a Reader'
    },
    {
      icon: '📖',
      title: 'Reading History',
      description: 'Your journey is sacred. Every reading is preserved in your personal archive, allowing you to track patterns and growth over time.',
      link: '/dashboard',
      cta: 'View History'
    }
  ];

  spreads = [
    {
      name: 'Single Card',
      description: 'A focused message from the universe. Perfect for daily guidance or a quick answer to a burning question.',
      cardCount: 1,
      positions: [1]
    },
    {
      name: 'Three Card',
      description: 'Explore the flow of Past, Present, and Future. Understand how your history shapes your current moment and future possibilities.',
      cardCount: 3,
      positions: [1, 2, 3]
    },
    {
      name: 'Celtic Cross',
      description: 'The most comprehensive spread in tarot. Ten cards reveal every dimension of your situation — from hidden influences to the ultimate outcome.',
      cardCount: 10,
      positions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  ];

  getParticleStyle(i: number): string {
    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 15 + 10;
    return `width: ${size}px; height: ${size}px; left: ${left}%; animation-delay: ${delay}s; animation-duration: ${duration}s;`;
  }
}
