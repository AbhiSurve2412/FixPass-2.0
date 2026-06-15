import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { AnswerApiActions } from '../store/actions/answer.actions';
import {
  getAnswerGenerating,
  getAnswerLoading,
  getAnswerSaving,
  getAnswers,
  getCurrentDetailedAnswer,
  getCurrentSimpleAnswer,
  getSelectedQuestionId,
  getSelectedSubjectId,
  getSelectedUnitId,
} from '../store/selectors/answer.selectors';

import { SubjectApiActions } from '../../subjects/store/actions/subject.actions';
import { getSubjects } from '../../subjects/store/selectors/subject.selectors';
import { UnitApiActions } from '../../units/store/actions/unit.actions';
import { getUnits } from '../../units/store/selectors/unit.selectors';
import { QuestionApiActions } from '../../questions/store/actions/question.actions';
import { getQuestions } from '../../questions/store/selectors/question.selectors';

import { Question } from '../../questions/interfaces/question.interfaces';
import { Answer, AnswerContent, AnswerType } from '../interfaces/answer.interfaces';
import { SelectOption } from '../../../shared/interfaces/admin-shared.interfaces';
import { AnswerWorkspaceComponent, RegenerateEvent } from '../components/answer-workspace/answer-workspace.component';
import { AnswerGridComponent } from '../components/answer-grid/answer-grid.component';
import { AnswerPreviewComponent } from '../components/answer-preview/answer-preview.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SearchableSelectComponent } from '../../../shared/components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-answers-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AnswerWorkspaceComponent,
    AnswerGridComponent,
    AnswerPreviewComponent,
    ConfirmDialogComponent,
    SearchableSelectComponent,
  ],
  templateUrl: './answers.component.html',
  styleUrl: './answers.component.scss',
})
export class AnswersPageComponent {
  private readonly store = inject(Store);

  readonly subjects = this.store.selectSignal(getSubjects);
  readonly units = this.store.selectSignal(getUnits);
  readonly questions = this.store.selectSignal(getQuestions);
  readonly answers = this.store.selectSignal(getAnswers);
  readonly loading = this.store.selectSignal(getAnswerLoading);
  readonly generating = this.store.selectSignal(getAnswerGenerating);
  readonly saving = this.store.selectSignal(getAnswerSaving);
  readonly selectedSubjectId = this.store.selectSignal(getSelectedSubjectId);
  readonly selectedUnitId = this.store.selectSignal(getSelectedUnitId);
  readonly selectedQuestionId = this.store.selectSignal(getSelectedQuestionId);
  readonly detailedAnswer = this.store.selectSignal(getCurrentDetailedAnswer);
  readonly simpleAnswer = this.store.selectSignal(getCurrentSimpleAnswer);

  readonly filteredUnits = computed(() => {
    const subjectId = this.selectedSubjectId();
    return subjectId ? this.units().filter(u => u.subjectId === subjectId) : [];
  });

  readonly filteredQuestions = computed<Question[]>(() => {
    const unitId = this.selectedUnitId();
    return unitId ? this.questions().filter(q => q.unitId === unitId) : [];
  });

  readonly selectedQuestion = computed<Question | null>(() => {
    const id = this.selectedQuestionId();
    return id ? (this.questions().find(q => q.id === id) ?? null) : null;
  });

  // Computed SelectOption arrays for searchable selects
  readonly subjectOptions = computed<SelectOption[]>(() =>
    this.subjects().map(s => ({ label: s.name, value: s.id }))
  );

  readonly unitOptions = computed<SelectOption[]>(() =>
    this.filteredUnits().map(u => ({ label: u.name, value: u.id }))
  );

  readonly questionOptions = computed<SelectOption[]>(() =>
    this.filteredQuestions().map(q => ({ label: q.text, value: q.id }))
  );

  readonly showWorkspace = computed(() => this.selectedQuestion() !== null);
  readonly activeTab = signal<'generation' | 'saved'>('generation');
  readonly previewAnswer = signal<Answer | null>(null);
  readonly pendingDeleteAnswer = signal<Answer | null>(null);

  private activeAnswerType: AnswerType = 'Detailed';

  setTab(tab: 'generation' | 'saved'): void {
    this.activeTab.set(tab);
  }

  constructor() {
    this.store.dispatch(SubjectApiActions.loadSubjects());
    this.store.dispatch(UnitApiActions.loadUnits());
    this.store.dispatch(QuestionApiActions.loadQuestions());
    this.store.dispatch(AnswerApiActions.loadAnswers());
  }

  onSubjectChange(value: string): void {
    this.store.dispatch(AnswerApiActions.setSelectedSubject({ subjectId: value || null }));
    this.store.dispatch(AnswerApiActions.setSelectedUnit({ unitId: null }));
    this.store.dispatch(AnswerApiActions.setSelectedQuestion({ questionId: null }));
  }

  onUnitChange(value: string): void {
    this.store.dispatch(AnswerApiActions.setSelectedUnit({ unitId: value || null }));
    this.store.dispatch(AnswerApiActions.setSelectedQuestion({ questionId: null }));
  }

  onQuestionChange(value: string): void {
    this.store.dispatch(AnswerApiActions.setSelectedQuestion({ questionId: value || null }));
  }

  onGenerateDetailed(): void {
    const q = this.selectedQuestion();
    if (q) {
      this.activeAnswerType = 'Detailed';
      this.store.dispatch(AnswerApiActions.generateDetailedAnswer({ questionText: q.text }));
    }
  }

  onGenerateSimple(): void {
    const q = this.selectedQuestion();
    if (q) {
      this.activeAnswerType = 'Simple';
      this.store.dispatch(AnswerApiActions.generateSimpleAnswer({ questionText: q.text }));
    }
  }

  onRegenerate(event: RegenerateEvent): void {
    const q = this.selectedQuestion();
    if (!q) return;

    const hasInstructions =
      event.contentInstruction.trim().length > 0 ||
      event.structureInstruction.trim().length > 0;

    if (hasInstructions && event.currentAnswer.content.length > 0) {
      this.store.dispatch(
        AnswerApiActions.updateAnswerContent({
          questionText: q.text,
          currentAnswer: event.currentAnswer,
          contentInstruction: event.contentInstruction,
          structureInstruction: event.structureInstruction,
        }),
      );
    } else {
      if (this.activeAnswerType === 'Detailed') {
        this.store.dispatch(AnswerApiActions.generateDetailedAnswer({ questionText: q.text }));
      } else {
        this.store.dispatch(AnswerApiActions.generateSimpleAnswer({ questionText: q.text }));
      }
    }
  }

  onSaveAnswer(content: AnswerContent): void {
    const q = this.selectedQuestion();
    if (!q) return;
    const type = this.activeAnswerType;
    const existing = this.answers().find(a => a.questionId === q.id && a.answerType === type);
    const answer: Answer = {
      id: existing?.id ?? '',
      questionId: q.id,
      questionText: q.text,
      subjectId: q.subjectId,
      subjectName: q.subjectName,
      unitId: q.unitId,
      unitName: q.unitName,
      answerType: type,
      status: 'Published',
      answer: content,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.dispatch(AnswerApiActions.saveAnswer({ answer }));
  }

  onViewAnswer(a: Answer): void {
    this.previewAnswer.set(a);
  }

  closePreview(): void {
    this.previewAnswer.set(null);
  }

  // Delete with confirmation
  onDeleteAnswer(a: Answer): void {
    this.pendingDeleteAnswer.set(a);
  }

  onConfirmDelete(): void {
    const a = this.pendingDeleteAnswer();
    if (a) {
      this.store.dispatch(AnswerApiActions.deleteAnswer({ id: a.id }));
      this.pendingDeleteAnswer.set(null);
    }
  }

  onCancelDelete(): void {
    this.pendingDeleteAnswer.set(null);
  }
}
