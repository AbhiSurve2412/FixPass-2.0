import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { AuthResponse, AuthUser } from '../models/auth.models';

export type OAuthProviderType = 'google' | 'github';

export interface AuthProvider {
  readonly type: OAuthProviderType;
  initiateLogin(): Observable<AuthResponse>;
}

const mockOAuthUser = (id: string, name: string, email: string): AuthUser => ({
  id,
  name,
  email,
  university: 'SPPU',
  year: '',
  college: '',
  branch: '',
  role: 'student',
});

class GoogleAuthProvider implements AuthProvider {
  readonly type: OAuthProviderType = 'google';

  initiateLogin(): Observable<AuthResponse> {
    // Production: window.location.href = '/api/auth/google' (server-side OAuth redirect)
    return of({
      success: true,
      accessToken:  'mock.google.access.token',
      refreshToken: 'mock.google.refresh.token',
      expiresIn:    900,
      user: mockOAuthUser('usr_google_01', 'Google User', 'user@gmail.com'),
    }).pipe(delay(600));
  }
}

class GithubAuthProvider implements AuthProvider {
  readonly type: OAuthProviderType = 'github';

  initiateLogin(): Observable<AuthResponse> {
    // Production: window.location.href = '/api/auth/github' (server-side OAuth redirect)
    return of({
      success: true,
      accessToken:  'mock.github.access.token',
      refreshToken: 'mock.github.refresh.token',
      expiresIn:    900,
      user: mockOAuthUser('usr_github_01', 'GitHub User', 'user@github.com'),
    }).pipe(delay(600));
  }
}

@Injectable({ providedIn: 'root' })
export class OAuthService {
  private readonly providers = new Map<OAuthProviderType, AuthProvider>([
    ['google', new GoogleAuthProvider()],
    ['github', new GithubAuthProvider()],
  ]);

  login(type: OAuthProviderType): Observable<AuthResponse> {
    const provider = this.providers.get(type);
    if (!provider) throw new Error(`OAuth provider '${type}' not registered`);
    return provider.initiateLogin();
  }
}
