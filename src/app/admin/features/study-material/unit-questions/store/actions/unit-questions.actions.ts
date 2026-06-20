import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Subject } from '../../../../subjects/interfaces/subject.interfaces';
import { Unit } from '../../../../units/interfaces/unit.interfaces';
import { Question } from '../../../../questions/interfaces/question.interfaces';
import { Answer } from '../../../../answers/interfaces/answer.interfaces';

export const UnitQuestionsApiActions = createActionGroup({
  source: 'Unit Questions API',
  events: {
    'Load Data': emptyProps(),
    'Load Data Success': props<{
      subjects: Subject[];
      units: Unit[];
      questions: Question[];
      answers: Answer[];
    }>(),
    'Load Data Failure': props<{ error: string }>(),
  },
});
