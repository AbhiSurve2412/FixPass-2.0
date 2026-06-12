import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
  readonly label    = input<string>();
  readonly title    = input('');
  readonly subtitle = input<string>();
  readonly align    = input<'center' | 'left'>('center');
}
