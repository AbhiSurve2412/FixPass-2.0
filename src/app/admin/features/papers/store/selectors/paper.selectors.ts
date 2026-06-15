import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SelectOption } from '../../../../shared/interfaces/admin-shared.interfaces';
import { PaperState } from '../state/paper.state';

// ── Feature root ──────────────────────────────────────────────────────────────

export const getPapersState = createFeatureSelector<PaperState>('papers');

// ── Primitive slices ──────────────────────────────────────────────────────────

export const getPapers = createSelector(
  getPapersState,
  (state) => state.data,
);

export const getPapersLoading = createSelector(
  getPapersState,
  (state): boolean => state.loading,
);

export const getPapersError = createSelector(
  getPapersState,
  (state): string | null => state.error,
);

export const getPaperFilters = createSelector(
  getPapersState,
  (state) => state.filters,
);

// ── Papers filtered by branch + year + pattern (no subject) ──────────────────
// Used to derive subject options so the dropdown never empties itself.

const getPapersFilteredWithoutSubject = createSelector(
  getPapers,
  getPaperFilters,
  (papers, filters) => {
    return papers.filter(p => {
      if (filters.branchName && p.branchName !== filters.branchName) return false;
      if (filters.academicYear && p.academicYear !== filters.academicYear) return false;
      if (filters.pattern && p.pattern !== filters.pattern) return false;
      return true;
    });
  },
);

// ── Fully filtered papers (all 4 filters applied) ────────────────────────────

export const getFilteredPapers = createSelector(
  getPapersFilteredWithoutSubject,
  getPaperFilters,
  (papers, filters) => {
    if (!filters.subjectName) return papers;
    return papers.filter(p => p.subjectName === filters.subjectName);
  },
);

// ── Subject options (derived from branch+year+pattern filtered set) ───────────

export const getPaperSubjectOptions = createSelector(
  getPapersFilteredWithoutSubject,
  (papers): SelectOption[] => {
    const seen = new Set<string>();
    const options: SelectOption[] = [];
    for (const p of papers) {
      if (!seen.has(p.subjectName)) {
        seen.add(p.subjectName);
        options.push({ label: p.subjectName, value: p.subjectName });
      }
    }
    return options.sort((a, b) => (a.label as string).localeCompare(b.label as string));
  },
);
