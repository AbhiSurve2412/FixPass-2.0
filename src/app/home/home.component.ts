// ─────────────────────────────────────────────────────────────────
// Home Page — Smart Container
//
// Responsibilities:
//   • Dispatch LoadHomePage on init
//   • Expose state slices as signals via store.selectSignal()
//   • Pass data down to presentational components as @Input()
//
// This component holds NO business logic and NO hardcoded data.
// ─────────────────────────────────────────────────────────────────
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { HomeApiActions } from './store/actions/home.actions';
import {
  getHomeLoading,
  getHomeError,
  getHeroContent,
  getBranches,
  getStudyMaterialFeatures,
  getTestimonials,
  getWorkSteps,
  getBenefits,
  getPricingPlans,
} from './store/selectors/home.selectors';

import { HeroShowcaseComponent } from './sections/hero-showcase/hero-showcase.component';
import { StudyFeaturesComponent } from './sections/study-features/study-features.component';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';
import { HowItWorksComponent } from './sections/how-it-works/how-it-works.component';
import { WhyFixpassComponent } from './sections/why-fixpass/why-fixpass.component';
import { PricingComponent } from './sections/pricing/pricing.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroShowcaseComponent,
    StudyFeaturesComponent,
    TestimonialsComponent,
    HowItWorksComponent,
    WhyFixpassComponent,
    PricingComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly store = inject(Store);

  // ── State slices as signals ─────────────────────────────────────
  readonly loading  = this.store.selectSignal(getHomeLoading);
  readonly error    = this.store.selectSignal(getHomeError);
  readonly hero     = this.store.selectSignal(getHeroContent);
  readonly branches = this.store.selectSignal(getBranches);
  readonly features = this.store.selectSignal(getStudyMaterialFeatures);
  readonly testimonials = this.store.selectSignal(getTestimonials);
  readonly steps    = this.store.selectSignal(getWorkSteps);
  readonly benefits = this.store.selectSignal(getBenefits);
  readonly plans    = this.store.selectSignal(getPricingPlans);

  ngOnInit(): void {
    this.store.dispatch(HomeApiActions.loadHomePage());
  }
}
