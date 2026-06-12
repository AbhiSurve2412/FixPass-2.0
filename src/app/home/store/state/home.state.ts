import { HomePageData } from '../../interfaces/home.interfaces';

export interface HomeState {
  loading: boolean;
  data: HomePageData | null;
  error: string | null;
}

export const initialHomeState: HomeState = {
  loading: false,
  data: null,
  error: null,
};
