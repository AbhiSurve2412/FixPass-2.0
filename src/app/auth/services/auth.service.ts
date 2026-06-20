import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, delay, filter, take, switchMap } from 'rxjs/operators';

import { AuthStore } from '../store/auth.store';
import { TokenService } from './token.service';
import { AUTH_ENDPOINTS } from '../constants/api.constants';
import type { AuthResponse, LoginRequest, SignupRequest, RefreshResponse, AuthUser } from '../models/auth.models';

// ── Mock data (swap service method bodies when backend is ready) ───
const MOCK_USER: AuthUser = {
  id: 'usr_01',
  name: 'Demo Student',
  email: 'demo@fixpass.in',
  university: 'SPPU',
  year: 'FE',
  college: 'COEP Technological University',
  branch: 'Computer Engineering',
  role: 'student',
};

const MOCK_AUTH: AuthResponse = {
  success: true,
  accessToken:  'mock.access.token',
  refreshToken: 'mock.refresh.token',
  expiresIn:    900,
  user: MOCK_USER,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly store  = inject(AuthStore);
  private readonly tokens = inject(TokenService);

  private isRefreshing = false;
  private refreshDone$ = new BehaviorSubject<string | null>(null);

  // ── Login ──────────────────────────────────────────────────────
  login(req: LoginRequest): Observable<AuthResponse> {
    this.store.setLoading(true);
    this.store.setError(null);
    this.tokens.setStorage(req.rememberMe);

    // Swap body → this.http.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, req)
    return of(MOCK_AUTH).pipe(
      delay(800),
      tap(res => {
        this.tokens.saveTokens(res.accessToken, res.refreshToken);
        this.store.setAuth(res.user, res.accessToken, res.refreshToken);
        this.store.setLoading(false);
      }),
      catchError(err => {
        this.store.setLoading(false);
        this.store.setError((err as { error?: { message?: string } })?.error?.message ?? 'Login failed');
        return throwError(() => err);
      }),
    );
  }

  // ── Signup ────────────────────────────────────────────────────
  signup(req: SignupRequest): Observable<AuthResponse> {
    this.store.setLoading(true);
    this.store.setError(null);

    // Swap body → this.http.post<AuthResponse>(AUTH_ENDPOINTS.SIGNUP, req)
    return of(MOCK_AUTH).pipe(
      delay(1000),
      tap(res => {
        this.tokens.saveTokens(res.accessToken, res.refreshToken);
        this.store.setAuth(res.user, res.accessToken, res.refreshToken);
        this.store.setLoading(false);
      }),
      catchError(err => {
        this.store.setLoading(false);
        this.store.setError((err as { error?: { message?: string } })?.error?.message ?? 'Signup failed');
        return throwError(() => err);
      }),
    );
  }

  // ── Token refresh (called by interceptor on 401) ──────────────
  refreshAccessToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshDone$.pipe(
        filter((t): t is string => t !== null),
        take(1),
      );
    }

    const refreshToken = this.tokens.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    // Create subject before flipping the flag so concurrent 401s queue on the new subject.
    this.refreshDone$ = new BehaviorSubject<string | null>(null);
    this.isRefreshing = true;

    // Swap body → this.http.post<RefreshResponse>(AUTH_ENDPOINTS.REFRESH, { refreshToken })
    return of({ success: true, accessToken: 'mock.new.access.token', expiresIn: 900 } as RefreshResponse).pipe(
      delay(300),
      tap(res => {
        this.tokens.saveTokens(res.accessToken, refreshToken);
        this.store.updateAccessToken(res.accessToken);
        this.isRefreshing = false;
        this.refreshDone$.next(res.accessToken);
      }),
      switchMap(res => of(res.accessToken)),
      catchError(err => {
        this.isRefreshing = false;
        this.logout();
        return throwError(() => err);
      }),
    );
  }

  // ── Boot-time session restore ─────────────────────────────────
  restoreSession(): void {
    const accessToken  = this.tokens.getAccessToken();
    const refreshToken = this.tokens.getRefreshToken();
    if (accessToken && refreshToken) {
      // Production: call GET /auth/me to validate token and receive current user data.
      // Mock: trust stored tokens and restore with mock user profile.
      this.store.setAuth(MOCK_USER, accessToken, refreshToken);
    }
  }

  // ── Logout ────────────────────────────────────────────────────
  logout(): void {
    this.tokens.clearTokens();
    this.store.clearAuth();
    void this.router.navigate(['/login']);
  }
}
