import { createReducer, on } from '@ngrx/store';
import { PaperApiActions } from '../actions/paper.actions';
import { PaperState, initialPaperState } from '../state/paper.state';

export const paperReducer = createReducer(
  initialPaperState,

  // ── Load ──────────────────────────────────────────────────────────────────
  on(PaperApiActions.loadPapers, (state): PaperState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PaperApiActions.loadPapersSuccess, (state, { papers }): PaperState => ({
    ...state,
    loading: false,
    data: papers,
  })),
  on(PaperApiActions.loadPapersFailure, (state, { error }): PaperState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Filters ───────────────────────────────────────────────────────────────
  on(PaperApiActions.setFilterBranch, (state, { branchName }): PaperState => ({
    ...state,
    filters: { ...state.filters, branchName, subjectName: null },
  })),
  on(PaperApiActions.setFilterYear, (state, { academicYear }): PaperState => ({
    ...state,
    filters: { ...state.filters, academicYear, subjectName: null },
  })),
  on(PaperApiActions.setFilterPattern, (state, { pattern }): PaperState => ({
    ...state,
    filters: { ...state.filters, pattern, subjectName: null },
  })),
  on(PaperApiActions.setFilterSubject, (state, { subjectName }): PaperState => ({
    ...state,
    filters: { ...state.filters, subjectName },
  })),
  on(PaperApiActions.clearFilters, (state): PaperState => ({
    ...state,
    filters: {
      branchName: null,
      academicYear: null,
      pattern: null,
      subjectName: null,
    },
  })),
);
