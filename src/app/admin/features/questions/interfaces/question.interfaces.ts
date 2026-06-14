import { Difficulty } from '../../../shared/interfaces/admin-shared.interfaces';

export type QuestionType = 'long-answer' | 'short-note' | 'numerical' | 'definition' | 'mcq';
export type ExamSeason = 'Summer' | 'Winter';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuestionYear {
  year: number;
  season: ExamSeason;
  paperCode: string;
}

export interface Question {
  id: string;
  text: string;
  subjectId: string;
  subjectName: string;
  unitId: string;
  unitName: string;
  difficulty: Difficulty;
  marks: number;
  type: QuestionType;
  isImportant: boolean;
  askedIn: QuestionYear[];
  tags: string[];
  options: QuestionOption[];
  correctOptionId: string;
  imageUrls: string[];
  tableHtml: string;
  detailedAnswer: string;
  simpleAnswer: string;
  revisionNotes: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type QuestionForm = Omit<Question, 'id' | 'createdAt' | 'updatedAt'>;

export interface ExtractedQuestion {
  id: string;
  text: string;
  estimatedMarks: number;
  questionNumber: string;
  needsReview: boolean;
  confidence: number;
  unitId: string;
  difficulty: Difficulty;
  type: QuestionType;
  isImportant: boolean;
  options: QuestionOption[];
  correctOptionId: string;
  imageUrls: string[];
  tableHtml: string;
}

export interface PdfImportMetadata {
  subjectId: string;
  subjectName: string;
  unitId: string;
  examSeason: ExamSeason;
  academicYear: number;
  paperCode: string;
  unitLookup: { id: string; name: string }[];
}

export interface QuestionExplorerUnit {
  unitId: string;
  unitName: string;
  questionCount: number;
}

export interface QuestionExplorerNode {
  subjectId: string;
  subjectName: string;
  expanded: boolean;
  units: QuestionExplorerUnit[];
}
