import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarotCard } from '../../../core/models/tarot-card.model';

@Component({
  selector: 'app-tarot-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="card-flip-container"
      [class.revealed]="isRevealed()"
      (click)="onCardClick()"
      [style.width]="width"
      [style.height]="height"
    >
      <div class="card-inner" [class.flipped]="isRevealed()">
        <!-- Card Back -->
        <div class="card-face card-back">
          <div class="card-back-design">
            <div class="back-border">
              <div class="back-symbol">✦</div>
              <div class="back-pattern">
                <span>☽</span>
                <span>✦</span>
                <span>☾</span>
              </div>
              <div class="back-text">Mystic Tarot</div>
            </div>
          </div>
        </div>

        <!-- Card Front -->
        <div class="card-face card-front" [class.reversed]="card?.isReversed">
          @if (card) {
            <div class="card-image-area">
              <div class="card-image-placeholder">
                <span class="card-arcana-symbol">{{ getArcanaSymbol() }}</span>
              </div>
            </div>
            <div class="card-info">
              <div class="card-name">{{ card.name }}</div>
              @if (card.isReversed) {
                <div class="card-reversed-badge">Reversed</div>
              }
              @if (showMeaning) {
                <div class="card-meaning">
                  {{ card.isReversed ? card.reversedMeaning : card.uprightMeaning }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-flip-container {
      perspective: 1000px;
      cursor: pointer;
      display: inline-block;
    }

    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
    }

    .card-inner.flipped {
      transform: rotateY(180deg);
    }

    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(201, 168, 76, 0.4);
    }

    .card-back {
      background: linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #1a0533 100%);
    }

    .card-back-design {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }

    .back-border {
      width: 100%;
      height: 100%;
      border: 2px solid rgba(201, 168, 76, 0.5);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(201, 168, 76, 0.03) 10px,
        rgba(201, 168, 76, 0.03) 20px
      );
    }

    .back-symbol {
      font-size: 2rem;
      color: #c9a84c;
      animation: twinkle 3s ease-in-out infinite;
    }

    .back-pattern {
      display: flex;
      gap: 0.5rem;
      color: rgba(201, 168, 76, 0.6);
      font-size: 0.9rem;
    }

    .back-text {
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      color: rgba(201, 168, 76, 0.5);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .card-front {
      background: linear-gradient(180deg, #2d1b69 0%, #1a0533 100%);
      display: flex;
      flex-direction: column;
    }

    .card-front.reversed {
      transform: rotateY(180deg) rotate(180deg);
    }

    .card-image-area {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .card-image-placeholder {
      width: 80%;
      aspect-ratio: 1;
      border-radius: 8px;
      background: rgba(201, 168, 76, 0.05);
      border: 1px solid rgba(201, 168, 76, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-arcana-symbol {
      font-size: 3rem;
      opacity: 0.6;
    }

    .card-info {
      padding: 0.75rem;
      background: rgba(0, 0, 0, 0.3);
      border-top: 1px solid rgba(201, 168, 76, 0.2);
    }

    .card-name {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      color: #c9a84c;
      text-align: center;
      font-weight: 600;
    }

    .card-reversed-badge {
      font-size: 0.6rem;
      color: #ff9a9a;
      text-align: center;
      margin-top: 0.2rem;
      font-style: italic;
    }

    .card-meaning {
      font-size: 0.65rem;
      color: #8b7aa8;
      text-align: center;
      margin-top: 0.4rem;
      line-height: 1.4;
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
    }

    .card-flip-container:hover .card-back {
      box-shadow: 0 0 20px rgba(201, 168, 76, 0.3);
    }
  `]
})
export class TarotCardComponent {
  @Input() card: TarotCard | null = null;
  @Input() width = '140px';
  @Input() height = '240px';
  @Input() showMeaning = false;
  @Input() autoReveal = false;
  @Output() cardRevealed = new EventEmitter<TarotCard>();

  isRevealed = signal(false);

  onCardClick(): void {
    if (!this.isRevealed() && this.card) {
      this.isRevealed.set(true);
      this.cardRevealed.emit(this.card);
    }
  }

  reveal(): void {
    if (this.card) {
      this.isRevealed.set(true);
    }
  }

  reset(): void {
    this.isRevealed.set(false);
  }

  getArcanaSymbol(): string {
    if (!this.card) return '✦';
    if (this.card.arcana === 'Major') return '☽';
    return { Wands: '🔥', Cups: '💧', Swords: '⚔️', Pentacles: '⭐' }[this.card.suit ?? 'Wands'] ?? '✦';
  }
}
