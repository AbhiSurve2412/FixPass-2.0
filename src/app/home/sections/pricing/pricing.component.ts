import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PricingPlan } from '../../interfaces/home.interfaces';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink, SectionHeaderComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingComponent {
  readonly plans = input<PricingPlan[]>([]);

  trackByPlan(_: number, plan: PricingPlan): string { return plan.id; }
  trackByFeature(index: number): number { return index; }
}
