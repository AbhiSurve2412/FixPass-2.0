import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { QuestionApiActions } from '../store/actions/question.actions';
import {
  getExtractedQuestions,
  getQuestions,
  getQuestionsError,
  getQuestionsExtracting,
  getQuestionsImporting,
  getQuestionsLoading,
} from '../store/selectors/question.selectors';

import { SubjectApiActions } from '../../subjects/store/actions/subject.actions';
import { getSubjects } from '../../subjects/store/selectors/subject.selectors';

import { UnitApiActions } from '../../units/store/actions/unit.actions';
import { getUnits } from '../../units/store/selectors/unit.selectors';

import {
  ExtractedQuestion,
  PdfImportMetadata,
  Question,
  QuestionExplorerNode,
  QuestionForm,
} from '../interfaces/question.interfaces';

import { QuestionExplorerComponent } from '../components/question-explorer/question-explorer.component';
import { QuestionCardComponent } from '../components/question-card/question-card.component';
import { QuestionEditorComponent } from '../components/question-editor/question-editor.component';
import { PdfImportWizardComponent } from '../components/pdf-import-wizard/pdf-import-wizard.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { MODAL_MODE, ModalMode } from '../../../shared/interfaces/admin-shared.interfaces';

@Component({
  selector: 'app-questions-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    QuestionExplorerComponent,
    QuestionCardComponent,
    QuestionEditorComponent,
    PdfImportWizardComponent,
    ConfirmDialogComponent,
    SearchBarComponent,
    EmptyStateComponent,
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
})
export class QuestionsPageComponent {
  private readonly store = inject(Store);

  // ── Store signals ──────────────────────────────────────────────────────────
  readonly questions = this.store.selectSignal(getQuestions);
  readonly subjects = this.store.selectSignal(getSubjects);
  readonly units = this.store.selectSignal(getUnits);
  readonly loading = this.store.selectSignal(getQuestionsLoading);
  readonly error = this.store.selectSignal(getQuestionsError);
  readonly extracting = this.store.selectSignal(getQuestionsExtracting);
  readonly importing = this.store.selectSignal(getQuestionsImporting);
  readonly extractedQuestions = this.store.selectSignal(getExtractedQuestions);

  // ── Local UI state ─────────────────────────────────────────────────────────
  readonly selectedSubjectId = signal<string | null>(null);
  readonly selectedUnitId = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly showEditor = signal(false);
  readonly editorMode = signal<ModalMode>(MODAL_MODE.CREATE);
  readonly selectedQuestion = signal<Question | null>(null);
  readonly showImportWizard = signal(false);
  readonly showConfirmDelete = signal(false);
  readonly deleteTargetId = signal<string | null>(null);
  readonly deleteTargetName = signal<string | null>(null);

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly explorerNodes = computed<QuestionExplorerNode[]>(() => {
    const subjects = this.subjects();
    const units = this.units();
    const questions = this.questions();

    return subjects.map(s => ({
      subjectId: s.id,
      subjectName: s.name,
      expanded: true,
      units: units
        .filter(u => u.subjectId === s.id)
        .map(u => ({
          unitId: u.id,
          unitName: u.name,
          questionCount: questions.filter(q => q.unitId === u.id).length,
        })),
    }));
  });

  readonly filteredQuestions = computed(() => {
    const unitId = this.selectedUnitId();
    const term = this.searchTerm().toLowerCase();
    let qs = unitId
      ? this.questions().filter(q => q.unitId === unitId)
      : this.questions();
    if (term) {
      qs = qs.filter(
        q =>
          q.text.toLowerCase().includes(term) ||
          q.tags.some(t => t.toLowerCase().includes(term)),
      );
    }
    return qs;
  });

  readonly pageTitle = computed(() => {
    const unitId = this.selectedUnitId();
    if (!unitId) return 'All Questions';
    const unit = this.units().find(u => u.id === unitId);
    const subject = unit ? this.subjects().find(s => s.id === unit.subjectId) : null;
    return subject ? `${subject.name} — ${unit?.name}` : (unit?.name ?? 'Questions');
  });

  // ── Init ───────────────────────────────────────────────────────────────────
  constructor() {
    this.store.dispatch(QuestionApiActions.loadQuestions());
    this.store.dispatch(SubjectApiActions.loadSubjects());
    this.store.dispatch(UnitApiActions.loadUnits());
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  onUnitSelected(unitId: string, subjectId: string): void {
    this.selectedUnitId.set(unitId);
    this.selectedSubjectId.set(subjectId);
  }

  onAllSelected(): void {
    this.selectedUnitId.set(null);
    this.selectedSubjectId.set(null);
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  openCreate(): void {
    this.selectedQuestion.set(null);
    this.editorMode.set(MODAL_MODE.CREATE);
    this.showEditor.set(true);
  }

  onViewQuestion(q: Question): void {
    this.selectedQuestion.set(q);
    this.editorMode.set(MODAL_MODE.VIEW);
    this.showEditor.set(true);
  }

  onEditQuestion(q: Question): void {
    this.selectedQuestion.set(q);
    this.editorMode.set(MODAL_MODE.EDIT);
    this.showEditor.set(true);
  }

  onDeleteQuestion(q: Question): void {
    this.deleteTargetId.set(q.id);
    this.deleteTargetName.set(q.text.slice(0, 60) + (q.text.length > 60 ? '…' : ''));
    this.showConfirmDelete.set(true);
  }

  onEditorSave(form: QuestionForm): void {
    const mode        = this.editorMode();
    const subjectName = this.subjects().find(s => s.id === form.subjectId)?.name ?? form.subjectId;
    const unitName    = this.units().find(u => u.id === form.unitId)?.name ?? form.unitId;
    const enriched: QuestionForm = { ...form, subjectName, unitName };

    if (mode === MODAL_MODE.CREATE) {
      this.store.dispatch(QuestionApiActions.createQuestion({ form: enriched }));
    } else if (mode === MODAL_MODE.EDIT) {
      const existing = this.selectedQuestion();
      if (existing) {
        this.store.dispatch(
          QuestionApiActions.updateQuestion({
            question: { ...existing, ...enriched },
          }),
        );
      }
    }
    this.showEditor.set(false);
    this.selectedQuestion.set(null);
  }

  onEditorCancel(): void {
    this.showEditor.set(false);
    this.selectedQuestion.set(null);
  }

  onConfirmDelete(): void {
    const id = this.deleteTargetId();
    if (id) this.store.dispatch(QuestionApiActions.deleteQuestion({ id }));
    this.showConfirmDelete.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  onCancelDelete(): void {
    this.showConfirmDelete.set(false);
    this.deleteTargetId.set(null);
    this.deleteTargetName.set(null);
  }

  openImportWizard(): void {
    this.store.dispatch(QuestionApiActions.clearExtractedQuestions());
    this.showImportWizard.set(true);
  }

  onExtractPdf(payload: { files: File[]; metadata: PdfImportMetadata }): void {
    this.store.dispatch(
      QuestionApiActions.extractQuestionsFromPdf({
        files: payload.files,
        metadata: payload.metadata,
      }),
    );
  }

  onImportPdf(payload: {
    questions: ExtractedQuestion[];
    metadata: PdfImportMetadata;
  }): void {
    this.store.dispatch(
      QuestionApiActions.importExtractedQuestions({
        questions: payload.questions,
        metadata: payload.metadata,
      }),
    );
    this.showImportWizard.set(false);
  }

  onCloseImportWizard(): void {
    this.showImportWizard.set(false);
  }

  trackByQuestion(_: number, q: Question): string {
    return q.id;
  }
}
