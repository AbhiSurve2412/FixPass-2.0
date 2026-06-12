import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HomeApiActions } from '../actions/home.actions';
import { HomeService } from '../../services/home.service';

@Injectable()
export class HomeEffects {
  private readonly actions$ = inject(Actions);
  private readonly homeService = inject(HomeService);

  loadHomePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeApiActions.loadHomePage),
      switchMap(() =>
        this.homeService.getHomePageData().pipe(
          map((data) => HomeApiActions.loadHomePageSuccess({ data })),
          catchError((err: Error) =>
            of(HomeApiActions.loadHomePageFailure({
              error: err?.message ?? 'Failed to load home page data',
            })),
          ),
        ),
      ),
    ),
  );
}
