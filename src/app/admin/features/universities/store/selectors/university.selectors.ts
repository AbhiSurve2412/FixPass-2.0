import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UniversityState } from '../state/university.state';

// ── Feature root ─────────────────────────────────────────────────────────────

export const getUniversityState =
  createFeatureSelector<UniversityState>('universities');

// ── Derived selectors ────────────────────────────────────────────────────────

export const getUniversitiesLoading = createSelector(
  getUniversityState,
  (state): boolean => state.loading,
);

export const getUniversitiesError = createSelector(
  getUniversityState,
  (state): string | null => state.error,
);

export const getUniversities = createSelector(
  getUniversityState,
  (state) => state.data,
);
