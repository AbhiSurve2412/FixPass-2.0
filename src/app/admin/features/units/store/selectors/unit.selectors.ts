import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UnitState } from '../state/unit.state';

// ── Feature root ─────────────────────────────────────────────────────────────

export const getUnitState =
  createFeatureSelector<UnitState>('units');

// ── Derived selectors ────────────────────────────────────────────────────────

export const getUnitsLoading = createSelector(
  getUnitState,
  (state): boolean => state.loading,
);

export const getUnitsError = createSelector(
  getUnitState,
  (state): string | null => state.error,
);

export const getUnits = createSelector(
  getUnitState,
  (state) => state.data,
);
