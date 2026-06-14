import { createReducer, on } from '@ngrx/store';
import { SubjectApiActions } from '../actions/subject.actions';
import { SubjectState, initialSubjectState } from '../state/subject.state';

export const subjectReducer = createReducer(
  initialSubjectState,

  // ── Load ────────────────────────────────────────────────────────────────────
  on(SubjectApiActions.loadSubjects, (state): SubjectState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectApiActions.loadSubjectsSuccess, (state, { subjects }): SubjectState => ({
    ...state,
    loading: false,
    data: subjects,
  })),

  on(SubjectApiActions.loadSubjectsFailure, (state, { error }): SubjectState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Create ──────────────────────────────────────────────────────────────────
  on(SubjectApiActions.createSubject, (state): SubjectState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectApiActions.createSubjectSuccess, (state, { subject }): SubjectState => ({
    ...state,
    loading: false,
    data: [...state.data, subject],
  })),

  on(SubjectApiActions.createSubjectFailure, (state, { error }): SubjectState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Update ──────────────────────────────────────────────────────────────────
  on(SubjectApiActions.updateSubject, (state): SubjectState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectApiActions.updateSubjectSuccess, (state, { subject }): SubjectState => ({
    ...state,
    loading: false,
    data: state.data.map((s) => (s.id === subject.id ? subject : s)),
  })),

  on(SubjectApiActions.updateSubjectFailure, (state, { error }): SubjectState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Delete ──────────────────────────────────────────────────────────────────
  on(SubjectApiActions.deleteSubject, (state): SubjectState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectApiActions.deleteSubjectSuccess, (state, { id }): SubjectState => ({
    ...state,
    loading: false,
    data: state.data.filter((s) => s.id !== id),
  })),

  on(SubjectApiActions.deleteSubjectFailure, (state, { error }): SubjectState => ({
    ...state,
    loading: false,
    error,
  })),
);
