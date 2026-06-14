import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import {
  GridActionEvent,
  GridColumn,
  GridGroup,
} from '../../interfaces/admin-shared.interfaces';
import { ActionMenuComponent } from '../action-menu/action-menu.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-grouped-grid',
  standalone: true,
  imports: [ActionMenuComponent, EmptyStateComponent],
  templateUrl: './grouped-grid.component.html',
  styleUrl: './grouped-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedGridComponent {
  readonly columns  = input<GridColumn[]>([]);
  readonly groups   = input<GridGroup[]>([]);
  readonly loading  = input(false);
  readonly emptyTitle = input('No data found');

  readonly action = output<GridActionEvent>();

  private readonly expandedGroups = signal<Set<string>>(new Set());

  constructor() {
    // Expand all groups whenever the groups array changes
    effect(() => {
      const ids = this.groups().map(g => g.id);
      untracked(() => this.expandedGroups.set(new Set(ids)));
    });
  }

  isExpanded(groupId: string): boolean {
    return this.expandedGroups().has(groupId);
  }

  toggleGroup(groupId: string): void {
    const next = new Set(this.expandedGroups());
    if (next.has(groupId)) {
      next.delete(groupId);
    } else {
      next.add(groupId);
    }
    this.expandedGroups.set(next);
  }

  trackByGroup(_: number, g: GridGroup): string { return g.id; }
  trackByColumn(_: number, c: GridColumn): string { return c.key; }
  trackByRow(_: number, r: Record<string, unknown>): string { return String(r['id']); }
}
