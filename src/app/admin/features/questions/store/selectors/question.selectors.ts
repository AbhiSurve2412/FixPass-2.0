import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuestionState } from '../state/question.state';

// ── Feature root ─────────────────────────────────────────────────────────────

export const getQuestionState = createFeatureSelector<QuestionState>('questions');

// ── Derived selectors ────────────────────────────────────────────────────────

export const getQuestionsLoading = createSelector(
  getQuestionState,
  (state): boolean => state.loading,
);

export const getQuestionsExtracting = createSelector(
  getQuestionState,
  (state): boolean => state.extracting,
);

export const getQuestionsImporting = createSelector(
  getQuestionState,
  (state): boolean => state.importing,
);

export const getQuestions = createSelector(
  getQuestionState,
  state => state.data,
);

export const getQuestionsError = createSelector(
  getQuestionState,
  (state): string | null => state.error,
);

export const getExtractedQuestions = createSelector(
  getQuestionState,
  state => state.extractedQuestions,
);
