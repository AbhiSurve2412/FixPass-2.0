import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { OAuthService } from '../../services/oauth.service';
import { AuthStore } from '../../store/auth.store';
import { TokenService } from '../../services/token.service';
import { SocialBtnComponent } from '../../components/social-btn/social-btn.component';
import type { OAuthProviderType } from '../../services/oauth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SocialBtnComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb      = inject(FormBuilder);
  private readonly auth    = inject(AuthService);
  private readonly oauth   = inject(OAuthService);
  private readonly tokens  = inject(TokenService);
  private readonly router  = inject(Router);
  protected readonly store = inject(AuthStore);

  protected readonly showPassword = signal(false);
  protected readonly oauthLoading = signal<OAuthProviderType | null>(null);

  protected readonly form = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  protected get email()    { return this.form.get('email')!; }
  protected get password() { return this.form.get('password')!; }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password, rememberMe } = this.form.getRawValue();
    this.auth
      .login({ email: email!, password: password!, rememberMe: rememberMe! })
      .subscribe({ next: () => void this.router.navigate(['/']) });
  }

  protected loginWith(provider: OAuthProviderType): void {
    if (this.oauthLoading()) return;
    this.oauthLoading.set(provider);
    this.oauth.login(provider).subscribe({
      next: res => {
        this.tokens.saveTokens(res.accessToken, res.refreshToken);
        this.store.setAuth(res.user, res.accessToken, res.refreshToken);
        this.oauthLoading.set(null);
        void this.router.navigate(['/']);
      },
      error: () => this.oauthLoading.set(null),
    });
  }
}
