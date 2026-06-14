import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { NgClass } from '@angular/common';

import { Question, QuestionType } from '../../interfaces/question.interfaces';

const TYPE_LABELS: Record<QuestionType, string> = {
  'long-answer': 'Long Answer',
  'short-note':  'Short Note',
  'numerical':   'Numerical',
  'definition':  'Definition',
  'mcq':         'MCQ',
};

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionCardComponent {
  question = input.required<Question>();

  view = output<Question>();
  edit = output<Question>();
  delete = output<Question>();

  readonly difficultyLower = computed(() => this.question().difficulty.toLowerCase());

  readonly formattedType = computed(() => TYPE_LABELS[this.question().type] ?? this.question().type);

  readonly badgeClass = computed(() => [
    'qcard__difficulty-badge',
    `qcard__difficulty-badge--${this.difficultyLower()}`,
  ]);
}
