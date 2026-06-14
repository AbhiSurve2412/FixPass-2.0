import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UnitApiActions } from '../actions/unit.actions';
import { UnitService } from '../../services/unit.service';

@Injectable()
export class UnitEffects {
  private readonly actions$ = inject(Actions);
  private readonly unitService = inject(UnitService);

  loadUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitApiActions.loadUnits),
      switchMap(() =>
        this.unitService.getAll().pipe(
          map((units) =>
            UnitApiActions.loadUnitsSuccess({ units }),
          ),
          catchError((err: Error) =>
            of(UnitApiActions.loadUnitsFailure({
              error: err?.message ?? 'Failed to load units',
            })),
          ),
        ),
      ),
    ),
  );

  createUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitApiActions.createUnit),
      mergeMap(({ form }) =>
        this.unitService.create(form).pipe(
          map((unit) =>
            UnitApiActions.createUnitSuccess({ unit }),
          ),
          catchError((err: Error) =>
            of(UnitApiActions.createUnitFailure({
              error: err?.message ?? 'Failed to create unit',
            })),
          ),
        ),
      ),
    ),
  );

  updateUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitApiActions.updateUnit),
      mergeMap(({ unit }) =>
        this.unitService.update(unit).pipe(
          map((updated) =>
            UnitApiActions.updateUnitSuccess({ unit: updated }),
          ),
          catchError((err: Error) =>
            of(UnitApiActions.updateUnitFailure({
              error: err?.message ?? 'Failed to update unit',
            })),
          ),
        ),
      ),
    ),
  );

  deleteUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitApiActions.deleteUnit),
      mergeMap(({ id }) =>
        this.unitService.delete(id).pipe(
          map(() =>
            UnitApiActions.deleteUnitSuccess({ id }),
          ),
          catchError((err: Error) =>
            of(UnitApiActions.deleteUnitFailure({
              error: err?.message ?? 'Failed to delete unit',
            })),
          ),
        ),
      ),
    ),
  );
}
