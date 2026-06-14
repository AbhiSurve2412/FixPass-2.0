import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { College, CollegeForm } from '../../interfaces/college.interfaces';

export const CollegeApiActions = createActionGroup({
  source: 'College API',
  events: {
    'Load Colleges': emptyProps(),
    'Load Colleges Success': props<{ colleges: College[] }>(),
    'Load Colleges Failure': props<{ error: string }>(),
    'Create College': props<{ form: CollegeForm }>(),
    'Create College Success': props<{ college: College }>(),
    'Create College Failure': props<{ error: string }>(),
    'Update College': props<{ college: College }>(),
    'Update College Success': props<{ college: College }>(),
    'Update College Failure': props<{ error: string }>(),
    'Delete College': props<{ id: string }>(),
    'Delete College Success': props<{ id: string }>(),
    'Delete College Failure': props<{ error: string }>(),
  },
});
