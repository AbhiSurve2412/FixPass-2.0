import { ChangeDetectionStrategy, Component, effect, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademicYear, Branch, HeroContent, Subject } from '../../interfaces/home.interfaces';

@Component({
  selector: 'app-hero-showcase',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero-showcase.component.html',
  styleUrl: './hero-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroShowcaseComponent {
  // ── Inputs from NgRx state (via home container) ─────────────────
  readonly hero     = input<HeroContent | null>(null);
  readonly branches = input<Branch[]>([]);

  // ── Local UI state (selection — NOT in NgRx store) ──────────────
  readonly activeBranch  = signal<Branch | null>(null);
  readonly activeYear    = signal<AcademicYear | null>(null);
  readonly activeSubject = signal<Subject | null>(null);

  private initialized = false;

  constructor() {
    // Initialize selection once branches data arrives from store
    effect(() => {
      const bs = this.branches();
      if (bs.length > 0 && !this.initialized) {
        this.initialized = true;
        const defaultBranch = bs.find(b => b.id === 'ce') ?? bs[0];
        const defaultYear   = defaultBranch.years.find(y => y.id === 'ty') ?? defaultBranch.years[0];
        untracked(() => {
          this.activeBranch.set(defaultBranch);
          this.activeYear.set(defaultYear ?? null);
          this.activeSubject.set(defaultYear?.subjects[0] ?? null);
        });
      }
    });
  }

  selectBranch(branch: Branch): void {
    const firstYear = branch.years[0];
    this.activeBranch.set(branch);
    this.activeYear.set(firstYear ?? null);
    this.activeSubject.set(firstYear?.subjects[0] ?? null);
  }

  selectYear(year: AcademicYear): void {
    this.activeYear.set(year);
    this.activeSubject.set(year.subjects[0] ?? null);
  }

  selectSubject(subject: Subject): void {
    this.activeSubject.set(subject);
  }

  getTotalQuestions(subject: Subject): number {
    return subject.units.reduce((s, u) => s + u.totalQuestions, 0);
  }

  getImportantQuestions(subject: Subject): number {
    return subject.units.reduce((s, u) => s + u.importantQuestions, 0);
  }

  trackByBranch(_: number, b: Branch): string { return b.id; }
  trackByYear(_: number, y: AcademicYear): string { return y.id; }
  trackBySubject(_: number, s: Subject): string { return s.id; }
  trackByStat(_: number, stat: { value: string; label: string }): string { return stat.label; }
  trackByUnit(i: number): number { return i; }
}
