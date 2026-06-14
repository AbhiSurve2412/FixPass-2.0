import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { SubjectApiActions } from '../store/actions/subject.actions';
import {
  getSubjects,
  getSubjectsError,
  getSubjectsLoading,
} from '../store/selectors/subject.selectors';
import { BranchApiActions } from '../../branches/store/actions/branch.actions';
import { getBranches } from '../../branches/store/selectors/branch.selectors';
import { Subject, SubjectForm } from '../interfaces/subject.interfaces';

import {
  AcademicYear,
  GridActionEvent,
  GridColumn,
  GridGroup,
  ModalField,
  ModalMode,
  SelectOption,
  Semester,
} from '../../../shared/interfaces/admin-shared.interfaces';

import { GroupedGridComponent } from '../../../shared/components/grouped-grid/grouped-grid.component';
import { ManagementModalComponent } from '../../../shared/components/management-modal/management-modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';

// ── Year → Semester mapping ──────────────────────────────────────────────────
const YEAR_SEMESTERS: Record<AcademicYear, Semester[]> = {
  FE: [1, 2],
  SE: [3, 4],
  TE: [5, 6],
  BE: [7, 8],
};

const YEAR_LABELS: Record<AcademicYear, string> = {
  FE: 'First Year (FE)',
  SE: 'Second Year (SE)',
  TE: 'Third Year (TE)',
  BE: 'Fourth Year (BE)',
};

const YEAR_OPTIONS: SelectOption[] = (Object.keys(YEAR_LABELS) as AcademicYear[]).map(y => ({
  label: YEAR_LABELS[y],
  value: y,
}));

function yearFromSemester(sem: number): AcademicYear {
  if (sem <= 2) return 'FE';
  if (sem <= 4) return 'SE';
  if (sem <= 6) return 'TE';
  return 'BE';
}

@Component({
  selector: 'app-subjects-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GroupedGridComponent,
    ManagementModalComponent,
    ConfirmDialogComponent,
    SearchBarComponent,
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
})
export class SubjectsPageComponent {
  private readonly store = inject(Store);

  // ── Store signals ─────────────────────────────────────────────────────────
  readonly subjects = this.store.selectSignal(getSubjects);
  readonly branches = this.store.selectSignal(getBranches);
  readonly loading  = this.store.selectSignal(getSubjectsLoading);
  readonly error    = this.store.selectSignal(getSubjectsError);

  // ── Local UI state ────────────────────────────────────────────────────────
  readonly searchTerm       = signal('');
  readonly modalVisible     = signal(false);
  readonly modalMode        = signal<ModalMode>('create');
  readonly selectedId       = signal<string | null>(null);
  readonly confirmVisible   = signal(false);
  readonly deleteTargetId   = signal<string | null>(null);
  readonly deleteTargetName = signal<string | null>(null);

  /** Tracks the Year currently selected inside the open modal. */
  readonly modalActiveYear  = signal<AcademicYear | ''>('');

  // ── Grid columns ──────────────────────────────────────────────────────────
  readonly columns: GridColumn[] = [
    { key: 'name',        header: 'Subject Name', flex: 3 },
    { key: 'code',        header: 'Code',         flex: 1 },
    { key: 'year',        header: 'Year',         flex: 1 },
    { key: 'semester',    header: 'Sem',          flex: 1 },
    { key: 'description', header: 'Description',  flex: 4, truncate: true },
  ];

  // ── Modal fields (reactive — semester options depend on selected year) ─────
  readonly fields = computed<ModalField[]>(() => {
    const year = this.modalActiveYear();

    const semesterOptions: SelectOption[] = year
      ? YEAR_SEMESTERS[year].map(s => ({ label: `Semester ${s}`, value: s }))
      : ([1, 2, 3, 4, 5, 6, 7, 8] as Semester[]).map(s => ({
          label: `Semester ${s} — ${YEAR_LABELS[yearFromSemester(s)]}`,
          value: s,
        }));

    return [
      {
        key:         'name',
        label:       'Subject Name',
        type:        'text',
        required:    true,
        placeholder: 'e.g. Data Structures',
      },
      {
        key:         'code',
        label:       'Subject Code',
        type:        'text',
        required:    true,
        placeholder: 'e.g. CS301',
      },
      {
        key:      'year',
        label:    'Year',
        type:     'select',
        required: true,
        options:  YEAR_OPTIONS,
      },
      {
        key:      'branchId',
        label:    'Branch',
        type:     'select',
        required: true,
        options:  this.branches().map(b => ({
          label: `${b.name} (${b.shortName})`,
          value: b.id,
        })),
      },
      {
        key:      'semester',
        label:    'Semester',
        type:     'select',
        required: true,
        options:  semesterOptions,
      },
      {
        key:         'description',
        label:       'Description',
        type:        'textarea',
        required:    false,
        placeholder: 'Brief description...',
        rows:        3,
      },
    ];
  });

  // ── Derived computed ──────────────────────────────────────────────────────
  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.subjects();
    return this.subjects().filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        s.branchName.toLowerCase().includes(term) ||
        s.year.toLowerCase().includes(term),
    );
  });

  readonly groups = computed<GridGroup[]>(() => {
    const subjects = this.filtered();
    return this.branches()
      .filter(b => subjects.some(s => s.branchId === b.id))
      .map(b => ({
        id:       b.id,
        label:    b.name,
        subtitle: b.shortName,
        rows:     subjects
          .filter(s => s.branchId === b.id) as unknown as Record<string, unknown>[],
      }));
  });

  readonly modalInitialValues = computed<Record<string, string>>(() => {
    const id = this.selectedId();
    if (!id || this.modalMode() === 'create') return {} as Record<string, string>;
    const item = this.subjects().find(s => s.id === id);
    if (!item) return {} as Record<string, string>;
    return {
      name:        item.name,
      code:        item.code,
      year:        item.year,
      branchId:    item.branchId,
      semester:    String(item.semester),
      description: item.description ?? '',
    };
  });

  readonly modalTitle = computed(() => {
    const mode = this.modalMode();
    if (mode === 'create') return 'Add Subject';
    if (mode === 'edit')   return 'Edit Subject';
    return 'View Subject';
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  constructor() {
    this.store.dispatch(SubjectApiActions.loadSubjects());
    this.store.dispatch(BranchApiActions.loadBranches());
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  openCreate(): void {
    this.selectedId.set(null);
    this.modalMode.set('create');
    this.modalActiveYear.set('');
    this.modalVisible.set(true);
  }

  onGridAction(event: GridActionEvent): void {
    this.selectedId.set(event.id);
    const item = this.subjects().find(s => s.id === event.id);

    if (event.type === 'view') {
      this.modalMode.set('view');
      this.modalActiveYear.set(item?.year ?? '');
      this.modalVisible.set(true);
    } else if (event.type === 'edit') {
      this.modalMode.set('edit');
      this.modalActiveYear.set(item?.year ?? '');
      this.modalVisible.set(true);
    } else {
      this.deleteTargetName.set(item?.name ?? null);
      this.deleteTargetId.set(event.id);
      this.confirmVisible.set(true);
    }
  }

  /** Cascade: selecting Year filters Semester options; selecting Semester infers Year. */
  onFieldChange(event: { key: string; value: string }): void {
    if (event.key === 'year') {
      this.modalActiveYear.set(event.value as AcademicYear);
    } else if (event.key === 'semester') {
      const sem = Number(event.value);
      if (sem) this.modalActiveYear.set(yearFromSemester(sem));
    }
  }

  onModalSave(formData: Record<string, string>): void {
    const mode = this.modalMode();
    const id   = this.selectedId();

    const year = formData['year'] as AcademicYear;
    const rawSem = Number(formData['semester']) as Semester;

    // Guard: if semester doesn't belong to the selected year, pick the first valid one.
    const validSemesters = YEAR_SEMESTERS[year] ?? [];
    const semester: Semester = validSemesters.includes(rawSem)
      ? rawSem
      : (validSemesters[0] ?? rawSem);

    if (mode === 'create') {
      const form: SubjectForm = {
        name:        formData['name'],
        code:        formData['code'],
        year,
        branchId:    formData['branchId'],
        semester,
        description: formData['description'] ?? '',
      };
      this.store.dispatch(SubjectApiActions.createSubject({ form }));
    } else if (mode === 'edit' && id) {
      const existing = this.subjects().find(s => s.id === id)!;
      const branch   = this.branches().find(b => b.id === formData['branchId']);
      this.store.dispatch(
        SubjectApiActions.updateSubject({
          subject: {
            ...existing,
            name:        formData['name'],
            code:        formData['code'],
            year,
            branchId:    formData['branchId'],
            branchName:  branch?.name ?? existing.branchName,
            semester,
            description: formData['description'] ?? '',
          },
        }),
      );
    }

    this.modalActiveYear.set('');
    this.modalVisible.set(false);
  }

  onModalCancel(): void {
    this.modalActiveYear.set('');
    this.modalVisible.set(false);
  }

  onConfirmDelete(): void {
    const id = this.deleteTargetId();
    if (id) this.store.dispatch(SubjectApiActions.deleteSubject({ id }));
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  onCancelDelete(): void {
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  trackBySubject(_: number, item: Subject): string { return item.id; }
}
