import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

import {
  Answer,
  AnswerContent,
  AnswerType,
  UpdateAnswerRequest,
} from '../interfaces/answer.interfaces';
import { GENERATE_ANSWER_PROMPT, EDIT_ANSWER_PROMPT } from '../constants/answer-prompts';
import { ANSWER_CONFIG } from '../config/answer.config';

const MOCK_ANSWERS: Answer[] = [
  // ── 1. Mathematics — Calculus / Derivatives ──────────────────────────────
  {
    id: 'mock-001',
    questionId: 'q-001',
    questionText: 'Explain differentiation and derivatives with rules and examples.',
    subjectId: 'sub-001',
    subjectName: 'Mathematics',
    unitId: 'unit-001',
    unitName: 'Calculus',
    answerType: 'Detailed',
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2025-01-10T09:00:00.000Z',
    answer: {
      content: [
        { type: 'header', data: 'Differentiation and Derivatives' },
        { type: 'text', data: 'A derivative measures the instantaneous rate of change of a function. If $f(x)$ is differentiable at $x = a$, the derivative is defined as the limit:' },
        { type: 'sqlCode', data: '\\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}' },
        { type: 'subHeader', data: 'Standard Derivative Rules' },
        {
          type: 'Ulist',
          dataObject: {
            items: [
              { text: 'Power Rule: $\\frac{d}{dx}[x^n] = nx^{n-1}$' },
              { text: "Product Rule: $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$" },
              { text: "Quotient Rule: $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$" },
              { text: "Chain Rule: $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$" },
            ],
          },
        },
        { type: 'subHeader', data: 'Worked Example' },
        { type: 'text', data: 'Find the derivative of $f(x) = x^3 - 5x^2 + 3x - 7$.' },
        { type: 'sqlCode', data: "f'(x) = 3x^2 - 10x + 3" },
        { type: 'text', data: 'Applying the power rule term by term: the constant $-7$ vanishes, giving $f\'\'(x) = 6x - 10$.' },
        { type: 'subHeader', data: 'Common Derivatives Reference' },
        {
          type: 'table',
          dataObject: {
            headers: ['Function', 'Derivative', 'Domain'],
            rows: [
              { Function: '$\\sin(x)$', Derivative: '$\\cos(x)$', Domain: 'ℝ' },
              { Function: '$\\cos(x)$', Derivative: '$-\\sin(x)$', Domain: 'ℝ' },
              { Function: '$e^x$', Derivative: '$e^x$', Domain: 'ℝ' },
              { Function: '$\\ln(x)$', Derivative: '$\\frac{1}{x}$', Domain: '$x > 0$' },
              { Function: '$\\tan(x)$', Derivative: '$\\sec^2(x)$', Domain: '$x \\ne \\frac{\\pi}{2} + n\\pi$' },
            ],
          },
        },
        { type: 'subHeader', data: 'Higher-Order Derivatives' },
        { type: 'text', data: 'The second derivative $f\'\'(x)$ describes curvature. For $f(x) = x^3 - 5x^2 + 3x - 7$:' },
        { type: 'sqlCode', data: "f''(x) = \\frac{d^2y}{dx^2} = 6x - 10" },
      ],
    },
  },

  // ── 2. Physics — Ohm's Law & Kirchhoff's Laws ─────────────────────────────
  {
    id: 'mock-002',
    questionId: 'q-002',
    questionText: "Explain Ohm's Law and Kirchhoff's Circuit Laws with examples.",
    subjectId: 'sub-001',
    subjectName: 'Physics',
    unitId: 'unit-002',
    unitName: 'Electrostatics & Circuits',
    answerType: 'Detailed',
    createdAt: '2025-01-11T10:00:00.000Z',
    updatedAt: '2025-01-11T10:00:00.000Z',
    answer: {
      content: [
        { type: 'header', data: "Ohm's Law and Kirchhoff's Circuit Laws" },
        { type: 'text', data: "Ohm's Law describes the relationship between voltage, current, and resistance in a circuit. It is the foundation of all circuit analysis." },
        { type: 'sqlCode', data: 'V = IR \\quad \\Rightarrow \\quad I = \\frac{V}{R} \\quad \\Rightarrow \\quad R = \\frac{V}{I}' },
        { type: 'subHeader', data: "Kirchhoff's Current Law (KCL)" },
        { type: 'text', data: 'The algebraic sum of all currents entering and leaving any node is zero — conservation of charge:' },
        { type: 'sqlCode', data: '\\sum_{k=1}^{n} I_k = 0 \\quad \\text{(at any node)}' },
        {
          type: 'Ulist',
          dataObject: {
            items: [
              { text: 'Currents entering a node are taken as positive.' },
              { text: 'Currents leaving a node are taken as negative.' },
              { text: 'Applies at every node in a lumped-circuit network.' },
            ],
          },
        },
        { type: 'subHeader', data: "Kirchhoff's Voltage Law (KVL)" },
        { type: 'text', data: 'The sum of all EMFs equals the sum of all voltage drops around any closed loop — conservation of energy:' },
        { type: 'sqlCode', data: '\\sum_{k=1}^{n} V_k = 0 \\quad \\text{(around any closed loop)}' },
        { type: 'subHeader', data: 'Series vs Parallel Resistors' },
        {
          type: 'table',
          dataObject: {
            headers: ['Property', 'Series', 'Parallel'],
            rows: [
              { Property: 'Total Resistance', Series: '$R_T = R_1 + R_2 + \\cdots$', Parallel: '$\\frac{1}{R_T} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\cdots$' },
              { Property: 'Current', Series: 'Same through all', Parallel: 'Splits across branches' },
              { Property: 'Voltage', Series: 'Divides across resistors', Parallel: 'Same across all' },
              { Property: 'Use Case', Series: 'Voltage dividers', Parallel: 'Current dividers / fault tolerance' },
            ],
          },
        },
        { type: 'subHeader', data: 'Power Dissipation' },
        { type: 'text', data: 'Power consumed by a resistor (all three forms are equivalent via Ohm\'s Law):' },
        { type: 'sqlCode', data: 'P = VI = I^2 R = \\frac{V^2}{R}' },
      ],
    },
  },

  // ── 3. Data Structures — Merge Sort ───────────────────────────────────────
  {
    id: 'mock-003',
    questionId: 'q-003',
    questionText: 'Explain Merge Sort algorithm with implementation and complexity analysis.',
    subjectId: 'sub-002',
    subjectName: 'Data Structures & Algorithms',
    unitId: 'unit-003',
    unitName: 'Sorting Algorithms',
    answerType: 'Detailed',
    createdAt: '2025-01-12T08:30:00.000Z',
    updatedAt: '2025-01-12T08:30:00.000Z',
    answer: {
      content: [
        { type: 'header', data: 'Merge Sort — Divide and Conquer' },
        { type: 'text', data: 'Merge Sort is a stable, comparison-based sorting algorithm that uses the divide-and-conquer paradigm. It recursively splits the input in half, sorts each half independently, then merges them.' },
        { type: 'subHeader', data: 'Algorithm Steps' },
        {
          type: 'Olist',
          dataObject: {
            items: [
              { text: 'Divide the unsorted array into two halves at the midpoint.' },
              { text: 'Recursively sort the left half.' },
              { text: 'Recursively sort the right half.' },
              { text: 'Merge the two sorted halves into a single sorted array.' },
            ],
          },
        },
        { type: 'subHeader', data: 'Python Implementation' },
        {
          type: 'sqlCode',
          data: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example
print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
# → [3, 9, 10, 27, 38, 43, 82]`,
        },
        { type: 'subHeader', data: 'Complexity Analysis' },
        { type: 'text', data: 'The recurrence relation $T(n) = 2T(n/2) + O(n)$ resolves to $O(n \\log n)$ by the Master Theorem — guaranteed in all cases.' },
        {
          type: 'table',
          dataObject: {
            headers: ['Case', 'Time Complexity', 'Space Complexity'],
            rows: [
              { Case: 'Best', 'Time Complexity': '$O(n \\log n)$', 'Space Complexity': '$O(n)$' },
              { Case: 'Average', 'Time Complexity': '$O(n \\log n)$', 'Space Complexity': '$O(n)$' },
              { Case: 'Worst', 'Time Complexity': '$O(n \\log n)$', 'Space Complexity': '$O(n)$' },
            ],
          },
        },
        { type: 'subHeader', data: 'Advantages & Disadvantages' },
        {
          type: 'Ulist',
          dataObject: {
            items: [
              { text: "CORRECT: Guarantees $O(n \\log n)$ in all cases — unlike Quick Sort's $O(n^2)$ worst case." },
              { text: 'CORRECT: Stable sort — preserves relative order of equal elements.' },
              { text: 'CORRECT: Ideal for linked lists and external sorting (disk-based data).' },
              { text: 'WRONG: Requires $O(n)$ auxiliary space — not an in-place algorithm.' },
              { text: 'WRONG: Slightly slower than Quick Sort in practice for small, in-memory arrays due to overhead.' },
            ],
          },
        },
      ],
    },
  },

  // ── 4. DBMS — SQL vs NoSQL ────────────────────────────────────────────────
  {
    id: 'mock-004',
    questionId: 'q-004',
    questionText: 'Compare SQL and NoSQL databases with examples and use cases.',
    subjectId: 'sub-003',
    subjectName: 'Database Management Systems',
    unitId: 'unit-004',
    unitName: 'Database Types',
    answerType: 'Simple',
    createdAt: '2025-01-13T11:00:00.000Z',
    updatedAt: '2025-01-13T11:00:00.000Z',
    answer: {
      content: [
        { type: 'header', data: 'SQL vs NoSQL Databases' },
        { type: 'text', data: 'SQL (Relational) and NoSQL (Non-Relational) databases serve fundamentally different use cases. Choosing correctly depends on data structure, scalability needs, and consistency requirements.' },
        {
          type: 'table',
          dataObject: {
            headers: ['Feature', 'SQL', 'NoSQL'],
            rows: [
              { Feature: 'Data Model', SQL: 'Tables with fixed schema', NoSQL: 'Document, Key-Value, Graph, Column' },
              { Feature: 'Schema', SQL: 'Rigid (defined upfront)', NoSQL: 'Dynamic / Schema-less' },
              { Feature: 'Query Language', SQL: 'SQL (standardized)', NoSQL: 'Varies by database' },
              { Feature: 'ACID Compliance', SQL: 'Full ACID', NoSQL: 'Eventual consistency (BASE)' },
              { Feature: 'Scaling', SQL: 'Vertical (scale up)', NoSQL: 'Horizontal (scale out)' },
              { Feature: 'Best For', SQL: 'Structured relational data', NoSQL: 'Unstructured / high-volume data' },
              { Feature: 'Examples', SQL: 'MySQL, PostgreSQL, Oracle', NoSQL: 'MongoDB, Cassandra, Redis' },
            ],
          },
        },
        { type: 'subHeader', data: 'When to Use SQL' },
        {
          type: 'Ulist',
          dataObject: {
            items: [
              { text: 'Complex relationships between entities requiring joins.' },
              { text: 'Financial / banking systems needing strict ACID transactions.' },
              { text: 'Stable, well-defined schemas unlikely to change frequently.' },
            ],
          },
        },
        { type: 'subHeader', data: 'When to Use NoSQL' },
        {
          type: 'Ulist',
          dataObject: {
            items: [
              { text: 'High read/write throughput at massive scale (social media, IoT).' },
              { text: 'Semi-structured or unstructured data (JSON documents, logs).' },
              { text: 'Rapid prototyping where schema evolves frequently.' },
            ],
          },
        },
        { type: 'subHeader', data: 'SQL JOIN Example' },
        {
          type: 'sqlCode',
          data: `-- Get all orders with customer details
SELECT c.name, c.email, o.order_date, o.total
FROM   customers c
INNER JOIN orders o ON c.id = o.customer_id
WHERE  o.total > 1000
ORDER  BY o.order_date DESC;`,
        },
      ],
    },
  },

  // ── 5. Operating Systems — CPU Scheduling ─────────────────────────────────
  {
    id: 'mock-005',
    questionId: 'q-005',
    questionText: 'Explain CPU scheduling algorithms in Operating Systems.',
    subjectId: 'sub-004',
    subjectName: 'Operating Systems',
    unitId: 'unit-005',
    unitName: 'Process Management',
    answerType: 'Detailed',
    createdAt: '2025-01-14T14:00:00.000Z',
    updatedAt: '2025-01-14T14:00:00.000Z',
    answer: {
      content: [
        { type: 'header', data: 'CPU Scheduling Algorithms' },
        { type: 'text', data: 'CPU scheduling determines the order in which processes use the CPU. The goal is to maximize throughput, minimize waiting time, and ensure fairness across all processes.' },
        { type: 'subHeader', data: 'Key Scheduling Criteria' },
        {
          type: 'Ulist',
          dataObject: {
            items: [
              { text: 'CPU Utilization — keep the CPU busy as close to 100% as possible.' },
              { text: 'Throughput — number of processes completed per unit time.' },
              { text: 'Turnaround Time — total time from submission to completion.' },
              { text: 'Waiting Time — cumulative time spent in the ready queue.' },
              { text: 'Response Time — time from first request to first CPU response.' },
            ],
          },
        },
        { type: 'subHeader', data: 'Major Algorithms Compared' },
        {
          type: 'table',
          dataObject: {
            headers: ['Algorithm', 'Type', 'Starvation', 'Overhead', 'Best For'],
            rows: [
              { Algorithm: 'FCFS', Type: 'Non-preemptive', Starvation: 'No', Overhead: 'Very Low', 'Best For': 'Batch systems' },
              { Algorithm: 'SJF', Type: 'Non-preemptive', Starvation: 'Yes', Overhead: 'Medium', 'Best For': 'Min avg wait time' },
              { Algorithm: 'SRTF', Type: 'Preemptive', Starvation: 'Yes', Overhead: 'High', 'Best For': 'Interactive systems' },
              { Algorithm: 'Round Robin', Type: 'Preemptive', Starvation: 'No', Overhead: 'Medium', 'Best For': 'Time-sharing' },
              { Algorithm: 'Priority', Type: 'Both', Starvation: 'Yes', Overhead: 'Medium', 'Best For': 'Real-time tasks' },
              { Algorithm: 'Multilevel Queue', Type: 'Preemptive', Starvation: 'Possible', Overhead: 'High', 'Best For': 'Mixed workloads' },
            ],
          },
        },
        { type: 'subHeader', data: 'Round Robin — Quantum Effect' },
        { type: 'text', data: 'If the time quantum $q$ is too large, Round Robin degenerates to FCFS. If $q$ is too small, context-switch overhead dominates. Empirically, $q$ is set to 10–100 ms.' },
        {
          type: 'sqlCode',
          data: `from collections import deque

def round_robin(processes, quantum):
    queue = deque(processes)   # [(pid, burst_time), ...]
    time = 0
    while queue:
        pid, burst = queue.popleft()
        run = min(burst, quantum)
        time += run
        burst -= run
        print(f"t={time}: P{pid} ran {run}ms, remaining={burst}ms")
        if burst > 0:
            queue.append((pid, burst))

# P1=24ms, P2=3ms, P3=3ms, quantum=4
round_robin([("P1",24),("P2",3),("P3",3)], quantum=4)`,
        },
        { type: 'subHeader', data: 'FCFS Waiting Time Example' },
        { type: 'text', data: 'For P1(24ms), P2(3ms), P3(3ms) all arriving at $t=0$ under FCFS: average waiting time $= (0 + 24 + 27) / 3 = 17$ ms. Under SJF (shortest first): average $= (0 + 3 + 6) / 3 = 3$ ms — a significant improvement.' },
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Engineering Mathematics – I  |  fe-math1  |  Detailed rich answers
  // ══════════════════════════════════════════════════════════════════════════

  // ── fmq-u1-1  Rolle's Theorem ─────────────────────────────────────────────
  {
    id: 'ans-fmq-u1-1-d',
    questionId: 'fmq-u1-1',
    questionText: "State and prove Rolle's Theorem. Give one geometrical interpretation.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: "Rolle's Theorem" },
        { type: 'subHeader', data: 'Statement' },
        { type: 'text', data: "If a function f(x) satisfies the following three conditions on the closed interval [a, b], then there exists at least one point c ∈ (a, b) such that f'(c) = 0." },
        { type: 'Olist', dataObject: { items: [
          { text: 'f(x) is continuous on the closed interval [a, b].' },
          { text: 'f(x) is differentiable on the open interval (a, b).' },
          { text: 'f(a) = f(b).' },
        ]}},
        { type: 'subHeader', data: 'Proof (Outline)' },
        { type: 'text', data: "Since f is continuous on [a, b], by the Extreme Value Theorem it attains its maximum M and minimum m in [a, b]." },
        { type: 'Ulist', dataObject: { items: [
          { text: "Case 1: M = m. Then f is constant on [a, b], so f'(x) = 0 everywhere in (a, b). Any c works." },
          { text: "Case 2: M > m. At least one extreme value is attained at an interior point c ∈ (a, b). By Fermat's theorem (f differentiable at interior extremum), f'(c) = 0." },
        ]}},
        { type: 'subHeader', data: 'Geometrical Interpretation' },
        { type: 'text', data: "If the curve y = f(x) starts and ends at the same height (f(a) = f(b)), then the tangent to the curve is horizontal (parallel to the x-axis) at least at one point c between a and b. Equivalently, the curve has at least one turning point in the interior of [a, b]." },
        { type: 'subHeader', data: 'Standard Example' },
        { type: 'text', data: "Verify Rolle's theorem for f(x) = x² − 4x + 3 on [1, 3]." },
        { type: 'Olist', dataObject: { items: [
          { text: 'f is a polynomial — continuous and differentiable everywhere.' },
          { text: 'f(1) = 1 − 4 + 3 = 0 and f(3) = 9 − 12 + 3 = 0. So f(1) = f(3). ✓' },
          { text: "f'(x) = 2x − 4 = 0 ⟹ x = 2 ∈ (1, 3). Verified." },
        ]}},
        { type: 'subHeader', data: 'Key Points to Remember' },
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

  // ── fmq-u1-2  LMVT ────────────────────────────────────────────────────────
  {
    id: 'ans-fmq-u1-2-d',
    questionId: 'fmq-u1-2',
    questionText: "State Lagrange's Mean Value Theorem and verify it for f(x) = x² − 3x + 2 on [1, 3].",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u1', unitName: 'Differential Calculus',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: "Lagrange's Mean Value Theorem (LMVT)" },
        { type: 'subHeader', data: 'Statement' },
        { type: 'text', data: "If f(x) is (1) continuous on [a, b] and (2) differentiable on (a, b), then there exists at least one point c ∈ (a, b) such that:" },
        { type: 'sqlCode', data: "f'(c) = [f(b) - f(a)] / (b - a)" },
        { type: 'subHeader', data: 'Geometrical Meaning' },
        { type: 'text', data: "There is at least one point on the curve where the tangent is parallel to the chord joining (a, f(a)) to (b, f(b))." },
        { type: 'subHeader', data: 'Verification for f(x) = x² − 3x + 2 on [1, 3]' },
        { type: 'Olist', dataObject: { items: [
          { text: 'f(x) is a polynomial — continuous and differentiable everywhere.' },
          { text: 'f(1) = 1 − 3 + 2 = 0,  f(3) = 9 − 9 + 2 = 2.' },
          { text: 'RHS = (f(3) − f(1)) / (3 − 1) = (2 − 0) / 2 = 1.' },
          { text: "f'(x) = 2x − 3.  Set f'(c) = 1 ⟹ 2c − 3 = 1 ⟹ c = 2." },
          { text: 'c = 2 ∈ (1, 3). Theorem is verified. ✓' },
        ]}},
        { type: 'subHeader', data: 'Relation to Rolle\'s Theorem' },
        { type: 'text', data: "Rolle's Theorem is a special case of LMVT when f(a) = f(b), making the RHS = 0 and hence f'(c) = 0." },
      ],
    },
  },

  // ── fmq-u2-1  Dirichlet conditions ────────────────────────────────────────
  {
    id: 'ans-fmq-u2-1-d',
    questionId: 'fmq-u2-1',
    questionText: "Define Fourier series. State the Dirichlet conditions for the existence of a Fourier series.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u2', unitName: 'Fourier Series',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: 'Fourier Series' },
        { type: 'subHeader', data: 'Definition' },
        { type: 'text', data: "A Fourier series is a representation of a periodic function f(x) with period 2π as an infinite sum of sine and cosine terms:" },
        { type: 'sqlCode', data: "f(x) = a₀/2 + Σₙ₌₁^∞ [aₙ cos(nx) + bₙ sin(nx)]" },
        { type: 'text', data: "where the Euler–Fourier coefficients are:" },
        { type: 'table', dataObject: {
          headers: ['Coefficient', 'Formula'],
          rows: [
            { Coefficient: 'a₀', Formula: '(1/π) ∫₋π^π f(x) dx' },
            { Coefficient: 'aₙ', Formula: '(1/π) ∫₋π^π f(x) cos(nx) dx' },
            { Coefficient: 'bₙ', Formula: '(1/π) ∫₋π^π f(x) sin(nx) dx' },
          ],
        }},
        { type: 'subHeader', data: "Dirichlet's Conditions (Sufficient for Convergence)" },
        { type: 'Olist', dataObject: { items: [
          { text: 'f(x) is periodic with period 2π.' },
          { text: 'f(x) is single-valued and bounded (finite) in one complete period.' },
          { text: 'f(x) has a finite number of discontinuities in one period.' },
          { text: 'f(x) has a finite number of maxima and minima in one period.' },
        ]}},
        { type: 'subHeader', data: 'Convergence at Discontinuities' },
        { type: 'text', data: "At a point of discontinuity x₀, the Fourier series converges to the average of the left- and right-hand limits: [f(x₀⁺) + f(x₀⁻)] / 2." },
        { type: 'subHeader', data: 'Importance' },
        { type: 'Ulist', dataObject: { items: [
          { text: 'Decomposes complex periodic signals into simple harmonic components.' },
          { text: 'Essential in signal processing, heat conduction, vibrations, and electrical engineering.' },
          { text: 'Foundation for the Fourier Transform used in digital signal processing.' },
        ]}},
      ],
    },
  },

  // ── fmq-u3-1  Euler's Theorem ─────────────────────────────────────────────
  {
    id: 'ans-fmq-u3-1-d',
    questionId: 'fmq-u3-1',
    questionText: "State and prove Euler's theorem on homogeneous functions.",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u3', unitName: 'Partial Differentiation',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: "Euler's Theorem on Homogeneous Functions" },
        { type: 'subHeader', data: 'Definition: Homogeneous Function' },
        { type: 'text', data: "A function f(x, y) is homogeneous of degree n if for every t > 0: f(tx, ty) = tⁿ · f(x, y)." },
        { type: 'text', data: "Examples: f = x²+xy+y² is homogeneous of degree 2; f = (x³+y³)/(x+y) is homogeneous of degree 2." },
        { type: 'subHeader', data: 'Statement of Euler\'s Theorem' },
        { type: 'text', data: "If f(x, y) is a homogeneous function of degree n, and if the partial derivatives ∂f/∂x and ∂f/∂y exist, then:" },
        { type: 'sqlCode', data: "x · (∂f/∂x) + y · (∂f/∂y) = n · f(x, y)" },
        { type: 'subHeader', data: 'Proof' },
        { type: 'Olist', dataObject: { items: [
          { text: 'Since f is homogeneous of degree n: f(tx, ty) = tⁿ · f(x, y) ... (1)' },
          { text: 'Differentiate both sides of (1) with respect to t:  x·fₓ(tx,ty) + y·f_y(tx,ty) = n·tⁿ⁻¹·f(x,y)' },
          { text: 'Set t = 1: x·fₓ(x,y) + y·f_y(x,y) = n·f(x,y). □' },
        ]}},
        { type: 'subHeader', data: 'Corollary (Second-order form)' },
        { type: 'sqlCode', data: "x²fₓₓ + 2xy·fₓ_y + y²f_yy = n(n−1)f" },
        { type: 'subHeader', data: 'Worked Example' },
        { type: 'text', data: "Verify Euler's theorem for f(x,y) = x³ + 3x²y + 3xy² + y³." },
        { type: 'Olist', dataObject: { items: [
          { text: 'f is homogeneous of degree 3 (replace x→tx, y→ty: t³ factor comes out).' },
          { text: 'fₓ = 3x² + 6xy + 3y², f_y = 3x² + 6xy + 3y².' },
          { text: 'x·fₓ + y·f_y = x(3x²+6xy+3y²) + y(3x²+6xy+3y²) = 3(x+y)(x²+2xy+y²) = 3(x+y)³ = 3f. ✓' },
        ]}},
        { type: 'subHeader', data: 'Applications' },
        { type: 'Ulist', dataObject: { items: [
          { text: 'Verifying degree of expressions in thermodynamics (intensive/extensive properties).' },
          { text: 'Economics: returns to scale — production functions often homogeneous.' },
          { text: 'Simplifying computation of partial derivatives without direct calculation.' },
        ]}},
      ],
    },
  },

  // ── fmq-u5-1  Eigenvalues ─────────────────────────────────────────────────
  {
    id: 'ans-fmq-u5-1-d',
    questionId: 'fmq-u5-1',
    questionText: "Find the eigenvalues and eigenvectors of the matrix A = [[4, 1], [2, 3]].",
    subjectId: 'fe-math1', subjectName: "Engineering Mathematics – I",
    unitId: 'fe-math1-u5', unitName: 'Matrices and Linear Algebra',
    answerType: 'Detailed',
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
    answer: {
      content: [
        { type: 'header', data: 'Eigenvalues and Eigenvectors' },
        { type: 'subHeader', data: 'Definitions' },
        { type: 'Ulist', dataObject: { items: [
          { text: 'Eigenvalue λ: a scalar such that Ax = λx for some non-zero vector x.' },
          { text: 'Eigenvector x: the non-zero vector satisfying (A − λI)x = 0.' },
          { text: 'Characteristic equation: det(A − λI) = 0.' },
        ]}},
        { type: 'subHeader', data: 'Step 1 — Characteristic Equation' },
        { type: 'text', data: 'A = [[4,1],[2,3]].  Form A − λI:' },
        { type: 'sqlCode', data: "det(A − λI) = (4−λ)(3−λ) − (1)(2) = λ² − 7λ + 10 = 0" },
        { type: 'text', data: 'Factoring: (λ − 5)(λ − 2) = 0  ⟹  λ₁ = 5,  λ₂ = 2.' },
        { type: 'subHeader', data: 'Step 2 — Eigenvector for λ₁ = 5' },
        { type: 'text', data: 'Solve (A − 5I)x = 0:' },
        { type: 'sqlCode', data: "[[-1, 1],  row-reduce  =>  [1, -1]\n [ 2,-2]]              [0,  0]" },
        { type: 'text', data: 'Solution: x₁ = x₂.  Choose x₂ = 1 ⟹ eigenvector X₁ = [1, 1]ᵀ.' },
        { type: 'subHeader', data: 'Step 3 — Eigenvector for λ₂ = 2' },
        { type: 'text', data: 'Solve (A − 2I)x = 0:' },
        { type: 'sqlCode', data: "[[2, 1],  row-reduce  =>  [2, 1]\n [2, 1]]              [0, 0]" },
        { type: 'text', data: 'Solution: 2x₁ + x₂ = 0 ⟹ x₂ = −2x₁.  Choose x₁ = 1 ⟹ eigenvector X₂ = [1, −2]ᵀ.' },
        { type: 'subHeader', data: 'Summary' },
        { type: 'table', dataObject: {
          headers: ['Eigenvalue', 'Eigenvector', 'Verification Ax = λx'],
          rows: [
            { Eigenvalue: 'λ₁ = 5', Eigenvector: '[1, 1]ᵀ', 'Verification Ax = λx': '[[4,1],[2,3]][1,1]=[5,5]=5·[1,1] ✓' },
            { Eigenvalue: 'λ₂ = 2', Eigenvector: '[1, −2]ᵀ', 'Verification Ax = λx': '[[4,1],[2,3]][1,−2]=[2,−4]=2·[1,−2] ✓' },
          ],
        }},
      ],
    },
  },
];

@Injectable({ providedIn: 'root' })
export class AnswerService {
  private readonly http = inject(HttpClient);
  private readonly apiKey: string;
  private answers: Answer[] = MOCK_ANSWERS;

  constructor() {
    const bytes = CryptoJS.AES.decrypt(ANSWER_CONFIG.ENCRYPTED_KEY, ANSWER_CONFIG.SECRET);
    this.apiKey = bytes.toString(CryptoJS.enc.Utf8);
  }

  getAll(): Observable<Answer[]> {
    return of([...this.answers]).pipe(delay(100));
  }

  save(answer: Answer): Observable<Answer> {
    const existing = this.answers.find(a => a.id === answer.id);
    if (existing) {
      const updated: Answer = { ...answer, updatedAt: new Date().toISOString() };
      this.answers = this.answers.map(a => (a.id === updated.id ? updated : a));
      return of({ ...updated }).pipe(delay(200));
    }
    const created: Answer = {
      ...answer,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.answers = [...this.answers, created];
    return of({ ...created }).pipe(delay(200));
  }


  delete(id: string): Observable<void> {
    this.answers = this.answers.filter(a => a.id !== id);
    return of(undefined).pipe(delay(100));
  }

  generateAnswer(questionText: string, answerType: AnswerType): Observable<AnswerContent> {
    const prompt = `${GENERATE_ANSWER_PROMPT}\n\nQuestion: ${questionText}\n\nAnswer Type: ${answerType} Answer`;
    return this.callOpenAI(prompt);
  }

  updateAnswer(req: UpdateAnswerRequest): Observable<AnswerContent> {
    const prompt =
      `${EDIT_ANSWER_PROMPT}\n\nQuestion: ${req.question}\n\n` +
      `Current Answer:\n${JSON.stringify(req.currentAnswer)}\n\n` +
      `Content Modification Instructions: ${req.contentInstruction || 'None'}\n\n` +
      `Structure Modification Instructions: ${req.structureInstruction || 'None'}`;
    return this.callOpenAI(prompt);
  }

  private callOpenAI(prompt: string): Observable<AnswerContent> {
    if (!this.apiKey) {
      return throwError(() => new Error('API key could not be decrypted.'));
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });
    const body = {
      model: ANSWER_CONFIG.MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    };
    return this.http
      .post<{ choices: Array<{ message: { content: string } }> }>(
        ANSWER_CONFIG.OPENAI_API_URL,
        body,
        { headers },
      )
      .pipe(
        map(res => {
          const parsed = JSON.parse(res.choices[0].message.content) as { answer: AnswerContent };
          return parsed.answer;
        }),
        catchError((err: { error?: { error?: { message?: string } } }) =>
          throwError(() => new Error(err?.error?.error?.message ?? 'AI generation failed')),
        ),
      );
  }
}
