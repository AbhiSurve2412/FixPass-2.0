import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Subject, SubjectForm } from '../interfaces/subject.interfaces';
import { AcademicYear } from '../../../shared/interfaces/admin-shared.interfaces';

// ─────────────────────────────────────────────────────────────────────────────
// SPPU First Year Engineering — 2019 Pattern
// Source: SPPU official curriculum, collegecirculars.unipune.ac.in
// Subject codes verified against published textbooks and question papers.
// ─────────────────────────────────────────────────────────────────────────────
const FE = 'FE' as AcademicYear;

const MOCK_SUBJECTS: Subject[] = [

  // ── Semester 1 ──────────────────────────────────────────────────────────────
  {
    id: 'fe-math1',
    name: 'Engineering Mathematics – I',
    code: '107001',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'Covers differential calculus (Rolle\'s theorem, Taylor series, L\'Hôpital\'s rule), Fourier series, partial differentiation, its applications, and matrix algebra with eigenvalue analysis. Forms the mathematical foundation for all engineering branches.',
  },
  {
    id: 'fe-phy',
    name: 'Engineering Physics',
    code: '107002',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'Applied physics for engineers spanning wave optics (interference, diffraction, polarization), lasers and optical fibres, quantum mechanics, semiconductor physics, magnetism, superconductivity, and an introduction to nanotechnology and non-destructive testing.',
  },
  {
    id: 'fe-sme',
    name: 'Systems in Mechanical Engineering',
    code: '107003',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'Introduces mechanical systems through energy sources and conversion, thermal engineering, vehicle systems, manufacturing processes, and common engineering mechanisms. Bridges theoretical science with real-world mechanical applications.',
  },
  {
    id: 'fe-bee',
    name: 'Basic Electrical Engineering',
    code: '103004',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'Foundational electrical engineering covering DC circuits (KVL, KCL, network theorems), electromagnetism, AC fundamentals, single and three-phase AC circuits, and an introduction to electric machines including transformers and motors.',
  },
  {
    id: 'fe-pps',
    name: 'Programming and Problem Solving',
    code: '107005',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'Develops computational thinking and structured programming skills using Python. Topics include algorithms, flowcharts, data types, control structures, functions, data structures (lists, tuples, dictionaries), object-oriented programming, and file handling.',
  },

  // ── Semester 2 ──────────────────────────────────────────────────────────────
  {
    id: 'fe-math2',
    name: 'Engineering Mathematics – II',
    code: '107008',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'Advances the mathematical toolkit with first-order ordinary differential equations, integral calculus (Beta/Gamma functions, reduction formulae), curve tracing, solid geometry in multiple coordinate systems, and introductory numerical methods and statistics.',
  },
  {
    id: 'fe-chem',
    name: 'Engineering Chemistry',
    code: '107009',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'Applied chemistry covering water technology (hardness, treatment, purification), instrumental analysis methods, advanced engineering materials (polymers and nanomaterials), energy sources and fuels, and corrosion mechanisms and prevention strategies.',
  },
  {
    id: 'fe-bele',
    name: 'Basic Electronics Engineering',
    code: '107006',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'Fundamentals of electronics covering PN junction diodes, rectifiers, Zener regulators, BJT and FET characteristics and biasing, operational amplifier circuits, and introductory digital electronics including Boolean algebra, logic gates, and combinational circuits.',
  },
  {
    id: 'fe-eg',
    name: 'Engineering Graphics',
    code: '102012',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'Principles and practice of engineering drawing per BIS standards. Covers drawing fundamentals, CAD tools, engineering curves (conics, helix, cycloid), orthographic projection of solids, isometric and oblique projections, and development of lateral surfaces.',
  },
  {
    id: 'fe-em',
    name: 'Engineering Mechanics',
    code: '107011',
    year: FE,
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'Principles of statics and dynamics applied to engineering. Topics include force systems, centroids and moments of inertia, friction, equilibrium, analysis of trusses and frames, kinematics of particles (linear and curvilinear), and kinetics using Newton\'s laws and energy methods.',
  },
];

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private subjects: Subject[] = [...MOCK_SUBJECTS];

  getAll(): Observable<Subject[]> {
    return of([...this.subjects]).pipe(delay(100));
  }

  create(form: SubjectForm): Observable<Subject> {
    const subject: Subject = { id: crypto.randomUUID(), branchName: '', ...form };
    this.subjects = [...this.subjects, subject];
    return of(subject).pipe(delay(100));
  }

  update(subject: Subject): Observable<Subject> {
    this.subjects = this.subjects.map((s) =>
      s.id === subject.id ? subject : s,
    );
    return of(subject).pipe(delay(100));
  }

  delete(id: string): Observable<void> {
    this.subjects = this.subjects.filter((s) => s.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
