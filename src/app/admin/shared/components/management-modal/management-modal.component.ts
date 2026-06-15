import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ModalField,
  ModalMode,
  SelectOption,
} from '../../interfaces/admin-shared.interfaces';
import { SearchableSelectComponent } from '../searchable-select/searchable-select.component';

@Component({
  selector: 'app-management-modal',
  standalone: true,
  imports: [FormsModule, SearchableSelectComponent],
  templateUrl: './management-modal.component.html',
  styleUrl: './management-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementModalComponent {
  visible = input(false);
  mode = input<ModalMode>('create');
  title = input('');
  fields = input<ModalField[]>([]);
  initialValues = input<Record<string, string>>({});

  save = output<Record<string, string>>();
  cancel = output<void>();
  fieldChange = output<{ key: string; value: string }>();

  readonly formData = signal<Record<string, string>>({});
  readonly isLoading = signal(false);

  constructor() {
    effect(() => {
      if (this.visible()) {
        const vals = this.initialValues();
        this.formData.set(
          this.fields().reduce(
            (acc, f) => ({ ...acc, [f.key]: vals[f.key] ?? '' }),
            {} as Record<string, string>
          )
        );
      }
    });
  }

  readonly isReadOnly = computed(() => this.mode() === 'view');

  readonly isValid = computed(() => {
    const data = this.formData();
    return this.fields().every(
      f => !f.required || (data[f.key]?.trim().length ?? 0) > 0
    );
  });

  getValue(key: string): string {
    return this.formData()[key] ?? '';
  }

  setValue(key: string, value: string): void {
    this.formData.update(d => ({ ...d, [key]: value }));
    this.fieldChange.emit({ key, value });
  }

  onSave(): void {
    if (this.isValid()) {
      this.save.emit(this.formData());
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal__overlay')) {
      this.onCancel();
    }
  }

  trackByField(_: number, f: ModalField): string {
    return f.key;
  }

  trackByOption(_: number, o: SelectOption): string | number {
    return o.value;
  }
}
