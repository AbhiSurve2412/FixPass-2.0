import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { Answer } from '../../interfaces/answer.interfaces';

@Component({
  selector: 'app-answer-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DatePipe],
  templateUrl: './answer-grid.component.html',
  styleUrl: './answer-grid.component.scss',
})
export class AnswerGridComponent {
  readonly answers = input<Answer[]>([]);
  readonly loading = input<boolean>(false);

  readonly view = output<Answer>();
  readonly remove = output<Answer>();

  readonly searchTerm = signal('');

  readonly skeletonRows = [0, 1, 2, 3, 4];

  readonly filtered = computed<Answer[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.answers();
    return this.answers().filter(
      a =>
        a.questionText.toLowerCase().includes(term) ||
        a.subjectName.toLowerCase().includes(term) ||
        a.unitName.toLowerCase().includes(term),
    );
  });

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }

  truncate(text: string, max = 70): string {
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  trackByAnswer(_: number, a: Answer): string {
    return a.id;
  }
}
