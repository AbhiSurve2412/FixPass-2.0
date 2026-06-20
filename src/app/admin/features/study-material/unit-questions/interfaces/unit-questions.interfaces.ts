import type { Subject } from '../../../subjects/interfaces/subject.interfaces';
import type { Unit } from '../../../units/interfaces/unit.interfaces';
import type { Question, QuestionType, AnswerBlock } from '../../../questions/interfaces/question.interfaces';
import type { Answer } from '../../../answers/interfaces/answer.interfaces';
import type { AcademicYear } from '../../../../shared/interfaces/admin-shared.interfaces';

export type { Subject, Unit, Question, QuestionType, AnswerBlock, Answer, AcademicYear };

export interface YearGroup { year: AcademicYear; label: string; subjects: Subject[]; }
export type FilterType = QuestionType | '';
