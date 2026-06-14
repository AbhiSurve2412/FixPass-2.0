import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  ExtractedQuestion,
  PdfImportMetadata,
  Question,
  QuestionForm,
} from '../../interfaces/question.interfaces';

export const QuestionApiActions = createActionGroup({
  source: 'Question API',
  events: {
    'Load Questions': emptyProps(),
    'Load Questions Success': props<{ questions: Question[] }>(),
    'Load Questions Failure': props<{ error: string }>(),

    'Create Question': props<{ form: QuestionForm }>(),
    'Create Question Success': props<{ question: Question }>(),
    'Create Question Failure': props<{ error: string }>(),

    'Update Question': props<{ question: Question }>(),
    'Update Question Success': props<{ question: Question }>(),
    'Update Question Failure': props<{ error: string }>(),

    'Delete Question': props<{ id: string }>(),
    'Delete Question Success': props<{ id: string }>(),
    'Delete Question Failure': props<{ error: string }>(),

    'Extract Questions From Pdf': props<{ files: File[]; metadata: PdfImportMetadata }>(),
    'Extract Questions From Pdf Success': props<{ questions: ExtractedQuestion[] }>(),
    'Extract Questions From Pdf Failure': props<{ error: string }>(),

    'Import Extracted Questions': props<{ questions: ExtractedQuestion[]; metadata: PdfImportMetadata }>(),
    'Import Extracted Questions Success': props<{ questions: Question[] }>(),
    'Import Extracted Questions Failure': props<{ error: string }>(),

    'Clear Extracted Questions': emptyProps(),
  },
});
