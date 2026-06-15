import { AcademicYear, Semester } from '../../../shared/interfaces/admin-shared.interfaces';

export const PAPER_PATTERN = { P2019: '2019', P2024: '2024' } as const;
export type PaperPattern = typeof PAPER_PATTERN[keyof typeof PAPER_PATTERN];

export const EXAM_MONTH = { NOV: 'November', MAY: 'May' } as const;
export type ExamMonth = typeof EXAM_MONTH[keyof typeof EXAM_MONTH];

export interface PreviousYearPaper {
  id: string;
  branchName: string;
  academicYear: AcademicYear;
  semester: Semester;
  pattern: PaperPattern;
  examYear: number;
  examMonth: ExamMonth;
  subjectName: string;
  subjectCode: string;
  fileUrl: string;
}

export interface PaperFilters {
  branchName: string | null;
  academicYear: AcademicYear | null;
  pattern: PaperPattern | null;
  subjectName: string | null;
}
