import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Testimonial } from '../../interfaces/home.interfaces';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [SectionHeaderComponent],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  readonly testimonials = input<Testimonial[]>([]);
  readonly stars = [1, 2, 3, 4, 5];

  trackByTestimonial(_: number, t: Testimonial): string { return t.id; }
}
