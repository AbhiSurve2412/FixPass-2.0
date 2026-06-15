import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { SelectOption } from '../../interfaces/admin-shared.interfaces';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.scss',
})
export class SearchableSelectComponent {
  readonly options = input<SelectOption[]>([]);
  readonly value = input<string>('');
  readonly placeholder = input('Select…');
  readonly disabled = input(false);

  readonly valueChange = output<string>();

  readonly isOpen = signal(false);
  readonly searchTerm = signal('');

  constructor(private readonly el: ElementRef) {}

  readonly selectedLabel = computed(() => {
    const val = this.value();
    if (!val) return '';
    return this.options().find(o => o.value.toString() === val)?.label ?? '';
  });

  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.options();
    return this.options().filter(o => o.label.toLowerCase().includes(term));
  });

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen.update(v => !v);
    if (!this.isOpen()) this.searchTerm.set('');
  }

  select(opt: SelectOption): void {
    this.valueChange.emit(opt.value.toString());
    this.isOpen.set(false);
    this.searchTerm.set('');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target as Node)) {
      this.isOpen.set(false);
      this.searchTerm.set('');
    }
  }
}
