import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnswerState } from '../state/answer.state';

export const getAnswerState = createFeatureSelector<AnswerState>('answers');

export const getAnswers = createSelector(getAnswerState, s => s.data);
export const getAnswerLoading = createSelector(getAnswerState, s => s.loading);
export const getAnswerGenerating = createSelector(getAnswerState, s => s.generating);
export const getAnswerSaving = createSelector(getAnswerState, s => s.saving);
export const getAnswerError = createSelector(getAnswerState, s => s.error);
export const getSelectedSubjectId = createSelector(getAnswerState, s => s.selectedSubjectId);
export const getSelectedUnitId = createSelector(getAnswerState, s => s.selectedUnitId);
export const getSelectedQuestionId = createSelector(getAnswerState, s => s.selectedQuestionId);
export const getCurrentDetailedAnswer = createSelector(getAnswerState, s => s.currentDetailedAnswer);
export const getCurrentSimpleAnswer = createSelector(getAnswerState, s => s.currentSimpleAnswer);
export const getActiveAnswerType = createSelector(getAnswerState, s => s.activeAnswerType);
