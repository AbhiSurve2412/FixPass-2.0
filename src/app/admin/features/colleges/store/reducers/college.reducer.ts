import { createReducer, on } from '@ngrx/store';
import { CollegeApiActions } from '../actions/college.actions';
import { CollegeState, initialCollegeState } from '../state/college.state';

export const collegeReducer = createReducer(
  initialCollegeState,

  // ── Load ────────────────────────────────────────────────────────────────────
  on(CollegeApiActions.loadColleges, (state): CollegeState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CollegeApiActions.loadCollegesSuccess, (state, { colleges }): CollegeState => ({
    ...state,
    loading: false,
    data: colleges,
  })),

  on(CollegeApiActions.loadCollegesFailure, (state, { error }): CollegeState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Create ──────────────────────────────────────────────────────────────────
  on(CollegeApiActions.createCollege, (state): CollegeState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CollegeApiActions.createCollegeSuccess, (state, { college }): CollegeState => ({
    ...state,
    loading: false,
    data: [...state.data, college],
  })),

  on(CollegeApiActions.createCollegeFailure, (state, { error }): CollegeState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Update ──────────────────────────────────────────────────────────────────
  on(CollegeApiActions.updateCollege, (state): CollegeState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CollegeApiActions.updateCollegeSuccess, (state, { college }): CollegeState => ({
    ...state,
    loading: false,
    data: state.data.map((c) => (c.id === college.id ? college : c)),
  })),

  on(CollegeApiActions.updateCollegeFailure, (state, { error }): CollegeState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Delete ──────────────────────────────────────────────────────────────────
  on(CollegeApiActions.deleteCollege, (state): CollegeState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CollegeApiActions.deleteCollegeSuccess, (state, { id }): CollegeState => ({
    ...state,
    loading: false,
    data: state.data.filter((c) => c.id !== id),
  })),

  on(CollegeApiActions.deleteCollegeFailure, (state, { error }): CollegeState => ({
    ...state,
    loading: false,
    error,
  })),
);
