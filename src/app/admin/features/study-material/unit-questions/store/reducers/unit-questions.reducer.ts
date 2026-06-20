import { createReducer, on } from '@ngrx/store';
import { UnitQuestionsApiActions } from '../actions/unit-questions.actions';
import { UnitQuestionsState, initialUnitQuestionsState } from '../state/unit-questions.state';

export const unitQuestionsReducer = createReducer(
  initialUnitQuestionsState,

  on(UnitQuestionsApiActions.loadData, (state): UnitQuestionsState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UnitQuestionsApiActions.loadDataSuccess, (state, { subjects, units, questions, answers }): UnitQuestionsState => ({
    ...state,
    subjects,
    units,
    questions,
    answers,
    loading: false,
  })),
  on(UnitQuestionsApiActions.loadDataFailure, (state, { error }): UnitQuestionsState => ({
    ...state,
    loading: false,
    error,
  })),
);
