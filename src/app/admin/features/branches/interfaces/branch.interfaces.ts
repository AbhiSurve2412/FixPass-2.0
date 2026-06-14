export interface Branch {
  id: string;
  name: string;
  shortName: string;
  description: string;
}

export type BranchForm = Omit<Branch, 'id'>;
