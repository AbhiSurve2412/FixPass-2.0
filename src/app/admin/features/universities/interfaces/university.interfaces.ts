export interface University {
  id: string;
  name: string;
  description: string;
}

export type UniversityForm = Omit<University, 'id'>;
