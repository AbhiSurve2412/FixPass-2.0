import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CollegeApiActions } from '../actions/college.actions';
import { CollegeService } from '../../services/college.service';

@Injectable()
export class CollegeEffects {
  private readonly actions$ = inject(Actions);
  private readonly collegeService = inject(CollegeService);

  loadColleges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollegeApiActions.loadColleges),
      switchMap(() =>
        this.collegeService.getAll().pipe(
          map((colleges) =>
            CollegeApiActions.loadCollegesSuccess({ colleges }),
          ),
          catchError((err: Error) =>
            of(CollegeApiActions.loadCollegesFailure({
              error: err?.message ?? 'Failed to load colleges',
            })),
          ),
        ),
      ),
    ),
  );

  createCollege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollegeApiActions.createCollege),
      mergeMap(({ form }) =>
        this.collegeService.create(form).pipe(
          map((college) =>
            CollegeApiActions.createCollegeSuccess({ college }),
          ),
          catchError((err: Error) =>
            of(CollegeApiActions.createCollegeFailure({
              error: err?.message ?? 'Failed to create college',
            })),
          ),
        ),
      ),
    ),
  );

  updateCollege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollegeApiActions.updateCollege),
      mergeMap(({ college }) =>
        this.collegeService.update(college).pipe(
          map((updated) =>
            CollegeApiActions.updateCollegeSuccess({ college: updated }),
          ),
          catchError((err: Error) =>
            of(CollegeApiActions.updateCollegeFailure({
              error: err?.message ?? 'Failed to update college',
            })),
          ),
        ),
      ),
    ),
  );

  deleteCollege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollegeApiActions.deleteCollege),
      mergeMap(({ id }) =>
        this.collegeService.delete(id).pipe(
          map(() =>
            CollegeApiActions.deleteCollegeSuccess({ id }),
          ),
          catchError((err: Error) =>
            of(CollegeApiActions.deleteCollegeFailure({
              error: err?.message ?? 'Failed to delete college',
            })),
          ),
        ),
      ),
    ),
  );
}
