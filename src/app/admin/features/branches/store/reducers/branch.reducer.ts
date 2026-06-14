import { createReducer, on } from '@ngrx/store';
import { BranchApiActions } from '../actions/branch.actions';
import { BranchState, initialBranchState } from '../state/branch.state';

export const branchReducer = createReducer(
  initialBranchState,

  // ── Load ────────────────────────────────────────────────────────────────────
  on(BranchApiActions.loadBranches, (state): BranchState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BranchApiActions.loadBranchesSuccess, (state, { branches }): BranchState => ({
    ...state,
    loading: false,
    data: branches,
  })),

  on(BranchApiActions.loadBranchesFailure, (state, { error }): BranchState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Create ──────────────────────────────────────────────────────────────────
  on(BranchApiActions.createBranch, (state): BranchState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BranchApiActions.createBranchSuccess, (state, { branch }): BranchState => ({
    ...state,
    loading: false,
    data: [...state.data, branch],
  })),

  on(BranchApiActions.createBranchFailure, (state, { error }): BranchState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Update ──────────────────────────────────────────────────────────────────
  on(BranchApiActions.updateBranch, (state): BranchState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BranchApiActions.updateBranchSuccess, (state, { branch }): BranchState => ({
    ...state,
    loading: false,
    data: state.data.map((b) => (b.id === branch.id ? branch : b)),
  })),

  on(BranchApiActions.updateBranchFailure, (state, { error }): BranchState => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Delete ──────────────────────────────────────────────────────────────────
  on(BranchApiActions.deleteBranch, (state): BranchState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BranchApiActions.deleteBranchSuccess, (state, { id }): BranchState => ({
    ...state,
    loading: false,
    data: state.data.filter((b) => b.id !== id),
  })),

  on(BranchApiActions.deleteBranchFailure, (state, { error }): BranchState => ({
    ...state,
    loading: false,
    error,
  })),
);
