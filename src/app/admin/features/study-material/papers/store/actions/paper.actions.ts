import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AcademicYear } from '../../../../../shared/interfaces/admin-shared.interfaces';
import { PaperPattern, PreviousYearPaper } from '../../interfaces/paper.interfaces';

export const PaperApiActions = createActionGroup({
  source: 'Paper API',
  events: {
    'Load Papers': emptyProps(),
    'Load Papers Success': props<{ papers: PreviousYearPaper[] }>(),
    'Load Papers Failure': props<{ error: string }>(),
    'Set Filter Branch': props<{ branchName: string | null }>(),
    'Set Filter Year': props<{ academicYear: AcademicYear | null }>(),
    'Set Filter Pattern': props<{ pattern: PaperPattern | null }>(),
    'Set Filter Subject': props<{ subjectName: string | null }>(),
    'Clear Filters': emptyProps(),
  },
});
