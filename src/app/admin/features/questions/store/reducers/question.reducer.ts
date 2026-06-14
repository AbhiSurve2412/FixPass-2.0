import { createReducer, on } from '@ngrx/store';
import { QuestionApiActions } from '../actions/question.actions';
import { QuestionState, initialQuestionState } from '../state/question.state';

export const questionReducer = createReducer(
  initialQuestionState,

  // ── Load ────────────────────────────────────────────────────────────────────
  on(QuestionApiActions.loadQuestions, (state): QuestionState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuestionApiActions.loadQuestionsSuccess, (state, { questions }): QuestionState => ({
    ...state,
    loading: false,
    data: questions,
  })),

  on(QuestionApiActions.loadQuestionsFailure, (state, { error }): QuestionState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Create ──────────────────────────────────────────────────────────────────
  on(QuestionApiActions.createQuestion, (state): QuestionState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuestionApiActions.createQuestionSuccess, (state, { question }): QuestionState => ({
    ...state,
    loading: false,
    data: [...state.data, question],
  })),

  on(QuestionApiActions.createQuestionFailure, (state, { error }): QuestionState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Update ──────────────────────────────────────────────────────────────────
  on(QuestionApiActions.updateQuestion, (state): QuestionState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuestionApiActions.updateQuestionSuccess, (state, { question }): QuestionState => ({
    ...state,
    loading: false,
    data: state.data.map(q => (q.id === question.id ? question : q)),
  })),

  on(QuestionApiActions.updateQuestionFailure, (state, { error }): QuestionState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Delete ──────────────────────────────────────────────────────────────────
  on(QuestionApiActions.deleteQuestion, (state): QuestionState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuestionApiActions.deleteQuestionSuccess, (state, { id }): QuestionState => ({
    ...state,
    loading: false,
    data: state.data.filter(q => q.id !== id),
  })),

  on(QuestionApiActions.deleteQuestionFailure, (state, { error }): QuestionState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Extract from PDF ────────────────────────────────────────────────────────
  on(QuestionApiActions.extractQuestionsFromPdf, (state): QuestionState => ({
    ...state,
    extracting: true,
    extractedQuestions: [],
    error: null,
  })),

  on(QuestionApiActions.extractQuestionsFromPdfSuccess, (state, { questions }): QuestionState => ({
    ...state,
    extracting: false,
    extractedQuestions: questions,
  })),

  on(QuestionApiActions.extractQuestionsFromPdfFailure, (state, { error }): QuestionState => ({
    ...state,
    extracting: false,
    error,
  })),

  // ── Import Extracted ────────────────────────────────────────────────────────
  on(QuestionApiActions.importExtractedQuestions, (state): QuestionState => ({
    ...state,
    importing: true,
    error: null,
  })),

  on(QuestionApiActions.importExtractedQuestionsSuccess, (state, { questions }): QuestionState => ({
    ...state,
    importing: false,
    data: [...state.data, ...questions],
    extractedQuestions: [],
  })),

  on(QuestionApiActions.importExtractedQuestionsFailure, (state, { error }): QuestionState => ({
    ...state,
    importing: false,
    error,
  })),

  // ── Clear Extracted ─────────────────────────────────────────────────────────
  on(QuestionApiActions.clearExtractedQuestions, (state): QuestionState => ({
    ...state,
    extractedQuestions: [],
  })),
);
