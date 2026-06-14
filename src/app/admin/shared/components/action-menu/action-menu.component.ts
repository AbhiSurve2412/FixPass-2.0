import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { GridActionEvent } from '../../interfaces/admin-shared.interfaces';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [],
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent {
  itemId = input.required<string>();

  action = output<GridActionEvent>();

  readonly isOpen = signal(false);

  constructor(private readonly elementRef: ElementRef) {}

  toggleMenu(): void {
    this.isOpen.update(open => !open);
  }

  onAction(type: 'view' | 'edit' | 'delete'): void {
    this.action.emit({ type, id: this.itemId() });
    this.isOpen.set(false);
  }

  @HostListener('keydown.escape')
  closeOnEscape(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
