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
  ExtractedQuestion,
  PdfImportMetadata,
  QuestionType,
} from '../../interfaces/question.interfaces';
import { Difficulty } from '../../../../shared/interfaces/admin-shared.interfaces';

export interface QuestionPairGroup {
  pairIndex: number;
  unitLabel: string;
  assignedUnitId: string;
  allQuestions: ExtractedQuestion[];
}

@Component({
  selector: 'app-pdf-import-wizard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pdf-import-wizard.component.html',
  styleUrl: './pdf-import-wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfImportWizardComponent {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  visible = input(false);
  subjects = input<{ id: string; name: string }[]>([]);
  units = input<{ id: string; name: string; subjectId: string }[]>([]);
  extracting = input(false);
  extractedQuestions = input<ExtractedQuestion[]>([]);

  // ── Outputs ────────────────────────────────────────────────────────────────
  extract = output<{ files: File[]; metadata: PdfImportMetadata }>();
  importQuestions = output<{ questions: ExtractedQuestion[]; metadata: PdfImportMetadata }>();
  close = output<void>();

  // ── Local state ────────────────────────────────────────────────────────────
  readonly currentStep = signal<1 | 2 | 3>(1);
  readonly selectedFiles = signal<File[]>([]);
  readonly selectedSubjectId = signal<string>('');
  readonly editedQuestions = signal<ExtractedQuestion[]>([]);
  readonly pairUnitMap = signal<Map<number, string>>(new Map());
  readonly activeSection = signal<string>('all');
  readonly selectedIds = signal<Set<string>>(new Set());

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly filteredUnits = computed(() =>
    this.units().filter(u => u.subjectId === this.selectedSubjectId()),
  );

  readonly canExtract = computed(
    () => this.selectedFiles().length > 0 && !!this.selectedSubjectId(),
  );

  readonly groupedQuestions = computed<QuestionPairGroup[]>(() => {
    const questions = this.editedQuestions();
    const unitMap = this.pairUnitMap();
    const groups: QuestionPairGroup[] = [];

    // MCQ group first (pairIndex = -1)
    const mcqQuestions = questions.filter(q => q.type === 'mcq');
    if (mcqQuestions.length > 0) {
      groups.push({
        pairIndex: -1,
        unitLabel: 'Multiple Choice Questions',
        assignedUnitId: unitMap.get(-1) ?? '',
        allQuestions: mcqQuestions
          .slice()
          .sort((a, b) => a.questionNumber.localeCompare(b.questionNumber)),
      });
    }

    // Non-MCQ questions grouped by Q-number pair
    const pairMap = new Map<number, ExtractedQuestion[]>();
    for (const q of questions.filter(q => q.type !== 'mcq')) {
      const match = q.questionNumber.match(/^Q(\d+)/i);
      const qNum = match ? parseInt(match[1], 10) : 0;
      // SPPU 2024 pattern: Q1=MCQ, Q2/Q3=Unit1, Q4/Q5=Unit2 … Q10/Q11=Unit5
      const pairIndex = Math.floor(qNum / 2) - 1;
      if (!pairMap.has(pairIndex)) pairMap.set(pairIndex, []);
      pairMap.get(pairIndex)!.push(q);
    }

    const unitGroups = Array.from(pairMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([pairIndex, all]) => ({
        pairIndex,
        unitLabel: `Unit ${pairIndex + 1}`,
        assignedUnitId: unitMap.get(pairIndex) ?? '',
        allQuestions: all
          .slice()
          .sort((a, b) => a.questionNumber.localeCompare(b.questionNumber)),
      }));

    return [...groups, ...unitGroups];
  });

  readonly importStats = computed(() => {
    const qs = this.editedQuestions();
    const mcqCount = qs.filter(q => q.type === 'mcq').length;
    return {
      total: qs.length,
      mcqCount,
      descriptiveCount: qs.length - mcqCount,
      flaggedCount: qs.filter(q => q.needsReview).length,
      avgConfidence: qs.length > 0
        ? qs.reduce((s, q) => s + q.confidence, 0) / qs.length
        : 0,
    };
  });

  readonly allSelected = computed(() => {
    const ids = this.selectedIds();
    const total = this.editedQuestions().length;
    return total > 0 && ids.size === total;
  });

  readonly someSelected = computed(() => this.selectedIds().size > 0);

  readonly difficultyOptions: Difficulty[] = ['Easy', 'Medium', 'Hard'];

  readonly typeOptions = [
    { value: 'long-answer', label: 'Long Answer' },
    { value: 'short-note', label: 'Short Note' },
    { value: 'definition', label: 'Definition' },
    { value: 'numerical', label: 'Numerical' },
    { value: 'mcq', label: 'MCQ' },
  ];

  constructor() {
    effect(() => {
      const questions = this.extractedQuestions();
      if (questions.length > 0) {
        this.editedQuestions.set(
          questions.map(q => ({
            ...q,
            options:
              q.options?.length === 4
                ? q.options.map(o => ({ ...o }))
                : [
                    { id: 'A' as const, text: '' },
                    { id: 'B' as const, text: '' },
                    { id: 'C' as const, text: '' },
                    { id: 'D' as const, text: '' },
                  ],
            correctOptionId: q.correctOptionId ?? 'A',
            imageUrls: [...(q.imageUrls ?? [])],
            tableHtml: q.tableHtml ?? '',
          })),
        );
        this.currentStep.set(3);
      }
    });
  }

  // ── Step 1 handlers ────────────────────────────────────────────────────────
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newFiles = Array.from(input.files ?? []);
    if (!newFiles.length) return;
    this.selectedFiles.update(existing => {
      const existingNames = new Set(existing.map(f => f.name));
      return [...existing, ...newFiles.filter(f => !existingNames.has(f.name))];
    });
    input.value = '';
  }

  removeFile(name: string): void {
    this.selectedFiles.update(files => files.filter(f => f.name !== name));
  }

  onSubjectChange(subjectId: string): void {
    this.selectedSubjectId.set(subjectId);
  }

  onExtract(): void {
    const files = this.selectedFiles();
    const subjectId = this.selectedSubjectId();
    if (!files.length || !subjectId) return;
    const subject = this.subjects().find(s => s.id === subjectId);
    const metadata: PdfImportMetadata = {
      subjectId,
      subjectName: subject?.name ?? subjectId,
      unitId: '',
      examSeason: 'Summer',
      academicYear: new Date().getFullYear(),
      paperCode: '',
      unitLookup: [],
    };
    this.currentStep.set(2);
    this.extract.emit({ files, metadata });
  }

  // ── Step 3 – selection & bulk ──────────────────────────────────────────────
  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  toggleSelect(id: string): void {
    this.selectedIds.update(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.editedQuestions().map(q => q.id)));
    }
  }

  deleteQuestion(id: string): void {
    this.editedQuestions.update(list => list.filter(q => q.id !== id));
    this.selectedIds.update(s => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  }

  bulkDelete(): void {
    const ids = this.selectedIds();
    this.editedQuestions.update(list => list.filter(q => !ids.has(q.id)));
    this.selectedIds.set(new Set());
  }

  bulkMarkImportant(): void {
    const ids = this.selectedIds();
    this.editedQuestions.update(list =>
      list.map(q => (ids.has(q.id) ? { ...q, isImportant: true } : q)),
    );
  }

  bulkAssignUnit(unitId: string): void {
    if (!unitId) return;
    const ids = this.selectedIds();
    this.editedQuestions.update(list =>
      list.map(q => (ids.has(q.id) ? { ...q, unitId } : q)),
    );
    this.selectedIds.set(new Set());
  }

  scrollToSection(sectionId: string): void {
    this.activeSection.set(sectionId);
    const el = document.getElementById('ws-' + sectionId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Step 3 – per-question handlers ─────────────────────────────────────────
  onGroupUnitChange(pairIndex: number, unitId: string): void {
    this.pairUnitMap.update(m => {
      const next = new Map(m);
      next.set(pairIndex, unitId);
      return next;
    });
    const group = this.groupedQuestions().find(g => g.pairIndex === pairIndex);
    if (!group) return;
    const idsInPair = new Set(group.allQuestions.map(q => q.id));
    this.editedQuestions.update(list =>
      list.map(q => (idsInPair.has(q.id) ? { ...q, unitId } : q)),
    );
  }

  onQuestionTextChange(id: string, newText: string): void {
    this.editedQuestions.update(list =>
      list.map(q => (q.id === id ? { ...q, text: newText } : q)),
    );
  }

  onQuestionUnitChange(id: string, unitId: string): void {
    this.editedQuestions.update(list =>
      list.map(q => (q.id === id ? { ...q, unitId } : q)),
    );
  }

  onQuestionMarksChange(id: string, val: string): void {
    const marks = parseInt(val, 10);
    if (!isNaN(marks)) {
      this.editedQuestions.update(list =>
        list.map(q => (q.id === id ? { ...q, estimatedMarks: marks } : q)),
      );
    }
  }

  onQuestionTypeChange(id: string, type: string): void {
    this.editedQuestions.update(list =>
      list.map(q => (q.id === id ? { ...q, type: type as QuestionType } : q)),
    );
  }

  onQuestionDifficultyChange(id: string, diff: Difficulty): void {
    this.editedQuestions.update(list =>
      list.map(q => (q.id === id ? { ...q, difficulty: diff } : q)),
    );
  }

  onQuestionImportantChange(id: string, val: boolean): void {
    this.editedQuestions.update(list =>
      list.map(q => (q.id === id ? { ...q, isImportant: val } : q)),
    );
  }

  onOptionTextChange(
    questionId: string,
    optionId: 'A' | 'B' | 'C' | 'D',
    text: string,
  ): void {
    this.editedQuestions.update(list =>
      list.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.map(o => (o.id === optionId ? { ...o, text } : o)) }
          : q,
      ),
    );
  }

  onCorrectOptionChange(questionId: string, optionId: string): void {
    this.editedQuestions.update(list =>
      list.map(q => (q.id === questionId ? { ...q, correctOptionId: optionId } : q)),
    );
  }

  toggleQuestionReview(id: string): void {
    this.editedQuestions.update(list =>
      list.map(q => (q.id === id ? { ...q, needsReview: !q.needsReview } : q)),
    );
  }

  // ── Import ─────────────────────────────────────────────────────────────────
  onImportSelected(): void {
    const ids = this.selectedIds();
    this.doImport(this.editedQuestions().filter(q => ids.has(q.id)));
  }

  onImportAll(): void {
    this.doImport(this.editedQuestions());
  }

  private doImport(questions: ExtractedQuestion[]): void {
    const subjectId = this.selectedSubjectId();
    const subject = this.subjects().find(s => s.id === subjectId);
    const metadata: PdfImportMetadata = {
      subjectId,
      subjectName: subject?.name ?? subjectId,
      unitId: '',
      examSeason: 'Summer',
      academicYear: new Date().getFullYear(),
      paperCode: '',
      unitLookup: this.filteredUnits().map(u => ({ id: u.id, name: u.name })),
    };
    this.importQuestions.emit({ questions, metadata });
    this.close.emit();
    this.resetState();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  typeLabel(type: QuestionType | string): string {
    const labels: Record<string, string> = {
      'long-answer': 'Long Answer',
      'short-note': 'Short Note',
      'definition': 'Definition',
      'numerical': 'Numerical',
      'mcq': 'MCQ',
    };
    return labels[type] ?? type;
  }

  confidencePercent(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
  }

  goBack(): void {
    this.currentStep.set(1);
  }

  onClose(): void {
    this.resetState();
    this.close.emit();
  }

  private resetState(): void {
    this.currentStep.set(1);
    this.selectedFiles.set([]);
    this.selectedSubjectId.set('');
    this.editedQuestions.set([]);
    this.pairUnitMap.set(new Map());
    this.activeSection.set('all');
    this.selectedIds.set(new Set());
  }
}
