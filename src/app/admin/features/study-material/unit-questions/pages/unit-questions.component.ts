import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

import { UnitQuestionsApiActions } from '../store/actions/unit-questions.actions';
import {
  selectUqSubjects,
  selectUqUnits,
  selectUqQuestions,
  selectUqAnswers,
  selectUqLoading,
} from '../store/selectors/unit-questions.selectors';

import type { Subject, Unit, Question, QuestionType, Answer, AnswerBlock, AcademicYear, YearGroup, FilterType } from '../interfaces/unit-questions.interfaces';

@Component({
  selector: 'app-unit-questions-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './unit-questions.component.html',
  styleUrl: './unit-questions.component.scss',
})
export class UnitQuestionsPageComponent {
  private readonly store     = inject(Store);
  private readonly sanitizer = inject(DomSanitizer);

  readonly subjects  = this.store.selectSignal(selectUqSubjects);
  readonly units     = this.store.selectSignal(selectUqUnits);
  readonly questions = this.store.selectSignal(selectUqQuestions);
  readonly loading   = this.store.selectSignal(selectUqLoading);
  readonly answers   = this.store.selectSignal(selectUqAnswers);

  // ── Navigation ────────────────────────────────────────────────────────────
  readonly selectedSubject  = signal<Subject | null>(null);
  readonly selectedUnit     = signal<Unit | null>(null);
  readonly sidebarCollapsed = signal(false);

  // ── Info panels ───────────────────────────────────────────────────────────
  readonly infoSubjectId = signal<string | null>(null);
  readonly infoUnitId    = signal<string | null>(null);

  // ── Filters ───────────────────────────────────────────────────────────────
  readonly filterImportant = signal(false);
  readonly filterType      = signal<FilterType>('');

  // ── Accordion ─────────────────────────────────────────────────────────────
  readonly expandedId = signal<string | null>(null);
  readonly tabMap     = signal<Record<string, 'simple' | 'detailed'>>({});

  // ── Video modal ───────────────────────────────────────────────────────────
  readonly activeVideoId = signal<string | null>(null);

  readonly safeVideoUrl = computed<SafeResourceUrl | null>(() => {
    const id = this.activeVideoId();
    if (!id) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
    );
  });

  // ── Static tables ─────────────────────────────────────────────────────────
  readonly YEAR_LABELS: Record<AcademicYear, string> = {
    FE: 'First Year',
    SE: 'Second Year',
    TE: 'Third Year',
    BE: 'Final Year',
  };

  readonly QUESTION_TYPES: { label: string; value: FilterType }[] = [
    { label: 'Long Answer', value: 'long-answer' },
    { label: 'MCQ',         value: 'mcq' },
  ];

  readonly TYPE_LABELS: Record<QuestionType, string> = {
    'long-answer': 'Long Answer',
    'short-note':  'Short Note',
    'definition':  'Definition',
    'numerical':   'Numerical',
    'mcq':         'MCQ',
  };

  // ── Computed ──────────────────────────────────────────────────────────────

  readonly subjectsByYear = computed<YearGroup[]>(() =>
    (['FE', 'SE', 'TE', 'BE'] as AcademicYear[])
      .map(year => ({
        year,
        label: this.YEAR_LABELS[year],
        subjects: this.subjects().filter(s => s.year === year),
      }))
      .filter(g => g.subjects.length > 0),
  );

  readonly filteredUnits = computed(() => {
    const s = this.selectedSubject();
    return s ? this.units().filter(u => u.subjectId === s.id) : [];
  });

  readonly filteredQuestions = computed(() => {
    const u = this.selectedUnit();
    if (!u) return [];
    let qs = this.questions().filter(q => q.unitId === u.id);
    if (this.filterImportant()) qs = qs.filter(q => q.isImportant);
    if (this.filterType())      qs = qs.filter(q => q.type === this.filterType());
    return qs;
  });

  readonly questionCountByUnit = computed(() => {
    const map: Record<string, number> = {};
    for (const q of this.questions()) {
      map[q.unitId] = (map[q.unitId] ?? 0) + 1;
    }
    return map;
  });

  readonly answersByQuestion = computed(() => {
    const map: Record<string, Record<string, Answer>> = {};
    for (const a of this.answers()) {
      if (!map[a.questionId]) map[a.questionId] = {};
      map[a.questionId][a.answerType] = a;
    }
    return map;
  });

  constructor() {
    this.store.dispatch(UnitQuestionsApiActions.loadData());
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  selectSubject(s: Subject): void {
    if (this.selectedSubject()?.id === s.id) return;
    this.selectedSubject.set(s);
    this.selectedUnit.set(null);
    this.infoSubjectId.set(null);
    this.expandedId.set(null);
    this.clearFilters();
    // auto-select first unit so content is immediately visible
    const first = this.filteredUnits()[0] ?? null;
    if (first) this.selectedUnit.set(first);
  }

  selectUnit(u: Unit): void {
    if (this.selectedUnit()?.id === u.id) return;
    this.selectedUnit.set(u);
    this.infoUnitId.set(null);
    this.expandedId.set(null);
    this.clearFilters();
  }

  // ── Sidebar / Info panels ─────────────────────────────────────────────────

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
    if (this.sidebarCollapsed()) this.infoSubjectId.set(null);
  }

  toggleSubjectInfo(id: string, e: Event): void {
    e.stopPropagation();
    this.infoSubjectId.set(this.infoSubjectId() === id ? null : id);
  }

  toggleUnitInfo(id: string, e: Event): void {
    e.stopPropagation();
    this.infoUnitId.set(this.infoUnitId() === id ? null : id);
  }

  // ── Accordion ─────────────────────────────────────────────────────────────

  toggleQuestion(id: string): void {
    const next = this.expandedId() === id ? null : id;
    this.expandedId.set(next);
    if (next && !this.tabMap()[id]) {
      this.tabMap.update(m => ({ ...m, [id]: 'detailed' }));
    }
  }

  setTab(qId: string, tab: 'simple' | 'detailed', e: Event): void {
    e.stopPropagation();
    this.tabMap.update(m => ({ ...m, [qId]: tab }));
    if (this.expandedId() !== qId) this.expandedId.set(qId);
  }

  getTab(qId: string): 'simple' | 'detailed' {
    return this.tabMap()[qId] ?? 'detailed';
  }

  // ── Answer helpers ────────────────────────────────────────────────────────

  getRichAnswer(qId: string, type: 'Simple' | 'Detailed'): Answer | null {
    return this.answersByQuestion()[qId]?.[type] ?? null;
  }

  blocksOf(a: Answer): AnswerBlock[] {
    return a.answer.content;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cast(b: AnswerBlock): any { return b; }

  // ── Misc helpers ──────────────────────────────────────────────────────────

  getUnitById(id: string): Unit | null {
    return this.units().find(u => u.id === id) ?? null;
  }

  getQCount(unitId: string): number {
    return this.questionCountByUnit()[unitId] ?? 0;
  }

  typeLabel(t: QuestionType): string {
    return this.TYPE_LABELS[t] ?? t;
  }

  openVideo(url: string, e: Event): void {
    e.stopPropagation();
    const id = this.extractYouTubeId(url);
    if (id) {
      this.activeVideoId.set(id);
    } else {
      window.open(url, '_blank');
    }
  }

  closeVideo(): void {
    this.activeVideoId.set(null);
  }

  private extractYouTubeId(url: string): string | null {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    );
    return match?.[1] ?? null;
  }

  clearFilters(): void {
    this.filterImportant.set(false);
    this.filterType.set('');
  }
}
