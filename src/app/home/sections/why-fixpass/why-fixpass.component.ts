import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Benefit } from '../../interfaces/home.interfaces';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

@Component({
  selector: 'app-why-fixpass',
  standalone: true,
  imports: [SectionHeaderComponent],
  templateUrl: './why-fixpass.component.html',
  styleUrl: './why-fixpass.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyFixpassComponent {
  readonly benefits = input<Benefit[]>([]);

  trackByBenefit(_: number, b: Benefit): string { return b.id; }
}
