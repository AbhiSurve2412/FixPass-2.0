import { createReducer, on } from '@ngrx/store';
import { UniversityApiActions } from '../actions/university.actions';
import { UniversityState, initialUniversityState } from '../state/university.state';

export const universityReducer = createReducer(
  initialUniversityState,

  // ── Load ────────────────────────────────────────────────────────────────────
  on(UniversityApiActions.loadUniversities, (state): UniversityState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UniversityApiActions.loadUniversitiesSuccess, (state, { universities }): UniversityState => ({
    ...state,
    loading: false,
    data: universities,
  })),

  on(UniversityApiActions.loadUniversitiesFailure, (state, { error }): UniversityState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Create ──────────────────────────────────────────────────────────────────
  on(UniversityApiActions.createUniversity, (state): UniversityState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UniversityApiActions.createUniversitySuccess, (state, { university }): UniversityState => ({
    ...state,
    loading: false,
    data: [...state.data, university],
  })),

  on(UniversityApiActions.createUniversityFailure, (state, { error }): UniversityState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Update ──────────────────────────────────────────────────────────────────
  on(UniversityApiActions.updateUniversity, (state): UniversityState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UniversityApiActions.updateUniversitySuccess, (state, { university }): UniversityState => ({
    ...state,
    loading: false,
    data: state.data.map((u) => (u.id === university.id ? university : u)),
  })),

  on(UniversityApiActions.updateUniversityFailure, (state, { error }): UniversityState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Delete ──────────────────────────────────────────────────────────────────
  on(UniversityApiActions.deleteUniversity, (state): UniversityState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UniversityApiActions.deleteUniversitySuccess, (state, { id }): UniversityState => ({
    ...state,
    loading: false,
    data: state.data.filter((u) => u.id !== id),
  })),

  on(UniversityApiActions.deleteUniversityFailure, (state, { error }): UniversityState => ({
    ...state,
    loading: false,
    error,
  })),
);
