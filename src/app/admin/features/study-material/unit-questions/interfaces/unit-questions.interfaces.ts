import type { Subject } from '../../../subjects/interfaces/subject.interfaces';
import type { Unit } from '../../../units/interfaces/unit.interfaces';
import type { Question, QuestionType } from '../../../questions/interfaces/question.interfaces';
import type { Answer, AnswerBlock } from '../../../answers/interfaces/answer.interfaces';
import type { AcademicYear } from '../../../../shared/interfaces/admin-shared.interfaces';

export type { Subject, Unit, Question, QuestionType, Answer, AnswerBlock, AcademicYear };

export interface YearGroup { year: AcademicYear; label: string; subjects: Subject[]; }
export type FilterType = QuestionType | '';
