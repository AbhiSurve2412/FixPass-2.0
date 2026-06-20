import { Subject } from '../../../../subjects/interfaces/subject.interfaces';
import { Unit } from '../../../../units/interfaces/unit.interfaces';
import { Question } from '../../../../questions/interfaces/question.interfaces';
import { Answer } from '../../../../answers/interfaces/answer.interfaces';

export interface UnitQuestionsState {
  subjects: Subject[];
  units: Unit[];
  questions: Question[];
  answers: Answer[];
  loading: boolean;
  error: string | null;
}

export const initialUnitQuestionsState: UnitQuestionsState = {
  subjects: [],
  units: [],
  questions: [],
  answers: [],
  loading: false,
  error: null,
};
