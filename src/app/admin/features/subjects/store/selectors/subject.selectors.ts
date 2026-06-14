import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubjectState } from '../state/subject.state';

// ── Feature root ─────────────────────────────────────────────────────────────

export const getSubjectState =
  createFeatureSelector<SubjectState>('subjects');

// ── Derived selectors ────────────────────────────────────────────────────────

export const getSubjectsLoading = createSelector(
  getSubjectState,
  (state): boolean => state.loading,
);

export const getSubjectsError = createSelector(
  getSubjectState,
  (state): string | null => state.error,
);

export const getSubjects = createSelector(
  getSubjectState,
  (state) => state.data,
);
