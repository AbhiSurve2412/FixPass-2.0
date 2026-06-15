import { createReducer, on } from '@ngrx/store';
import { ANSWER_TYPE } from '../../interfaces/answer.interfaces';
import { AnswerApiActions } from '../actions/answer.actions';
import { AnswerState, initialAnswerState } from '../state/answer.state';

export const answerReducer = createReducer(
  initialAnswerState,

  // ── Load ────────────────────────────────────────────────────────────────────
  on(AnswerApiActions.loadAnswers, (state): AnswerState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AnswerApiActions.loadAnswersSuccess, (state, { answers }): AnswerState => ({
    ...state,
    loading: false,
    data: answers,
  })),
  on(AnswerApiActions.loadAnswersFailure, (state, { error }): AnswerState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Save ────────────────────────────────────────────────────────────────────
  on(AnswerApiActions.saveAnswer, (state): AnswerState => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(AnswerApiActions.saveAnswerSuccess, (state, { answer }): AnswerState => ({
    ...state,
    saving: false,
    data: state.data.some(a => a.id === answer.id)
      ? state.data.map(a => (a.id === answer.id ? answer : a))
      : [...state.data, answer],
  })),
  on(AnswerApiActions.saveAnswerFailure, (state, { error }): AnswerState => ({
    ...state,
    saving: false,
    error,
  })),

  // ── Delete ──────────────────────────────────────────────────────────────────
  on(AnswerApiActions.deleteAnswer, (state): AnswerState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AnswerApiActions.deleteAnswerSuccess, (state, { id }): AnswerState => ({
    ...state,
    loading: false,
    data: state.data.filter(a => a.id !== id),
  })),
  on(AnswerApiActions.deleteAnswerFailure, (state, { error }): AnswerState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Generate Detailed ───────────────────────────────────────────────────────
  on(AnswerApiActions.generateDetailedAnswer, (state): AnswerState => ({
    ...state,
    generating: true,
    error: null,
  })),
  on(AnswerApiActions.generateDetailedAnswerSuccess, (state, { content }): AnswerState => ({
    ...state,
    generating: false,
    currentDetailedAnswer: content,
  })),
  on(AnswerApiActions.generateDetailedAnswerFailure, (state, { error }): AnswerState => ({
    ...state,
    generating: false,
    error,
  })),

  // ── Generate Simple ─────────────────────────────────────────────────────────
  on(AnswerApiActions.generateSimpleAnswer, (state): AnswerState => ({
    ...state,
    generating: true,
    error: null,
  })),
  on(AnswerApiActions.generateSimpleAnswerSuccess, (state, { content }): AnswerState => ({
    ...state,
    generating: false,
    currentSimpleAnswer: content,
  })),
  on(AnswerApiActions.generateSimpleAnswerFailure, (state, { error }): AnswerState => ({
    ...state,
    generating: false,
    error,
  })),

  // ── Update Content ──────────────────────────────────────────────────────────
  on(AnswerApiActions.updateAnswerContent, (state): AnswerState => ({
    ...state,
    generating: true,
    error: null,
  })),
  on(AnswerApiActions.updateAnswerContentSuccess, (state, { content }): AnswerState => ({
    ...state,
    generating: false,
    currentDetailedAnswer:
      state.activeAnswerType === ANSWER_TYPE.DETAILED ? content : state.currentDetailedAnswer,
    currentSimpleAnswer:
      state.activeAnswerType === ANSWER_TYPE.SIMPLE ? content : state.currentSimpleAnswer,
  })),
  on(AnswerApiActions.updateAnswerContentFailure, (state, { error }): AnswerState => ({
    ...state,
    generating: false,
    error,
  })),

  // ── Selection / Workspace ───────────────────────────────────────────────────
  on(AnswerApiActions.setSelectedSubject, (state, { subjectId }): AnswerState => ({
    ...state,
    selectedSubjectId: subjectId,
    selectedUnitId: null,
    selectedQuestionId: null,
  })),
  on(AnswerApiActions.setSelectedUnit, (state, { unitId }): AnswerState => ({
    ...state,
    selectedUnitId: unitId,
    selectedQuestionId: null,
  })),
  on(AnswerApiActions.setSelectedQuestion, (state, { questionId }): AnswerState => ({
    ...state,
    selectedQuestionId: questionId,
  })),
  on(AnswerApiActions.setActiveAnswerType, (state, { answerType }): AnswerState => ({
    ...state,
    activeAnswerType: answerType,
  })),
  on(AnswerApiActions.setCurrentDetailedAnswer, (state, { content }): AnswerState => ({
    ...state,
    currentDetailedAnswer: content,
  })),
  on(AnswerApiActions.setCurrentSimpleAnswer, (state, { content }): AnswerState => ({
    ...state,
    currentSimpleAnswer: content,
  })),
  on(AnswerApiActions.clearWorkspace, (state): AnswerState => ({
    ...state,
    selectedQuestionId: null,
    currentDetailedAnswer: null,
    currentSimpleAnswer: null,
    activeAnswerType: 'Detailed',
  })),
);
