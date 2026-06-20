import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Subject } from '../../../subjects/interfaces/subject.interfaces';
import { Unit } from '../../../units/interfaces/unit.interfaces';
import { Question } from '../../../questions/interfaces/question.interfaces';
import { Answer } from '../../../answers/interfaces/answer.interfaces';

// ─────────────────────────────────────────────────────────────────────────────
// Study-Material — Unit Wise Solved Questions
// Self-contained mock data for the /study-material/unit-wise-solved-questions
// screen. When a real backend is available, only replace the method bodies —
// no effects / reducers / selectors / component changes needed.
// ─────────────────────────────────────────────────────────────────────────────

const SUBJECTS: Subject[] = [
  {
    id: 'fe-math1',
    name: 'Engineering Mathematics – I',
    code: '107001',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'Covers differential calculus (Rolle\'s theorem, Taylor series, L\'Hôpital\'s rule), Fourier series, partial differentiation, its applications, and matrix algebra with eigenvalue analysis.',
  },
  {
    id: 'fe-phy',
    name: 'Engineering Physics',
    code: '107002',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'Applied physics spanning wave optics, lasers, quantum mechanics, semiconductor physics, magnetism, superconductivity, and nanotechnology.',
  },
  {
    id: 'fe-bee',
    name: 'Basic Electrical Engineering',
    code: '103004',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'DC circuits, electromagnetism, AC fundamentals, single and three-phase circuits, and introduction to electric machines.',
  },
  {
    id: 'fe-pps',
    name: 'Programming and Problem Solving',
    code: '107005',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'Computational thinking and structured programming using Python — algorithms, data types, control structures, functions, data structures, and OOP.',
  },
  {
    id: 'fe-sme',
    name: 'Systems in Mechanical Engineering',
    code: '107003',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 1,
    description:
      'Energy sources and conversion, thermal engineering, vehicle systems, manufacturing processes, and common engineering mechanisms.',
  },
  {
    id: 'fe-math2',
    name: 'Engineering Mathematics – II',
    code: '107008',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'First-order ODEs, integral calculus, curve tracing, solid geometry, Fourier series, numerical methods, and statistics.',
  },
  {
    id: 'fe-chem',
    name: 'Engineering Chemistry',
    code: '107009',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'Water technology, instrumental analysis, advanced engineering materials, energy sources and fuels, and corrosion prevention.',
  },
  {
    id: 'fe-bele',
    name: 'Basic Electronics Engineering',
    code: '107006',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'Semiconductor diodes, BJT and FET characteristics, operational amplifiers, and digital electronics fundamentals.',
  },
  {
    id: 'fe-eg',
    name: 'Engineering Graphics',
    code: '102012',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'Engineering drawing standards, CAD, engineering curves, orthographic projection, isometric projection, and development of lateral surfaces.',
  },
  {
    id: 'fe-em',
    name: 'Engineering Mechanics',
    code: '107011',
    year: 'FE',
    branchId: 'fe',
    branchName: 'First Year Engineering',
    semester: 2,
    description:
      'Statics and dynamics: force systems, centroids, friction, equilibrium, truss analysis, kinematics and kinetics of particles.',
  },
];

const UNITS: Unit[] = [
  // ── Engineering Mathematics – I  ─────────────────────────────────────────
  {
    id: 'fe-math1-u1',
    name: 'Differential Calculus',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Medium',
    description:
      "Rolle's theorem, Lagrange's and Cauchy's mean value theorems, Taylor's and Maclaurin's series, indeterminate forms, L'Hôpital's rule.",
  },
  {
    id: 'fe-math1-u2',
    name: 'Fourier Series',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Hard',
    description:
      "Periodic functions, Dirichlet's conditions, full-range and half-range Fourier series, harmonic analysis, Parseval's identity.",
  },
  {
    id: 'fe-math1-u3',
    name: 'Partial Differentiation',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Medium',
    description:
      "Functions of several variables, Euler's theorem on homogeneous functions, total derivative, change of variables, Jacobians.",
  },
  {
    id: 'fe-math1-u4',
    name: 'Applications of Partial Differentiation',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Hard',
    description:
      "Errors and approximations, maxima and minima of functions of two variables, Lagrange's method of undetermined multipliers.",
  },
  {
    id: 'fe-math1-u5',
    name: 'Matrices and Linear Algebra',
    subjectId: 'fe-math1',
    subjectName: 'Engineering Mathematics – I',
    difficulty: 'Medium',
    description:
      'Rank, echelon form, systems of linear equations, eigenvalues and eigenvectors, Cayley-Hamilton theorem, diagonalisation.',
  },
];

const QUESTIONS: Question[] = [
  // ── Unit 1 — Differential Calculus ────────────────────────────────────────
  {
    id: 'fmq-u1-1',
    text: "State and prove Rolle's Theorem. Give one geometrical interpretation.",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Medium', marks: 6, type: 'long-answer', isImportant: true,
    askedIn: [
      { year: 2023, season: 'Winter', paperCode: '107001-W23' },
      { year: 2022, season: 'Summer', paperCode: '107001-S22' },
    ],
    tags: ["Rolle's theorem", 'MVT', 'calculus'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Rolle's Theorem: if f is continuous on [a,b], differentiable on (a,b), and f(a)=f(b), then ∃ c∈(a,b) with f'(c)=0. Geometrically: the tangent is horizontal at c.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u1-2',
    text: "State Lagrange's Mean Value Theorem and verify it for f(x) = x² − 3x + 2 on [1, 3].",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Medium', marks: 6, type: 'long-answer', isImportant: true,
    askedIn: [
      { year: 2024, season: 'Winter', paperCode: '107001-W24' },
      { year: 2023, season: 'Summer', paperCode: '107001-S23' },
    ],
    tags: ['LMVT', 'MVT', 'verification'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "LMVT: ∃ c∈(a,b) with f'(c)=(f(b)−f(a))/(b−a). For f=x²−3x+2 on [1,3]: f(1)=0, f(3)=2, so f'(c)=1 ⟹ c=2∈(1,3). ✓",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u1-3',
    text: "Expand sin x using Maclaurin's series up to the term containing x⁵.",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Easy', marks: 4, type: 'short-note', isImportant: true,
    askedIn: [{ year: 2024, season: 'Summer', paperCode: '107001-S24' }],
    tags: ['Maclaurin series', 'Taylor series', 'sin x'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'sin x = x − x³/3! + x⁵/5! − … = x − x³/6 + x⁵/120 − …',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u1-4',
    text: "Evaluate lim(x→0) (eˣ − 1 − x) / x² using L'Hôpital's rule.",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Easy', marks: 4, type: 'numerical', isImportant: false,
    askedIn: [{ year: 2022, season: 'Winter', paperCode: '107001-W22' }],
    tags: ["L'Hôpital", 'limits', 'indeterminate forms'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Apply L'Hôpital twice: lim(eˣ−1−x)/x² = lim(eˣ−1)/2x = lim eˣ/2 = 1/2.",
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u1-5',
    text: "Define Taylor's series and expand f(x) = log(1+x) about x = 0 up to four terms.",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Medium', marks: 4, type: 'short-note', isImportant: false,
    askedIn: [],
    tags: ['Taylor series', 'logarithm', 'expansion'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'log(1+x) = x − x²/2 + x³/3 − x⁴/4 + …  for |x| ≤ 1 (x ≠ −1).',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },

  // ── Unit 2 — Fourier Series ───────────────────────────────────────────────
  {
    id: 'fmq-u2-1',
    text: 'Define Fourier series. State the Dirichlet conditions for the existence of a Fourier series.',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    difficulty: 'Easy', marks: 4, type: 'definition', isImportant: true,
    askedIn: [
      { year: 2023, season: 'Winter', paperCode: '107001-W23' },
      { year: 2022, season: 'Winter', paperCode: '107001-W22' },
    ],
    tags: ['Fourier series', 'Dirichlet conditions', 'periodic functions'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'f(x) = a₀/2 + Σ(aₙcos(nx) + bₙsin(nx)). Dirichlet: (1) periodic, (2) single-valued & finite, (3) finite discontinuities, (4) finite extrema in one period.',
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u2-2',
    text: 'Find the Fourier series of f(x) = x² in the interval (−π, π) and hence show that π²/6 = 1 + 1/4 + 1/9 + …',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    difficulty: 'Hard', marks: 8, type: 'long-answer', isImportant: true,
    askedIn: [
      { year: 2024, season: 'Winter', paperCode: '107001-W24' },
      { year: 2023, season: 'Summer', paperCode: '107001-S23' },
      { year: 2022, season: 'Summer', paperCode: '107001-S22' },
    ],
    tags: ['Fourier series', "Parseval's identity", 'series sum'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'a₀=2π²/3, aₙ=4(−1)ⁿ/n², bₙ=0. Put x=π: π²=π²/3 + 4Σ(1/n²) ⟹ π²/6 = Σ1/n².',
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u2-3',
    text: 'Obtain the half-range cosine series of f(x) = x in the interval (0, π).',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    difficulty: 'Hard', marks: 6, type: 'long-answer', isImportant: true,
    askedIn: [{ year: 2024, season: 'Summer', paperCode: '107001-S24' }],
    tags: ['half-range', 'cosine series', 'Fourier'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'f(x) = π/2 − 4/π[cos x + cos3x/9 + cos5x/25 + …]',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u2-4',
    text: "What is Parseval's identity? State its significance in Fourier analysis.",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    difficulty: 'Medium', marks: 4, type: 'short-note', isImportant: false,
    askedIn: [{ year: 2022, season: 'Summer', paperCode: '107001-S22' }],
    tags: ['Parseval identity', 'energy', 'Fourier'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "(1/π)∫[f(x)]²dx = a₀²/2 + Σ(aₙ²+bₙ²). Relates energy of a signal to its frequency components.",
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },

  // ── Unit 3 — Partial Differentiation ─────────────────────────────────────
  {
    id: 'fmq-u3-1',
    text: "State and prove Euler's theorem on homogeneous functions.",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    difficulty: 'Medium', marks: 6, type: 'long-answer', isImportant: true,
    askedIn: [
      { year: 2024, season: 'Winter', paperCode: '107001-W24' },
      { year: 2023, season: 'Winter', paperCode: '107001-W23' },
      { year: 2022, season: 'Winter', paperCode: '107001-W22' },
    ],
    tags: ["Euler's theorem", 'homogeneous functions', 'partial differentiation'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'If f(x,y) is homogeneous of degree n, then x·∂f/∂x + y·∂f/∂y = n·f. Proof: differentiate f(tx,ty)=tⁿf w.r.t. t, set t=1.',
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u3-2',
    text: 'Find the Jacobian ∂(u,v)/∂(x,y) if u = x² − y², v = 2xy.',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    difficulty: 'Easy', marks: 4, type: 'numerical', isImportant: false,
    askedIn: [{ year: 2023, season: 'Summer', paperCode: '107001-S23' }],
    tags: ['Jacobian', 'partial differentiation', 'transformation'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'J = |2x −2y; 2y 2x| = 4x²+4y² = 4(x²+y²).',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u3-3',
    text: 'If u = f(x−y, y−z, z−x), show that ∂u/∂x + ∂u/∂y + ∂u/∂z = 0.',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    difficulty: 'Hard', marks: 6, type: 'long-answer', isImportant: true,
    askedIn: [
      { year: 2024, season: 'Summer', paperCode: '107001-S24' },
      { year: 2022, season: 'Summer', paperCode: '107001-S22' },
    ],
    tags: ['partial differentiation', 'chain rule', 'composite functions'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'Let p=x−y, q=y−z, r=z−x. By chain rule the column sums of [∂p,∂q,∂r]ᵀ over each variable all equal zero, so the total sum vanishes.',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u3-4',
    text: 'Define total derivative. If u = x² + y² and x = eᵗ, y = e⁻ᵗ, find du/dt.',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    difficulty: 'Easy', marks: 4, type: 'numerical', isImportant: false,
    askedIn: [],
    tags: ['total derivative', 'chain rule'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'du/dt = 2x·eᵗ + 2y·(−e⁻ᵗ) = 2e²ᵗ − 2e⁻²ᵗ.',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },

  // ── Unit 4 — Applications of Partial Differentiation ─────────────────────
  {
    id: 'fmq-u4-1',
    text: 'Find the maxima and minima of f(x, y) = x³ + y³ − 3xy.',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u4', unitName: 'Applications of Partial Differentiation',
    difficulty: 'Hard', marks: 8, type: 'long-answer', isImportant: true,
    askedIn: [
      { year: 2024, season: 'Winter', paperCode: '107001-W24' },
      { year: 2023, season: 'Winter', paperCode: '107001-W23' },
      { year: 2022, season: 'Summer', paperCode: '107001-S22' },
    ],
    tags: ['maxima minima', 'stationary points', 'optimization'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'Critical: (0,0) saddle, (1,1) minimum f=−1. Second-derivative test at (1,1): rt−s²=27>0, r=6>0 ∴ minimum.',
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u4-2',
    text: "Using Lagrange's method of undetermined multipliers, find the maximum value of x·y·z subject to x + y + z = a.",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u4', unitName: 'Applications of Partial Differentiation',
    difficulty: 'Hard', marks: 6, type: 'long-answer', isImportant: true,
    askedIn: [
      { year: 2024, season: 'Summer', paperCode: '107001-S24' },
      { year: 2023, season: 'Summer', paperCode: '107001-S23' },
    ],
    tags: ['Lagrange multipliers', 'constrained optimization', 'AM-GM'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'yz=λ, xz=λ, xy=λ ⟹ x=y=z=a/3. Max xyz = (a/3)³ = a³/27.',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u4-3',
    text: 'If the radius of a sphere is measured as 9 cm with a possible error of 0.03 cm, find the approximate error in the calculated surface area.',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u4', unitName: 'Applications of Partial Differentiation',
    difficulty: 'Easy', marks: 4, type: 'numerical', isImportant: false,
    askedIn: [{ year: 2022, season: 'Winter', paperCode: '107001-W22' }],
    tags: ['errors approximations', 'differentials', 'application'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'S=4πr². dS=8πr·dr = 8π×9×0.03 = 2.16π ≈ 6.79 cm².',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },

  // ── Unit 5 — Matrices and Linear Algebra ─────────────────────────────────
  {
    id: 'fmq-u5-1',
    text: 'Find the eigenvalues and eigenvectors of the matrix A = [[4, 1], [2, 3]].',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    difficulty: 'Medium', marks: 6, type: 'long-answer', isImportant: true,
    askedIn: [
      { year: 2024, season: 'Winter', paperCode: '107001-W24' },
      { year: 2023, season: 'Winter', paperCode: '107001-W23' },
      { year: 2022, season: 'Winter', paperCode: '107001-W22' },
    ],
    tags: ['eigenvalues', 'eigenvectors', 'matrices'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'λ²−7λ+10=0 ⟹ λ=5,2. For λ=5: [1,1]ᵀ. For λ=2: [1,−2]ᵀ.',
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example7',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u5-2',
    text: 'State and verify the Cayley-Hamilton theorem for A = [[1, 2], [3, 4]].',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    difficulty: 'Medium', marks: 6, type: 'long-answer', isImportant: true,
    askedIn: [
      { year: 2024, season: 'Summer', paperCode: '107001-S24' },
      { year: 2023, season: 'Summer', paperCode: '107001-S23' },
    ],
    tags: ['Cayley-Hamilton', 'characteristic polynomial', 'matrices'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'Char. poly: λ²−5λ−2=0. A²−5A−2I = [[7,10],[15,22]]−[[5,10],[15,20]]−[[2,0],[0,2]] = O. ✓',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u5-3',
    text: 'Reduce the matrix [[2,1,3],[4,2,1],[2,1,3]] to echelon form and find its rank.',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    difficulty: 'Easy', marks: 4, type: 'numerical', isImportant: false,
    askedIn: [{ year: 2022, season: 'Summer', paperCode: '107001-S22' }],
    tags: ['rank', 'echelon form', 'row reduction'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'R2→R2−2R1, R3→R3−R1: rows [2,1,3],[0,0,−5],[0,0,0]. Two non-zero rows ⟹ rank = 2.',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u5-4',
    text: 'What is diagonalisation of a matrix? State the conditions required for a matrix to be diagonalisable.',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    difficulty: 'Easy', marks: 4, type: 'definition', isImportant: false,
    askedIn: [],
    tags: ['diagonalisation', 'linear algebra', 'eigenvalues'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: 'A is diagonalisable if ∃ invertible P with P⁻¹AP=D. Sufficient condition: n distinct eigenvalues.',
    detailedAnswer: '', revisionNotes: '', videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
];

const ANSWERS: Answer[] = [
  {
    id: 'ans-fmq-u1-1-d',
    questionId: 'fmq-u1-1',
    questionText: "State and prove Rolle's Theorem. Give one geometrical interpretation.",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: "Rolle's Theorem" },
        { type: 'subHeader', data: 'Statement' },
        { type: 'text', data: "If f(x) satisfies three conditions on [a,b], then ∃ c∈(a,b) with f'(c)=0." },
        { type: 'Olist', dataObject: { items: [
          { text: 'f(x) is continuous on [a, b].' },
          { text: 'f(x) is differentiable on (a, b).' },
          { text: 'f(a) = f(b).' },
        ]}},
        { type: 'subHeader', data: 'Proof (Outline)' },
        { type: 'text', data: 'By EVT, f attains max M and min m on [a,b].' },
        { type: 'Ulist', dataObject: { items: [
          { text: "Case 1: M=m. Then f is constant and f'(x)=0 everywhere in (a,b)." },
          { text: "Case 2: M>m. An extreme value is attained at interior c. By Fermat's theorem, f'(c)=0." },
        ]}},
        { type: 'subHeader', data: 'Geometrical Interpretation' },
        { type: 'text', data: "If the curve starts and ends at the same height, the tangent is horizontal at least once in (a,b)." },
        { type: 'subHeader', data: 'Standard Example' },
        { type: 'text', data: "Verify for f(x)=x²−4x+3 on [1,3]." },
        { type: 'Olist', dataObject: { items: [
          { text: 'f is a polynomial — continuous and differentiable everywhere.' },
          { text: 'f(1)=0 and f(3)=0. ✓' },
          { text: "f'(x)=2x−4=0 ⟹ x=2∈(1,3). Verified." },
        ]}},
        { type: 'subHeader', data: 'Key Points' },
        { type: 'table', dataObject: {
          headers: ['Condition', 'Consequence if violated'],
          rows: [
            { Condition: 'Continuity on [a,b]', 'Consequence if violated': 'Theorem may fail — function may jump' },
            { Condition: 'Differentiability on (a,b)', 'Consequence if violated': 'No tangent exists at corner/cusp' },
            { Condition: 'f(a) = f(b)', 'Consequence if violated': 'Tangent need not be horizontal' },
          ],
        }},
      ],
    },
  },
  {
    id: 'ans-fmq-u1-2-d',
    questionId: 'fmq-u1-2',
    questionText: "State Lagrange's Mean Value Theorem and verify it for f(x) = x² − 3x + 2 on [1, 3].",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: "Lagrange's Mean Value Theorem (LMVT)" },
        { type: 'subHeader', data: 'Statement' },
        { type: 'text', data: "If f is (1) continuous on [a,b] and (2) differentiable on (a,b), then ∃ c∈(a,b) such that:" },
        { type: 'sqlCode', data: "f'(c) = [f(b) - f(a)] / (b - a)" },
        { type: 'subHeader', data: 'Geometrical Meaning' },
        { type: 'text', data: 'The tangent at c is parallel to the chord joining (a,f(a)) and (b,f(b)).' },
        { type: 'subHeader', data: 'Verification for f(x) = x² − 3x + 2 on [1, 3]' },
        { type: 'Olist', dataObject: { items: [
          { text: 'f(x) is a polynomial — continuous and differentiable everywhere.' },
          { text: 'f(1)=0, f(3)=2. RHS = (2−0)/(3−1) = 1.' },
          { text: "f'(x)=2x−3. Set f'(c)=1 ⟹ c=2." },
          { text: 'c=2∈(1,3). ✓' },
        ]}},
        { type: 'subHeader', data: "Relation to Rolle's Theorem" },
        { type: 'text', data: "Rolle's Theorem is LMVT with f(a)=f(b), giving f'(c)=0." },
      ],
    },
  },
  {
    id: 'ans-fmq-u2-1-d',
    questionId: 'fmq-u2-1',
    questionText: 'Define Fourier series. State the Dirichlet conditions.',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: 'Fourier Series' },
        { type: 'subHeader', data: 'Definition' },
        { type: 'text', data: 'A Fourier series represents a periodic f(x) (period 2π) as:' },
        { type: 'sqlCode', data: 'f(x) = a₀/2 + Σₙ₌₁^∞ [aₙ cos(nx) + bₙ sin(nx)]' },
        { type: 'table', dataObject: {
          headers: ['Coefficient', 'Formula'],
          rows: [
            { Coefficient: 'a₀', Formula: '(1/π) ∫₋π^π f(x) dx' },
            { Coefficient: 'aₙ', Formula: '(1/π) ∫₋π^π f(x) cos(nx) dx' },
            { Coefficient: 'bₙ', Formula: '(1/π) ∫₋π^π f(x) sin(nx) dx' },
          ],
        }},
        { type: 'subHeader', data: "Dirichlet's Conditions" },
        { type: 'Olist', dataObject: { items: [
          { text: 'f(x) is periodic with period 2π.' },
          { text: 'f(x) is single-valued and bounded in one period.' },
          { text: 'f(x) has finite number of discontinuities in one period.' },
          { text: 'f(x) has finite number of maxima and minima in one period.' },
        ]}},
        { type: 'subHeader', data: 'Convergence at Discontinuities' },
        { type: 'text', data: 'At x₀: series converges to [f(x₀⁺) + f(x₀⁻)] / 2.' },
      ],
    },
  },
  {
    id: 'ans-fmq-u3-1-d',
    questionId: 'fmq-u3-1',
    questionText: "State and prove Euler's theorem on homogeneous functions.",
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: "Euler's Theorem on Homogeneous Functions" },
        { type: 'subHeader', data: 'Definition' },
        { type: 'text', data: 'f(x,y) is homogeneous of degree n if f(tx,ty) = tⁿ·f(x,y) for t>0.' },
        { type: 'subHeader', data: 'Statement' },
        { type: 'sqlCode', data: 'x · (∂f/∂x) + y · (∂f/∂y) = n · f(x, y)' },
        { type: 'subHeader', data: 'Proof' },
        { type: 'Olist', dataObject: { items: [
          { text: 'f(tx,ty) = tⁿ·f(x,y)  ... (1)' },
          { text: 'Differentiate (1) w.r.t. t: x·fₓ(tx,ty) + y·f_y(tx,ty) = n·tⁿ⁻¹·f(x,y)' },
          { text: 'Set t=1: x·fₓ + y·f_y = n·f. □' },
        ]}},
        { type: 'subHeader', data: 'Corollary' },
        { type: 'sqlCode', data: 'x²fₓₓ + 2xy·fₓ_y + y²f_yy = n(n−1)f' },
        { type: 'subHeader', data: 'Worked Example' },
        { type: 'text', data: 'Verify for f=x³+3x²y+3xy²+y³ (degree 3).' },
        { type: 'Olist', dataObject: { items: [
          { text: 'fₓ=3x²+6xy+3y², f_y=3x²+6xy+3y².' },
          { text: 'x·fₓ+y·f_y = 3(x+y)³ = 3f. ✓' },
        ]}},
      ],
    },
  },
  {
    id: 'ans-fmq-u5-1-d',
    questionId: 'fmq-u5-1',
    questionText: 'Find the eigenvalues and eigenvectors of A = [[4,1],[2,3]].',
    subjectId: 'fe-math1', subjectName: 'Engineering Mathematics – I',
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: 'Eigenvalues and Eigenvectors' },
        { type: 'subHeader', data: 'Step 1 — Characteristic Equation' },
        { type: 'sqlCode', data: 'det(A − λI) = (4−λ)(3−λ) − 2 = λ² − 7λ + 10 = 0' },
        { type: 'text', data: '(λ−5)(λ−2)=0  ⟹  λ₁=5, λ₂=2.' },
        { type: 'subHeader', data: 'Step 2 — Eigenvector for λ₁ = 5' },
        { type: 'text', data: 'Solve (A−5I)x=0: x₁=x₂. Eigenvector X₁=[1,1]ᵀ.' },
        { type: 'subHeader', data: 'Step 3 — Eigenvector for λ₂ = 2' },
        { type: 'text', data: 'Solve (A−2I)x=0: x₂=−2x₁. Eigenvector X₂=[1,−2]ᵀ.' },
        { type: 'subHeader', data: 'Summary' },
        { type: 'table', dataObject: {
          headers: ['Eigenvalue', 'Eigenvector', 'Verification Ax=λx'],
          rows: [
            { Eigenvalue: 'λ₁=5', Eigenvector: '[1,1]ᵀ', 'Verification Ax=λx': '[5,5]=5·[1,1] ✓' },
            { Eigenvalue: 'λ₂=2', Eigenvector: '[1,−2]ᵀ', 'Verification Ax=λx': '[2,−4]=2·[1,−2] ✓' },
          ],
        }},
      ],
    },
  },
];

@Injectable({ providedIn: 'root' })
export class UnitQuestionsService {
  getSubjects(): Observable<Subject[]> {
    return of([...SUBJECTS]).pipe(delay(100));
  }

  getUnits(): Observable<Unit[]> {
    return of([...UNITS]).pipe(delay(100));
  }

  getQuestions(): Observable<Question[]> {
    return of([...QUESTIONS]).pipe(delay(100));
  }

  getAnswers(): Observable<Answer[]> {
    return of([...ANSWERS]).pipe(delay(100));
  }
}
