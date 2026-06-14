import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BranchState } from '../state/branch.state';

// ── Feature root ─────────────────────────────────────────────────────────────

export const getBranchState =
  createFeatureSelector<BranchState>('branches');

// ── Derived selectors ────────────────────────────────────────────────────────

export const getBranchesLoading = createSelector(
  getBranchState,
  (state): boolean => state.loading,
);

export const getBranchesError = createSelector(
  getBranchState,
  (state): string | null => state.error,
);

export const getBranches = createSelector(
  getBranchState,
  (state) => state.data,
);
