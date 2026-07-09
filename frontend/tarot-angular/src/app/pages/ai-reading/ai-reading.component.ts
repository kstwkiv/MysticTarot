import { Component, inject, signal, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReadingService } from '../../core/services/reading.service';
import { TarotCardComponent } from '../../shared/components/tarot-card/tarot-card.component';
import { SpreadType } from '../../core/models/reading.model';
import { TarotCard } from '../../core/models/tarot-card.model';
import { AiReadingResponse } from '../../core/models/reading.model';

type ReadingStep = 'choose-spread' | 'ask-question' | 'drawing' | 'reveal' | 'interpretation';

@Component({
  selector: 'app-ai-reading',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    TarotCardComponent
  ],
  template: `
    <div class="reading-page page-container">
      <div class="reading-container">

        <!-- Step: Choose Spread -->
        @if (step() === 'choose-spread') {
          <div class="step-section fade-in">
            <div class="step-header">
              <div class="step-symbol">✦</div>
              <h1 class="step-title">Choose Your Spread</h1>
              <p class="step-subtitle">Select the spread that resonates with your intention</p>
            </div>

            <div class="spread-options">
              @for (spread of spreadOptions; track spread.type) {
                <div
                  class="spread-option"
                  [class.selected]="selectedSpread() === spread.type"
                  (click)="selectSpread(spread.type)"
                >
                  <div class="spread-visual">
                    @for (pos of spread.positions; track pos) {
                      <div class="spread-slot">✦</div>
                    }
                  </div>
                  <h3 class="spread-option-name">{{ spread.name }}</h3>
                  <p class="spread-option-desc">{{ spread.description }}</p>
                  <div class="spread-card-count">{{ spread.cardCount }} card{{ spread.cardCount > 1 ? 's' : '' }}</div>
                </div>
              }
            </div>

            <button class="btn-mystic next-btn" (click)="goToQuestion()" [disabled]="!selectedSpread()">
              Continue ✦
            </button>
          </div>
        }

        <!-- Step: Ask Question -->
        @if (step() === 'ask-question') {
          <div class="step-section fade-in">
            <div class="step-header">
              <div class="step-symbol">☽</div>
              <h1 class="step-title">Focus Your Intention</h1>
              <p class="step-subtitle">Ask a question, or let the cards speak freely</p>
            </div>

            <div class="question-area">
              <mat-form-field appearance="fill" class="question-field">
                <mat-label>Your question (optional)</mat-label>
                <textarea
                  matInput
                  [(ngModel)]="question"
                  rows="4"
                  placeholder="What guidance do you seek from the universe? Leave empty for an open reading..."
                ></textarea>
              </mat-form-field>

              <div class="question-suggestions">
                <p class="suggestions-label">Suggested questions:</p>
                <div class="suggestions-list">
                  @for (suggestion of questionSuggestions; track suggestion) {
                    <button class="suggestion-chip" (click)="question = suggestion">
                      {{ suggestion }}
                    </button>
                  }
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-mystic-outline" (click)="step.set('choose-spread')">← Back</button>
              <button class="btn-mystic" (click)="performReading()">
                Draw the Cards ✦
              </button>
            </div>
          </div>
        }

        <!-- Step: Drawing (Loading) -->
        @if (step() === 'drawing') {
          <div class="step-section drawing-state fade-in">
            <div class="drawing-animation">
              <div class="drawing-circle">
                <div class="drawing-inner">
                  <span class="drawing-symbol">☽</span>
                </div>
              </div>
              <div class="drawing-particles">
                @for (i of [1,2,3,4,5,6,7,8]; track i) {
                  <div class="draw-particle" [style]="'animation-delay: ' + (i * 0.2) + 's'"></div>
                }
              </div>
            </div>
            <h2 class="drawing-title">The Cards Are Speaking...</h2>
            <p class="drawing-subtitle">The universe is weaving your reading</p>
          </div>
        }

        <!-- Step: Reveal Cards -->
        @if (step() === 'reveal') {
          <div class="step-section fade-in">
            <div class="step-header">
              <div class="step-symbol">🔮</div>
              <h1 class="step-title">Your Cards Have Been Drawn</h1>
              <p class="step-subtitle">Click each card to reveal its wisdom</p>
            </div>

            <div class="cards-spread" [class]="'spread-' + selectedSpread()?.toLowerCase()">
              @for (card of drawnCards(); track card.name; let i = $index) {
                <div class="card-position">
                  <div class="position-label">{{ getPositionLabel(i) }}</div>
                  <app-tarot-card
                    [card]="card"
                    [showMeaning]="true"
                    width="130px"
                    height="220px"
                    (cardRevealed)="onCardRevealed($event)"
                  />
                </div>
              }
            </div>

            <div class="reveal-progress">
              <span class="progress-text">{{ revealedCount() }} / {{ drawnCards().length }} revealed</span>
              <div class="progress-bar">
                <div class="progress-fill" [style.width]="(revealedCount() / drawnCards().length * 100) + '%'"></div>
              </div>
            </div>

            <button
              class="btn-mystic next-btn"
              (click)="step.set('interpretation')"
              [disabled]="revealedCount() < drawnCards().length"
            >
              Receive Your Interpretation ✦
            </button>
          </div>
        }

        <!-- Step: Interpretation -->
        @if (step() === 'interpretation') {
          <div class="step-section fade-in">
            <div class="step-header">
              <div class="step-symbol">✦</div>
              <h1 class="step-title">Your Reading</h1>
              @if (currentReading()?.question) {
                <p class="step-subtitle">"{{ currentReading()?.question }}"</p>
              }
            </div>

            <!-- Cards Summary -->
            <div class="cards-summary">
              @for (card of drawnCards(); track card.name; let i = $index) {
                <div class="summary-card">
                  <div class="summary-position">{{ getPositionLabel(i) }}</div>
                  <div class="summary-card-name" [class.reversed]="card.isReversed">
                    {{ card.name }}{{ card.isReversed ? ' (Reversed)' : '' }}
                  </div>
                </div>
              }
            </div>

            <!-- Interpretation -->
            <div class="interpretation-card mystic-card">
              <div class="interpretation-header">
                <span class="interpretation-icon">☽</span>
                <span class="interpretation-label">The Oracle Speaks</span>
              </div>
              <div class="interpretation-text">
                {{ currentReading()?.interpretation }}
              </div>
            </div>

            <!-- Actions -->
            <div class="interpretation-actions">
              <button class="btn-mystic" (click)="startNewReading()">
                ✦ New Reading
              </button>
              <button class="btn-mystic-outline" (click)="copyInterpretation()">
                Copy Reading
              </button>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .reading-page {
      min-height: calc(100vh - 70px);
    }

    .reading-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Step Header */
    .step-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .step-symbol {
      font-size: 2.5rem;
      color: #c9a84c;
      text-shadow: 0 0 20px rgba(201, 168, 76, 0.6);
      margin-bottom: 0.75rem;
    }

    .step-title {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      color: #c9a84c;
      margin-bottom: 0.5rem;
    }

    .step-subtitle {
      color: #8b7aa8;
      font-size: 1rem;
      font-style: italic;
    }

    /* Spread Options */
    .spread-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .spread-option {
      background: linear-gradient(135deg, rgba(45, 27, 105, 0.4) 0%, rgba(26, 5, 51, 0.6) 100%);
      border: 2px solid rgba(201, 168, 76, 0.2);
      border-radius: 16px;
      padding: 2rem 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(201, 168, 76, 0.5);
        transform: translateY(-4px);
      }

      &.selected {
        border-color: #c9a84c;
        background: linear-gradient(135deg, rgba(201, 168, 76, 0.1) 0%, rgba(45, 27, 105, 0.6) 100%);
        box-shadow: 0 0 30px rgba(201, 168, 76, 0.2);
      }
    }

    .spread-visual {
      display: flex;
      justify-content: center;
      gap: 0.4rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .spread-slot {
      width: 28px;
      height: 46px;
      border: 1px solid rgba(201, 168, 76, 0.4);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.55rem;
      color: rgba(201, 168, 76, 0.6);
      background: rgba(45, 27, 105, 0.3);
    }

    .spread-option-name {
      font-family: 'Cinzel', serif;
      font-size: 1rem;
      color: #c9a84c;
      margin-bottom: 0.5rem;
    }

    .spread-option-desc {
      font-size: 0.8rem;
      color: #8b7aa8;
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }

    .spread-card-count {
      font-family: 'Cinzel', serif;
      font-size: 0.7rem;
      color: rgba(201, 168, 76, 0.6);
      letter-spacing: 0.1em;
    }

    .next-btn {
      display: block;
      margin: 0 auto;
      min-width: 200px;
    }

    /* Question */
    .question-area {
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .question-field {
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .suggestions-label {
      font-size: 0.8rem;
      color: #8b7aa8;
      margin-bottom: 0.75rem;
    }

    .suggestions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .suggestion-chip {
      background: rgba(45, 27, 105, 0.4);
      border: 1px solid rgba(201, 168, 76, 0.2);
      border-radius: 20px;
      padding: 0.35rem 0.85rem;
      font-size: 0.75rem;
      color: #8b7aa8;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: rgba(201, 168, 76, 0.5);
        color: #c9a84c;
        background: rgba(201, 168, 76, 0.05);
      }
    }

    .step-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    /* Drawing Animation */
    .drawing-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 2rem;
    }

    .drawing-animation {
      position: relative;
      width: 200px;
      height: 200px;
    }

    .drawing-circle {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      border: 2px solid rgba(201, 168, 76, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: spin 3s linear infinite;
      background: radial-gradient(circle, rgba(201, 168, 76, 0.05), transparent);
    }

    .drawing-inner {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 1px solid rgba(201, 168, 76, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: spin 2s linear infinite reverse;
    }

    .drawing-symbol {
      font-size: 3rem;
      color: #c9a84c;
      text-shadow: 0 0 20px rgba(201, 168, 76, 0.8);
      animation: none;
    }

    .drawing-particles {
      position: absolute;
      inset: 0;
    }

    .draw-particle {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #c9a84c;
      top: 50%;
      left: 50%;
      animation: orbit 2s linear infinite;
    }

    @keyframes orbit {
      from { transform: rotate(0deg) translateX(90px) rotate(0deg); opacity: 1; }
      to { transform: rotate(360deg) translateX(90px) rotate(-360deg); opacity: 0.3; }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .drawing-title {
      font-family: 'Cinzel', serif;
      font-size: 1.5rem;
      color: #c9a84c;
    }

    .drawing-subtitle {
      color: #8b7aa8;
      font-style: italic;
    }

    /* Cards Spread */
    .cards-spread {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card-position {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .position-label {
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      color: rgba(201, 168, 76, 0.7);
      letter-spacing: 0.1em;
      text-align: center;
      max-width: 130px;
    }

    /* Reveal Progress */
    .reveal-progress {
      max-width: 400px;
      margin: 0 auto 2rem;
      text-align: center;
    }

    .progress-text {
      font-family: 'Cinzel', serif;
      font-size: 0.8rem;
      color: #8b7aa8;
      display: block;
      margin-bottom: 0.5rem;
    }

    .progress-bar {
      height: 4px;
      background: rgba(201, 168, 76, 0.1);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #c9a84c, #e8c96a);
      border-radius: 2px;
      transition: width 0.5s ease;
    }

    /* Cards Summary */
    .cards-summary {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .summary-card {
      background: rgba(45, 27, 105, 0.4);
      border: 1px solid rgba(201, 168, 76, 0.2);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      text-align: center;
    }

    .summary-position {
      font-size: 0.65rem;
      color: #8b7aa8;
      margin-bottom: 0.2rem;
    }

    .summary-card-name {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      color: #c9a84c;

      &.reversed {
        color: #ff9a9a;
      }
    }

    /* Interpretation */
    .interpretation-card {
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .interpretation-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(201, 168, 76, 0.2);
    }

    .interpretation-icon {
      font-size: 1.5rem;
      color: #c9a84c;
    }

    .interpretation-label {
      font-family: 'Cinzel', serif;
      font-size: 0.9rem;
      color: #c9a84c;
      letter-spacing: 0.1em;
    }

    .interpretation-text {
      color: #f0e6ff;
      line-height: 1.9;
      font-size: 0.95rem;
      white-space: pre-wrap;
    }

    .interpretation-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
  `]
})
export class AiReadingComponent {
  private readingService = inject(ReadingService);
  private snackBar = inject(MatSnackBar);

  step = signal<ReadingStep>('choose-spread');
  selectedSpread = signal<SpreadType | null>(null);
  question = '';
  drawnCards = signal<TarotCard[]>([]);
  revealedCount = signal(0);
  currentReading = signal<AiReadingResponse | null>(null);

  spreadOptions = [
    {
      type: 'SingleCard' as SpreadType,
      name: 'Single Card',
      description: 'A focused message for the moment',
      cardCount: 1,
      positions: [1]
    },
    {
      type: 'ThreeCard' as SpreadType,
      name: 'Three Card',
      description: 'Past, Present, and Future revealed',
      cardCount: 3,
      positions: [1, 2, 3]
    },
    {
      type: 'CelticCross' as SpreadType,
      name: 'Celtic Cross',
      description: 'The complete picture of your situation',
      cardCount: 10,
      positions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  ];

  questionSuggestions = [
    'What energy surrounds me right now?',
    'What should I focus on this month?',
    'What is blocking my path forward?',
    'What do I need to release?',
    'What opportunity am I missing?',
    'What does my heart truly desire?'
  ];

  positionLabels: Record<string, string[]> = {
    SingleCard: ['The Message'],
    ThreeCard: ['Past', 'Present', 'Future'],
    CelticCross: [
      'The Present', 'The Challenge', 'The Past', 'The Future',
      'Above', 'Below', 'Advice', 'External', 'Hopes & Fears', 'Outcome'
    ]
  };

  selectSpread(type: SpreadType): void {
    this.selectedSpread.set(type);
  }

  goToQuestion(): void {
    if (this.selectedSpread()) {
      this.step.set('ask-question');
    }
  }

  performReading(): void {
    const spread = this.selectedSpread();
    if (!spread) return;

    this.step.set('drawing');
    this.revealedCount.set(0);

    this.readingService.performAiReading({
      spreadType: spread,
      question: this.question || undefined
    }).subscribe({
      next: (response) => {
        this.currentReading.set(response);
        this.drawnCards.set(response.cards);
        this.step.set('reveal');
      },
      error: () => {
        this.step.set('ask-question');
        this.snackBar.open('The spirits are unavailable. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snack']
        });
      }
    });
  }

  onCardRevealed(card: TarotCard): void {
    this.revealedCount.update(n => n + 1);
  }

  getPositionLabel(index: number): string {
    const spread = this.selectedSpread();
    if (!spread) return `Card ${index + 1}`;
    const labels = this.positionLabels[spread] ?? [];
    return labels[index] ?? `Card ${index + 1}`;
  }

  startNewReading(): void {
    this.step.set('choose-spread');
    this.selectedSpread.set(null);
    this.question = '';
    this.drawnCards.set([]);
    this.revealedCount.set(0);
    this.currentReading.set(null);
  }

  copyInterpretation(): void {
    const text = this.currentReading()?.interpretation ?? '';
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Reading copied to clipboard ✦', 'Close', {
        duration: 2000,
        panelClass: ['success-snack']
      });
    });
  }
}
