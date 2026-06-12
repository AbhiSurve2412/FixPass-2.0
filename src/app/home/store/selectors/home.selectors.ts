import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HomeState } from '../state/home.state';

// ── Feature root ──────────────────────────────────────────────────

export const getHomeState = createFeatureSelector<HomeState>('home');

// ── Loading / error ───────────────────────────────────────────────

export const getHomeLoading = createSelector(
  getHomeState,
  (state): boolean => state.loading,
);

export const getHomeError = createSelector(
  getHomeState,
  (state): string | null => state.error,
);

export const getHomeData = createSelector(
  getHomeState,
  (state) => state.data,
);

// ── Section selectors ─────────────────────────────────────────────

export const getHeroContent = createSelector(
  getHomeData,
  (data) => data?.hero ?? null,
);

export const getBranches = createSelector(
  getHomeData,
  (data) => data?.branches ?? [],
);

export const getStudyMaterialFeatures = createSelector(
  getHomeData,
  (data) => data?.studyFeatures ?? [],
);

export const getTestimonials = createSelector(
  getHomeData,
  (data) => data?.testimonials ?? [],
);

export const getWorkSteps = createSelector(
  getHomeData,
  (data) => data?.workSteps ?? [],
);

export const getBenefits = createSelector(
  getHomeData,
  (data) => data?.benefits ?? [],
);

export const getPricingPlans = createSelector(
  getHomeData,
  (data) => data?.pricingPlans ?? [],
);
