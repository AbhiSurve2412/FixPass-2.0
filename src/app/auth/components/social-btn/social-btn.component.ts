import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { OAuthProviderType } from '../../services/oauth.service';

@Component({
  selector: 'app-social-btn',
  standalone: true,
  templateUrl: './social-btn.component.html',
  styleUrl: './social-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialBtnComponent {
  readonly provider = input.required<OAuthProviderType>();
  readonly loading  = input(false);
  readonly clicked  = output<OAuthProviderType>();

  handleClick(): void {
    if (!this.loading()) this.clicked.emit(this.provider());
  }
}
