import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'tarot_token';
  private readonly USER_KEY = 'tarot_user';

  // Signals for reactive state
  private _currentUser = signal<AuthResponse | null>(this.loadUserFromStorage());
  private _isAuthenticated = computed(() => {
    const user = this._currentUser();
    if (!user) return false;
    // Check token expiry
    const expiresAt = new Date(user.expiresAt);
    return expiresAt > new Date();
  });

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated;

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
      tap(response => this.storeAuth(response)),
      catchError(err => throwError(() => err))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, request).pipe(
      tap(response => this.storeAuth(response)),
      catchError(err => throwError(() => err))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  hasRole(role: string): boolean {
    return this._currentUser()?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isReader(): boolean {
    return this.hasRole('Reader');
  }

  isClient(): boolean {
    return this.hasRole('Client');
  }

  private storeAuth(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    this._currentUser.set(response);
  }

  private loadUserFromStorage(): AuthResponse | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      if (!stored) return null;
      const user = JSON.parse(stored) as AuthResponse;
      // Validate token hasn't expired
      if (new Date(user.expiresAt) <= new Date()) {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }
}
