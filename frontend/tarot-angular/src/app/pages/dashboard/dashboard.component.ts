import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { ReadingService } from '../../core/services/reading.service';
import { Booking } from '../../core/models/booking.model';
import { Reading } from '../../core/models/reading.model';
import { TarotCard } from '../../core/models/tarot-card.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-page page-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="welcome-section">
          <div class="welcome-symbol">☽</div>
          <div>
            <h1 class="dashboard-title">
              Welcome, {{ authService.currentUser()?.firstName }}
            </h1>
            <p class="dashboard-subtitle">Your mystical journey continues...</p>
          </div>
        </div>

        <div class="quick-actions">
          <a routerLink="/ai-reading" class="btn-mystic">
            ✦ New AI Reading
          </a>
          <a routerLink="/book-reading" class="btn-mystic-outline">
            Book a Reader
          </a>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card mystic-card">
          <div class="stat-icon">🔮</div>
          <div class="stat-value">{{ readings().length }}</div>
          <div class="stat-label">Total Readings</div>
        </div>
        <div class="stat-card mystic-card">
          <div class="stat-icon">📅</div>
          <div class="stat-value">{{ bookings().length }}</div>
          <div class="stat-label">Bookings</div>
        </div>
        <div class="stat-card mystic-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">{{ getActiveBookings() }}</div>
          <div class="stat-label">Upcoming Sessions</div>
        </div>
        <div class="stat-card mystic-card">
          <div class="stat-icon">☽</div>
          <div class="stat-value">{{ getMostDrawnCard() }}</div>
          <div class="stat-label">Frequent Card</div>
        </div>
      </div>

      <!-- Tabs -->
      <mat-tab-group class="dashboard-tabs" animationDuration="300ms">
        <!-- Readings Tab -->
        <mat-tab label="✦ My Readings">
          <div class="tab-content">
            @if (loadingReadings()) {
              <div class="loading-state">
                <div class="mystic-spinner"></div>
                <p>Consulting the cosmic archive...</p>
              </div>
            } @else if (readings().length === 0) {
              <div class="empty-state">
                <div class="empty-icon">🔮</div>
                <h3>No readings yet</h3>
                <p>The cards await your first question</p>
                <a routerLink="/ai-reading" class="btn-mystic">Begin Your First Reading</a>
              </div>
            } @else {
              <div class="readings-grid">
                @for (reading of readings(); track reading.id) {
                  <div class="reading-card mystic-card">
                    <div class="reading-header">
                      <span class="reading-spread">{{ formatSpreadType(reading.spreadType) }}</span>
                      <span class="reading-date">{{ reading.createdAt | date:'MMM d, y' }}</span>
                    </div>
                    @if (reading.question) {
                      <p class="reading-question">"{{ reading.question }}"</p>
                    }
                    <div class="reading-cards-preview">
                      @for (card of getReadingCards(reading); track card.name) {
                        <span class="card-chip" [class.reversed]="card.isReversed">
                          {{ card.name }}{{ card.isReversed ? ' ↓' : '' }}
                        </span>
                      }
                    </div>
                    <p class="reading-interpretation-preview">
                      {{ truncateText(reading.interpretation, 150) }}
                    </p>
                  </div>
                }
              </div>
            }
          </div>
        </mat-tab>

        <!-- Bookings Tab -->
        <mat-tab label="📅 My Bookings">
          <div class="tab-content">
            @if (loadingBookings()) {
              <div class="loading-state">
                <div class="mystic-spinner"></div>
                <p>Retrieving your appointments...</p>
              </div>
            } @else if (bookings().length === 0) {
              <div class="empty-state">
                <div class="empty-icon">📅</div>
                <h3>No bookings yet</h3>
                <p>Schedule a session with one of our gifted readers</p>
                <a routerLink="/book-reading" class="btn-mystic">Book a Reading</a>
              </div>
            } @else {
              <div class="bookings-list">
                @for (booking of bookings(); track booking.id) {
                  <div class="booking-item mystic-card">
                    <div class="booking-status-bar" [class]="'status-' + booking.status.toLowerCase()"></div>
                    <div class="booking-content">
                      <div class="booking-main">
                        <div class="booking-type">
                          {{ booking.readingType === 'HumanReading' ? '🔮 Human Reading' : '🤖 AI Reading' }}
                        </div>
                        <div class="booking-datetime">
                          <mat-icon>schedule</mat-icon>
                          {{ booking.scheduledAt | date:'EEEE, MMMM d, y — h:mm a' }}
                        </div>
                        @if (booking.notes) {
                          <p class="booking-notes">{{ booking.notes }}</p>
                        }
                      </div>
                      <div class="booking-meta">
                        <span class="booking-status-badge" [class]="'badge-' + booking.status.toLowerCase()">
                          {{ booking.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .dashboard-page {
      max-width: 1100px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .welcome-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome-symbol {
      font-size: 2.5rem;
      color: #c9a84c;
      text-shadow: 0 0 20px rgba(201, 168, 76, 0.6);
    }

    .dashboard-title {
      font-family: 'Cinzel', serif;
      font-size: 1.75rem;
      color: #c9a84c;
      margin: 0 0 0.25rem;
    }

    .dashboard-subtitle {
      color: #8b7aa8;
      font-style: italic;
      margin: 0;
    }

    .quick-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      padding: 1.5rem;
      text-align: center;
    }

    .stat-icon {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      font-weight: 700;
      color: #c9a84c;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #8b7aa8;
      letter-spacing: 0.05em;
    }

    /* Tabs */
    .dashboard-tabs {
      ::ng-deep .mat-mdc-tab-header {
        border-bottom: 1px solid rgba(201, 168, 76, 0.2);
      }

      ::ng-deep .mat-mdc-tab-label-container {
        background: transparent;
      }

      ::ng-deep .mdc-tab__text-label {
        color: #8b7aa8;
        font-family: 'Cinzel', serif;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
      }

      ::ng-deep .mdc-tab--active .mdc-tab__text-label {
        color: #c9a84c;
      }

      ::ng-deep .mdc-tab-indicator__content--underline {
        border-color: #c9a84c;
      }

      ::ng-deep .mat-mdc-tab-body-wrapper {
        background: transparent;
      }
    }

    .tab-content {
      padding: 1.5rem 0;
    }

    /* Loading & Empty States */
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      gap: 1rem;
      color: #8b7aa8;
      text-align: center;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .empty-state h3 {
      font-family: 'Cinzel', serif;
      color: #c9a84c;
      font-size: 1.25rem;
    }

    /* Readings */
    .readings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .reading-card {
      padding: 1.5rem;
    }

    .reading-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .reading-spread {
      font-family: 'Cinzel', serif;
      font-size: 0.8rem;
      color: #c9a84c;
      background: rgba(201, 168, 76, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      border: 1px solid rgba(201, 168, 76, 0.3);
    }

    .reading-date {
      font-size: 0.75rem;
      color: #8b7aa8;
    }

    .reading-question {
      font-style: italic;
      color: #f0e6ff;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }

    .reading-cards-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.75rem;
    }

    .card-chip {
      font-size: 0.7rem;
      background: rgba(45, 27, 105, 0.5);
      border: 1px solid rgba(201, 168, 76, 0.2);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      color: #8b7aa8;

      &.reversed {
        color: #ff9a9a;
        border-color: rgba(255, 154, 154, 0.3);
      }
    }

    .reading-interpretation-preview {
      font-size: 0.85rem;
      color: #8b7aa8;
      line-height: 1.6;
      margin: 0;
    }

    /* Bookings */
    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .booking-item {
      display: flex;
      overflow: hidden;
      padding: 0;
    }

    .booking-status-bar {
      width: 4px;
      flex-shrink: 0;

      &.status-pending { background: #f0c040; }
      &.status-confirmed { background: #40c080; }
      &.status-cancelled { background: #c04040; }
      &.status-completed { background: #4080c0; }
    }

    .booking-content {
      flex: 1;
      padding: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .booking-type {
      font-family: 'Cinzel', serif;
      font-size: 0.9rem;
      color: #c9a84c;
      margin-bottom: 0.5rem;
    }

    .booking-datetime {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: #f0e6ff;

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
        color: #8b7aa8;
      }
    }

    .booking-notes {
      font-size: 0.8rem;
      color: #8b7aa8;
      margin: 0.5rem 0 0;
      font-style: italic;
    }

    .booking-status-badge {
      font-family: 'Cinzel', serif;
      font-size: 0.7rem;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      letter-spacing: 0.05em;
      white-space: nowrap;

      &.badge-pending { background: rgba(240, 192, 64, 0.15); color: #f0c040; border: 1px solid rgba(240, 192, 64, 0.3); }
      &.badge-confirmed { background: rgba(64, 192, 128, 0.15); color: #40c080; border: 1px solid rgba(64, 192, 128, 0.3); }
      &.badge-cancelled { background: rgba(192, 64, 64, 0.15); color: #c04040; border: 1px solid rgba(192, 64, 64, 0.3); }
      &.badge-completed { background: rgba(64, 128, 192, 0.15); color: #4080c0; border: 1px solid rgba(64, 128, 192, 0.3); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private readingService = inject(ReadingService);

  readings = signal<Reading[]>([]);
  bookings = signal<Booking[]>([]);
  loadingReadings = signal(true);
  loadingBookings = signal(true);

  ngOnInit(): void {
    this.loadReadings();
    this.loadBookings();
  }

  private loadReadings(): void {
    this.readingService.getMyReadings().subscribe({
      next: (data) => {
        this.readings.set(data);
        this.loadingReadings.set(false);
      },
      error: () => this.loadingReadings.set(false)
    });
  }

  private loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loadingBookings.set(false);
      },
      error: () => this.loadingBookings.set(false)
    });
  }

  getActiveBookings(): number {
    return this.bookings().filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
  }

  getMostDrawnCard(): string {
    const allCards = this.readings().flatMap(r => this.getReadingCards(r));
    if (allCards.length === 0) return '—';
    const counts = allCards.reduce((acc, card) => {
      acc[card.name] = (acc[card.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0].split(' ').slice(-1)[0] : '—';
  }

  getReadingCards(reading: Reading): TarotCard[] {
    try {
      if (typeof reading.cards === 'string') {
        return JSON.parse(reading.cards) as TarotCard[];
      }
      return reading.cards as TarotCard[];
    } catch {
      return [];
    }
  }

  formatSpreadType(type: string): string {
    return { SingleCard: 'Single Card', ThreeCard: 'Three Card', CelticCross: 'Celtic Cross' }[type] ?? type;
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
