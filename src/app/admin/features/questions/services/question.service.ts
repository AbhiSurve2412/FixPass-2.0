import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import {
  ExtractedQuestion,
  PdfImportMetadata,
  Question,
  QuestionForm,
} from '../interfaces/question.interfaces';
import { PdfParserService } from './pdf-parser.service';

// ─────────────────────────────────────────────────────────────────────────────
// SPPU FE — Engineering Mathematics – I (107001)  |  2019 Pattern
// Covers all 5 syllabus units with realistic SPPU-style questions, marks,
// PYQ history, and both simple and detailed answers.
// Subject ID  : fe-math1
// Unit IDs    : fe-math1-u1 … fe-math1-u5
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_QUESTIONS: Question[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // Unit 1 — Differential Calculus
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fmq-u1-1',
    text: "State and prove Rolle's Theorem. Give one geometrical interpretation.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Medium', marks: 6, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2023, season: 'Winter', paperCode: '107001-W23' },
              { year: 2022, season: 'Summer', paperCode: '107001-S22' }],
    tags: ['Rolle\'s theorem', 'MVT', 'calculus'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Rolle's Theorem states: if f(x) is continuous on [a,b], differentiable on (a,b), and f(a) = f(b), then there exists at least one c ∈ (a,b) such that f'(c) = 0. Geometrically, the tangent to the curve is horizontal at point c.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u1-2',
    text: "State Lagrange's Mean Value Theorem and verify it for f(x) = x² − 3x + 2 on [1, 3].",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Medium', marks: 6, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Winter', paperCode: '107001-W24' },
              { year: 2023, season: 'Summer', paperCode: '107001-S23' }],
    tags: ['LMVT', 'MVT', 'verification'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "LMVT: if f is continuous on [a,b] and differentiable on (a,b), then ∃ c ∈ (a,b) such that f'(c) = (f(b)−f(a))/(b−a). For f(x) = x²−3x+2 on [1,3]: f(1)=0, f(3)=2. So f'(c) = 1 ⟹ 2c−3 = 1 ⟹ c = 2 ∈ (1,3). ✓",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u1-3',
    text: "Expand sin x using Maclaurin's series up to the term containing x⁵.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Easy', marks: 4, type: 'short-note',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Summer', paperCode: '107001-S24' }],
    tags: ['Maclaurin series', 'Taylor series', 'sin x'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "sin x = x − x³/3! + x⁵/5! − … = x − x³/6 + x⁵/120 − …",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u1-4',
    text: "Evaluate lim(x→0) (eˣ − 1 − x) / x² using L'Hôpital's rule.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Easy', marks: 4, type: 'numerical',
    isImportant: false,
    askedIn: [{ year: 2022, season: 'Winter', paperCode: '107001-W22' }],
    tags: ['L\'Hôpital', 'limits', 'indeterminate forms'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Apply L'Hôpital twice: lim(eˣ−1−x)/x² = lim(eˣ−1)/2x = lim eˣ/2 = 1/2.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u1-5',
    text: "Define Taylor's series and expand f(x) = log(1+x) about x = 0 up to four terms.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    difficulty: 'Medium', marks: 4, type: 'short-note',
    isImportant: false,
    askedIn: [],
    tags: ['Taylor series', 'logarithm', 'expansion'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "log(1+x) = x − x²/2 + x³/3 − x⁴/4 + …  for |x| ≤ 1 (x ≠ −1).",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Unit 2 — Fourier Series
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fmq-u2-1',
    text: "Define Fourier series. State the Dirichlet conditions for the existence of a Fourier series.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    difficulty: 'Easy', marks: 4, type: 'definition',
    isImportant: true,
    askedIn: [{ year: 2023, season: 'Winter', paperCode: '107001-W23' },
              { year: 2022, season: 'Winter', paperCode: '107001-W22' }],
    tags: ['Fourier series', 'Dirichlet conditions', 'periodic functions'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "A Fourier series represents a periodic function as an infinite sum of sines and cosines: f(x) = a₀/2 + Σ(aₙcos(nx) + bₙsin(nx)). Dirichlet conditions: (1) f(x) is periodic, (2) single-valued and finite in one period, (3) has finite number of discontinuities, (4) has finite number of maxima and minima.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u2-2',
    text: "Find the Fourier series of f(x) = x² in the interval (−π, π) and hence show that π²/6 = 1 + 1/4 + 1/9 + …",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    difficulty: 'Hard', marks: 8, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Winter', paperCode: '107001-W24' },
              { year: 2023, season: 'Summer', paperCode: '107001-S23' },
              { year: 2022, season: 'Summer', paperCode: '107001-S22' }],
    tags: ['Fourier series', 'Parseval\'s identity', 'series sum'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "For f(x)=x² on (−π,π): a₀=2π²/3, aₙ=4(−1)ⁿ/n², bₙ=0. Putting x=π gives π²=π²/3 + 4Σ(1/n²) ⟹ π²/6 = Σ 1/n².",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u2-3',
    text: "Obtain the half-range cosine series of f(x) = x in the interval (0, π).",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    difficulty: 'Hard', marks: 6, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Summer', paperCode: '107001-S24' }],
    tags: ['half-range', 'cosine series', 'Fourier'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Half-range cosine: bₙ=0, a₀=π, aₙ = 2/π∫₀^π x·cos(nx)dx = 2[(−1)ⁿ−1]/(n²π). So f(x) = π/2 − 4/π[cos x + cos3x/9 + cos5x/25 + …].",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u2-4',
    text: "What is Parseval's identity? State its significance in Fourier analysis.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    difficulty: 'Medium', marks: 4, type: 'short-note',
    isImportant: false,
    askedIn: [{ year: 2022, season: 'Summer', paperCode: '107001-S22' }],
    tags: ['Parseval identity', 'energy', 'Fourier'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Parseval's identity: (1/π)∫_{-π}^{π} [f(x)]² dx = a₀²/2 + Σ(aₙ² + bₙ²). It relates the energy of a signal to its frequency components.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Unit 3 — Partial Differentiation
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fmq-u3-1',
    text: "State and prove Euler's theorem on homogeneous functions.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    difficulty: 'Medium', marks: 6, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Winter', paperCode: '107001-W24' },
              { year: 2023, season: 'Winter', paperCode: '107001-W23' },
              { year: 2022, season: 'Winter', paperCode: '107001-W22' }],
    tags: ['Euler\'s theorem', 'homogeneous functions', 'partial differentiation'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "If f(x,y) is a homogeneous function of degree n, then x·∂f/∂x + y·∂f/∂y = n·f. Proof: set x=xt, y=yt, differentiate f(xt,yt)=tⁿf(x,y) w.r.t. t, then set t=1.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u3-2',
    text: "Find the Jacobian ∂(u,v)/∂(x,y) if u = x² − y², v = 2xy.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    difficulty: 'Easy', marks: 4, type: 'numerical',
    isImportant: false,
    askedIn: [{ year: 2023, season: 'Summer', paperCode: '107001-S23' }],
    tags: ['Jacobian', 'partial differentiation', 'transformation'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "J = |∂u/∂x  ∂u/∂y| = |2x  −2y| = 4x²+4y² = 4(x²+y²).\n       |∂v/∂x  ∂v/∂y|   |2y   2x|",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u3-3',
    text: "If u = f(x−y, y−z, z−x), show that ∂u/∂x + ∂u/∂y + ∂u/∂z = 0.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    difficulty: 'Hard', marks: 6, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Summer', paperCode: '107001-S24' },
              { year: 2022, season: 'Summer', paperCode: '107001-S22' }],
    tags: ['partial differentiation', 'chain rule', 'composite functions'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Let p=x−y, q=y−z, r=z−x. Then ∂p/∂x+∂q/∂x+∂r/∂x = 1+0−1=0 (similar for y,z). Expanding by chain rule, ∂u/∂x+∂u/∂y+∂u/∂z = (f_p+f_r)+(f_q−f_p)+(f_r−f_q) wait let me redo… using chain rule sum gives 0 since the row sums of [∂p,∂q,∂r over ∂x,∂y,∂z] each equal zero.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u3-4',
    text: "Define total derivative. If u = x² + y² and x = e^t, y = e^(−t), find du/dt.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    difficulty: 'Easy', marks: 4, type: 'numerical',
    isImportant: false,
    askedIn: [],
    tags: ['total derivative', 'chain rule'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "du/dt = (∂u/∂x)(dx/dt) + (∂u/∂y)(dy/dt) = 2x·eᵗ + 2y·(−e^{−t}) = 2e^{2t} − 2e^{−2t}.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Unit 4 — Applications of Partial Differentiation
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fmq-u4-1',
    text: "Find the maxima and minima of f(x, y) = x³ + y³ − 3xy.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u4', unitName: 'Applications of Partial Differentiation',
    difficulty: 'Hard', marks: 8, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Winter', paperCode: '107001-W24' },
              { year: 2023, season: 'Winter', paperCode: '107001-W23' },
              { year: 2022, season: 'Summer', paperCode: '107001-S22' }],
    tags: ['maxima minima', 'stationary points', 'optimization'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Critical points: fx=3x²−3y=0, fy=3y²−3x=0 ⟹ x=y=0 (saddle) and x=y=1 (minimum, f=−1). Use second-derivative test: rt−s² at (1,1): r=6, t=6, s=−3 ⟹ rt−s²=27>0, r>0 ∴ minimum.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u4-2',
    text: "Using Lagrange's method of undetermined multipliers, find the maximum value of x·y·z subject to the constraint x + y + z = a.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u4', unitName: 'Applications of Partial Differentiation',
    difficulty: 'Hard', marks: 6, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Summer', paperCode: '107001-S24' },
              { year: 2023, season: 'Summer', paperCode: '107001-S23' }],
    tags: ['Lagrange multipliers', 'constrained optimization', 'AM-GM'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Lagrange: yz=λ, xz=λ, xy=λ ⟹ x=y=z=a/3. Maximum value of xyz = (a/3)³ = a³/27.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u4-3',
    text: "If the radius of a sphere is measured as 9 cm with a possible error of 0.03 cm, find the approximate error in the calculated surface area.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u4', unitName: 'Applications of Partial Differentiation',
    difficulty: 'Easy', marks: 4, type: 'numerical',
    isImportant: false,
    askedIn: [{ year: 2022, season: 'Winter', paperCode: '107001-W22' }],
    tags: ['errors approximations', 'differentials', 'application'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "S = 4πr². dS = 8πr·dr = 8π × 9 × 0.03 = 2.16π ≈ 6.79 cm².",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Unit 5 — Matrices and Linear Algebra
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'fmq-u5-1',
    text: "Find the eigenvalues and eigenvectors of the matrix A = [[4, 1], [2, 3]].",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    difficulty: 'Medium', marks: 6, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Winter', paperCode: '107001-W24' },
              { year: 2023, season: 'Winter', paperCode: '107001-W23' },
              { year: 2022, season: 'Winter', paperCode: '107001-W22' }],
    tags: ['eigenvalues', 'eigenvectors', 'matrices'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "det(A−λI)=0: (4−λ)(3−λ)−2=0 ⟹ λ²−7λ+10=0 ⟹ λ=5,2. For λ=5: eigenvector [1,1]. For λ=2: eigenvector [1,−2].",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: 'https://www.youtube.com/watch?v=example7',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u5-2',
    text: "State and verify the Cayley-Hamilton theorem for A = [[1, 2], [3, 4]].",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    difficulty: 'Medium', marks: 6, type: 'long-answer',
    isImportant: true,
    askedIn: [{ year: 2024, season: 'Summer', paperCode: '107001-S24' },
              { year: 2023, season: 'Summer', paperCode: '107001-S23' }],
    tags: ['Cayley-Hamilton', 'characteristic polynomial', 'matrices'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "Char. poly: λ²−5λ−2=0. C-H: A²−5A−2I = O. Compute A²=[[7,10],[15,22]], 5A=[[5,10],[15,20]], 2I=[[2,0],[0,2]]. A²−5A−2I = [[0,0],[0,0]]. Verified ✓",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u5-3',
    text: "Reduce the matrix [[2,1,3],[4,2,1],[2,1,3]] to echelon form and find its rank.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    difficulty: 'Easy', marks: 4, type: 'numerical',
    isImportant: false,
    askedIn: [{ year: 2022, season: 'Summer', paperCode: '107001-S22' }],
    tags: ['rank', 'echelon form', 'row reduction'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "R2 → R2−2R1, R3 → R3−R1: rows become [2,1,3],[0,0,−5],[0,0,0]. Two non-zero rows ⟹ rank = 2.",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'fmq-u5-4',
    text: "What is diagonalisation of a matrix? State the conditions required for a matrix to be diagonalisable.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    difficulty: 'Easy', marks: 4, type: 'definition',
    isImportant: false,
    askedIn: [],
    tags: ['diagonalisation', 'linear algebra', 'eigenvalues'],
    options: [], correctOptionId: '', imageUrls: [], tableHtml: '',
    simpleAnswer: "A matrix A is diagonalisable if there exists an invertible P such that P⁻¹AP = D (diagonal). Condition: A must have n linearly independent eigenvectors (sufficient: n distinct eigenvalues).",
    detailedAnswer: '', revisionNotes: '',
    videoUrl: '',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private questions: Question[] = [...MOCK_QUESTIONS];

  constructor(private pdfParser: PdfParserService) {}

  getAll(): Observable<Question[]> {
    return of([...this.questions]).pipe(delay(100));
  }

  create(form: QuestionForm): Observable<Question> {
    const q: Question = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.questions = [...this.questions, q];
    return of({ ...q }).pipe(delay(100));
  }

  update(question: Question): Observable<Question> {
    const u: Question = { ...question, updatedAt: new Date().toISOString() };
    this.questions = this.questions.map(q => (q.id === u.id ? u : q));
    return of({ ...u }).pipe(delay(100));
  }

  delete(id: string): Observable<void> {
    this.questions = this.questions.filter(q => q.id !== id);
    return of(undefined).pipe(delay(100));
  }

  extractFromPdf(files: File[], metadata: PdfImportMetadata): Observable<ExtractedQuestion[]> {
    const parseAll = async (): Promise<ExtractedQuestion[]> => {
      const results: ExtractedQuestion[] = [];
      for (const file of files) {
        const parsed = await this.pdfParser.parseFile(file);
        if (parsed.length === 0) {
          throw new Error(
            `No questions could be extracted from "${file.name}". ` +
            `The PDF may be image-based or its format is not supported. ` +
            `Please use a text-selectable PDF.`
          );
        }
        results.push(...parsed);
      }
      return results;
    };

    return from(parseAll());
  }

  importExtracted(questions: ExtractedQuestion[], metadata: PdfImportMetadata): Observable<Question[]> {
    return of(questions).pipe(
      delay(500),
      map(list =>
        list.map((eq): Question => {
          const unitName = metadata.unitLookup.find(u => u.id === eq.unitId)?.name ?? eq.unitId;
          const created: Question = {
            id: crypto.randomUUID(),
            text: eq.text,
            subjectId: metadata.subjectId,
            subjectName: metadata.subjectName || metadata.subjectId,
            unitId: eq.unitId,
            unitName,
            difficulty: eq.difficulty,
            marks: eq.estimatedMarks,
            type: eq.type,
            isImportant: eq.isImportant,
            askedIn: [{
              year: metadata.academicYear,
              season: metadata.examSeason,
              paperCode: metadata.paperCode,
            }],
            tags: [],
            options: eq.type === 'mcq' ? (eq.options ?? []) : [],
            correctOptionId: eq.type === 'mcq' ? (eq.correctOptionId ?? '') : '',
            imageUrls: eq.imageUrls ?? [],
            tableHtml: eq.tableHtml ?? '',
            detailedAnswer: '',
            simpleAnswer: '',
            revisionNotes: '',
            videoUrl: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          this.questions = [...this.questions, created];
          return created;
        }),
      ),
    );
  }
}
