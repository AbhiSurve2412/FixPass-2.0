import { Subject } from '../../interfaces/subject.interfaces';

export interface SubjectState {
  loading: boolean;
  data: Subject[];
  error: string | null;
}

export const initialSubjectState: SubjectState = {
  loading: false,
  data: [],
  error: null,
};
