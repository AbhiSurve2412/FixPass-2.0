import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  visible = input(false);
  itemName = input<string | undefined>(undefined);

  confirm = output<void>();
  cancel = output<void>();

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('confirm-dialog__overlay')) {
      this.cancel.emit();
    }
  }
}
