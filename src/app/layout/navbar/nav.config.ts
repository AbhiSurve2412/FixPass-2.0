// ─────────────────────────────────────────────────────────────────
// FixPass Navigation Configuration
// ─────────────────────────────────────────────────────────────────
// Single source of truth for the navbar.
// To add/remove items or children, edit this file only.
// ─────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────

/** Top-level status of a nav item */
export type NavStatus = 'live' | 'coming-soon' | 'active';

/** Phase status of an admin section child */
export type ChildStatus = 'active' | 'coming-soon';

// ── Interfaces ────────────────────────────────────────────────────

/** Nested sub-route within an admin section (e.g. /admin/study-material/universities) */
export interface NavSubItem {
  label: string;
  route: string;
}

/** A child entry inside a dropdown / mega menu */
export interface NavChild {
  label: string;
  description: string;
  route: string;
  icon: string;          // SVG <path d="..."> — 24×24 Heroicons stroke style

  // Admin-only fields ─────────────────────────────────
  childStatus?: ChildStatus;   // phase indicator shown inside the admin dropdown
  subItems?: NavSubItem[];     // nested management links (admin study-material section)
}

/** A top-level navbar item */
export interface NavItem {
  label: string;
  route?: string;         // present only on plain items (no dropdown)
  status?: NavStatus;     // drives badge display and mega-menu variant
  children?: NavChild[];  // triggers dropdown; absent on plain items
}

// ─────────────────────────────────────────────────────────────────
// NAV ITEMS
// ─────────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [

  // ── Study Material ─ Phase 1, Live ───────────────────────────
  {
    label: 'Study Material',
    status: 'live',
    children: [
      {
        label: 'Previous Year Papers',
        description: 'Access university examination papers organised by semester and subject.',
        route: '/study-material/previous-year-papers',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      },
      {
        label: 'Unit-wise Solved Questions',
        description: 'Important questions with detailed answers, notes, and video explanations.',
        route: '/study-material/unit-wise-solved-questions',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      },
      {
        label: 'Smart Analysis',
        description: 'Topic weightage, exam trends, and actionable subject-wise insights.',
        route: '/study-material/smart-analysis',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      },
    ],
  },

  // ── Placement Material ─ Coming Soon ─────────────────────────
  {
    label: 'Placement Material',
    status: 'coming-soon',
    children: [
      { label: 'DSA Practice', description: '', route: '', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { label: 'Company Interview Experiences', description: '', route: '', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { label: 'Campus Placement Insights', description: '', route: '', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
      { label: 'Core Subjects Preparation', description: '', route: '', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
      { label: 'Aptitude & Reasoning', description: '', route: '', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
    ],
  },

  // ── Jobs ─ Coming Soon ────────────────────────────────────────
  {
    label: 'Jobs',
    status: 'coming-soon',
    children: [
      { label: 'Job Openings', description: '', route: '', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { label: 'Submit Opportunity', description: '', route: '', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    ],
  },

  // ── Discussion Hub ─ Coming Soon ──────────────────────────────
  {
    label: 'Discussion Hub',
    status: 'coming-soon',
    children: [
      { label: 'Ask Question', description: '', route: '', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { label: 'Browse Discussions', description: '', route: '', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
      { label: 'Popular Discussions', description: '', route: '', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
      { label: 'Unanswered Questions', description: '', route: '', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    ],
  },

  // ── Tools ─ Coming Soon ───────────────────────────────────────
  {
    label: 'Tools',
    status: 'coming-soon',
    children: [
      { label: 'Resume Builder', description: '', route: '', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { label: 'Resume Analyzer', description: '', route: '', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
      { label: 'ATS Score Checker', description: '', route: '', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
      { label: 'Cover Letter Generator', description: '', route: '', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    ],
  },

  // ── Admin ─ Active ────────────────────────────────────────────
  {
    label: 'Admin',
    route: '/admin',
    status: 'active',
    children: [
      // ── Dashboard ─ plain active link (no childStatus) ────────
      {
        label: 'Dashboard',
        description: 'Platform overview, metrics, and quick actions.',
        route: '/admin/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      },

      // ── Manage Study Material ─ Active, with sub-items ────────
      {
        label: 'Manage Study Material',
        description: 'Manage all study content across universities.',
        route: '/admin/study-material',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        childStatus: 'active',
        subItems: [
          { label: 'Universities',         route: '/admin/study-material/universities' },
          { label: 'Colleges',             route: '/admin/study-material/colleges' },
          { label: 'Branches',             route: '/admin/study-material/branches' },
          { label: 'Subjects',             route: '/admin/study-material/subjects' },
          { label: 'Units',                route: '/admin/study-material/units' },
          { label: 'Questions',            route: '/admin/study-material/questions' },
          { label: 'Answers',              route: '/admin/study-material/answers' },
          { label: 'Previous Year Papers', route: '/admin/study-material/previous-year-papers' },
          { label: 'Study Resources',      route: '/admin/study-material/resources' },
        ],
      },

      // ── Coming Soon sections ──────────────────────────────────
      {
        label: 'Manage Placement Material',
        description: '',
        route: '/admin/placement-material',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        childStatus: 'coming-soon',
      },
      {
        label: 'Manage Discussion Hub',
        description: '',
        route: '/admin/discussion-hub',
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
        childStatus: 'coming-soon',
      },
      {
        label: 'Manage Jobs',
        description: '',
        route: '/admin/jobs',
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
        childStatus: 'coming-soon',
      },
      {
        label: 'Manage Tools',
        description: '',
        route: '/admin/tools',
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
        childStatus: 'coming-soon',
      },
      {
        label: 'Analytics',
        description: '',
        route: '/admin/analytics',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        childStatus: 'coming-soon',
      },
    ],
  },

  // ── Pricing ─ Live, plain link ────────────────────────────────
  {
    label: 'Pricing',
    route: '/pricing',
  },
];
