import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { UnitApiActions } from '../store/actions/unit.actions';
import {
  getUnits,
  getUnitsError,
  getUnitsLoading,
} from '../store/selectors/unit.selectors';
import { SubjectApiActions } from '../../subjects/store/actions/subject.actions';
import { getSubjects } from '../../subjects/store/selectors/subject.selectors';
import { Unit, UnitForm } from '../interfaces/unit.interfaces';

import {
  Difficulty,
  GridActionEvent,
  GridColumn,
  GridGroup,
  ModalField,
  ModalMode,
} from '../../../shared/interfaces/admin-shared.interfaces';

import { GroupedGridComponent } from '../../../shared/components/grouped-grid/grouped-grid.component';
import { ManagementModalComponent } from '../../../shared/components/management-modal/management-modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-units-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GroupedGridComponent,
    ManagementModalComponent,
    ConfirmDialogComponent,
    SearchBarComponent,
  ],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss',
})
export class UnitsPageComponent {
  private readonly store = inject(Store);

  // -- Store signals -----------------------------------------------------------
  readonly units    = this.store.selectSignal(getUnits);
  readonly subjects = this.store.selectSignal(getSubjects);
  readonly loading  = this.store.selectSignal(getUnitsLoading);
  readonly error    = this.store.selectSignal(getUnitsError);

  // -- Local UI state ----------------------------------------------------------
  readonly searchTerm       = signal('');
  readonly modalVisible     = signal(false);
  readonly modalMode        = signal<ModalMode>('create');
  readonly selectedId       = signal<string | null>(null);
  readonly confirmVisible   = signal(false);
  readonly deleteTargetId   = signal<string | null>(null);
  readonly deleteTargetName = signal<string | null>(null);

  // -- Grid columns (subject column omitted — it is the group label) -----------
  readonly columns: GridColumn[] = [
    { key: 'name',       header: 'Unit Name',  flex: 4 },
    { key: 'difficulty', header: 'Difficulty', flex: 1 },
    { key: 'description', header: 'Description', flex: 5, truncate: true },
  ];

  // -- Modal fields ------------------------------------------------------------
  readonly fields = computed<ModalField[]>(() => [
    {
      key:         'name',
      label:       'Unit Name',
      type:        'text',
      required:    true,
      placeholder: 'e.g. Unit 1: Introduction to AI',
    },
    {
      key:      'subjectId',
      label:    'Subject',
      type:     'select',
      required: true,
      options:  this.subjects().map(s => ({
        label: `${s.name} (${s.code})`,
        value: s.id,
      })),
    },
    {
      key:      'difficulty',
      label:    'Difficulty',
      type:     'select',
      required: true,
      options:  (['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => ({
        label: d,
        value: d,
      })),
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

  // -- Derived computed --------------------------------------------------------
  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.units();
    return this.units().filter(
      u =>
        u.name.toLowerCase().includes(term) ||
        u.subjectName.toLowerCase().includes(term),
    );
  });

  readonly groups = computed<GridGroup[]>(() => {
    const units = this.filtered();
    return this.subjects()
      .filter(s => units.some(u => u.subjectId === s.id))
      .map(s => ({
        id:       s.id,
        label:    s.name,
        subtitle: `${s.code} — Semester ${s.semester}`,
        rows:     units
          .filter(u => u.subjectId === s.id) as unknown as Record<string, unknown>[],
      }));
  });

  readonly modalInitialValues = computed<Record<string, string>>(() => {
    const id = this.selectedId();
    if (!id || this.modalMode() === 'create') return {} as Record<string, string>;
    const item = this.units().find(u => u.id === id);
    if (!item) return {} as Record<string, string>;
    return {
      name:        item.name,
      subjectId:   item.subjectId,
      difficulty:  item.difficulty,
      description: item.description ?? '',
    };
  });

  readonly modalTitle = computed(() => {
    const mode = this.modalMode();
    if (mode === 'create') return 'Add Unit';
    if (mode === 'edit')   return 'Edit Unit';
    return 'View Unit';
  });

  // -- Init --------------------------------------------------------------------
  constructor() {
    this.store.dispatch(UnitApiActions.loadUnits());
    this.store.dispatch(SubjectApiActions.loadSubjects());
  }

  // -- Handlers ----------------------------------------------------------------
  onSearch(term: string): void {
    this.searchTerm.set(term);
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
      const item = this.units().find(u => u.id === event.id);
      this.deleteTargetName.set(item?.name ?? null);
      this.deleteTargetId.set(event.id);
      this.confirmVisible.set(true);
    }
  }

  onModalSave(formData: Record<string, string>): void {
    const mode = this.modalMode();
    const id   = this.selectedId();

    if (mode === 'create') {
      const form: UnitForm = {
        name:        formData['name'],
        subjectId:   formData['subjectId'],
        difficulty:  formData['difficulty'] as Difficulty | '',
        description: formData['description'] ?? '',
      };
      this.store.dispatch(UnitApiActions.createUnit({ form }));
    } else if (mode === 'edit' && id) {
      const existing = this.units().find(u => u.id === id)!;
      const subject  = this.subjects().find(s => s.id === formData['subjectId']);
      this.store.dispatch(
        UnitApiActions.updateUnit({
          unit: {
            ...existing,
            name:        formData['name'],
            subjectId:   formData['subjectId'],
            subjectName: subject?.name ?? existing.subjectName,
            difficulty:  formData['difficulty'] as Difficulty | '',
            description: formData['description'] ?? '',
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
    if (id) this.store.dispatch(UnitApiActions.deleteUnit({ id }));
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  onCancelDelete(): void {
    this.confirmVisible.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  trackByUnit(_: number, item: Unit): string { return item.id; }
}
