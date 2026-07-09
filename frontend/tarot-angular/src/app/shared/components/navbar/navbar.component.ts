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
      background: rgba(13, 2, 33, 0.9);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(201, 168, 76, 0.2);
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
      font-size: 1.25rem;
      font-weight: 700;
      color: #c9a84c;
      white-space: nowrap;
      transition: all 0.3s ease;

      &:hover {
        text-shadow: 0 0 20px rgba(201, 168, 76, 0.8);
      }
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
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #8b7aa8;
      text-decoration: none;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover, &.active {
        color: #c9a84c;
        background: rgba(201, 168, 76, 0.1);
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
      border-radius: 8px;
      border: 1px solid rgba(201, 168, 76, 0.3);
      transition: all 0.3s ease;
      color: #f0e6ff;

      &:hover {
        border-color: rgba(201, 168, 76, 0.6);
        background: rgba(201, 168, 76, 0.05);
      }
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c9a84c, #a07830);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      font-weight: 700;
      color: #0d0221;
    }

    .user-name {
      font-family: 'Raleway', sans-serif;
      font-size: 0.9rem;
      color: #f0e6ff;
    }

    .menu-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(201, 168, 76, 0.2);
      margin-bottom: 0.25rem;
    }

    .menu-email {
      font-size: 0.8rem;
      color: #8b7aa8;
      margin: 0 0 0.25rem;
    }

    .menu-role {
      font-size: 0.7rem;
      font-family: 'Cinzel', serif;
      color: #c9a84c;
      background: rgba(201, 168, 76, 0.1);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      border: 1px solid rgba(201, 168, 76, 0.3);
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
