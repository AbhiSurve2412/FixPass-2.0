import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SubjectApiActions } from '../actions/subject.actions';
import { SubjectService } from '../../services/subject.service';

@Injectable()
export class SubjectEffects {
  private readonly actions$ = inject(Actions);
  private readonly subjectService = inject(SubjectService);

  loadSubjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectApiActions.loadSubjects),
      switchMap(() =>
        this.subjectService.getAll().pipe(
          map((subjects) =>
            SubjectApiActions.loadSubjectsSuccess({ subjects }),
          ),
          catchError((err: Error) =>
            of(SubjectApiActions.loadSubjectsFailure({
              error: err?.message ?? 'Failed to load subjects',
            })),
          ),
        ),
      ),
    ),
  );

  createSubject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectApiActions.createSubject),
      mergeMap(({ form }) =>
        this.subjectService.create(form).pipe(
          map((subject) =>
            SubjectApiActions.createSubjectSuccess({ subject }),
          ),
          catchError((err: Error) =>
            of(SubjectApiActions.createSubjectFailure({
              error: err?.message ?? 'Failed to create subject',
            })),
          ),
        ),
      ),
    ),
  );

  updateSubject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectApiActions.updateSubject),
      mergeMap(({ subject }) =>
        this.subjectService.update(subject).pipe(
          map((updated) =>
            SubjectApiActions.updateSubjectSuccess({ subject: updated }),
          ),
          catchError((err: Error) =>
            of(SubjectApiActions.updateSubjectFailure({
              error: err?.message ?? 'Failed to update subject',
            })),
          ),
        ),
      ),
    ),
  );

  deleteSubject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubjectApiActions.deleteSubject),
      mergeMap(({ id }) =>
        this.subjectService.delete(id).pipe(
          map(() =>
            SubjectApiActions.deleteSubjectSuccess({ id }),
          ),
          catchError((err: Error) =>
            of(SubjectApiActions.deleteSubjectFailure({
              error: err?.message ?? 'Failed to delete subject',
            })),
          ),
        ),
      ),
    ),
  );
}
