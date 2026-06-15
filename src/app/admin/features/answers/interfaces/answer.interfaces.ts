export type BlockType =
  | 'header'
  | 'subHeader'
  | 'text'
  | 'content'
  | 'Olist'
  | 'Ulist'
  | 'table'
  | 'diagram'
  | 'sqlCode';

export const ANSWER_TYPE = { DETAILED: 'Detailed', SIMPLE: 'Simple' } as const;
export type AnswerType = typeof ANSWER_TYPE[keyof typeof ANSWER_TYPE];

export interface ListSubpoint {
  text: string;
  subpointsObject?: { subpoints: ListSubpoint[] };
}

export interface ListItem {
  text: string;
  subpointsObject?: { subpoints: ListSubpoint[] };
}

export interface HeaderBlock {
  type: 'header';
  data: string;
}
export interface SubHeaderBlock {
  type: 'subHeader';
  data: string;
}
export interface TextBlock {
  type: 'text' | 'content';
  data: string;
}
export interface ListBlock {
  type: 'Olist' | 'Ulist';
  dataObject: { items: ListItem[] };
}
export interface TableBlock {
  type: 'table';
  dataObject: { headers: string[]; rows: Record<string, string>[] };
}
export interface DiagramBlock {
  type: 'diagram';
  data: { url: string; description: string };
}
export interface SqlCodeBlock {
  type: 'sqlCode';
  data: string;
}

export type AnswerBlock =
  | HeaderBlock
  | SubHeaderBlock
  | TextBlock
  | ListBlock
  | TableBlock
  | DiagramBlock
  | SqlCodeBlock;

export interface AnswerContent {
  content: AnswerBlock[];
}

// EditorBlock adds runtime-only tracking fields, stripped before save
export type EditorBlock = AnswerBlock & { _id: string; _collapsed?: boolean };

export interface Answer {
  id: string;
  questionId: string;
  questionText: string;
  subjectId: string;
  subjectName: string;
  unitId: string;
  unitName: string;
  answerType: AnswerType;
  answer: AnswerContent;
  createdAt: string;
  updatedAt: string;
}

export type AnswerTemplate =
  | 'definition'
  | 'theory'
  | 'advantages-disadvantages'
  | 'comparison'
  | 'architecture'
  | 'working-principle'
  | 'algorithm'
  | 'database'
  | 'sql-query';

export interface GenerateAnswerRequest {
  question: string;
  answerType: AnswerType;
}

export interface UpdateAnswerRequest {
  question: string;
  currentAnswer: AnswerContent;
  contentInstruction: string;
  structureInstruction: string;
}
