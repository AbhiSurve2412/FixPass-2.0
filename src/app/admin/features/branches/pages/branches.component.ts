import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { BranchApiActions } from '../store/actions/branch.actions';
import {
  getBranches,
  getBranchesError,
  getBranchesLoading,
} from '../store/selectors/branch.selectors';
import { Branch, BranchForm } from '../interfaces/branch.interfaces';

import {
  GridActionEvent,
  GridColumn,
  ModalField,
  ModalMode,
} from '../../../shared/interfaces/admin-shared.interfaces';

import { ManagementGridComponent } from '../../../shared/components/management-grid/management-grid.component';
import { ManagementModalComponent } from '../../../shared/components/management-modal/management-modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-branches-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ManagementGridComponent,
    ManagementModalComponent,
    ConfirmDialogComponent,
    SearchBarComponent,
    PaginationComponent,
  ],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss',
})
export class BranchesPageComponent {
  private readonly store = inject(Store);

  // ── Store signals ──────────────────────────────────────────────────────────
  readonly branches  = this.store.selectSignal(getBranches);
  readonly loading   = this.store.selectSignal(getBranchesLoading);
  readonly error     = this.store.selectSignal(getBranchesError);

  // ── Local UI state ─────────────────────────────────────────────────────────
  readonly searchTerm       = signal('');
  readonly currentPage      = signal(1);
  readonly pageSize         = signal(10);
  readonly modalVisible     = signal(false);
  readonly modalMode        = signal<ModalMode>('create');
  readonly selectedId       = signal<string | null>(null);
  readonly confirmVisible   = signal(false);
  readonly deleteTargetId   = signal<string | null>(null);
  readonly deleteTargetName = signal<string | null>(null);

  // ── Grid columns ───────────────────────────────────────────────────────────
  readonly columns: GridColumn[] = [
    { key: 'name',        header: 'Branch Name', flex: 3 },
    { key: 'shortName',   header: 'Short Name',  flex: 2 },
    { key: 'description', header: 'Description', flex: 5, truncate: true },
  ];

  // ── Modal fields ───────────────────────────────────────────────────────────
  readonly fields: ModalField[] = [
    {
      key:         'name',
      label:       'Branch Name',
      type:        'text',
      required:    true,
      placeholder: 'e.g. Computer Engineering',
    },
    {
      key:         'shortName',
      label:       'Short Name',
      type:        'text',
      required:    true,
      placeholder: 'e.g. CE',
    },
    {
      key:         'description',
      label:       'Description',
      type:        'textarea',
      required:    false,
      placeholder: 'Brief description of the branch...',
      rows:        3,
    },
  ];

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.branches();
    return this.branches().filter(
      b =>
        b.name.toLowerCase().includes(term) ||
        b.shortName.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term),
    );
  });

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  readonly modalInitialValues = computed<Record<string, string>>(() => {
    const id = this.selectedId();
    if (!id || this.modalMode() === 'create') return {} as Record<string, string>;
    const item = this.branches().find(b => b.id === id);
    if (!item) return {} as Record<string, string>;
    return {
      name:        item.name,
      shortName:   item.shortName,
      description: item.description ?? '',
    };
  });

  readonly modalTitle = computed(() => {
    const mode = this.modalMode();
    if (mode === 'create') return 'Add Branch';
    if (mode === 'edit')   return 'Edit Branch';
    return 'View Branch';
  });

  // ── Init ───────────────────────────────────────────────────────────────────
  constructor() {
    this.store.dispatch(BranchApiActions.loadBranches());
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  openCreate(): void {
    this.selectedId.set(null);
    this.modalMode.set('create');
    this.modalVisible.set(true);
  }

  onGridAction(event: GridActionEvent): void {
    this.selectedId.set(event.id);
    if (event.type === 'view') {
      this.modalMode.set('view');
      this.modalVisible.set(true);
    } else if (event.type === 'edit') {
      this.modalMode.set('edit');
      this.modalVisible.set(true);
    } else {
      const item = this.branches().find(b => b.id === event.id);
      this.deleteTargetName.set(item?.name ?? null);
      this.deleteTargetId.set(event.id);
      this.confirmVisible.set(true);
    }
  }

  onModalSave(formData: Record<string, string>): void {
    const mode = this.modalMode();
    const id   = this.selectedId();

    if (mode === 'create') {
      const form: BranchForm = {
        name:        formData['name'],
        shortName:   formData['shortName'],
        description: formData['description'] ?? '',
      };
      this.store.dispatch(BranchApiActions.createBranch({ form }));
    } else if (mode === 'edit' && id) {
      const existing = this.branches().find(b => b.id === id)!;
      this.store.dispatch(
        BranchApiActions.updateBranch({
          branch: {
            ...existing,
            name:        formData['name'],
            shortName:   formData['shortName'],
            description: formData['description'] ?? '',
          },
        }),
      );
    }
    this.modalVisible.set(false);
  }

  onModalCancel(): void { this.modalVisible.set(false); }

  onConfirmDelete(): void {
    const id = this.deleteTargetId();
    if (id) this.store.dispatch(BranchApiActions.deleteBranch({ id }));
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  onCancelDelete(): void {
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  trackByBranch(_: number, item: Branch): string { return item.id; }
}
