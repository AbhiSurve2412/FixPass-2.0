import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { ANSWER_TYPE, AnswerBlock, AnswerContent, AnswerType } from '../../interfaces/answer.interfaces';
import { Question } from '../../../questions/interfaces/question.interfaces';
import { AnswerPreviewComponent } from '../answer-preview/answer-preview.component';

export interface RegenerateEvent {
  contentInstruction: string;
  structureInstruction: string;
  currentAnswer: AnswerContent;
}

@Component({
  selector: 'app-answer-workspace',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AnswerPreviewComponent],
  templateUrl: './answer-workspace.component.html',
  styleUrl: './answer-workspace.component.scss',
})
export class AnswerWorkspaceComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly question = input<Question | null>(null);
  readonly detailedAnswer = input<AnswerContent | null>(null);
  readonly simpleAnswer = input<AnswerContent | null>(null);
  readonly generating = input<boolean>(false);
  readonly saving = input<boolean>(false);

  readonly regenerate = output<RegenerateEvent>();
  readonly saveAnswer = output<AnswerContent>();

  readonly AT = ANSWER_TYPE;
  readonly activeAnswerType = signal<AnswerType>(ANSWER_TYPE.DETAILED);
  readonly contentInstruction = signal('');
  readonly structureInstruction = signal('');
  readonly currentContent = signal<AnswerContent>({ content: [] });

  // Image upload state
  readonly imagePreview = signal<string | null>(null);
  readonly imageCaption = signal('');

  constructor() {
    effect(() => {
      const answer =
        this.activeAnswerType() === ANSWER_TYPE.DETAILED ? this.detailedAnswer() : this.simpleAnswer();
      this.currentContent.set(answer ?? { content: [] });
    });
  }

  setAnswerType(type: AnswerType): void {
    this.activeAnswerType.set(type);
  }

  onRegenerate(): void {
    this.regenerate.emit({
      contentInstruction: this.contentInstruction(),
      structureInstruction: this.structureInstruction(),
      currentAnswer: this.currentContent(),
    });
  }

  onSave(): void {
    this.saveAnswer.emit(this.currentContent());
  }

  // ── Image upload ────────────────────────────────────────────────────────────
  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  insertImage(): void {
    const url = this.imagePreview();
    if (!url) return;
    const diagramBlock: AnswerBlock = {
      type: 'diagram',
      data: { url, description: this.imageCaption() || 'Diagram' },
    };
    const updated: AnswerContent = {
      content: [...this.currentContent().content, diagramBlock],
    };
    this.currentContent.set(updated);
    this.imagePreview.set(null);
    this.imageCaption.set('');
  }

  clearImage(): void {
    this.imagePreview.set(null);
    this.imageCaption.set('');
  }
}
