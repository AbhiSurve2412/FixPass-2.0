// ──────────────────────────────────────────────────────────────
// FixPass Home Page — Data Models
// ──────────────────────────────────────────────────────────────

export interface UnitStats {
  unit: number;
  totalQuestions: number;
  importantQuestions: number;
}

export interface Subject {
  id: string;
  name: string;
  units: UnitStats[];
}

export interface Feature {
  icon: string;      // SVG <path d="…"> — 24×24 Heroicons stroke
  title: string;
  description: string;
  items: string[];
}

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface Benefit {
  icon: string;      // SVG <path d="…"> — 24×24 Heroicons stroke
  title: string;
  description: string;
}

export interface RoadmapPhase {
  phase: number;
  status: 'live' | 'coming-soon';
  title: string;
  features: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  university: string;
  rating: number;
  quote: string;
  initials: string;
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

export interface PricingFeature {
  text: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  badge?: { label: string; variant: 'recommended' | 'coming-soon' };
  description: string;
  features: string[];
  ctaLabel: string;
  ctaRoute?: string;
  status: 'free' | 'active' | 'coming-soon';
  featured?: boolean;
}
