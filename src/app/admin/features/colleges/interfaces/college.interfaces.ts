export interface College {
  id: string;
  name: string;
  universityId: string;
  universityName: string;
  description: string;
}

export type CollegeForm = Omit<College, 'id' | 'universityName'>;
