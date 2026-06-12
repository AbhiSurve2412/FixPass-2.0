import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Subject } from '../../models/home.models';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

const SUBJECTS: Subject[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    units: [
      { unit: 1, totalQuestions: 24, importantQuestions: 8 },
      { unit: 2, totalQuestions: 18, importantQuestions: 6 },
      { unit: 3, totalQuestions: 22, importantQuestions: 7 },
      { unit: 4, totalQuestions: 20, importantQuestions: 6 },
      { unit: 5, totalQuestions: 26, importantQuestions: 9 },
      { unit: 6, totalQuestions: 21, importantQuestions: 7 },
    ],
  },
  {
    id: 'wt',
    name: 'Web Technology',
    units: [
      { unit: 1, totalQuestions: 20, importantQuestions: 7 },
      { unit: 2, totalQuestions: 22, importantQuestions: 8 },
      { unit: 3, totalQuestions: 19, importantQuestions: 6 },
      { unit: 4, totalQuestions: 24, importantQuestions: 9 },
      { unit: 5, totalQuestions: 17, importantQuestions: 6 },
      { unit: 6, totalQuestions: 23, importantQuestions: 8 },
    ],
  },
  {
    id: 'dsbd',
    name: 'Data Science & Big Data Analytics',
    units: [
      { unit: 1, totalQuestions: 22, importantQuestions: 7 },
      { unit: 2, totalQuestions: 19, importantQuestions: 6 },
      { unit: 3, totalQuestions: 25, importantQuestions: 8 },
      { unit: 4, totalQuestions: 21, importantQuestions: 7 },
      { unit: 5, totalQuestions: 23, importantQuestions: 8 },
      { unit: 6, totalQuestions: 18, importantQuestions: 6 },
    ],
  },
  {
    id: 'cc',
    name: 'Cloud Computing',
    units: [
      { unit: 1, totalQuestions: 18, importantQuestions: 6 },
      { unit: 2, totalQuestions: 20, importantQuestions: 7 },
      { unit: 3, totalQuestions: 24, importantQuestions: 8 },
      { unit: 4, totalQuestions: 22, importantQuestions: 7 },
      { unit: 5, totalQuestions: 19, importantQuestions: 6 },
      { unit: 6, totalQuestions: 26, importantQuestions: 9 },
    ],
  },
  {
    id: 'is',
    name: 'Information Security',
    units: [
      { unit: 1, totalQuestions: 21, importantQuestions: 7 },
      { unit: 2, totalQuestions: 24, importantQuestions: 8 },
      { unit: 3, totalQuestions: 18, importantQuestions: 6 },
      { unit: 4, totalQuestions: 22, importantQuestions: 7 },
      { unit: 5, totalQuestions: 20, importantQuestions: 6 },
      { unit: 6, totalQuestions: 25, importantQuestions: 9 },
    ],
  },
  {
    id: 'avr',
    name: 'Augmented & Virtual Reality',
    units: [
      { unit: 1, totalQuestions: 19, importantQuestions: 6 },
      { unit: 2, totalQuestions: 23, importantQuestions: 8 },
      { unit: 3, totalQuestions: 20, importantQuestions: 7 },
      { unit: 4, totalQuestions: 26, importantQuestions: 9 },
      { unit: 5, totalQuestions: 21, importantQuestions: 7 },
      { unit: 6, totalQuestions: 17, importantQuestions: 6 },
    ],
  },
];

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  imports: [SectionHeaderComponent],
  templateUrl: './product-showcase.component.html',
  styleUrl: './product-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShowcaseComponent {
  readonly subjects = SUBJECTS;
  readonly activeSubject = signal<Subject>(SUBJECTS[0]);

  setActive(subject: Subject): void {
    this.activeSubject.set(subject);
  }

  getTotalQuestions(subject: Subject): number {
    return subject.units.reduce((sum, u) => sum + u.totalQuestions, 0);
  }

  getImportantQuestions(subject: Subject): number {
    return subject.units.reduce((sum, u) => sum + u.importantQuestions, 0);
  }

  trackBySubject(_: number, subject: Subject): string {
    return subject.id;
  }

  trackByUnit(index: number): number {
    return index;
  }
}
