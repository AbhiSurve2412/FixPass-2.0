import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { UniversityApiActions } from '../store/actions/university.actions';
import {
  getUniversities,
  getUniversitiesError,
  getUniversitiesLoading,
} from '../store/selectors/university.selectors';
import { University, UniversityForm } from '../interfaces/university.interfaces';

import {
  GRID_ACTION,
  GridActionEvent,
  GridColumn,
  MODAL_MODE,
  ModalField,
  ModalMode,
} from '../../../shared/interfaces/admin-shared.interfaces';

import { ManagementGridComponent } from '../../../shared/components/management-grid/management-grid.component';
import { ManagementModalComponent } from '../../../shared/components/management-modal/management-modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-universities-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ManagementGridComponent,
    ManagementModalComponent,
    ConfirmDialogComponent,
    SearchBarComponent,
    PaginationComponent,
  ],
  templateUrl: './universities.component.html',
  styleUrl: './universities.component.scss',
})
export class UniversitiesPageComponent {
  private readonly store = inject(Store);

  // ── Store signals ────────────────────────────────────────────────────────────
  readonly universities = this.store.selectSignal(getUniversities);
  readonly loading      = this.store.selectSignal(getUniversitiesLoading);
  readonly error        = this.store.selectSignal(getUniversitiesError);

  // ── Local UI state ───────────────────────────────────────────────────────────
  readonly searchTerm      = signal('');
  readonly currentPage     = signal(1);
  readonly pageSize        = signal(10);
  readonly modalVisible    = signal(false);
  readonly modalMode       = signal<ModalMode>(MODAL_MODE.CREATE);
  readonly selectedId      = signal<string | null>(null);
  readonly confirmVisible  = signal(false);
  readonly deleteTargetId  = signal<string | null>(null);
  readonly deleteTargetName = signal<string | null>(null);

  // ── Grid config ──────────────────────────────────────────────────────────────
  readonly columns: GridColumn[] = [
    { key: 'name',        header: 'University Name', flex: 3 },
    { key: 'description', header: 'Description',     flex: 5, truncate: true },
  ];

  // ── Modal fields ─────────────────────────────────────────────────────────────
  readonly fields: ModalField[] = [
    {
      key:         'name',
      label:       'University Name',
      type:        'text',
      required:    true,
      placeholder: 'e.g. Savitribai Phule Pune University',
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

  // ── Derived computed ─────────────────────────────────────────────────────────
  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.universities();
    return this.universities().filter(
      u =>
        u.name.toLowerCase().includes(term) ||
        u.description?.toLowerCase().includes(term),
    );
  });

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  readonly modalInitialValues = computed<Record<string, string>>(() => {
    const id = this.selectedId();
    if (!id || this.modalMode() === MODAL_MODE.CREATE) return {} as Record<string, string>;
    const item = this.universities().find(u => u.id === id);
    if (!item) return {} as Record<string, string>;
    return { name: item.name, description: item.description ?? '' };
  });

  readonly modalTitle = computed(() => {
    const mode = this.modalMode();
    if (mode === MODAL_MODE.CREATE) return 'Add University';
    if (mode === MODAL_MODE.EDIT)   return 'Edit University';
    return 'View University';
  });

  // ── Init ─────────────────────────────────────────────────────────────────────
  constructor() {
    this.store.dispatch(UniversityApiActions.loadUniversities());
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────
  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
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
      const item = this.universities().find(u => u.id === event.id);
      this.deleteTargetName.set(item?.name ?? null);
      this.deleteTargetId.set(event.id);
      this.confirmVisible.set(true);
    }
  }

  onModalSave(formData: Record<string, string>): void {
    const mode = this.modalMode();
    const id   = this.selectedId();
    const form: UniversityForm = {
      name:        formData['name'],
      description: formData['description'] ?? '',
    };

    if (mode === MODAL_MODE.CREATE) {
      this.store.dispatch(UniversityApiActions.createUniversity({ form }));
    } else if (mode === MODAL_MODE.EDIT && id) {
      const existing = this.universities().find(u => u.id === id)!;
      this.store.dispatch(
        UniversityApiActions.updateUniversity({
          university: { ...existing, ...form },
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
    if (id) this.store.dispatch(UniversityApiActions.deleteUniversity({ id }));
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  onCancelDelete(): void {
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  // ── TrackBy ──────────────────────────────────────────────────────────────────
  trackByUniversity(_: number, item: University): string {
    return item.id;
  }
}
