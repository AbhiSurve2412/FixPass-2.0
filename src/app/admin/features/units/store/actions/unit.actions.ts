import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Unit, UnitForm } from '../../interfaces/unit.interfaces';

export const UnitApiActions = createActionGroup({
  source: 'Unit API',
  events: {
    'Load Units': emptyProps(),
    'Load Units Success': props<{ units: Unit[] }>(),
    'Load Units Failure': props<{ error: string }>(),
    'Create Unit': props<{ form: UnitForm }>(),
    'Create Unit Success': props<{ unit: Unit }>(),
    'Create Unit Failure': props<{ error: string }>(),
    'Update Unit': props<{ unit: Unit }>(),
    'Update Unit Success': props<{ unit: Unit }>(),
    'Update Unit Failure': props<{ error: string }>(),
    'Delete Unit': props<{ id: string }>(),
    'Delete Unit Success': props<{ id: string }>(),
    'Delete Unit Failure': props<{ error: string }>(),
  },
});
