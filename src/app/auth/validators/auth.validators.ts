import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordStrengthValidator: ValidatorFn = (ctrl: AbstractControl): ValidationErrors | null => {
  const val: string = ctrl.value ?? '';
  const errors: Record<string, boolean> = {};
  if (val.length < 8)       errors['minLength']  = true;
  if (!/[A-Z]/.test(val))   errors['uppercase']  = true;
  if (!/[a-z]/.test(val))   errors['lowercase']  = true;
  if (!/[0-9]/.test(val))   errors['number']     = true;
  return Object.keys(errors).length ? { passwordStrength: errors } : null;
};

export const confirmPasswordValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pw  = group.get('password')?.value ?? '';
  const cpw = group.get('confirmPassword')?.value ?? '';
  return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
};

export function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)           score++;
  if (pw.length >= 12)          score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[a-z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;

  if (score <= 2) return { score, label: 'Weak',   color: 'var(--color-danger)' };
  if (score <= 4) return { score, label: 'Fair',   color: 'var(--color-warning)' };
  if (score === 5) return { score, label: 'Good',  color: 'var(--color-info)' };
  return                  { score, label: 'Strong', color: 'var(--color-success)' };
}
