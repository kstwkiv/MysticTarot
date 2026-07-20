import { Component, inject, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  el = inject(ElementRef);

  // Eye tracking
  pupilX = 100; pupilY = 60;
  eyeWinking = false;
  private eyeEl: Element | null = null;

  // Daily card
  drawnCard: any = null;
  cardFlipped = false;

  // Testimonials
  activeTestimonial = 0;
  private testimonialTimer: any;

  // Scroll reveal observer
  private observer: IntersectionObserver | null = null;

  previewCards = [
    { label: 'The Moon',  symbol: '☽', style: '--r:-8deg;top:8%;left:2%;animation-delay:0s;animation-duration:7s;' },
    { label: 'The Tower', symbol: '⚡', style: '--r:6deg;top:55%;left:3%;animation-delay:1.5s;animation-duration:8s;' },
    { label: 'The Star',  symbol: '✦', style: '--r:-5deg;top:5%;right:4%;animation-delay:0.8s;animation-duration:6.5s;' },
    { label: 'The Devil', symbol: '🜏', style: '--r:10deg;bottom:8%;right:2%;animation-delay:2s;animation-duration:9s;' },
  ];

  tickerItems = [
    'The Fool','The Magician','The High Priestess','The Empress','The Emperor',
    'The Hierophant','The Lovers','The Chariot','Strength','The Hermit',
    'Wheel of Fortune','Justice','The Hanged Man','Death','Temperance',
    'The Devil','The Tower','The Star','The Moon','The Sun','Judgement','The World'
  ];

  dailyCards = [
    { name: 'The High Priestess', symbol: '🌙', keyword: 'INTUITION', message: 'You already know. Stop second-guessing yourself and trust the voice you keep dismissing.' },
    { name: 'The Tower', symbol: '⚡', keyword: 'DISRUPTION', message: 'What\'s falling apart was never meant to hold. Let it collapse — what survives is real.' },
    { name: 'The Star', symbol: '✦', keyword: 'HOPE', message: 'After the storm, this card appears. You are being renewed. Let yourself believe in it.' },
    { name: 'The Moon', symbol: '☽', keyword: 'ILLUSION', message: 'Not everything is as it seems right now. Sit with uncertainty instead of forcing clarity.' },
    { name: 'The Lovers', symbol: '♡', keyword: 'CHOICE', message: 'This isn\'t just about romance — it\'s about alignment. Choose what genuinely reflects your values.' },
    { name: 'The Devil', symbol: '🔗', keyword: 'BONDAGE', message: 'The chains are looser than you think. What you believe is trapping you is mostly fear.' },
    { name: 'The World', symbol: '🌍', keyword: 'COMPLETION', message: 'A cycle is closing. Honour how far you\'ve come before rushing into what\'s next.' },
    { name: 'The Hermit', symbol: '🕯', keyword: 'SOLITUDE', message: 'The answer isn\'t out there. Go inward. The light you\'re looking for is your own.' },
    { name: 'Wheel of Fortune', symbol: '☸', keyword: 'CHANGE', message: 'The wheel turns whether you\'re ready or not. Adapt. Flow. Stop fighting the shift.' },
    { name: 'Strength', symbol: '∞', keyword: 'COURAGE', message: 'True strength is calm. You don\'t need to roar — your quiet power is already working.' },
    { name: 'The Empress', symbol: '♀', keyword: 'ABUNDANCE', message: 'You are fertile ground. Whatever you tend to with love and patience will flourish.' },
    { name: 'Death', symbol: '🥀', keyword: 'TRANSFORMATION', message: 'Something is ending so something better can begin. Let go with grace, not grief.' },
  ];

  services = [
    { num: '01', icon: '🤖', title: 'AI Reading',  desc: 'Instant, no-filter AI interpretation. Ask anything. The algorithm doesn\'t sugarcoat.', link: '/ai-reading' },
    { num: '02', icon: '🔮', title: 'Book KS Live', desc: 'One-on-one with KS herself. Real talk, real cards, real answers.',                    link: '/book-reading' },
    { num: '03', icon: '📜', title: 'Your Archive', desc: 'Every reading saved. Track the patterns your conscious mind tries to ignore.',          link: '/dashboard' },
  ];

  spreads = [
    { name: 'One Card', description: 'One card. One truth. Good for when you already know the answer but need someone to say it.', cardCount: 1, positions: [1] },
    { name: 'Past · Present · Future', description: 'Three cards that cut through the noise — where you\'ve been, where you are, where you\'re headed.', cardCount: 3, positions: [1,2,3] },
    { name: 'Celtic Cross', description: 'Ten cards. Full picture. For when the situation is complicated and you need the whole truth.', cardCount: 10, positions: [1,2,3,4,5,6,7,8,9,10] },
  ];

  testimonials = [
    { quote: 'KS told me things about my situation that no one else knew. The AI reading was shockingly accurate — I cried.', name: 'Priya M.', detail: 'Celtic Cross reading', avatar: '🌙' },
    { quote: 'I was skeptical but the three-card spread literally described my week. Bookmarked. Coming back every Monday.', name: 'Aria T.', detail: 'Weekly draws', avatar: '✦' },
    { quote: 'The booking with KS was the most honest conversation I\'ve had about my relationship. No BS, just truth.', name: 'Camille R.', detail: 'Live reading with KS', avatar: '🔮' },
    { quote: 'The Devil card came up and I laughed because it was so on point. This site knows things.', name: 'Zara K.', detail: 'Daily card reader', avatar: '🥀' },
  ];

  ngOnInit() {
    // scroll reveal
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.15 });
    setTimeout(() => {
      this.el.nativeElement.querySelectorAll('.reveal').forEach((el: Element) => this.observer?.observe(el));
    }, 100);

    // auto-rotate testimonials
    this.testimonialTimer = setInterval(() => {
      this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length;
    }, 4000);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    clearInterval(this.testimonialTimer);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.eyeEl) this.eyeEl = this.el.nativeElement.querySelector('.eye-svg');
    if (!this.eyeEl) return;
    const rect = this.eyeEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxR = 8;
    const r = Math.min(dist / 20, maxR);
    const angle = Math.atan2(dy, dx);
    this.pupilX = 100 + r * Math.cos(angle);
    this.pupilY = 60 + r * Math.sin(angle);
  }

  winkEye() {
    this.eyeWinking = true;
    setTimeout(() => this.eyeWinking = false, 600);
  }

  drawCard() {
    const card = this.dailyCards[Math.floor(Math.random() * this.dailyCards.length)];
    this.drawnCard = card;
    this.cardFlipped = false;
    setTimeout(() => this.cardFlipped = true, 100);
  }

  resetCard() { this.drawnCard = null; this.cardFlipped = false; }
}
