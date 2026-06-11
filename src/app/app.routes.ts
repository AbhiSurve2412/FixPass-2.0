import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

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
  { path: 'study-material/previous-year-papers',       component: HomeComponent }, // TBD
  { path: 'study-material/unit-wise-solved-questions', component: HomeComponent }, // TBD
  { path: 'study-material/smart-analysis',             component: HomeComponent }, // TBD

  // ── Live Routes (pages TBD) ───────────────────────────────────
  { path: 'pricing', component: HomeComponent }, // TBD
  { path: 'login',   component: HomeComponent }, // TBD
  { path: 'signup',  component: HomeComponent }, // TBD

  // ── Admin (Phase 1 — Active) ──────────────────────────────────
  { path: 'admin',           redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: HomeComponent }, // TBD

  // ── Admin: Study Material sub-routes ─────────────────────────
  {
    path: 'admin/study-material',
    redirectTo: 'admin/study-material/universities',
    pathMatch: 'full',
  },
  { path: 'admin/study-material/universities',         component: HomeComponent }, // TBD
  { path: 'admin/study-material/colleges',             component: HomeComponent }, // TBD
  { path: 'admin/study-material/branches',             component: HomeComponent }, // TBD
  { path: 'admin/study-material/subjects',             component: HomeComponent }, // TBD
  { path: 'admin/study-material/units',                component: HomeComponent }, // TBD
  { path: 'admin/study-material/questions',            component: HomeComponent }, // TBD
  { path: 'admin/study-material/answers',              component: HomeComponent }, // TBD
  { path: 'admin/study-material/previous-year-papers', component: HomeComponent }, // TBD
  { path: 'admin/study-material/resources',            component: HomeComponent }, // TBD

  // ── Admin: Coming Soon sections — redirect to dashboard ───────
  { path: 'admin/placement-material', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/discussion-hub',     redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/jobs',               redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/tools',              redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/analytics',          redirectTo: 'admin/dashboard', pathMatch: 'full' },

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
