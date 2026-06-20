import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UnitQuestionsState } from '../state/unit-questions.state';

export const selectUnitQuestionsState = createFeatureSelector<UnitQuestionsState>('unitQuestions');

export const selectUqSubjects  = createSelector(selectUnitQuestionsState, s => s.subjects);
export const selectUqUnits     = createSelector(selectUnitQuestionsState, s => s.units);
export const selectUqQuestions = createSelector(selectUnitQuestionsState, s => s.questions);
export const selectUqAnswers   = createSelector(selectUnitQuestionsState, s => s.answers);
export const selectUqLoading   = createSelector(selectUnitQuestionsState, s => s.loading);
export const selectUqError     = createSelector(selectUnitQuestionsState, s => s.error);
