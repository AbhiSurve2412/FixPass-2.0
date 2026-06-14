import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { QuestionApiActions } from '../actions/question.actions';
import { QuestionService } from '../../services/question.service';

@Injectable()
export class QuestionEffects {
  private readonly actions$ = inject(Actions);
  private readonly questionService = inject(QuestionService);

  loadQuestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionApiActions.loadQuestions),
      switchMap(() =>
        this.questionService.getAll().pipe(
          map(questions => QuestionApiActions.loadQuestionsSuccess({ questions })),
          catchError((err: Error) =>
            of(QuestionApiActions.loadQuestionsFailure({
              error: err?.message ?? 'Failed to load questions',
            })),
          ),
        ),
      ),
    ),
  );

  createQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionApiActions.createQuestion),
      mergeMap(({ form }) =>
        this.questionService.create(form).pipe(
          map(question => QuestionApiActions.createQuestionSuccess({ question })),
          catchError((err: Error) =>
            of(QuestionApiActions.createQuestionFailure({
              error: err?.message ?? 'Failed to create question',
            })),
          ),
        ),
      ),
    ),
  );

  updateQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionApiActions.updateQuestion),
      mergeMap(({ question }) =>
        this.questionService.update(question).pipe(
          map(updated => QuestionApiActions.updateQuestionSuccess({ question: updated })),
          catchError((err: Error) =>
            of(QuestionApiActions.updateQuestionFailure({
              error: err?.message ?? 'Failed to update question',
            })),
          ),
        ),
      ),
    ),
  );

  deleteQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionApiActions.deleteQuestion),
      mergeMap(({ id }) =>
        this.questionService.delete(id).pipe(
          map(() => QuestionApiActions.deleteQuestionSuccess({ id })),
          catchError((err: Error) =>
            of(QuestionApiActions.deleteQuestionFailure({
              error: err?.message ?? 'Failed to delete question',
            })),
          ),
        ),
      ),
    ),
  );

  extractQuestionsFromPdf$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionApiActions.extractQuestionsFromPdf),
      switchMap(({ files, metadata }) =>
        this.questionService.extractFromPdf(files, metadata).pipe(
          map(questions => QuestionApiActions.extractQuestionsFromPdfSuccess({ questions })),
          catchError((err: Error) =>
            of(QuestionApiActions.extractQuestionsFromPdfFailure({
              error: err?.message ?? 'Failed to extract questions from PDF',
            })),
          ),
        ),
      ),
    ),
  );

  importExtractedQuestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionApiActions.importExtractedQuestions),
      mergeMap(({ questions, metadata }) =>
        this.questionService.importExtracted(questions, metadata).pipe(
          map(imported => QuestionApiActions.importExtractedQuestionsSuccess({ questions: imported })),
          catchError((err: Error) =>
            of(QuestionApiActions.importExtractedQuestionsFailure({
              error: err?.message ?? 'Failed to import extracted questions',
            })),
          ),
        ),
      ),
    ),
  );
}
