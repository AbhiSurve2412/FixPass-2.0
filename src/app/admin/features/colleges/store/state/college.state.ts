import { College } from '../../interfaces/college.interfaces';

export interface CollegeState {
  loading: boolean;
  data: College[];
  error: string | null;
}

export const initialCollegeState: CollegeState = {
  loading: false,
  data: [],
  error: null,
};
