import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Branch, BranchForm } from '../../interfaces/branch.interfaces';

export const BranchApiActions = createActionGroup({
  source: 'Branch API',
  events: {
    'Load Branches': emptyProps(),
    'Load Branches Success': props<{ branches: Branch[] }>(),
    'Load Branches Failure': props<{ error: string }>(),
    'Create Branch': props<{ form: BranchForm }>(),
    'Create Branch Success': props<{ branch: Branch }>(),
    'Create Branch Failure': props<{ error: string }>(),
    'Update Branch': props<{ branch: Branch }>(),
    'Update Branch Success': props<{ branch: Branch }>(),
    'Update Branch Failure': props<{ error: string }>(),
    'Delete Branch': props<{ id: string }>(),
    'Delete Branch Success': props<{ id: string }>(),
    'Delete Branch Failure': props<{ error: string }>(),
  },
});
