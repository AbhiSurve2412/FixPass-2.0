import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { University, UniversityForm } from '../../interfaces/university.interfaces';

export const UniversityApiActions = createActionGroup({
  source: 'University API',
  events: {
    'Load Universities': emptyProps(),
    'Load Universities Success': props<{ universities: University[] }>(),
    'Load Universities Failure': props<{ error: string }>(),
    'Create University': props<{ form: UniversityForm }>(),
    'Create University Success': props<{ university: University }>(),
    'Create University Failure': props<{ error: string }>(),
    'Update University': props<{ university: University }>(),
    'Update University Success': props<{ university: University }>(),
    'Update University Failure': props<{ error: string }>(),
    'Delete University': props<{ id: string }>(),
    'Delete University Success': props<{ id: string }>(),
    'Delete University Failure': props<{ error: string }>(),
  },
});
