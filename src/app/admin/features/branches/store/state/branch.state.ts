import { Branch } from '../../interfaces/branch.interfaces';

export interface BranchState {
  loading: boolean;
  data: Branch[];
  error: string | null;
}

export const initialBranchState: BranchState = {
  loading: false,
  data: [],
  error: null,
};
