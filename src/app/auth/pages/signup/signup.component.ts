import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { OAuthService } from '../../services/oauth.service';
import { AuthStore } from '../../store/auth.store';
import { TokenService } from '../../services/token.service';
import { SocialBtnComponent } from '../../components/social-btn/social-btn.component';
import { PasswordStrengthComponent } from '../../components/password-strength/password-strength.component';
import { passwordStrengthValidator, confirmPasswordValidator } from '../../validators/auth.validators';
import type { OAuthProviderType } from '../../services/oauth.service';

export const YEARS    = ['FE', 'SE', 'TE', 'BE'] as const;
export const BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
] as const;
export const COLLEGES = [
  'COEP Technological University',
  'Pune Institute of Computer Technology (PICT)',
  'Vishwakarma Institute of Technology (VIT)',
  'Symbiosis Institute of Technology (SIT)',
  'MIT College of Engineering',
  'Cummins College of Engineering for Women',
  'Army Institute of Technology (AIT)',
  'Bharati Vidyapeeth College of Engineering',
  'Indira College of Engineering and Management',
  'NBN Sinhgad School of Engineering',
  'Sinhgad College of Engineering',
  'Zeal College of Engineering and Research',
  'RMD Sinhgad School of Engineering',
  'Savitribai Phule Pune University',
] as const;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SocialBtnComponent, PasswordStrengthComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private readonly fb      = inject(FormBuilder);
  private readonly auth    = inject(AuthService);
  private readonly oauth   = inject(OAuthService);
  private readonly tokens  = inject(TokenService);
  private readonly router  = inject(Router);
  protected readonly store = inject(AuthStore);

  protected readonly step                = signal<1 | 2>(1);
  protected readonly showPassword        = signal(false);
  protected readonly showConfirmPassword = signal(false);
  protected readonly oauthLoading        = signal<OAuthProviderType | null>(null);

  protected readonly years    = YEARS;
  protected readonly branches = BRANCHES;
  protected readonly colleges = COLLEGES;

  protected readonly form = this.fb.group(
    {
      // Step 1
      name:            ['', [Validators.required, Validators.minLength(2)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      // Step 2
      university: [{ value: 'SPPU', disabled: true }],
      year:       ['', Validators.required],
      college:    ['', Validators.required],
      branch:     ['', Validators.required],
    },
    { validators: confirmPasswordValidator },
  );

  protected get name()            { return this.form.get('name')!; }
  protected get email()           { return this.form.get('email')!; }
  protected get password()        { return this.form.get('password')!; }
  protected get confirmPassword() { return this.form.get('confirmPassword')!; }
  protected get year()            { return this.form.get('year')!; }
  protected get college()         { return this.form.get('college')!; }
  protected get branch()          { return this.form.get('branch')!; }
  protected get passwordValue()   { return this.password.value ?? ''; }

  protected goNext(): void {
    this.name.markAsTouched();
    this.email.markAsTouched();
    this.password.markAsTouched();
    this.confirmPassword.markAsTouched();

    const step1Valid =
      this.name.valid &&
      this.email.valid &&
      this.password.valid &&
      this.confirmPassword.valid &&
      !this.form.hasError('passwordMismatch');

    if (step1Valid) this.step.set(2);
  }

  protected goBack(): void {
    this.step.set(1);
  }

  protected submit(): void {
    this.year.markAsTouched();
    this.college.markAsTouched();
    this.branch.markAsTouched();

    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    this.auth.signup({
      name:       raw.name!,
      email:      raw.email!,
      university: raw.university!,
      year:       raw.year!,
      college:    raw.college!,
      branch:     raw.branch!,
      password:   raw.password!,
    }).subscribe({ next: () => void this.router.navigate(['/']) });
  }

  protected signupWith(provider: OAuthProviderType): void {
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
