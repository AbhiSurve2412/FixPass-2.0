import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Question,
  QuestionForm,
  QuestionOption,
  QuestionType,
} from '../../interfaces/question.interfaces';
import { Difficulty, MODAL_MODE, ModalMode } from '../../../../shared/interfaces/admin-shared.interfaces';

const DEFAULT_OPTIONS = (): QuestionOption[] => [
  { id: 'A', text: '' },
  { id: 'B', text: '' },
  { id: 'C', text: '' },
  { id: 'D', text: '' },
];

@Component({
  selector: 'app-question-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './question-editor.component.html',
  styleUrl: './question-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionEditorComponent {
  visible = input(false);
  mode = input<ModalMode>(MODAL_MODE.CREATE);
  question = input<Question | null>(null);
  subjects = input<{ id: string; name: string }[]>([]);
  units = input<{ id: string; name: string; subjectId: string }[]>([]);

  save = output<QuestionForm>();
  cancel = output<void>();

  // ── Core form state ────────────────────────────────────────────────────────
  readonly selectedSubjectId = signal<string>('');
  readonly tagsString = signal<string>('');
  readonly formData = signal<Partial<QuestionForm>>({
    text: '', subjectId: '', unitId: '', difficulty: 'Medium',
    marks: 8, type: 'long-answer', isImportant: false, tags: [], askedIn: [],
  });

  // ── Rich content state ─────────────────────────────────────────────────────
  readonly options = signal<QuestionOption[]>(DEFAULT_OPTIONS());
  readonly correctOptionId = signal<string>('A');
  readonly imageUrls = signal<string[]>([]);

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly isReadOnly = computed(() => this.mode() === MODAL_MODE.VIEW);
  readonly isMcq = computed(() => this.formData().type === 'mcq');

  readonly filteredUnits = computed(() =>
    this.units().filter(u => u.subjectId === this.selectedSubjectId()),
  );

  readonly isValid = computed(() => {
    const d = this.formData();
    if (!d.text?.trim() || !d.unitId || !d.subjectId || !d.marks) return false;
    if (d.type === 'mcq') {
      return this.options().every(o => o.text.trim().length > 0) && !!this.correctOptionId();
    }
    return true;
  });

  readonly modalTitle = computed(() => {
    const m = this.mode();
    if (m === MODAL_MODE.CREATE) return 'Add Question';
    if (m === MODAL_MODE.EDIT)   return 'Edit Question';
    return 'View Question';
  });

  readonly difficultyOptions: Difficulty[] = ['Easy', 'Medium', 'Hard'];
  readonly typeOptions: { label: string; value: QuestionType }[] = [
    { label: 'Long Answer',  value: 'long-answer' },
    { label: 'Short Note',   value: 'short-note' },
    { label: 'Numerical',    value: 'numerical' },
    { label: 'Definition',   value: 'definition' },
    { label: 'MCQ',          value: 'mcq' },
  ];

  constructor() {
    effect(() => {
      if (this.visible()) {
        const q = this.question();
        if (q && this.mode() !== 'create') {
          this.selectedSubjectId.set(q.subjectId);
          this.tagsString.set(q.tags.join(', '));
          this.options.set(
            q.options?.length === 4
              ? q.options.map(o => ({ ...o }))
              : DEFAULT_OPTIONS(),
          );
          this.correctOptionId.set(q.correctOptionId || 'A');
          this.imageUrls.set([...(q.imageUrls ?? [])]);
          this.formData.set({
            text: q.text, subjectId: q.subjectId, unitId: q.unitId,
            difficulty: q.difficulty, marks: q.marks, type: q.type,
            isImportant: q.isImportant, tags: q.tags, askedIn: q.askedIn,
          });
        } else {
          this.selectedSubjectId.set('');
          this.tagsString.set('');
          this.options.set(DEFAULT_OPTIONS());
          this.correctOptionId.set('A');
          this.imageUrls.set([]);
          this.formData.set({
            text: '', subjectId: '', unitId: '', difficulty: 'Medium',
            marks: 8, type: 'long-answer', isImportant: false, tags: [], askedIn: [],
          });
        }
      }
    });
  }

  // ── Base form handlers ─────────────────────────────────────────────────────
  onSubjectChange(subjectId: string): void {
    this.selectedSubjectId.set(subjectId);
    this.patchForm({ subjectId, unitId: '' });
  }

  onUnitChange(unitId: string): void { this.patchForm({ unitId }); }
  onDifficultyChange(d: string): void { this.patchForm({ difficulty: d as Difficulty }); }
  onMarksChange(v: string): void { this.patchForm({ marks: Number(v) }); }
  onImportantChange(v: boolean): void { this.patchForm({ isImportant: v }); }
  onTagsInput(v: string): void { this.tagsString.set(v); }

  onTypeChange(t: string): void {
    this.patchForm({ type: t as QuestionType });
    if (t === 'mcq' && this.options().every(o => !o.text)) {
      this.options.set(DEFAULT_OPTIONS());
    }
  }

  patchForm(patch: Partial<QuestionForm>): void {
    this.formData.set({ ...this.formData(), ...patch });
  }

  // ── MCQ handlers ───────────────────────────────────────────────────────────
  onOptionTextChange(id: 'A' | 'B' | 'C' | 'D', text: string): void {
    this.options.update(opts => opts.map(o => o.id === id ? { ...o, text } : o));
  }

  onCorrectOptionChange(id: string): void {
    this.correctOptionId.set(id);
  }

  // ── Image handlers ─────────────────────────────────────────────────────────
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    Array.from(input.files ?? []).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        this.imageUrls.update(urls => [...urls, e.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removeImage(index: number): void {
    this.imageUrls.update(urls => urls.filter((_, i) => i !== index));
  }

  // ── Save / Cancel ──────────────────────────────────────────────────────────
  onSave(): void {
    if (!this.isValid()) return;
    const d = this.formData();
    const isMcq = d.type === 'mcq';
    const tags = this.tagsString().split(',').map(t => t.trim()).filter(Boolean);
    this.save.emit({
      text:            d.text ?? '',
      subjectId:       d.subjectId ?? '',
      subjectName:     '',
      unitId:          d.unitId ?? '',
      unitName:        '',
      difficulty:      d.difficulty ?? 'Medium',
      marks:           d.marks ?? 8,
      type:            d.type ?? 'long-answer',
      isImportant:     d.isImportant ?? false,
      tags,
      askedIn:         d.askedIn ?? [],
      options:         isMcq ? this.options() : [],
      correctOptionId: isMcq ? this.correctOptionId() : '',
      imageUrls:       this.imageUrls(),
      tableHtml:       '',
      detailedAnswer:  '',
      simpleAnswer:    '',
      revisionNotes:   '',
      videoUrl:        '',
    });
  }

  onCancel(): void { this.cancel.emit(); }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('qeditor__overlay')) {
      this.cancel.emit();
    }
  }
}
