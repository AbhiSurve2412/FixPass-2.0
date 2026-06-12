// ─────────────────────────────────────────────────────────────────
// FixPass Home — Canonical Interfaces
//
// All home-page data shapes are defined here.
// Components import from this file, NOT from home.models.ts.
// ─────────────────────────────────────────────────────────────────

// ── Hero ──────────────────────────────────────────────────────────

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroContent {
  badgeText: string;
  headline: string;
  headlineAccent: string;
  subText: string;
  ctaText: string;
  ctaRoute: string;
  ctaNote: string;
  stats: HeroStat[];
}

// ── Study Material Hierarchy ──────────────────────────────────────

export interface Unit {
  unit: number;
  totalQuestions: number;
  importantQuestions: number;
}

export interface Subject {
  id: string;
  name: string;
  units: Unit[];
}

export interface AcademicYear {
  id: string;
  label: string;
  subjects: Subject[];
}

export interface Branch {
  id: string;
  name: string;
  shortName: string;
  years: AcademicYear[];
}

// ── Study Features ────────────────────────────────────────────────

export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  items: string[];
}

// ── Testimonials ──────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  university: string;
  rating: number;
  quote: string;
  initials: string;
}

// ── How It Works ──────────────────────────────────────────────────

export interface WorkStep {
  id: string;
  number: number;
  icon: string;
  title: string;
  description: string;
}

// ── Why FixPass ───────────────────────────────────────────────────

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// ── Pricing ───────────────────────────────────────────────────────

export interface PricingBadge {
  label: string;
  variant: 'recommended' | 'coming-soon';
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  badge?: PricingBadge;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaRoute?: string;
  status: 'free' | 'active' | 'coming-soon';
  featured?: boolean;
}

// ── Aggregate ─────────────────────────────────────────────────────

export interface HomePageData {
  hero: HeroContent;
  branches: Branch[];
  studyFeatures: FeatureCard[];
  testimonials: Testimonial[];
  workSteps: WorkStep[];
  benefits: Benefit[];
  pricingPlans: PricingPlan[];
}
