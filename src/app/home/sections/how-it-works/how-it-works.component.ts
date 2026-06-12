import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WorkStep } from '../../interfaces/home.interfaces';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [SectionHeaderComponent],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {
  readonly steps = input<WorkStep[]>([]);

  trackByStep(_: number, step: WorkStep): string { return step.id; }
}
