import { createReducer, on } from '@ngrx/store';
import { UnitApiActions } from '../actions/unit.actions';
import { UnitState, initialUnitState } from '../state/unit.state';

export const unitReducer = createReducer(
  initialUnitState,

  // ── Load ────────────────────────────────────────────────────────────────────
  on(UnitApiActions.loadUnits, (state): UnitState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UnitApiActions.loadUnitsSuccess, (state, { units }): UnitState => ({
    ...state,
    loading: false,
    data: units,
  })),

  on(UnitApiActions.loadUnitsFailure, (state, { error }): UnitState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Create ──────────────────────────────────────────────────────────────────
  on(UnitApiActions.createUnit, (state): UnitState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UnitApiActions.createUnitSuccess, (state, { unit }): UnitState => ({
    ...state,
    loading: false,
    data: [...state.data, unit],
  })),

  on(UnitApiActions.createUnitFailure, (state, { error }): UnitState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Update ──────────────────────────────────────────────────────────────────
  on(UnitApiActions.updateUnit, (state): UnitState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UnitApiActions.updateUnitSuccess, (state, { unit }): UnitState => ({
    ...state,
    loading: false,
    data: state.data.map((u) => (u.id === unit.id ? unit : u)),
  })),

  on(UnitApiActions.updateUnitFailure, (state, { error }): UnitState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Delete ──────────────────────────────────────────────────────────────────
  on(UnitApiActions.deleteUnit, (state): UnitState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UnitApiActions.deleteUnitSuccess, (state, { id }): UnitState => ({
    ...state,
    loading: false,
    data: state.data.filter((u) => u.id !== id),
  })),

  on(UnitApiActions.deleteUnitFailure, (state, { error }): UnitState => ({
    ...state,
    loading: false,
    error,
  })),
);
