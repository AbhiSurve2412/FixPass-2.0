import { Difficulty } from '../../../shared/interfaces/admin-shared.interfaces';

export interface Unit {
  id: string;
  name: string;
  subjectId: string;
  subjectName: string;
  difficulty: Difficulty | '';
  description: string;
}

export type UnitForm = Omit<Unit, 'id' | 'subjectName'>;
