import { createReducer, on } from '@ngrx/store';
import { HomeApiActions } from '../actions/home.actions';
import { HomeState, initialHomeState } from '../state/home.state';

export const homeReducer = createReducer(
  initialHomeState,

  on(HomeApiActions.loadHomePage, (state): HomeState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HomeApiActions.loadHomePageSuccess, (state, { data }): HomeState => ({
    ...state,
    loading: false,
    data,
  })),

  on(HomeApiActions.loadHomePageFailure, (state, { error }): HomeState => ({
    ...state,
    loading: false,
    error,
  })),
);
