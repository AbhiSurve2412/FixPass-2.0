import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AcademicYear, SelectOption } from '../../../shared/interfaces/admin-shared.interfaces';
import { PAPER_PATTERN, PaperPattern, PreviousYearPaper } from '../interfaces/paper.interfaces';
import { PaperApiActions } from '../store/actions/paper.actions';
import {
  getFilteredPapers,
  getPaperFilters,
  getPaperSubjectOptions,
  getPapersError,
  getPapersLoading,
} from '../store/selectors/paper.selectors';

import { BranchApiActions } from '../../branches/store/actions/branch.actions';
import { getBranches } from '../../branches/store/selectors/branch.selectors';

import { SearchableSelectComponent } from '../../../shared/components/searchable-select/searchable-select.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-papers-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SearchableSelectComponent],
  templateUrl: './papers.component.html',
  styleUrl: './papers.component.scss',
})
export class PapersPageComponent {
  private readonly store = inject(Store);

  readonly branches = this.store.selectSignal(getBranches);
  readonly filteredPapers = this.store.selectSignal(getFilteredPapers);
  readonly loading = this.store.selectSignal(getPapersLoading);
  readonly error = this.store.selectSignal(getPapersError);
  readonly filters = this.store.selectSignal(getPaperFilters);
  readonly subjectOptions = this.store.selectSignal(getPaperSubjectOptions);

  readonly branchOptions = computed<SelectOption[]>(() =>
    this.branches().map(b => ({ label: b.name, value: b.name })),
  );

  readonly PAPER_PATTERN = PAPER_PATTERN;
  readonly ACADEMIC_YEARS: AcademicYear[] = ['FE', 'SE', 'TE', 'BE'];

  readonly academicYearOptions = computed<SelectOption[]>(() =>
    this.ACADEMIC_YEARS.map(y => ({ label: y, value: y })),
  );

  readonly patternOptions: SelectOption[] = [
    { label: '2019 Pattern', value: PAPER_PATTERN.P2019 },
    { label: '2024 Pattern', value: PAPER_PATTERN.P2024 },
  ];

  readonly skeletonItems = Array.from({ length: 6 });

  constructor() {
    this.store.dispatch(PaperApiActions.loadPapers());
    this.store.dispatch(BranchApiActions.loadBranches());
  }

  onBranchChange(value: string): void {
    this.store.dispatch(PaperApiActions.setFilterBranch({ branchName: value || null }));
  }

  onYearChange(value: string): void {
    this.store.dispatch(PaperApiActions.setFilterYear({ academicYear: (value as AcademicYear) || null }));
  }

  onPatternChange(value: string): void {
    this.store.dispatch(PaperApiActions.setFilterPattern({ pattern: (value as PaperPattern) || null }));
  }

  onSubjectChange(value: string): void {
    this.store.dispatch(PaperApiActions.setFilterSubject({ subjectName: value || null }));
  }

  onClearFilters(): void {
    this.store.dispatch(PaperApiActions.clearFilters());
  }

  openPaper(paper: PreviousYearPaper): void {
    window.open(paper.fileUrl, '_blank');
  }

  downloadPaper(paper: PreviousYearPaper, e: Event): void {
    e.preventDefault();
    window.open(paper.fileUrl.replace('/view', '/export?format=pdf'), '_blank');
  }
}
