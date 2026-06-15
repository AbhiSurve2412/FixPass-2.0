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

interface DropdownPos { top: string; left: string; width: string; }

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
  readonly dropdownPos = signal<DropdownPos | null>(null);

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
    const opening = !this.isOpen();
    if (opening) {
      const trigger = this.el.nativeElement.querySelector('.ss__trigger') as HTMLElement;
      const rect = trigger.getBoundingClientRect();
      this.dropdownPos.set({
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    } else {
      this.searchTerm.set('');
      this.dropdownPos.set(null);
    }
    this.isOpen.set(opening);
  }

  select(opt: SelectOption): void {
    this.valueChange.emit(opt.value.toString());
    this.isOpen.set(false);
    this.searchTerm.set('');
    this.dropdownPos.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target as Node)) {
      this.isOpen.set(false);
      this.searchTerm.set('');
      this.dropdownPos.set(null);
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowChange(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.searchTerm.set('');
      this.dropdownPos.set(null);
    }
  }
}
