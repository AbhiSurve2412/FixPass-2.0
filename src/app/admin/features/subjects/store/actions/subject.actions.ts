import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Subject, SubjectForm } from '../../interfaces/subject.interfaces';

export const SubjectApiActions = createActionGroup({
  source: 'Subject API',
  events: {
    'Load Subjects': emptyProps(),
    'Load Subjects Success': props<{ subjects: Subject[] }>(),
    'Load Subjects Failure': props<{ error: string }>(),
    'Create Subject': props<{ form: SubjectForm }>(),
    'Create Subject Success': props<{ subject: Subject }>(),
    'Create Subject Failure': props<{ error: string }>(),
    'Update Subject': props<{ subject: Subject }>(),
    'Update Subject Success': props<{ subject: Subject }>(),
    'Update Subject Failure': props<{ error: string }>(),
    'Delete Subject': props<{ id: string }>(),
    'Delete Subject Success': props<{ id: string }>(),
    'Delete Subject Failure': props<{ error: string }>(),
  },
});
