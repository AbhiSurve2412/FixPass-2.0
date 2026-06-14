import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Answer, AnswerContent, AnswerType } from '../../interfaces/answer.interfaces';

export const AnswerApiActions = createActionGroup({
  source: 'Answer API',
  events: {
    'Load Answers': emptyProps(),
    'Load Answers Success': props<{ answers: Answer[] }>(),
    'Load Answers Failure': props<{ error: string }>(),

    'Save Answer': props<{ answer: Answer }>(),
    'Save Answer Success': props<{ answer: Answer }>(),
    'Save Answer Failure': props<{ error: string }>(),

    'Publish Answer': props<{ id: string }>(),
    'Publish Answer Success': props<{ answer: Answer }>(),
    'Publish Answer Failure': props<{ error: string }>(),

    'Delete Answer': props<{ id: string }>(),
    'Delete Answer Success': props<{ id: string }>(),
    'Delete Answer Failure': props<{ error: string }>(),

    'Generate Detailed Answer': props<{ questionText: string }>(),
    'Generate Detailed Answer Success': props<{ content: AnswerContent }>(),
    'Generate Detailed Answer Failure': props<{ error: string }>(),

    'Generate Simple Answer': props<{ questionText: string }>(),
    'Generate Simple Answer Success': props<{ content: AnswerContent }>(),
    'Generate Simple Answer Failure': props<{ error: string }>(),

    'Update Answer Content': props<{
      questionText: string;
      currentAnswer: AnswerContent;
      contentInstruction: string;
      structureInstruction: string;
    }>(),
    'Update Answer Content Success': props<{ content: AnswerContent }>(),
    'Update Answer Content Failure': props<{ error: string }>(),

    'Set Selected Subject': props<{ subjectId: string | null }>(),
    'Set Selected Unit': props<{ unitId: string | null }>(),
    'Set Selected Question': props<{ questionId: string | null }>(),
    'Set Active Answer Type': props<{ answerType: AnswerType }>(),
    'Set Current Detailed Answer': props<{ content: AnswerContent }>(),
    'Set Current Simple Answer': props<{ content: AnswerContent }>(),
    'Clear Workspace': emptyProps(),
  },
});
