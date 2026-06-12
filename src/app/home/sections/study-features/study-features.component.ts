import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FeatureCard } from '../../interfaces/home.interfaces';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

@Component({
  selector: 'app-study-features',
  standalone: true,
  imports: [SectionHeaderComponent],
  templateUrl: './study-features.component.html',
  styleUrl: './study-features.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyFeaturesComponent {
  readonly features = input<FeatureCard[]>([]);

  trackByFeature(_: number, f: FeatureCard): string { return f.id; }
  trackByItem(index: number): number { return index; }
}
