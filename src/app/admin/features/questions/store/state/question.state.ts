import { ExtractedQuestion, Question } from '../../interfaces/question.interfaces';

export interface QuestionState {
  loading: boolean;
  extracting: boolean;
  importing: boolean;
  data: Question[];
  extractedQuestions: ExtractedQuestion[];
  error: string | null;
}

export const initialQuestionState: QuestionState = {
  loading: false,
  extracting: false,
  importing: false,
  data: [],
  extractedQuestions: [],
  error: null,
};
