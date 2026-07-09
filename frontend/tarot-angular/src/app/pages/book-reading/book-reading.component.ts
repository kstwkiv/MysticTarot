import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-book-reading',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <div class="booking-page page-container">
      <div class="booking-container">

        @if (!bookingSuccess()) {
          <!-- Header -->
          <div class="booking-header">
            <div class="booking-symbol">🔮</div>
            <h1 class="booking-title">Book a Reading</h1>
            <p class="booking-subtitle">Schedule a session with one of our gifted readers</p>
          </div>

          <!-- Reading Type Cards -->
          <div class="reading-type-section">
            <h2 class="section-label">Choose Your Reading Type</h2>
            <div class="reading-types">
              <div
                class="reading-type-card"
                [class.selected]="selectedType() === 'HumanReading'"
                (click)="selectType('HumanReading')"
              >
                <div class="type-icon">🔮</div>
                <h3 class="type-name">Human Reading</h3>
                <p class="type-desc">Connect with an experienced reader for a deeply personal, intuitive session</p>
                <ul class="type-features">
                  <li>✦ Live one-on-one session</li>
                  <li>✦ Deep intuitive insights</li>
                  <li>✦ Q&A included</li>
                </ul>
              </div>

              <div
                class="reading-type-card"
                [class.selected]="selectedType() === 'AiReading'"
                (click)="selectType('AiReading')"
              >
                <div class="type-icon">🤖</div>
                <h3 class="type-name">AI Reading</h3>
                <p class="type-desc">Experience the fusion of ancient wisdom and modern AI for instant guidance</p>
                <ul class="type-features">
                  <li>✦ Instant availability</li>
                  <li>✦ AI-powered interpretation</li>
                  <li>✦ Saved to your history</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Booking Form -->
          <div class="booking-form-card mystic-card">
            <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <mat-form-field appearance="fill">
                  <mat-label>Your Name</mat-label>
                  <input matInput formControlName="clientName" placeholder="Luna Starweaver">
                  <mat-icon matSuffix>person</mat-icon>
                  @if (bookingForm.get('clientName')?.hasError('required') && bookingForm.get('clientName')?.touched) {
                    <mat-error>Name is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="fill">
                  <mat-label>Your Email</mat-label>
                  <input matInput type="email" formControlName="clientEmail" placeholder="your@email.com">
                  <mat-icon matSuffix>email</mat-icon>
                  @if (bookingForm.get('clientEmail')?.hasError('required') && bookingForm.get('clientEmail')?.touched) {
                    <mat-error>Email is required</mat-error>
                  }
                  @if (bookingForm.get('clientEmail')?.hasError('email') && bookingForm.get('clientEmail')?.touched) {
                    <mat-error>Please enter a valid email</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="fill">
                  <mat-label>Preferred Date</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="scheduledDate" [min]="minDate">
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  @if (bookingForm.get('scheduledDate')?.hasError('required') && bookingForm.get('scheduledDate')?.touched) {
                    <mat-error>Please select a date</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="fill">
                  <mat-label>Preferred Time</mat-label>
                  <mat-select formControlName="scheduledTime">
                    @for (time of availableTimes; track time) {
                      <mat-option [value]="time">{{ time }}</mat-option>
                    }
                  </mat-select>
                  @if (bookingForm.get('scheduledTime')?.hasError('required') && bookingForm.get('scheduledTime')?.touched) {
                    <mat-error>Please select a time</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Notes or Questions (optional)</mat-label>
                <textarea
                  matInput
                  formControlName="notes"
                  rows="3"
                  placeholder="Share anything you'd like your reader to know, or specific areas you'd like to explore..."
                ></textarea>
              </mat-form-field>

              @if (errorMessage()) {
                <div class="error-banner">
                  <mat-icon>error_outline</mat-icon>
                  {{ errorMessage() }}
                </div>
              }

              <div class="form-actions">
                <a routerLink="/dashboard" class="btn-mystic-outline">Cancel</a>
                <button
                  type="submit"
                  class="btn-mystic"
                  [disabled]="bookingForm.invalid || isLoading() || !selectedType()"
                >
                  @if (isLoading()) {
                    <span class="mystic-spinner" style="width: 20px; height: 20px; border-width: 2px;"></span>
                  } @else {
                    ✦ Confirm Booking
                  }
                </button>
              </div>
            </form>
          </div>

        } @else {
          <!-- Success State -->
          <div class="success-state fade-in">
            <div class="success-symbol">✦</div>
            <h1 class="success-title">Your Session is Booked</h1>
            <p class="success-subtitle">
              The universe has received your intention. You'll receive a confirmation shortly.
            </p>
            <div class="success-details mystic-card">
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value">{{ selectedType() === 'HumanReading' ? '🔮 Human Reading' : '🤖 AI Reading' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">{{ getFormattedDateTime() }}</span>
              </div>
            </div>
            <div class="success-actions">
              <a routerLink="/dashboard" class="btn-mystic">View My Bookings</a>
              <button class="btn-mystic-outline" (click)="bookAnother()">Book Another</button>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .booking-page {
      min-height: calc(100vh - 70px);
    }

    .booking-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .booking-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .booking-symbol {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    .booking-title {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      color: #c9a84c;
      margin-bottom: 0.5rem;
    }

    .booking-subtitle {
      color: #8b7aa8;
      font-style: italic;
    }

    /* Reading Types */
    .reading-type-section {
      margin-bottom: 2.5rem;
    }

    .section-label {
      font-family: 'Cinzel', serif;
      font-size: 0.9rem;
      color: #8b7aa8;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .reading-types {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .reading-type-card {
      background: linear-gradient(135deg, rgba(45, 27, 105, 0.4) 0%, rgba(26, 5, 51, 0.6) 100%);
      border: 2px solid rgba(201, 168, 76, 0.2);
      border-radius: 16px;
      padding: 1.75rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(201, 168, 76, 0.4);
        transform: translateY(-2px);
      }

      &.selected {
        border-color: #c9a84c;
        background: linear-gradient(135deg, rgba(201, 168, 76, 0.08) 0%, rgba(45, 27, 105, 0.6) 100%);
        box-shadow: 0 0 25px rgba(201, 168, 76, 0.15);
      }
    }

    .type-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .type-name {
      font-family: 'Cinzel', serif;
      font-size: 1rem;
      color: #c9a84c;
      margin-bottom: 0.5rem;
    }

    .type-desc {
      font-size: 0.85rem;
      color: #8b7aa8;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .type-features {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        font-size: 0.8rem;
        color: #8b7aa8;
        padding: 0.2rem 0;
      }
    }

    /* Form */
    .booking-form-card {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 0.75rem;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .full-width {
      width: 100%;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 80, 80, 0.1);
      border: 1px solid rgba(255, 80, 80, 0.3);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #ff8080;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    /* Success */
    .success-state {
      text-align: center;
      padding: 3rem 0;
    }

    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .success-symbol {
      font-size: 4rem;
      color: #c9a84c;
      text-shadow: 0 0 30px rgba(201, 168, 76, 0.8);
      margin-bottom: 1rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .success-title {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      color: #c9a84c;
      margin-bottom: 0.75rem;
    }

    .success-subtitle {
      color: #8b7aa8;
      font-size: 1rem;
      margin-bottom: 2rem;
      font-style: italic;
    }

    .success-details {
      max-width: 400px;
      margin: 0 auto 2rem;
      padding: 1.5rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(201, 168, 76, 0.1);

      &:last-child {
        border-bottom: none;
      }
    }

    .detail-label {
      font-size: 0.8rem;
      color: #8b7aa8;
    }

    .detail-value {
      font-family: 'Cinzel', serif;
      font-size: 0.85rem;
      color: #c9a84c;
    }

    .success-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
  `]
})
export class BookReadingComponent {
  private fb = inject(FormBuilder);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  selectedType = signal<'HumanReading' | 'AiReading' | null>(null);
  isLoading = signal(false);
  bookingSuccess = signal(false);
  errorMessage = signal('');
  minDate = new Date();

  availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  bookingForm: FormGroup = this.fb.group({
    clientName: [
      `${this.authService.currentUser()?.firstName ?? ''} ${this.authService.currentUser()?.lastName ?? ''}`.trim(),
      Validators.required
    ],
    clientEmail: [
      this.authService.currentUser()?.email ?? '',
      [Validators.required, Validators.email]
    ],
    scheduledDate: [null, Validators.required],
    scheduledTime: ['', Validators.required],
    notes: ['']
  });

  selectType(type: 'HumanReading' | 'AiReading'): void {
    this.selectedType.set(type);
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.selectedType()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { clientName, clientEmail, scheduledDate, scheduledTime, notes } = this.bookingForm.value;

    // Combine date and time
    const [time, period] = scheduledTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
    const scheduledAt = new Date(scheduledDate);
    scheduledAt.setHours(adjustedHours, minutes, 0, 0);

    this.bookingService.createBooking({
      clientName,
      clientEmail,
      readingType: this.selectedType()!,
      scheduledAt: scheduledAt.toISOString(),
      notes: notes || undefined
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.bookingSuccess.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to create booking. Please try again.');
      }
    });
  }

  getFormattedDateTime(): string {
    const { scheduledDate, scheduledTime } = this.bookingForm.value;
    if (!scheduledDate) return '';
    const date = new Date(scheduledDate);
    return `${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at ${scheduledTime}`;
  }

  bookAnother(): void {
    this.bookingSuccess.set(false);
    this.bookingForm.reset({
      clientName: `${this.authService.currentUser()?.firstName ?? ''} ${this.authService.currentUser()?.lastName ?? ''}`.trim(),
      clientEmail: this.authService.currentUser()?.email ?? ''
    });
    this.selectedType.set(null);
  }
}
