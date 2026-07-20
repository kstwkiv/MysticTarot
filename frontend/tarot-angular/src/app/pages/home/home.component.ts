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
      <div class="hero-bg-text" aria-hidden="true">TAROT</div>

      <!-- ░░ HERO ░░ -->
      <section class="hero">
        <div class="hero-left">
          <div class="eyebrow">
            <span class="eyebrow-line"></span>
            <span class="eyebrow-text">by KS · witchy.bitchy.baddie</span>
            <span class="eyebrow-line"></span>
          </div>
          <h1 class="hero-title">
            The cards<br>
            <em class="hero-title-accent">don't lie.</em><br>
            Do you dare?
          </h1>
          <p class="hero-sub">
            Raw. Real. Unapologetic readings for the woman who already knows
            something's up — she just needs the cards to confirm it.
          </p>
          <div class="hero-actions">
            @if (authService.isAuthenticated()) {
              <a routerLink="/ai-reading" class="btn-hex">Pull Your Cards</a>
              <a routerLink="/book-reading" class="btn-ghost">Book KS Live</a>
            } @else {
              <a routerLink="/auth/register" class="btn-hex">Start Free</a>
              <a routerLink="/auth/login" class="btn-ghost">Sign In</a>
            }
          </div>
          <div class="hero-receipts">
            <div class="receipt">
              <span class="receipt-n">78</span>
              <span class="receipt-l">cards in the deck</span>
            </div>
            <div class="receipt-sep">⸻</div>
            <div class="receipt">
              <span class="receipt-n">3</span>
              <span class="receipt-l">spread types</span>
            </div>
            <div class="receipt-sep">⸻</div>
            <div class="receipt">
              <span class="receipt-n">∞</span>
              <span class="receipt-l">no-filter truth</span>
            </div>
          </div>
        </div>

        <div class="hero-right" aria-hidden="true">
          <div class="serpent-ring">
            <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="150" cy="150" r="130" stroke="rgba(29,185,84,0.15)" stroke-width="1" stroke-dasharray="6 4"/>
              <circle cx="150" cy="150" r="110" stroke="rgba(255,45,120,0.1)" stroke-width="1" stroke-dasharray="3 6"/>
            </svg>
          </div>
          <div class="eye-sigil">
            <svg class="eye-svg" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="60" rx="95" ry="50" stroke="#ff2d78" stroke-width="1.5" opacity="0.6"/>
              <ellipse cx="100" cy="60" rx="70" ry="38" stroke="#1db954" stroke-width="1" opacity="0.4"/>
              <circle cx="100" cy="60" r="28" fill="none" stroke="#ff2d78" stroke-width="1.5"/>
              <circle cx="100" cy="60" r="16" fill="rgba(255,45,120,0.15)" stroke="#ff2d78" stroke-width="1"/>
              <circle cx="100" cy="60" r="6" fill="#ff2d78"/>
              <circle cx="93" cy="54" r="3" fill="rgba(255,255,255,0.7)"/>
              <line x1="5" y1="60" x2="30" y2="60" stroke="#ff2d78" stroke-width="1" opacity="0.5"/>
              <line x1="170" y1="60" x2="195" y2="60" stroke="#ff2d78" stroke-width="1" opacity="0.5"/>
              <line x1="20" y1="35" x2="40" y2="48" stroke="#ff2d78" stroke-width="0.75" opacity="0.4"/>
              <line x1="20" y1="85" x2="40" y2="72" stroke="#ff2d78" stroke-width="0.75" opacity="0.4"/>
              <line x1="180" y1="35" x2="160" y2="48" stroke="#ff2d78" stroke-width="0.75" opacity="0.4"/>
              <line x1="180" y1="85" x2="160" y2="72" stroke="#ff2d78" stroke-width="0.75" opacity="0.4"/>
            </svg>
          </div>
          @for (card of previewCards; track card.label) {
            <div class="float-card" [style]="card.style">
              <div class="float-card-back">
                <span class="float-card-sym">{{ card.symbol }}</span>
                <span class="float-card-name">{{ card.label }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- ░░ SERVICES ░░ -->
      <section class="services">
        <div class="services-tag">What we do</div>
        <div class="services-grid">
          @for (s of services; track s.title) {
            <a [routerLink]="s.link" class="service-tile">
              <div class="service-num">{{ s.num }}</div>
              <div class="service-icon">{{ s.icon }}</div>
              <h3 class="service-title">{{ s.title }}</h3>
              <p class="service-desc">{{ s.desc }}</p>
              <span class="service-arrow">→</span>
            </a>
          }
        </div>
      </section>

      <!-- ░░ SPREADS ░░ -->
      <section class="spreads">
        <div class="spreads-header">
          <div class="spreads-label">The spreads</div>
          <h2 class="spreads-title">Pick your<br><span class="pink-text">poison</span></h2>
        </div>
        <div class="spreads-row">
          @for (sp of spreads; track sp.name) {
            <div class="spread-item">
              <div class="spread-slots">
                @for (p of sp.positions; track p) {
                  <div class="spread-slot"></div>
                }
              </div>
              <div class="spread-info">
                <span class="spread-count-badge">{{ sp.cardCount }}-card</span>
                <h3 class="spread-name">{{ sp.name }}</h3>
                <p class="spread-desc">{{ sp.description }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- ░░ MANIFESTO ░░ -->
      <section class="manifesto">
        <div class="manifesto-inner">
          <p class="manifesto-text">
            No sugarcoating. No vague vibes. Just you, the cards, and the truth you've
            been avoiding. <em>We go there.</em>
          </p>
          @if (!authService.isAuthenticated()) {
            <a routerLink="/auth/register" class="btn-hex manifesto-btn">I'm ready — let's go</a>
          } @else {
            <a routerLink="/ai-reading" class="btn-hex manifesto-btn">Pull your cards now</a>
          }
        </div>
        <div class="manifesto-deco" aria-hidden="true">𖤐</div>
      </section>

    </div>
  `,
  styles: [`
    .home-page { min-height: 100vh; background: #050505; color: #f5f0eb; }

    .hero-bg-text {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      font-family: 'Cinzel', serif; font-size: clamp(8rem, 20vw, 22rem); font-weight: 900;
      color: transparent; -webkit-text-stroke: 1px rgba(255, 45, 120, 0.06);
      letter-spacing: 0.05em; pointer-events: none; user-select: none; white-space: nowrap; z-index: 0;
    }

    .hero {
      position: relative; z-index: 1; min-height: calc(100vh - 70px);
      display: grid; grid-template-columns: 55% 45%; align-items: center;
      padding: 5rem 4rem 5rem 6rem; overflow: hidden; gap: 2rem;
      @media (max-width: 900px) { grid-template-columns: 1fr; padding: 3rem 1.5rem; }
    }

    .eyebrow { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
    .eyebrow-line { flex: 0 0 40px; height: 1px; background: #ff2d78; }
    .eyebrow-text {
      font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
      color: #ff2d78; font-family: 'Raleway', sans-serif; font-weight: 700;
    }

    .hero-title {
      font-family: 'Cinzel', serif; font-size: clamp(3rem, 6vw, 5.5rem); font-weight: 900;
      color: #f5f0eb; line-height: 1.05; margin-bottom: 1.5rem; letter-spacing: -0.01em;
    }
    .hero-title-accent { font-style: italic; color: #1db954; -webkit-text-stroke: 1px #1db954; }
    .hero-sub {
      font-size: 1.05rem; color: rgba(245,240,235,0.55); line-height: 1.85;
      max-width: 460px; margin-bottom: 2.5rem; font-weight: 300;
    }

    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem; }

    .btn-hex {
      display: inline-block; background: #ff2d78; color: #fff;
      font-family: 'Cinzel', serif; font-size: 0.8rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase; padding: 0.9rem 2.2rem; border: none;
      clip-path: polygon(8px 0%,calc(100% - 8px) 0%,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0% calc(100% - 8px),0% 8px);
      cursor: pointer; text-decoration: none; transition: all 0.3s ease;
      &:hover { background: #ff5599; box-shadow: 0 0 40px rgba(255,45,120,0.5); transform: translateY(-2px); color: #fff; }
    }

    .btn-ghost {
      display: inline-block; background: transparent; color: #f5f0eb;
      font-family: 'Cinzel', serif; font-size: 0.8rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase; padding: 0.9rem 2.2rem;
      border: 1px solid rgba(245,240,235,0.25); cursor: pointer; text-decoration: none; transition: all 0.3s ease;
      &:hover { border-color: #1db954; color: #1db954; box-shadow: 0 0 20px rgba(29,185,84,0.2); }
    }

    .hero-receipts { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
    .receipt { display: flex; flex-direction: column; }
    .receipt-n { font-family: 'Cinzel', serif; font-size: 2rem; font-weight: 900; color: #f5f0eb; line-height: 1; }
    .receipt-l { font-size: 0.68rem; color: rgba(245,240,235,0.4); letter-spacing: 0.1em; text-transform: uppercase; }
    .receipt-sep { color: rgba(255,45,120,0.4); font-size: 0.7rem; }

    .hero-right {
      position: relative; height: 520px; display: flex; align-items: center; justify-content: center;
      @media (max-width: 900px) { display: none; }
    }

    .eye-sigil { position: relative; z-index: 2; }
    .eye-svg { width: 320px; height: auto; filter: drop-shadow(0 0 30px rgba(255,45,120,0.4)); animation: pulse-eye 4s ease-in-out infinite; }
    @keyframes pulse-eye {
      0%, 100% { filter: drop-shadow(0 0 20px rgba(255,45,120,0.3)); }
      50%       { filter: drop-shadow(0 0 50px rgba(255,45,120,0.7)); }
    }

    .float-card {
      position: absolute; width: 75px; height: 120px;
      clip-path: polygon(6px 0%,calc(100% - 6px) 0%,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0% calc(100% - 6px),0% 6px);
      background: linear-gradient(160deg,#0e1f0e 0%,#050505 100%); border: 1px solid rgba(29,185,84,0.35);
      animation: card-float 7s ease-in-out infinite;
    }
    .float-card-back { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.5rem; }
    .float-card-sym { font-size: 1.6rem; }
    .float-card-name { font-family: 'Cinzel', serif; font-size: 0.45rem; color: #1db954; text-align: center; letter-spacing: 0.05em; text-transform: uppercase; }
    @keyframes card-float {
      0%, 100% { transform: translateY(0) rotate(var(--r,0deg)); }
      50%       { transform: translateY(-18px) rotate(var(--r,0deg)); }
    }

    .serpent-ring {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      animation: slow-spin 40s linear infinite; z-index: 0;
    }
    .serpent-ring svg { width: 300px; height: 300px; }
    @keyframes slow-spin { to { transform: rotate(360deg); } }

    /* ── SERVICES ── */
    .services { padding: 6rem 6rem; position: relative; z-index: 1; @media (max-width: 900px) { padding: 4rem 1.5rem; } }
    .services-tag {
      font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: #1db954; font-weight: 700;
      margin-bottom: 3rem; display: flex; align-items: center; gap: 0.75rem;
      &::before { content: ''; display: inline-block; width: 30px; height: 1px; background: #1db954; }
    }
    .services-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; border: 1px solid rgba(255,255,255,0.07);
      @media (max-width: 700px) { grid-template-columns: 1fr; }
    }
    .service-tile {
      padding: 2.5rem 2rem; background: #050505; border-right: 1px solid rgba(255,255,255,0.07);
      display: flex; flex-direction: column; gap: 0.75rem; text-decoration: none; transition: background 0.3s ease; position: relative; overflow: hidden;
      &::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #ff2d78; transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
      &:hover { background: rgba(255,45,120,0.04); &::before { transform: scaleX(1); } .service-arrow { transform: translateX(6px); color: #ff2d78; } }
      &:last-child { border-right: none; }
    }
    .service-num { font-family: 'Cinzel', serif; font-size: 0.65rem; color: rgba(245,240,235,0.2); letter-spacing: 0.15em; }
    .service-icon { font-size: 1.75rem; }
    .service-title { font-family: 'Cinzel', serif; font-size: 1.1rem; color: #f5f0eb; font-weight: 700; margin: 0; }
    .service-desc { font-size: 0.875rem; color: rgba(245,240,235,0.45); line-height: 1.75; margin: 0; flex: 1; }
    .service-arrow { font-size: 1rem; color: rgba(245,240,235,0.3); transition: all 0.3s ease; align-self: flex-end; }

    /* ── SPREADS ── */
    .spreads {
      padding: 5rem 6rem; display: grid; grid-template-columns: 280px 1fr; gap: 4rem;
      border-top: 1px solid rgba(255,255,255,0.07); position: relative; z-index: 1;
      @media (max-width: 900px) { grid-template-columns: 1fr; padding: 4rem 1.5rem; gap: 2rem; }
    }
    .spreads-label { font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: #ff2d78; font-weight: 700; margin-bottom: 1rem; }
    .spreads-title { font-family: 'Cinzel', serif; font-size: 2.5rem; font-weight: 900; color: #f5f0eb; line-height: 1.15; margin: 0; }
    .pink-text { color: #ff2d78; }
    .spreads-row { display: flex; flex-direction: column; }
    .spread-item {
      display: grid; grid-template-columns: 140px 1fr; gap: 2rem; align-items: center;
      padding: 2rem 0; border-bottom: 1px solid rgba(255,255,255,0.07); transition: background 0.2s ease;
      &:hover { background: rgba(255,45,120,0.03); }
      &:first-child { border-top: 1px solid rgba(255,255,255,0.07); }
      @media (max-width: 600px) { grid-template-columns: 1fr; gap: 1rem; }
    }
    .spread-slots { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; }
    .spread-slot {
      width: 22px; height: 36px; background: rgba(29,185,84,0.08); border: 1px solid rgba(29,185,84,0.3);
      clip-path: polygon(4px 0%,calc(100% - 4px) 0%,100% 4px,100% calc(100% - 4px),calc(100% - 4px) 100%,4px 100%,0% calc(100% - 4px),0% 4px);
    }
    .spread-info { display: flex; flex-direction: column; gap: 0.5rem; }
    .spread-count-badge { font-size: 0.65rem; font-family: 'Cinzel', serif; letter-spacing: 0.15em; color: #1db954; text-transform: uppercase; }
    .spread-name { font-family: 'Cinzel', serif; font-size: 1.15rem; color: #f5f0eb; font-weight: 700; margin: 0; }
    .spread-desc { font-size: 0.875rem; color: rgba(245,240,235,0.45); line-height: 1.7; margin: 0; }

    /* ── MANIFESTO ── */
    .manifesto {
      position: relative; z-index: 1; padding: 7rem 6rem; background: #0a0a0a;
      border-top: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center;
      justify-content: space-between; gap: 3rem; overflow: hidden;
      @media (max-width: 900px) { flex-direction: column; padding: 4rem 1.5rem; text-align: center; }
    }
    .manifesto-inner { max-width: 680px; display: flex; flex-direction: column; gap: 2.5rem; }
    .manifesto-text {
      font-family: 'Cinzel', serif; font-size: clamp(1.25rem, 2.5vw, 2rem); color: #f5f0eb;
      line-height: 1.6; font-weight: 400; margin: 0;
      em { font-style: italic; color: #ff2d78; }
    }
    .manifesto-btn { align-self: flex-start; }
    .manifesto-deco { font-size: clamp(5rem,12vw,10rem); color: rgba(255,45,120,0.07); font-family: serif; user-select: none; pointer-events: none; flex-shrink: 0; }
  `]
})
export class HomeComponent {
  authService = inject(AuthService);

  previewCards = [
    { label: 'The Moon',  symbol: '☽', style: '--r:-8deg;top:8%;left:2%;animation-delay:0s;animation-duration:7s;' },
    { label: 'The Tower', symbol: '⚡', style: '--r:6deg;top:55%;left:3%;animation-delay:1.5s;animation-duration:8s;' },
    { label: 'The Star',  symbol: '✦', style: '--r:-5deg;top:5%;right:4%;animation-delay:0.8s;animation-duration:6.5s;' },
    { label: 'The Devil', symbol: '🜏', style: '--r:10deg;bottom:8%;right:2%;animation-delay:2s;animation-duration:9s;' },
  ];

  services = [
    { num: '01', icon: '🤖', title: 'AI Reading',   desc: 'Instant, no-filter AI interpretation. Ask anything. The algorithm doesn\'t sugarcoat.', link: '/ai-reading' },
    { num: '02', icon: '🔮', title: 'Book KS Live',  desc: 'One-on-one with KS herself. Real talk, real cards, real answers.',                    link: '/book-reading' },
    { num: '03', icon: '📜', title: 'Your Archive',  desc: 'Every reading saved. Track the patterns your conscious mind tries to ignore.',          link: '/dashboard' },
  ];

  spreads = [
    { name: 'One Card',               description: 'One card. One truth. Good for when you already know the answer but need someone to say it.',                                                                          cardCount: 1,  positions: [1] },
    { name: 'Past · Present · Future', description: 'Three cards that cut through the noise and show you exactly where things went, where they are, and where they\'re headed.',                                           cardCount: 3,  positions: [1,2,3] },
    { name: 'Celtic Cross',            description: 'Ten cards. Full picture. For when the situation is complicated and you need the whole truth, not the highlights.',                                                    cardCount: 10, positions: [1,2,3,4,5,6,7,8,9,10] },
  ];
}
