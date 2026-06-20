import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { passwordStrength } from '../../validators/auth.validators';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthComponent {
  readonly password = input<string>('');

  readonly strength = computed(() => passwordStrength(this.password()));
  readonly segments = [0, 1, 2, 3, 4];
}
