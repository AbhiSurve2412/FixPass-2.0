import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { CollegeApiActions } from '../store/actions/college.actions';
import {
  getColleges,
  getCollegesError,
  getCollegesLoading,
} from '../store/selectors/college.selectors';
import { UniversityApiActions } from '../../universities/store/actions/university.actions';
import { getUniversities } from '../../universities/store/selectors/university.selectors';
import { College, CollegeForm } from '../interfaces/college.interfaces';

import {
  GRID_ACTION,
  GridActionEvent,
  GridColumn,
  GridGroup,
  MODAL_MODE,
  ModalField,
  ModalMode,
} from '../../../shared/interfaces/admin-shared.interfaces';

import { GroupedGridComponent } from '../../../shared/components/grouped-grid/grouped-grid.component';
import { ManagementModalComponent } from '../../../shared/components/management-modal/management-modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-colleges-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GroupedGridComponent,
    ManagementModalComponent,
    ConfirmDialogComponent,
    SearchBarComponent,
  ],
  templateUrl: './colleges.component.html',
  styleUrl: './colleges.component.scss',
})
export class CollegesPageComponent {
  private readonly store = inject(Store);

  // ── Store signals ────────────────────────────────────────────────────────
  readonly colleges     = this.store.selectSignal(getColleges);
  readonly universities = this.store.selectSignal(getUniversities);
  readonly loading      = this.store.selectSignal(getCollegesLoading);
  readonly error        = this.store.selectSignal(getCollegesError);

  // ── Local UI state ───────────────────────────────────────────────────────
  readonly searchTerm       = signal('');
  readonly modalVisible     = signal(false);
  readonly modalMode        = signal<ModalMode>(MODAL_MODE.CREATE);
  readonly selectedId       = signal<string | null>(null);
  readonly confirmVisible   = signal(false);
  readonly deleteTargetId   = signal<string | null>(null);
  readonly deleteTargetName = signal<string | null>(null);

  // ── Grid columns (university column omitted — it is the group label) ──────
  readonly columns: GridColumn[] = [
    { key: 'name',        header: 'College Name', flex: 3 },
    { key: 'description', header: 'Description',  flex: 5, truncate: true },
  ];

  // ── Modal fields (university dropdown is dynamic) ────────────────────────
  readonly fields = computed<ModalField[]>(() => [
    {
      key:         'name',
      label:       'College Name',
      type:        'text',
      required:    true,
      placeholder: 'e.g. College of Engineering, Pune',
    },
    {
      key:      'universityId',
      label:    'University',
      type:     'select',
      required: true,
      options:  this.universities().map(u => ({ label: u.name, value: u.id })),
    },
    {
      key:         'description',
      label:       'Description',
      type:        'textarea',
      required:    false,
      placeholder: 'Brief description...',
      rows:        3,
    },
  ]);

  // ── Derived computed ─────────────────────────────────────────────────────
  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.colleges();
    return this.colleges().filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.universityName.toLowerCase().includes(term),
    );
  });

  readonly groups = computed<GridGroup[]>(() => {
    const colleges = this.filtered();
    return this.universities()
      .filter(u => colleges.some(c => c.universityId === u.id))
      .map(u => ({
        id:   u.id,
        label: u.name,
        rows:  colleges
          .filter(c => c.universityId === u.id) as unknown as Record<string, unknown>[],
      }));
  });

  readonly modalInitialValues = computed<Record<string, string>>(() => {
    const id = this.selectedId();
    if (!id || this.modalMode() === MODAL_MODE.CREATE) return {} as Record<string, string>;
    const item = this.colleges().find(c => c.id === id);
    if (!item) return {} as Record<string, string>;
    return {
      name:         item.name,
      universityId: item.universityId,
      description:  item.description ?? '',
    };
  });

  readonly modalTitle = computed(() => {
    const mode = this.modalMode();
    if (mode === MODAL_MODE.CREATE) return 'Add College';
    if (mode === MODAL_MODE.EDIT)   return 'Edit College';
    return 'View College';
  });

  // ── Init ─────────────────────────────────────────────────────────────────
  constructor() {
    this.store.dispatch(CollegeApiActions.loadColleges());
    this.store.dispatch(UniversityApiActions.loadUniversities());
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  openCreate(): void {
    this.selectedId.set(null);
    this.modalMode.set(MODAL_MODE.CREATE);
    this.modalVisible.set(true);
  }

  onGridAction(event: GridActionEvent): void {
    this.selectedId.set(event.id);
    if (event.type === GRID_ACTION.VIEW) {
      this.modalMode.set(MODAL_MODE.VIEW);
      this.modalVisible.set(true);
    } else if (event.type === GRID_ACTION.EDIT) {
      this.modalMode.set(MODAL_MODE.EDIT);
      this.modalVisible.set(true);
    } else {
      const item = this.colleges().find(c => c.id === event.id);
      this.deleteTargetName.set(item?.name ?? null);
      this.deleteTargetId.set(event.id);
      this.confirmVisible.set(true);
    }
  }

  onModalSave(formData: Record<string, string>): void {
    const mode = this.modalMode();
    const id   = this.selectedId();

    if (mode === MODAL_MODE.CREATE) {
      const form: CollegeForm = {
        name:         formData['name'],
        universityId: formData['universityId'],
        description:  formData['description'] ?? '',
      };
      this.store.dispatch(CollegeApiActions.createCollege({ form }));
    } else if (mode === MODAL_MODE.EDIT && id) {
      const existing = this.colleges().find(c => c.id === id)!;
      const uni      = this.universities().find(u => u.id === formData['universityId']);
      this.store.dispatch(
        CollegeApiActions.updateCollege({
          college: {
            ...existing,
            name:           formData['name'],
            universityId:   formData['universityId'],
            universityName: uni?.name ?? existing.universityName,
            description:    formData['description'] ?? '',
          },
        }),
      );
    }
    this.modalVisible.set(false);
  }

  onModalCancel(): void {
    this.modalVisible.set(false);
  }

  onConfirmDelete(): void {
    const id = this.deleteTargetId();
    if (id) this.store.dispatch(CollegeApiActions.deleteCollege({ id }));
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  onCancelDelete(): void {
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  trackByCollege(_: number, item: College): string { return item.id; }
}
