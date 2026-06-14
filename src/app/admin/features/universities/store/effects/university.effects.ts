import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UniversityApiActions } from '../actions/university.actions';
import { UniversityService } from '../../services/university.service';

@Injectable()
export class UniversityEffects {
  private readonly actions$ = inject(Actions);
  private readonly universityService = inject(UniversityService);

  loadUniversities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UniversityApiActions.loadUniversities),
      switchMap(() =>
        this.universityService.getAll().pipe(
          map((universities) =>
            UniversityApiActions.loadUniversitiesSuccess({ universities }),
          ),
          catchError((err: Error) =>
            of(UniversityApiActions.loadUniversitiesFailure({
              error: err?.message ?? 'Failed to load universities',
            })),
          ),
        ),
      ),
    ),
  );

  createUniversity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UniversityApiActions.createUniversity),
      mergeMap(({ form }) =>
        this.universityService.create(form).pipe(
          map((university) =>
            UniversityApiActions.createUniversitySuccess({ university }),
          ),
          catchError((err: Error) =>
            of(UniversityApiActions.createUniversityFailure({
              error: err?.message ?? 'Failed to create university',
            })),
          ),
        ),
      ),
    ),
  );

  updateUniversity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UniversityApiActions.updateUniversity),
      mergeMap(({ university }) =>
        this.universityService.update(university).pipe(
          map((updated) =>
            UniversityApiActions.updateUniversitySuccess({ university: updated }),
          ),
          catchError((err: Error) =>
            of(UniversityApiActions.updateUniversityFailure({
              error: err?.message ?? 'Failed to update university',
            })),
          ),
        ),
      ),
    ),
  );

  deleteUniversity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UniversityApiActions.deleteUniversity),
      mergeMap(({ id }) =>
        this.universityService.delete(id).pipe(
          map(() =>
            UniversityApiActions.deleteUniversitySuccess({ id }),
          ),
          catchError((err: Error) =>
            of(UniversityApiActions.deleteUniversityFailure({
              error: err?.message ?? 'Failed to delete university',
            })),
          ),
        ),
      ),
    ),
  );
}
