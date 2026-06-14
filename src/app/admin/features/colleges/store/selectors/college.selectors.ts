import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollegeState } from '../state/college.state';

// ── Feature root ─────────────────────────────────────────────────────────────

export const getCollegeState =
  createFeatureSelector<CollegeState>('colleges');

// ── Derived selectors ────────────────────────────────────────────────────────

export const getCollegesLoading = createSelector(
  getCollegeState,
  (state): boolean => state.loading,
);

export const getCollegesError = createSelector(
  getCollegeState,
  (state): string | null => state.error,
);

export const getColleges = createSelector(
  getCollegeState,
  (state) => state.data,
);
