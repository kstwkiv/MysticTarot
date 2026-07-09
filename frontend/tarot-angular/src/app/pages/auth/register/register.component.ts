import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
    MatSnackBarModule
  ],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card mystic-card">
          <!-- Header -->
          <div class="auth-header">
            <div class="auth-symbol">✦</div>
            <h1 class="auth-title">Begin Your Journey</h1>
            <p class="auth-subtitle">The cosmos welcomes a new seeker</p>
          </div>

          <!-- Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-row">
              <mat-form-field appearance="fill">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" placeholder="Luna">
                @if (registerForm.get('firstName')?.hasError('required') && registerForm.get('firstName')?.touched) {
                  <mat-error>First name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" placeholder="Starweaver">
                @if (registerForm.get('lastName')?.hasError('required') && registerForm.get('lastName')?.touched) {
                  <mat-error>Last name is required</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="your@email.com">
              <mat-icon matSuffix>email</mat-icon>
              @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
              @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                <mat-error>Password must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>I am a...</mat-label>
              <mat-select formControlName="role">
                <mat-option value="Client">Seeker (Client)</mat-option>
                <mat-option value="Reader">Reader</mat-option>
              </mat-select>
            </mat-form-field>

            @if (errorMessage) {
              <div class="error-banner">
                <mat-icon>error_outline</mat-icon>
                {{ errorMessage }}
              </div>
            }

            <button
              type="submit"
              class="btn-mystic submit-btn"
              [disabled]="registerForm.invalid || isLoading"
            >
              @if (isLoading) {
                <span class="mystic-spinner" style="width: 20px; height: 20px; border-width: 2px;"></span>
              } @else {
                ✦ Enter the Mystic Realm
              }
            </button>
          </form>

          <!-- Footer -->
          <div class="auth-footer">
            <p>Already a seeker?
              <a routerLink="/auth/login" class="auth-link">Return to your path</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .auth-container {
      width: 100%;
      max-width: 480px;
    }

    .auth-card {
      padding: 2.5rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-symbol {
      font-size: 2.5rem;
      color: #c9a84c;
      text-shadow: 0 0 20px rgba(201, 168, 76, 0.6);
      margin-bottom: 0.75rem;
    }

    .auth-title {
      font-family: 'Cinzel', serif;
      font-size: 1.75rem;
      color: #c9a84c;
      margin-bottom: 0.5rem;
    }

    .auth-subtitle {
      color: #8b7aa8;
      font-size: 0.9rem;
      font-style: italic;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
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
    }

    .submit-btn {
      width: 100%;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-height: 48px;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: #8b7aa8;
      font-size: 0.9rem;
    }

    .auth-link {
      color: #c9a84c;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Client']
  });

  isLoading = false;
  showPassword = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snackBar.open('✦ Welcome to the mystic realm, seeker', 'Close', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = 'This email is already bound to another soul. Try signing in.';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Please check your details and try again.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}
