import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import { UnitQuestionsApiActions } from '../actions/unit-questions.actions';
import { UnitQuestionsService } from '../../services/unit-questions.service';

@Injectable()
export class UnitQuestionsEffects {
  private readonly actions$ = inject(Actions);
  private readonly service  = inject(UnitQuestionsService);

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitQuestionsApiActions.loadData),
      switchMap(() =>
        forkJoin({
          subjects: this.service.getSubjects(),
          units:    this.service.getUnits(),
          questions: this.service.getQuestions(),
          answers:  this.service.getAnswers(),
        }).pipe(
          map(({ subjects, units, questions, answers }) =>
            UnitQuestionsApiActions.loadDataSuccess({ subjects, units, questions, answers }),
          ),
          catchError((err: Error) =>
            of(UnitQuestionsApiActions.loadDataFailure({ error: err?.message ?? 'Failed to load data' })),
          ),
        ),
      ),
    ),
  );
}
