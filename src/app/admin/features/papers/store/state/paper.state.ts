import { PaperFilters, PreviousYearPaper } from '../../interfaces/paper.interfaces';

export interface PaperState {
  data: PreviousYearPaper[];
  loading: boolean;
  error: string | null;
  filters: PaperFilters;
}

export const initialPaperState: PaperState = {
  data: [],
  loading: false,
  error: null,
  filters: {
    branchName: null,
    academicYear: null,
    pattern: null,
    subjectName: null,
  },
};
