import { University } from '../../interfaces/university.interfaces';

export interface UniversityState {
  loading: boolean;
  data: University[];
  error: string | null;
}

export const initialUniversityState: UniversityState = {
  loading: false,
  data: [],
  error: null,
};
