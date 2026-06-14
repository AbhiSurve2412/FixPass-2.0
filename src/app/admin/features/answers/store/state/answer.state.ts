import { Answer, AnswerContent, AnswerType } from '../../interfaces/answer.interfaces';

export interface AnswerState {
  loading: boolean;
  generating: boolean;
  saving: boolean;
  data: Answer[];
  selectedSubjectId: string | null;
  selectedUnitId: string | null;
  selectedQuestionId: string | null;
  currentDetailedAnswer: AnswerContent | null;
  currentSimpleAnswer: AnswerContent | null;
  activeAnswerType: AnswerType;
  error: string | null;
}

export const initialAnswerState: AnswerState = {
  loading: false,
  generating: false,
  saving: false,
  data: [],
  selectedSubjectId: null,
  selectedUnitId: null,
  selectedQuestionId: null,
  currentDetailedAnswer: null,
  currentSimpleAnswer: null,
  activeAnswerType: 'Detailed',
  error: null,
};
