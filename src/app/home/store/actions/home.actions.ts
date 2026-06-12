import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HomePageData } from '../../interfaces/home.interfaces';

export const HomeApiActions = createActionGroup({
  source: 'Home API',
  events: {
    'Load Home Page': emptyProps(),
    'Load Home Page Success': props<{ data: HomePageData }>(),
    'Load Home Page Failure': props<{ error: string }>(),
  },
});
