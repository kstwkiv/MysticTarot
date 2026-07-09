import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="admin-page page-container">
      <!-- Header -->
      <div class="admin-header">
        <div class="header-left">
          <div class="admin-symbol">⚜</div>
          <div>
            <h1 class="admin-title">Admin Dashboard</h1>
            <p class="admin-subtitle">Manage the mystic realm</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="admin-stats">
        <div class="admin-stat mystic-card">
          <div class="stat-icon">📅</div>
          <div class="stat-value">{{ bookings().length }}</div>
          <div class="stat-label">Total Bookings</div>
        </div>
        <div class="admin-stat mystic-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-value">{{ getPendingCount() }}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="admin-stat mystic-card">
          <div class="stat-icon">✅</div>
          <div class="stat-value">{{ getConfirmedCount() }}</div>
          <div class="stat-label">Confirmed</div>
        </div>
        <div class="admin-stat mystic-card">
          <div class="stat-icon">🔮</div>
          <div class="stat-value">{{ getHumanReadingCount() }}</div>
          <div class="stat-label">Human Readings</div>
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="bookings-section">
        <div class="section-header">
          <h2 class="section-title-sm">All Bookings</h2>
          <button class="btn-mystic-outline refresh-btn" (click)="loadBookings()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>

        @if (isLoading()) {
          <div class="loading-state">
            <div class="mystic-spinner"></div>
            <p>Loading bookings...</p>
          </div>
        } @else if (bookings().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📅</div>
            <p>No bookings found</p>
          </div>
        } @else {
          <!-- Filter Tabs -->
          <mat-tab-group class="filter-tabs" (selectedTabChange)="onTabChange($event)">
            <mat-tab label="All ({{ bookings().length }})"></mat-tab>
            <mat-tab label="Pending ({{ getPendingCount() }})"></mat-tab>
            <mat-tab label="Confirmed ({{ getConfirmedCount() }})"></mat-tab>
            <mat-tab label="Cancelled"></mat-tab>
          </mat-tab-group>

          <div class="bookings-table-wrapper">
            <table class="bookings-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Scheduled</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (booking of filteredBookings(); track booking.id) {
                  <tr class="booking-row">
                    <td>
                      <div class="client-info">
                        <div class="client-name">{{ booking.clientName }}</div>
                        <div class="client-email">{{ booking.clientEmail }}</div>
                      </div>
                    </td>
                    <td>
                      <span class="type-badge">
                        {{ booking.readingType === 'HumanReading' ? '🔮 Human' : '🤖 AI' }}
                      </span>
                    </td>
                    <td>
                      <div class="scheduled-date">
                        {{ booking.scheduledAt | date:'MMM d, y' }}
                      </div>
                      <div class="scheduled-time">
                        {{ booking.scheduledAt | date:'h:mm a' }}
                      </div>
                    </td>
                    <td>
                      <span class="status-badge" [class]="'badge-' + booking.status.toLowerCase()">
                        {{ booking.status }}
                      </span>
                    </td>
                    <td>
                      <span class="notes-text">{{ booking.notes || '—' }}</span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        @if (booking.status === 'Pending') {
                          <button
                            class="action-btn confirm-btn"
                            (click)="confirmBooking(booking)"
                            [disabled]="processingId() === booking.id"
                            title="Confirm booking"
                          >
                            <mat-icon>check_circle</mat-icon>
                          </button>
                        }
                        @if (booking.status !== 'Cancelled' && booking.status !== 'Completed') {
                          <button
                            class="action-btn cancel-btn"
                            (click)="cancelBooking(booking)"
                            [disabled]="processingId() === booking.id"
                            title="Cancel booking"
                          >
                            <mat-icon>cancel</mat-icon>
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      max-width: 1200px;
      margin: 0 auto;
    }

    .admin-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .admin-symbol {
      font-size: 2.5rem;
      color: #c9a84c;
      text-shadow: 0 0 20px rgba(201, 168, 76, 0.6);
    }

    .admin-title {
      font-family: 'Cinzel', serif;
      font-size: 1.75rem;
      color: #c9a84c;
      margin: 0 0 0.25rem;
    }

    .admin-subtitle {
      color: #8b7aa8;
      font-style: italic;
      margin: 0;
    }

    /* Stats */
    .admin-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .admin-stat {
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
    }

    /* Bookings Section */
    .bookings-section {
      background: rgba(45, 27, 105, 0.2);
      border: 1px solid rgba(201, 168, 76, 0.15);
      border-radius: 16px;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(201, 168, 76, 0.15);
    }

    .section-title-sm {
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      color: #c9a84c;
      margin: 0;
    }

    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      padding: 0.4rem 0.9rem;
    }

    /* Loading & Empty */
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1rem;
      color: #8b7aa8;
    }

    .empty-icon {
      font-size: 2.5rem;
    }

    /* Filter Tabs */
    .filter-tabs {
      ::ng-deep .mat-mdc-tab-header {
        background: rgba(13, 2, 33, 0.3);
        border-bottom: 1px solid rgba(201, 168, 76, 0.1);
      }

      ::ng-deep .mdc-tab__text-label {
        color: #8b7aa8;
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
      }

      ::ng-deep .mdc-tab--active .mdc-tab__text-label {
        color: #c9a84c;
      }

      ::ng-deep .mdc-tab-indicator__content--underline {
        border-color: #c9a84c;
      }

      ::ng-deep .mat-mdc-tab-body-wrapper {
        display: none;
      }
    }

    /* Table */
    .bookings-table-wrapper {
      overflow-x: auto;
    }

    .bookings-table {
      width: 100%;
      border-collapse: collapse;

      th {
        font-family: 'Cinzel', serif;
        font-size: 0.7rem;
        color: #8b7aa8;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid rgba(201, 168, 76, 0.1);
        background: rgba(13, 2, 33, 0.3);
      }

      td {
        padding: 0.875rem 1rem;
        border-bottom: 1px solid rgba(201, 168, 76, 0.05);
        vertical-align: middle;
      }
    }

    .booking-row {
      transition: background 0.2s ease;

      &:hover {
        background: rgba(201, 168, 76, 0.03);
      }
    }

    .client-name {
      font-size: 0.9rem;
      color: #f0e6ff;
      font-weight: 500;
    }

    .client-email {
      font-size: 0.75rem;
      color: #8b7aa8;
    }

    .type-badge {
      font-size: 0.8rem;
      color: #f0e6ff;
    }

    .scheduled-date {
      font-size: 0.85rem;
      color: #f0e6ff;
    }

    .scheduled-time {
      font-size: 0.75rem;
      color: #8b7aa8;
    }

    .status-badge {
      font-family: 'Cinzel', serif;
      font-size: 0.7rem;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      letter-spacing: 0.05em;

      &.badge-pending { background: rgba(240, 192, 64, 0.15); color: #f0c040; border: 1px solid rgba(240, 192, 64, 0.3); }
      &.badge-confirmed { background: rgba(64, 192, 128, 0.15); color: #40c080; border: 1px solid rgba(64, 192, 128, 0.3); }
      &.badge-cancelled { background: rgba(192, 64, 64, 0.15); color: #c04040; border: 1px solid rgba(192, 64, 64, 0.3); }
      &.badge-completed { background: rgba(64, 128, 192, 0.15); color: #4080c0; border: 1px solid rgba(64, 128, 192, 0.3); }
    }

    .notes-text {
      font-size: 0.8rem;
      color: #8b7aa8;
      max-width: 200px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .action-buttons {
      display: flex;
      gap: 0.4rem;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      mat-icon {
        font-size: 1.1rem;
        width: 1.1rem;
        height: 1.1rem;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .confirm-btn {
      background: rgba(64, 192, 128, 0.15);
      color: #40c080;
      border: 1px solid rgba(64, 192, 128, 0.3);

      &:hover:not(:disabled) {
        background: rgba(64, 192, 128, 0.3);
      }
    }

    .cancel-btn {
      background: rgba(192, 64, 64, 0.15);
      color: #c04040;
      border: 1px solid rgba(192, 64, 64, 0.3);

      &:hover:not(:disabled) {
        background: rgba(192, 64, 64, 0.3);
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  private bookingService = inject(BookingService);
  private snackBar = inject(MatSnackBar);

  bookings = signal<Booking[]>([]);
  filteredBookings = signal<Booking[]>([]);
  isLoading = signal(true);
  processingId = signal<string | null>(null);
  activeFilter = signal<string>('All');

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading.set(true);
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.applyFilter(this.activeFilter());
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
      }
    });
  }

  onTabChange(event: any): void {
    const filters = ['All', 'Pending', 'Confirmed', 'Cancelled'];
    this.activeFilter.set(filters[event.index] ?? 'All');
    this.applyFilter(this.activeFilter());
  }

  private applyFilter(filter: string): void {
    if (filter === 'All') {
      this.filteredBookings.set(this.bookings());
    } else {
      this.filteredBookings.set(this.bookings().filter(b => b.status === filter));
    }
  }

  confirmBooking(booking: Booking): void {
    this.processingId.set(booking.id);
    this.bookingService.confirmBooking(booking.id).subscribe({
      next: (updated) => {
        this.bookings.update(list => list.map(b => b.id === updated.id ? updated : b));
        this.applyFilter(this.activeFilter());
        this.processingId.set(null);
        this.snackBar.open('✦ Booking confirmed', 'Close', {
          duration: 3000,
          panelClass: ['success-snack']
        });
      },
      error: () => {
        this.processingId.set(null);
        this.snackBar.open('Failed to confirm booking', 'Close', { duration: 3000 });
      }
    });
  }

  cancelBooking(booking: Booking): void {
    this.processingId.set(booking.id);
    this.bookingService.cancelBooking(booking.id).subscribe({
      next: (updated) => {
        this.bookings.update(list => list.map(b => b.id === updated.id ? updated : b));
        this.applyFilter(this.activeFilter());
        this.processingId.set(null);
        this.snackBar.open('Booking cancelled', 'Close', { duration: 3000 });
      },
      error: () => {
        this.processingId.set(null);
        this.snackBar.open('Failed to cancel booking', 'Close', { duration: 3000 });
      }
    });
  }

  getPendingCount(): number {
    return this.bookings().filter(b => b.status === 'Pending').length;
  }

  getConfirmedCount(): number {
    return this.bookings().filter(b => b.status === 'Confirmed').length;
  }

  getHumanReadingCount(): number {
    return this.bookings().filter(b => b.readingType === 'HumanReading').length;
  }
}
