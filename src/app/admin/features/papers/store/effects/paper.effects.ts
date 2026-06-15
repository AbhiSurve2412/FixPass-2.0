import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PaperApiActions } from '../actions/paper.actions';
import { PaperService } from '../../services/paper.service';

@Injectable()
export class PaperEffects {
  private readonly actions$ = inject(Actions);
  private readonly paperService = inject(PaperService);

  loadPapers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaperApiActions.loadPapers),
      switchMap(() =>
        this.paperService.getAll().pipe(
          map(papers => PaperApiActions.loadPapersSuccess({ papers })),
          catchError((err: Error) =>
            of(PaperApiActions.loadPapersFailure({ error: err?.message ?? 'Failed to load papers' })),
          ),
        ),
      ),
    ),
  );
}
