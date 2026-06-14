import { AcademicYear, Semester } from '../../../shared/interfaces/admin-shared.interfaces';

export interface Subject {
  id: string;
  name: string;
  code: string;
  year: AcademicYear;
  branchId: string;
  branchName: string;
  semester: Semester;
  description: string;
}

export type SubjectForm = Omit<Subject, 'id' | 'branchName'>;
