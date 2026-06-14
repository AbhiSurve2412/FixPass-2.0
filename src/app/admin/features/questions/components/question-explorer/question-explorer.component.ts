import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

import {
  QuestionExplorerNode,
  QuestionExplorerUnit,
} from '../../interfaces/question.interfaces';

@Component({
  selector: 'app-question-explorer',
  standalone: true,
  imports: [],
  templateUrl: './question-explorer.component.html',
  styleUrl: './question-explorer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionExplorerComponent {
  nodes = input<QuestionExplorerNode[]>([]);
  selectedUnitId = input<string | null>(null);

  unitSelected = output<{ unitId: string; subjectId: string }>();
  allClicked = output<void>();

  readonly expandedSubjects = signal<Set<string>>(new Set());

  readonly totalCount = computed(() =>
    this.nodes().reduce(
      (sum, n) => sum + n.units.reduce((s, u) => s + u.questionCount, 0),
      0,
    ),
  );

  readonly subjectTotal = computed(() => {
    const map = new Map<string, number>();
    for (const node of this.nodes()) {
      map.set(node.subjectId, node.units.reduce((s, u) => s + u.questionCount, 0));
    }
    return map;
  });

  constructor() {
    effect(() => {
      const nodeList = this.nodes();
      if (nodeList.length > 0) {
        this.expandedSubjects.set(new Set(nodeList.map(n => n.subjectId)));
      }
    });
  }

  toggleSubject(subjectId: string): void {
    const next = new Set(this.expandedSubjects());
    if (next.has(subjectId)) next.delete(subjectId);
    else next.add(subjectId);
    this.expandedSubjects.set(next);
  }

  isExpanded(subjectId: string): boolean {
    return this.expandedSubjects().has(subjectId);
  }

  onAllClick(): void {
    this.allClicked.emit();
  }

  onUnitClick(unitId: string, subjectId: string): void {
    this.unitSelected.emit({ unitId, subjectId });
  }

  getSubjectTotal(subjectId: string): number {
    return this.subjectTotal().get(subjectId) ?? 0;
  }

  trackByNode(_: number, n: QuestionExplorerNode): string {
    return n.subjectId;
  }

  trackByUnit(_: number, u: QuestionExplorerUnit): string {
    return u.unitId;
  }
}
