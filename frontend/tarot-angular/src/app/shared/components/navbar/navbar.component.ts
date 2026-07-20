import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <a routerLink="/" class="navbar-logo">
          <span class="logo-symbol">☽</span>
          <span class="logo-text">Mystic Tarot</span>
          <span class="logo-symbol">☾</span>
        </a>

        <!-- Desktop Nav Links -->
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            Home
          </a>

          @if (authService.isAuthenticated()) {
            <a routerLink="/ai-reading" routerLinkActive="active" class="nav-link">
              AI Reading
            </a>
            <a routerLink="/book-reading" routerLinkActive="active" class="nav-link">
              Book a Reading
            </a>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              Dashboard
            </a>
            @if (authService.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="active" class="nav-link">
                Admin
              </a>
            }
          }
        </div>

        <!-- Auth Buttons -->
        <div class="nav-auth">
          <!-- Instagram Link -->
          <a href="https://www.instagram.com/witchy.bitchy.baddie/" target="_blank" rel="noopener noreferrer"
             class="instagram-link" aria-label="Follow on Instagram">
            <svg class="instagram-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
            </svg>
          </a>

          @if (authService.isAuthenticated()) {
            <div class="user-menu" [matMenuTriggerFor]="userMenu">
              <div class="user-avatar">
                {{ getUserInitials() }}
              </div>
              <span class="user-name">{{ authService.currentUser()?.firstName }}</span>
              <mat-icon>expand_more</mat-icon>
            </div>

            <mat-menu #userMenu="matMenu" class="mystic-menu">
              <div class="menu-header">
                <p class="menu-email">{{ authService.currentUser()?.email }}</p>
                <span class="menu-role">{{ authService.currentUser()?.role }}</span>
              </div>
              <button mat-menu-item routerLink="/dashboard">
                <mat-icon>dashboard</mat-icon>
                <span>Dashboard</span>
              </button>
              <button mat-menu-item (click)="authService.logout()">
                <mat-icon>logout</mat-icon>
                <span>Sign Out</span>
              </button>
            </mat-menu>
          } @else {
            <a routerLink="/auth/login" class="btn-mystic-outline nav-btn">Sign In</a>
            <a routerLink="/auth/register" class="btn-mystic nav-btn">Get Started</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(5, 5, 5, 0.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      padding: 0 1.5rem;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
      gap: 2rem;
    }

    .navbar-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: #f5f0eb;
      white-space: nowrap;
      transition: all 0.3s ease;

      &:hover { color: #ff2d78; }
    }


    .logo-symbol {
      font-size: 1.1rem;
      opacity: 0.8;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(245, 240, 235, 0.5);
      text-decoration: none;
      padding: 0.5rem 0.75rem;
      transition: all 0.3s ease;

      &:hover, &.active {
        color: #f5f0eb;
        border-bottom: 1px solid #ff2d78;
      }
    }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      white-space: nowrap;
    }

    .nav-btn {
      font-size: 0.8rem;
      padding: 0.5rem 1.25rem;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.4rem 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.12);
      transition: all 0.3s ease;
      color: #f5f0eb;

      &:hover { border-color: #ff2d78; background: rgba(255, 45, 120, 0.05); }
    }

    .user-avatar {
      width: 32px; height: 32px; border-radius: 0;
      background: #ff2d78;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cinzel', serif; font-size: 0.75rem; font-weight: 700; color: #fff;
    }

    .user-name { font-family: 'Raleway', sans-serif; font-size: 0.9rem; color: #f5f0eb; }

    .menu-header { padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 0.25rem; }
    .menu-email { font-size: 0.8rem; color: rgba(245,240,235,0.45); margin: 0 0 0.25rem; }
    .menu-role {
      font-size: 0.7rem; font-family: 'Cinzel', serif; color: #1db954;
      background: rgba(29,185,84,0.08); padding: 0.15rem 0.5rem; border: 1px solid rgba(29,185,84,0.25);
    }

    .instagram-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid rgba(245, 240, 235, 0.15);
      color: rgba(245, 240, 235, 0.4);
      transition: all 0.3s ease;
      text-decoration: none;

      &:hover {
        color: #e1306c;
        border-color: #e1306c;
        background: rgba(225, 48, 108, 0.1);
        box-shadow: 0 0 15px rgba(225, 48, 108, 0.3);
      }
    }

    .instagram-icon {
      width: 18px;
      height: 18px;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '?';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
}
