import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AnswerApiActions } from '../actions/answer.actions';
import { AnswerService } from '../../services/answer.service';

@Injectable()
export class AnswerEffects {
  private readonly actions$ = inject(Actions);
  private readonly answerService = inject(AnswerService);

  loadAnswers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnswerApiActions.loadAnswers),
      switchMap(() =>
        this.answerService.getAll().pipe(
          map(answers => AnswerApiActions.loadAnswersSuccess({ answers })),
          catchError((err: Error) =>
            of(AnswerApiActions.loadAnswersFailure({ error: err?.message ?? 'Failed to load answers' })),
          ),
        ),
      ),
    ),
  );

  saveAnswer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnswerApiActions.saveAnswer),
      mergeMap(({ answer }) =>
        this.answerService.save(answer).pipe(
          map(saved => AnswerApiActions.saveAnswerSuccess({ answer: saved })),
          catchError((err: Error) =>
            of(AnswerApiActions.saveAnswerFailure({ error: err?.message ?? 'Failed to save answer' })),
          ),
        ),
      ),
    ),
  );

  deleteAnswer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnswerApiActions.deleteAnswer),
      mergeMap(({ id }) =>
        this.answerService.delete(id).pipe(
          map(() => AnswerApiActions.deleteAnswerSuccess({ id })),
          catchError((err: Error) =>
            of(AnswerApiActions.deleteAnswerFailure({ error: err?.message ?? 'Failed to delete answer' })),
          ),
        ),
      ),
    ),
  );

  generateDetailedAnswer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnswerApiActions.generateDetailedAnswer),
      switchMap(({ questionText }) =>
        this.answerService.generateAnswer(questionText, 'Detailed').pipe(
          mergeMap(content => [
            AnswerApiActions.generateDetailedAnswerSuccess({ content }),
            AnswerApiActions.setCurrentDetailedAnswer({ content }),
          ]),
          catchError((err: Error) =>
            of(AnswerApiActions.generateDetailedAnswerFailure({ error: err?.message ?? 'Failed to generate answer' })),
          ),
        ),
      ),
    ),
  );

  generateSimpleAnswer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnswerApiActions.generateSimpleAnswer),
      switchMap(({ questionText }) =>
        this.answerService.generateAnswer(questionText, 'Simple').pipe(
          mergeMap(content => [
            AnswerApiActions.generateSimpleAnswerSuccess({ content }),
            AnswerApiActions.setCurrentSimpleAnswer({ content }),
          ]),
          catchError((err: Error) =>
            of(AnswerApiActions.generateSimpleAnswerFailure({ error: err?.message ?? 'Failed to generate answer' })),
          ),
        ),
      ),
    ),
  );

  updateAnswerContent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnswerApiActions.updateAnswerContent),
      switchMap(({ questionText, currentAnswer, contentInstruction, structureInstruction }) =>
        this.answerService
          .updateAnswer({
            question: questionText,
            currentAnswer,
            contentInstruction,
            structureInstruction,
          })
          .pipe(
            mergeMap(content => [
              AnswerApiActions.updateAnswerContentSuccess({ content }),
              AnswerApiActions.setCurrentDetailedAnswer({ content }),
            ]),
            catchError((err: Error) =>
              of(AnswerApiActions.updateAnswerContentFailure({ error: err?.message ?? 'Failed to update answer' })),
            ),
          ),
      ),
    ),
  );
}
