import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BranchApiActions } from '../actions/branch.actions';
import { BranchService } from '../../services/branch.service';

@Injectable()
export class BranchEffects {
  private readonly actions$ = inject(Actions);
  private readonly branchService = inject(BranchService);

  loadBranches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchApiActions.loadBranches),
      switchMap(() =>
        this.branchService.getAll().pipe(
          map((branches) =>
            BranchApiActions.loadBranchesSuccess({ branches }),
          ),
          catchError((err: Error) =>
            of(BranchApiActions.loadBranchesFailure({
              error: err?.message ?? 'Failed to load branches',
            })),
          ),
        ),
      ),
    ),
  );

  createBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchApiActions.createBranch),
      mergeMap(({ form }) =>
        this.branchService.create(form).pipe(
          map((branch) =>
            BranchApiActions.createBranchSuccess({ branch }),
          ),
          catchError((err: Error) =>
            of(BranchApiActions.createBranchFailure({
              error: err?.message ?? 'Failed to create branch',
            })),
          ),
        ),
      ),
    ),
  );

  updateBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchApiActions.updateBranch),
      mergeMap(({ branch }) =>
        this.branchService.update(branch).pipe(
          map((updated) =>
            BranchApiActions.updateBranchSuccess({ branch: updated }),
          ),
          catchError((err: Error) =>
            of(BranchApiActions.updateBranchFailure({
              error: err?.message ?? 'Failed to update branch',
            })),
          ),
        ),
      ),
    ),
  );

  deleteBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchApiActions.deleteBranch),
      mergeMap(({ id }) =>
        this.branchService.delete(id).pipe(
          map(() =>
            BranchApiActions.deleteBranchSuccess({ id }),
          ),
          catchError((err: Error) =>
            of(BranchApiActions.deleteBranchFailure({
              error: err?.message ?? 'Failed to delete branch',
            })),
          ),
        ),
      ),
    ),
  );
}
