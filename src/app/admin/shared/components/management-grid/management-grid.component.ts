import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { GridActionEvent, GridColumn } from '../../interfaces/admin-shared.interfaces';
import { ActionMenuComponent } from '../action-menu/action-menu.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-management-grid',
  standalone: true,
  imports: [ActionMenuComponent, EmptyStateComponent],
  templateUrl: './management-grid.component.html',
  styleUrl: './management-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementGridComponent {
  columns = input<GridColumn[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows = input<any[]>([]);
  loading = input(false);
  emptyTitle = input('No data found');
  emptySubtitle = input<string | undefined>(undefined);

  action = output<GridActionEvent>();

  trackByColumn(_: number, col: GridColumn): string {
    return col.key;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackByRow(_: number, row: any): string {
    return row.id;
  }
}
