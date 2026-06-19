import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';

import { AdminLayoutComponent } from './layout/admin-layout.component';

import { universityReducer } from './features/universities/store/reducers/university.reducer';
import { UniversityEffects } from './features/universities/store/effects/university.effects';

import { collegeReducer } from './features/colleges/store/reducers/college.reducer';
import { CollegeEffects } from './features/colleges/store/effects/college.effects';

import { branchReducer } from './features/branches/store/reducers/branch.reducer';
import { BranchEffects } from './features/branches/store/effects/branch.effects';

import { subjectReducer } from './features/subjects/store/reducers/subject.reducer';
import { SubjectEffects } from './features/subjects/store/effects/subject.effects';

import { unitReducer } from './features/units/store/reducers/unit.reducer';
import { UnitEffects } from './features/units/store/effects/unit.effects';

import { questionReducer } from './features/questions/store/reducers/question.reducer';
import { QuestionEffects } from './features/questions/store/effects/question.effects';

import { answerReducer } from './features/answers/store/reducers/answer.reducer';
import { AnswerEffects } from './features/answers/store/effects/answer.effects';

import { paperReducer } from './features/study-material/papers/store/reducers/paper.reducer';
import { PaperEffects } from './features/study-material/papers/store/effects/paper.effects';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    providers: [
      provideState('universities', universityReducer),
      provideEffects(UniversityEffects),
      provideState('colleges', collegeReducer),
      provideEffects(CollegeEffects),
      provideState('branches', branchReducer),
      provideEffects(BranchEffects),
      provideState('subjects', subjectReducer),
      provideEffects(SubjectEffects),
      provideState('units', unitReducer),
      provideEffects(UnitEffects),
      provideState('questions', questionReducer),
      provideEffects(QuestionEffects),
      provideState('answers', answerReducer),
      provideEffects(AnswerEffects),
      provideState('papers', paperReducer),
      provideEffects(PaperEffects),
      provideHttpClient(),
    ],
    children: [
      {
        path: 'study-material/universities',
        loadComponent: () =>
          import('./features/universities/pages/universities.component').then(
            m => m.UniversitiesPageComponent,
          ),
      },
      {
        path: 'study-material/colleges',
        loadComponent: () =>
          import('./features/colleges/pages/colleges.component').then(
            m => m.CollegesPageComponent,
          ),
      },
      {
        path: 'study-material/branches',
        loadComponent: () =>
          import('./features/branches/pages/branches.component').then(
            m => m.BranchesPageComponent,
          ),
      },
      {
        path: 'study-material/subjects',
        loadComponent: () =>
          import('./features/subjects/pages/subjects.component').then(
            m => m.SubjectsPageComponent,
          ),
      },
      {
        path: 'study-material/units',
        loadComponent: () =>
          import('./features/units/pages/units.component').then(
            m => m.UnitsPageComponent,
          ),
      },
      {
        path: 'study-material/questions',
        loadComponent: () =>
          import('./features/questions/pages/questions.component').then(
            m => m.QuestionsPageComponent,
          ),
      },
      {
        path: 'study-material/answers',
        loadComponent: () =>
          import('./features/answers/pages/answers.component').then(
            m => m.AnswersPageComponent,
          ),
      },
      {
        path: 'study-material/papers',
        loadComponent: () =>
          import('./features/study-material/papers/pages/papers.component').then(
            m => m.PapersPageComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'study-material/universities',
        pathMatch: 'full',
      },
    ],
  },
];
