export type FieldType = 'text' | 'textarea' | 'select' | 'number';
export type ModalMode = 'create' | 'edit' | 'view';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type AcademicYear = 'FE' | 'SE' | 'TE' | 'BE';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface ModalField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  rows?: number;
}

export interface GridColumn {
  key: string;
  header: string;
  flex?: number;
  truncate?: boolean;
}

export interface GridActionEvent {
  type: 'view' | 'edit' | 'delete';
  id: string;
}

export interface GroupedAccordionGroup {
  id: string;
  label: string;
  subtitle?: string;
  items: Record<string, unknown>[];
}

export interface AdminEntityState<T> {
  loading: boolean;
  data: T[];
  error: string | null;
}

export interface GridGroup {
  id: string;
  label: string;
  subtitle?: string;
  rows: Record<string, unknown>[];
}
