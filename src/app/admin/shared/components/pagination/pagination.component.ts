import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  page = input<number>(1);
  pageSize = input<number>(10);
  total = input<number>(0);

  pageChange = output<number>();

  readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  readonly showing = computed(() => {
    const start = (this.page() - 1) * this.pageSize() + 1;
    const end = Math.min(this.page() * this.pageSize(), this.total());
    return `Showing ${start}–${end} of ${this.total()}`;
  });

  trackByPage(_: number, p: number): number {
    return p;
  }
}
