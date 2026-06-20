import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { HomeComponent } from './home/home.component';
import { paperReducer } from './admin/features/study-material/papers/store/reducers/paper.reducer';
import { PaperEffects } from './admin/features/study-material/papers/store/effects/paper.effects';
import { branchReducer } from './admin/features/branches/store/reducers/branch.reducer';
import { BranchEffects } from './admin/features/branches/store/effects/branch.effects';
import { unitQuestionsReducer } from './admin/features/study-material/unit-questions/store/reducers/unit-questions.reducer';
import { UnitQuestionsEffects } from './admin/features/study-material/unit-questions/store/effects/unit-questions.effects';

// ─────────────────────────────────────────────────────────────────
// FixPass Route Configuration
//
// Pages marked "// TBD" use HomeComponent as a temporary scaffold.
// Replace with the real component once the page is built.
// ─────────────────────────────────────────────────────────────────

export const routes: Routes = [

  // ── Home ─────────────────────────────────────────────────────
  { path: '', component: HomeComponent, pathMatch: 'full' },

  // ── Study Material (Phase 1 — Live) ──────────────────────────
  {
    path: 'study-material',
    redirectTo: 'study-material/previous-year-papers',
    pathMatch: 'full',
  },
  {
    path: 'study-material/previous-year-papers',
    loadComponent: () =>
      import('./admin/features/study-material/papers/pages/papers.component').then(
        m => m.PapersPageComponent,
      ),
    providers: [
      provideState('papers', paperReducer),
      provideEffects(PaperEffects),
      provideState('branches', branchReducer),
      provideEffects(BranchEffects),
    ],
  },
  {
    path: 'study-material/unit-wise-solved-questions',
    loadComponent: () =>
      import('./admin/features/study-material/unit-questions/pages/unit-questions.component').then(
        m => m.UnitQuestionsPageComponent,
      ),
    providers: [
      provideState('unitQuestions', unitQuestionsReducer),
      provideEffects(UnitQuestionsEffects),
    ],
  },
  { path: 'study-material/smart-analysis',             component: HomeComponent }, // TBD

  // ── Live Routes (pages TBD) ───────────────────────────────────
  { path: 'pricing', component: HomeComponent }, // TBD
  { path: 'login',   component: HomeComponent }, // TBD
  { path: 'signup',  component: HomeComponent }, // TBD

  // ── Admin (Phase 1 — Active) ──────────────────────────────────
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.adminRoutes),
  },

  // ── Coming Soon — route stubs (not navigable from UI) ─────────
  // Nav items with status:'coming-soon' are disabled in the navbar.
  // These stubs prevent 404s if the URL is typed directly.
  { path: 'placement-material', redirectTo: '', pathMatch: 'full' },
  { path: 'jobs',               redirectTo: '', pathMatch: 'full' },
  { path: 'discussion-hub',     redirectTo: '', pathMatch: 'full' },
  { path: 'tools',              redirectTo: '', pathMatch: 'full' },

  // ── Wildcard ──────────────────────────────────────────────────
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
