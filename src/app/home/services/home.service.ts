import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  HomePageData,
  Branch,
  FeatureCard,
  Testimonial,
  WorkStep,
  Benefit,
  PricingPlan,
} from '../interfaces/home.interfaces';

// ─────────────────────────────────────────────────────────────────
// MOCK DATA
//
// This file owns ALL home-page content.
// To switch to a real API, replace `of(MOCK_HOME_DATA)` in
// getHomePageData() with `this.http.get<HomePageData>(url)`.
// No other file needs to change.
// ─────────────────────────────────────────────────────────────────

// ── Branch / Year / Subject / Unit hierarchy ──────────────────────

const CE_TY_BRANCHES: Branch[] = [
  {
    id: 'ce',
    name: 'Computer Engineering',
    shortName: 'CE',
    years: [
      {
        id: 'fy',
        label: '1st Year',
        subjects: [
          { id: 'em1',   name: 'Engineering Mathematics I', units: [] },
          { id: 'ep',    name: 'Engineering Physics',       units: [] },
          { id: 'beng',  name: 'Basic Electronics',         units: [] },
          { id: 'pchem', name: 'Engineering Chemistry',     units: [] },
        ],
      },
      {
        id: 'sy',
        label: '2nd Year',
        subjects: [
          { id: 'dsa',    name: 'Data Structures & Algorithms',    units: [] },
          { id: 'dbms',   name: 'Database Management Systems',     units: [] },
          { id: 'os',     name: 'Operating Systems',               units: [] },
          { id: 'cn',     name: 'Computer Networks',               units: [] },
          { id: 'maths3', name: 'Engineering Mathematics III',     units: [] },
        ],
      },
      {
        id: 'ty',
        label: '3rd Year',
        subjects: [
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
              { unit: 1, totalQuestions: 30, importantQuestions: 10 },
              { unit: 2, totalQuestions: 28, importantQuestions: 9  },
              { unit: 3, totalQuestions: 26, importantQuestions: 8  },
              { unit: 4, totalQuestions: 32, importantQuestions: 11 },
              { unit: 5, totalQuestions: 24, importantQuestions: 8  },
              { unit: 6, totalQuestions: 29, importantQuestions: 10 },
            ],
          },
          {
            id: 'cc',
            name: 'Cloud Computing',
            units: [
              { unit: 1, totalQuestions: 22, importantQuestions: 7 },
              { unit: 2, totalQuestions: 25, importantQuestions: 8 },
              { unit: 3, totalQuestions: 28, importantQuestions: 9 },
              { unit: 4, totalQuestions: 20, importantQuestions: 7 },
              { unit: 5, totalQuestions: 24, importantQuestions: 8 },
              { unit: 6, totalQuestions: 22, importantQuestions: 7 },
            ],
          },
          {
            id: 'dsbd',
            name: 'Data Science & BDA',
            units: [
              { unit: 1, totalQuestions: 20, importantQuestions: 7 },
              { unit: 2, totalQuestions: 24, importantQuestions: 8 },
              { unit: 3, totalQuestions: 22, importantQuestions: 7 },
              { unit: 4, totalQuestions: 26, importantQuestions: 9 },
              { unit: 5, totalQuestions: 21, importantQuestions: 7 },
              { unit: 6, totalQuestions: 23, importantQuestions: 8 },
            ],
          },
          {
            id: 'is',
            name: 'Information Security',
            units: [
              { unit: 1, totalQuestions: 25, importantQuestions: 8 },
              { unit: 2, totalQuestions: 20, importantQuestions: 7 },
              { unit: 3, totalQuestions: 24, importantQuestions: 8 },
              { unit: 4, totalQuestions: 22, importantQuestions: 7 },
              { unit: 5, totalQuestions: 19, importantQuestions: 6 },
              { unit: 6, totalQuestions: 21, importantQuestions: 7 },
            ],
          },
          {
            id: 'avr',
            name: 'Augmented & Virtual Reality',
            units: [
              { unit: 1, totalQuestions: 18, importantQuestions: 6 },
              { unit: 2, totalQuestions: 22, importantQuestions: 7 },
              { unit: 3, totalQuestions: 20, importantQuestions: 7 },
              { unit: 4, totalQuestions: 24, importantQuestions: 8 },
              { unit: 5, totalQuestions: 19, importantQuestions: 6 },
              { unit: 6, totalQuestions: 17, importantQuestions: 6 },
            ],
          },
        ],
      },
      {
        id: 'ly',
        label: 'Final Year',
        subjects: [
          { id: 'ml', name: 'Machine Learning',    units: [] },
          { id: 'se', name: 'Software Engineering', units: [] },
          { id: 'cg', name: 'Computer Graphics',    units: [] },
        ],
      },
    ],
  },
  {
    id: 'it',
    name: 'Information Technology',
    shortName: 'IT',
    years: [
      {
        id: 'fy-it', label: '1st Year', subjects: [
          { id: 'em1-it',  name: 'Engineering Mathematics I', units: [] },
          { id: 'ep-it',   name: 'Engineering Physics',       units: [] },
          { id: 'beng-it', name: 'Basic Electronics',         units: [] },
        ],
      },
      {
        id: 'sy-it', label: '2nd Year', subjects: [
          { id: 'dsa-it',  name: 'Data Structures & Algorithms',  units: [] },
          { id: 'dbms-it', name: 'Database Management Systems',   units: [] },
          { id: 'os-it',   name: 'Operating Systems',             units: [] },
        ],
      },
      {
        id: 'ty-it', label: '3rd Year', subjects: [
          { id: 'wad-it',  name: 'Web Application Development', units: [] },
          { id: 'mldl-it', name: 'ML & Deep Learning',          units: [] },
          { id: 'is-it',   name: 'Information Security',        units: [] },
        ],
      },
      {
        id: 'ly-it', label: 'Final Year', subjects: [
          { id: 'bigdata-it',   name: 'Big Data Analytics', units: [] },
          { id: 'cloudcomp-it', name: 'Cloud Computing',    units: [] },
        ],
      },
    ],
  },
  {
    id: 'entc',
    name: 'Electronics & TC',
    shortName: 'ENTC',
    years: [
      {
        id: 'fy-entc', label: '1st Year', subjects: [
          { id: 'ep-entc',   name: 'Engineering Physics', units: [] },
          { id: 'beng-entc', name: 'Basic Electronics',   units: [] },
        ],
      },
      {
        id: 'sy-entc', label: '2nd Year', subjects: [
          { id: 'eldev-entc', name: 'Electronic Devices',  units: [] },
          { id: 'delec-entc', name: 'Digital Electronics', units: [] },
        ],
      },
      {
        id: 'ty-entc', label: '3rd Year', subjects: [
          { id: 'mpc-entc', name: 'Microprocessors & Microcontrollers', units: [] },
          { id: 'sns-entc', name: 'Signals & Systems',                  units: [] },
        ],
      },
      {
        id: 'ly-entc', label: 'Final Year', subjects: [
          { id: 'vlsi-entc',  name: 'VLSI Design',       units: [] },
          { id: 'embed-entc', name: 'Embedded Systems',  units: [] },
        ],
      },
    ],
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    shortName: 'Mech',
    years: [
      {
        id: 'fy-mech', label: '1st Year', subjects: [
          { id: 'em1-mech', name: 'Engineering Mathematics I', units: [] },
          { id: 'ep-mech',  name: 'Engineering Physics',       units: [] },
        ],
      },
      {
        id: 'sy-mech', label: '2nd Year', subjects: [
          { id: 'thermo-mech', name: 'Thermodynamics',   units: [] },
          { id: 'fluid-mech',  name: 'Fluid Mechanics',  units: [] },
        ],
      },
      {
        id: 'ty-mech', label: '3rd Year', subjects: [
          { id: 'design-mech', name: 'Machine Design', units: [] },
          { id: 'heat-mech',   name: 'Heat Transfer',  units: [] },
        ],
      },
      {
        id: 'ly-mech', label: 'Final Year', subjects: [
          { id: 'cadcam-mech', name: 'CAD/CAM',       units: [] },
          { id: 'mechat-mech', name: 'Mechatronics',  units: [] },
        ],
      },
    ],
  },
];

// ── Study Features ────────────────────────────────────────────────

const MOCK_STUDY_FEATURES: FeatureCard[] = [
  {
    id: 'pyp',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    title: 'Previous Year Papers',
    description: 'Access previous examination papers organized by university, branch, year, and subject in one place.',
    items: ['Download PDFs', 'Subject-wise Organization', 'Year-wise Organization'],
  },
  {
    id: 'uwsq',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    title: 'Unit-wise Solved Questions',
    description: 'Important questions for every unit with both detailed and simple answers, notes, and video explanations.',
    items: ['Important Questions', 'Detailed Answers', 'Simple Answers', 'Revision Notes', 'Video Solutions'],
  },
  {
    id: 'smart-analysis',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Smart Analysis',
    description: 'Identify important topics and focus your preparation using historical question patterns and exam insights.',
    items: ['Unit Weightage', 'Frequently Asked Topics', 'Difficulty Analysis', 'Topic Trends'],
  },
];

// ── Testimonials ──────────────────────────────────────────────────

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'ap',
    name: 'Abhishek Patil',
    role: 'Third Year · Computer Engineering',
    university: 'Savitribai Phule Pune University',
    rating: 5,
    quote: 'The unit-wise solved questions helped me focus on important topics before exams. Smart analysis cut my preparation time in half.',
    initials: 'AP',
  },
  {
    id: 'sk',
    name: 'Sneha Kulkarni',
    role: 'Second Year · Computer Engineering',
    university: 'Mumbai University',
    rating: 5,
    quote: 'Finding previous year papers subject-wise became very easy. Everything was organized in one place. I scored much better this semester.',
    initials: 'SK',
  },
  {
    id: 'rj',
    name: 'Rohit Jadhav',
    role: 'Third Year · Computer Engineering',
    university: 'Dr. Babasaheb Ambedkar Technological University',
    rating: 5,
    quote: 'Papers, revision notes, and important questions all in one place made exam prep much faster and more focused. Highly recommend.',
    initials: 'RJ',
  },
];

// ── Work Steps ────────────────────────────────────────────────────

const MOCK_WORK_STEPS: WorkStep[] = [
  {
    id: 'step-1',
    number: 1,
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    title: 'Set Your Academic Profile',
    description: 'Provide your university, branch, year, and semester. Takes under a minute — no account needed to browse.',
  },
  {
    id: 'step-2',
    number: 2,
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    title: 'Get Personalized Study Material',
    description: 'FixPass automatically surfaces every subject, paper, and solved question matched to your academic profile.',
  },
  {
    id: 'step-3',
    number: 3,
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Prepare & Score Better',
    description: 'Study unit-wise, track important questions, review smart insights, and walk into your exam confident.',
  },
];

// ── Benefits ──────────────────────────────────────────────────────

const MOCK_BENEFITS: Benefit[] = [
  {
    id: 'b1',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
    title: 'Previous Year Papers in One Place',
    description: 'All university exam papers organized and instantly accessible by subject, year, and branch.',
  },
  {
    id: 'b2',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    title: 'Organized Subject-wise Content',
    description: 'Browse study material by university, branch, year, and subject without any clutter.',
  },
  {
    id: 'b3',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    title: 'Unit-wise Exam Preparation',
    description: 'Focus on specific units with curated question banks and important topic highlights.',
  },
  {
    id: 'b4',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    title: 'Revision Notes for Quick Learning',
    description: 'Summarized, concise notes to reinforce key concepts quickly before exams.',
  },
  {
    id: 'b5',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Smart Topic Analysis',
    description: 'Data-driven insights into high-weightage topics and frequently asked exam questions.',
  },
  {
    id: 'b6',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    title: 'Personalized Academic Experience',
    description: 'Everything tailored to your university, branch, and semester automatically.',
  },
];

// ── Pricing Plans ─────────────────────────────────────────────────

const MOCK_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    description: 'Everything you need to start your exam preparation today.',
    features: [
      'Previous year question papers',
      'Unit-wise solved questions',
      'Revision notes',
      'All subjects — Computer Engineering 3rd Year',
      'No account required',
    ],
    ctaLabel: 'Start for Free',
    ctaRoute: '/study-material',
    status: 'free',
    featured: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹49',
    period: 'per month',
    description: 'Full platform access — all branches, all years, every feature.',
    badge: { label: 'Most Popular', variant: 'recommended' },
    features: [
      'Everything in Free',
      'All branches & all academic years',
      'Video solutions for every question',
      'Smart analysis & performance insights',
      'Early access to new content',
      'Priority support',
    ],
    ctaLabel: 'Get Premium',
    ctaRoute: '/pricing',
    status: 'active',
    featured: true,
  },
  {
    id: 'premium-plus',
    name: 'Premium Plus',
    price: 'TBD',
    description: 'Career tools and placement preparation on top of everything else.',
    badge: { label: 'Coming Soon', variant: 'coming-soon' },
    features: [
      'Everything in Premium',
      'DSA practice & aptitude',
      'Interview experiences database',
      'Resume builder & ATS checker',
      'Cover letter generator',
      'Placement preparation kit',
    ],
    ctaLabel: 'Join Waitlist',
    status: 'coming-soon',
    featured: false,
  },
];

// ── Full page data ─────────────────────────────────────────────────

const MOCK_HOME_DATA: HomePageData = {
  hero: {
    badgeText: 'Study Material live for Computer Engineering',
    headline: 'Study Smarter.',
    headlineAccent: 'Score Better.',
    subText:
      'FixPass gives engineering students unit-wise solved questions, previous year papers, and smart analysis — organized by branch, year, and subject.',
    ctaText: 'Start Studying Free',
    ctaRoute: '/study-material',
    ctaNote: 'No account needed · Always free',
    stats: [
      { value: '500+', label: 'Questions' },
      { value: '6',    label: 'Subjects'  },
      { value: 'Free', label: 'Forever'   },
    ],
  },
  branches: CE_TY_BRANCHES,
  studyFeatures: MOCK_STUDY_FEATURES,
  testimonials: MOCK_TESTIMONIALS,
  workSteps: MOCK_WORK_STEPS,
  benefits: MOCK_BENEFITS,
  pricingPlans: MOCK_PRICING_PLANS,
};

// ─────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class HomeService {
  getHomePageData(): Observable<HomePageData> {
    // Replace with: return this.http.get<HomePageData>('/api/home');
    return of(MOCK_HOME_DATA);
  }
}
