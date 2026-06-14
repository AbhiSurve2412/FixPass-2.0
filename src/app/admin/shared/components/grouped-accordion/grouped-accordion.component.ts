import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  output,
  signal,
} from '@angular/core';
import {
  GridActionEvent,
  GridColumn,
  GroupedAccordionGroup,
} from '../../interfaces/admin-shared.interfaces';
import { ActionMenuComponent } from '../action-menu/action-menu.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-grouped-accordion',
  standalone: true,
  imports: [ActionMenuComponent, EmptyStateComponent],
  templateUrl: './grouped-accordion.component.html',
  styleUrl: './grouped-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedAccordionComponent implements OnInit {
  groups = input<GroupedAccordionGroup[]>([]);
  columns = input<GridColumn[]>([]);
  loading = input(false);
  emptyTitle = input('No data found');

  action = output<GridActionEvent>();

  readonly expandedGroups = signal<Set<string>>(new Set());

  ngOnInit(): void {
    const allIds = new Set(this.groups().map(g => g.id));
    this.expandedGroups.set(allIds);
  }

  toggleGroup(id: string): void {
    this.expandedGroups.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  isExpanded(id: string): boolean {
    return this.expandedGroups().has(id);
  }

  trackByGroup(_: number, group: GroupedAccordionGroup): string {
    return group.id;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackByItem(_: number, item: any): string {
    return item['id'] ?? _;
  }

  trackByColumn(_: number, col: GridColumn): string {
    return col.key;
  }
}
