/**
 * One-time script: extracts the Engineering Chemistry PDF from the Claude
 * conversation transcript, parses it with pdfjs-dist, and prints structured
 * mock data ready to paste into question.service.ts.
 *
 * Run: node scripts/extract-pdf-questions.mjs
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Step 1: Extract base64 PDF from JSONL transcript ─────────────────────────

const JSONL_PATH = path.join(
  'C:/Users/surve/.claude/projects/c--Users-surve-Desktop-FixPass-2-0',
  'bb940e1b-adc0-46bb-ac6d-cfeca81a89ce.jsonl',
);

console.log('Reading transcript…');
const jsonl = fs.readFileSync(JSONL_PATH, 'utf8');

// Find the PDF base64 blob (may span multiple lines inside the JSON)
// The pattern is: "media_type":"application/pdf","data":"<base64>"
const PDF_RE = /"media_type"\s*:\s*"application\/pdf"\s*,\s*"data"\s*:\s*"([^"]+)"/g;

const matches = [...jsonl.matchAll(PDF_RE)];
if (matches.length === 0) {
  console.error('No PDF found in transcript.');
  process.exit(1);
}

console.log(`Found ${matches.length} PDF attachment(s). Scanning for Chemistry paper…`);

// Scan each PDF to find the Engineering Chemistry one
let base64Data = null;
for (let idx = 0; idx < matches.length; idx++) {
  const buf = Buffer.from(matches[idx][1], 'base64');
  // Quick text check — load first page only
  const tmpPdf = await (await import('pdfjs-dist/legacy/build/pdf.mjs')).getDocument({ data: new Uint8Array(buf) }).promise;
  const p1 = await tmpPdf.getPage(1);
  const c1 = await p1.getTextContent();
  const snippet = c1.items.map(i => i.str).join(' ').toLowerCase().slice(0, 500);
  console.log(`  PDF ${idx + 1}: ${snippet.slice(0, 120).trim()}`);
  if (snippet.includes('chemistry') || snippet.includes('chem') || snippet.includes('hardness') || snippet.includes('corrosion')) {
    console.log(`  → Found Chemistry paper at index ${idx + 1}`);
    base64Data = matches[idx][1];
    break;
  }
}

if (!base64Data) {
  console.log('Chemistry paper not identified by keyword — using last PDF as fallback');
  base64Data = matches[matches.length - 1][1];
}

const pdfBuffer = Buffer.from(base64Data, 'base64');

// Save locally so pdfjs can load it
const TMP_PDF = path.join(__dirname, '_tmp_paper.pdf');
fs.writeFileSync(TMP_PDF, pdfBuffer);
console.log(`Saved PDF (${(pdfBuffer.length / 1024).toFixed(0)} KB) → ${TMP_PDF}`);

// ── Step 2: Extract text with pdfjs-dist ──────────────────────────────────────

// Set up pdfjs worker once (used throughout)
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
const workerPath = new URL('../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url).href;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;

const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
const pdf = await loadingTask.promise;
console.log(`PDF loaded: ${pdf.numPages} pages`);

let fullText = '';
for (let p = 1; p <= pdf.numPages; p++) {
  const page = await pdf.getPage(p);
  const content = await page.getTextContent();

  // Group items by rounded Y to reconstruct lines
  const lineMap = new Map();
  for (const item of content.items) {
    if (!item.str?.trim()) continue;
    const y = Math.round(item.transform[5] / 4) * 4;
    if (!lineMap.has(y)) lineMap.set(y, []);
    lineMap.get(y).push({ x: item.transform[4], text: item.str });
  }

  const lines = Array.from(lineMap.entries())
    .sort(([ya], [yb]) => yb - ya)
    .map(([, items]) =>
      items.sort((a, b) => a.x - b.x).map(i => i.text).join(' ').replace(/\s+/g, ' ').trim()
    )
    .filter(l => l.length > 1);

  fullText += lines.join('\n') + '\n\n';
}

// Save raw text for inspection
const TXT_PATH = path.join(__dirname, '_tmp_paper_text.txt');
fs.writeFileSync(TXT_PATH, fullText, 'utf8');
console.log(`Raw text saved → ${TXT_PATH}`);
console.log('\n────────────────────────────────────────────────────────────────');
console.log('RAW TEXT PREVIEW (first 3000 chars):');
console.log(fullText.slice(0, 3000));
console.log('────────────────────────────────────────────────────────────────\n');

// ── Step 3: Parse SPPU structure ─────────────────────────────────────────────

const lines2 = fullText.split('\n').map(l => l.trim()).filter(Boolean);

const Q_START   = /^Q\s*\.?\s*(?:No\.?\s*)?(\d{1,2})\b/i;
const OR_LINE   = /^OR\s*$/i;
const SUB_ALPHA = /^([a-z])\s*[\).]\s*(.+)/i;
const SUB_ROMAN = /^(i{1,3}|iv|vi{0,3}|ix|x)\s*[\).]\s*(.+)/i;
const MCQ_OPT   = /^\(([ABCD])\)\s*(.+)/i;
const MARKS_END = /\[(\d+)\]\s*$/;

// Split into Q-blocks
const blocks = [];
let cur = null;
for (const line of lines2) {
  const qm = Q_START.exec(line);
  if (qm) {
    if (cur) blocks.push(cur);
    cur = { qNum: parseInt(qm[1], 10), lines: [line] };
  } else if (cur) {
    if (OR_LINE.test(line)) { blocks.push(cur); cur = null; }
    else cur.lines.push(line);
  }
}
if (cur) blocks.push(cur);

console.log(`\nFound ${blocks.length} Q-blocks: ${blocks.map(b => `Q${b.qNum}`).join(', ')}`);

// ── Q1 MCQ parse ─────────────────────────────────────────────────────────────
function parseMcq(lines) {
  const results = [];
  const SUB = /^([a-z]|\b(?:i{1,3}|iv|vi{0,3}|ix|x)\b)\s*[)\.](.+)/i;
  const OPT = /^\(([ABCD])\)\s*(.+)/i;
  const OPT_INLINE = /\(([ABCD])\)\s*([^(]+?)(?=\([ABCD]\)|$)/gi;

  let idx = 0;
  let i = 1; // skip Q.1 header
  while (i < lines.length) {
    const line = lines[i];
    const sm = SUB.exec(line);
    if (!sm) { i++; continue; }

    const rawText = sm[2].trim();
    let questionText = rawText.replace(MARKS_END, '').trim();
    const opts = { A: '', B: '', C: '', D: '' };
    let hasOpts = false;

    // Check inline options on same line
    const inlineM = [...rawText.matchAll(OPT_INLINE)];
    if (inlineM.length >= 2) {
      const firstOptPos = rawText.search(/\([ABCD]\)/i);
      if (firstOptPos > 0) questionText = rawText.slice(0, firstOptPos).replace(MARKS_END, '').trim();
      inlineM.forEach(m => { opts[m[1].toUpperCase()] = m[2].trim(); });
      hasOpts = true;
      i++;
    } else {
      i++;
      while (i < lines.length) {
        const next = lines[i];
        if (SUB.test(next) || Q_START.test(next)) break;
        const om = OPT.exec(next);
        if (om) { opts[om[1].toUpperCase()] = om[2].trim(); hasOpts = true; i++; continue; }
        const ci = [...next.matchAll(OPT_INLINE)];
        if (ci.length >= 2) {
          ci.forEach(m => { opts[m[1].toUpperCase()] = m[2].trim(); });
          hasOpts = true; i++; break;
        }
        if (!hasOpts && next.length > 2) questionText += ' ' + next.replace(MARKS_END, '').trim();
        i++;
      }
    }

    const letter = String.fromCharCode(97 + idx);
    results.push({
      questionNumber: `Q1${letter}`,
      text: questionText,
      marks: 1,
      type: 'mcq',
      options: [
        { id: 'A', text: opts.A },
        { id: 'B', text: opts.B },
        { id: 'C', text: opts.C },
        { id: 'D', text: opts.D },
      ],
    });
    idx++;
  }
  return results;
}

// ── Q2-Q11 parse ─────────────────────────────────────────────────────────────
function parseDescriptive(qNum, lines) {
  const results = [];
  const SUB = /^([a-z])\s*[\).]\s*(.+)/i;

  let i = 1;
  while (i < lines.length) {
    const line = lines[i];
    if (Q_START.test(line)) { i++; continue; }
    const sm = SUB.exec(line);
    if (!sm) { i++; continue; }

    const label = sm[1].toLowerCase();
    let text = sm[2].replace(MARKS_END, '').trim();
    const marksM = MARKS_END.exec(sm[2]);
    let marks = marksM ? parseInt(marksM[1], 10) : 0;

    i++;
    while (i < lines.length) {
      const next = lines[i];
      if (SUB.test(next) || Q_START.test(next)) break;
      if (!marks) { const mm = MARKS_END.exec(next); if (mm) marks = parseInt(mm[1], 10); }
      const clean = next.replace(MARKS_END, '').trim();
      if (clean) text += ' ' + clean;
      i++;
    }

    results.push({
      questionNumber: `Q${qNum}${label}`,
      text: text.trim(),
      marks: marks || (label === 'a' ? 6 : 3),
      type: inferType(text, marks),
    });
  }
  return results;
}

function inferType(text, marks) {
  const t = text.toLowerCase();
  if (/calculat|find|determin|compute/.test(t) && marks <= 4) return 'numerical';
  if (/define|definition|what is meant|give the meaning/.test(t) && marks <= 4) return 'definition';
  if (/short note|brief|list (any|two|three)|mention|give (any|two|three)/.test(t) && marks <= 4) return 'short-note';
  if (/calculat|find|determin|compute/.test(t)) return 'numerical';
  return 'long-answer';
}

// ── Build output ──────────────────────────────────────────────────────────────
const mcqBlock = blocks.find(b => b.qNum === 1);
const mcqs = mcqBlock ? parseMcq(mcqBlock.lines) : [];

const descriptive = blocks
  .filter(b => b.qNum >= 2 && b.qNum <= 11)
  .flatMap(b => parseDescriptive(b.qNum, b.lines));

console.log(`\n✔ MCQs found: ${mcqs.length}`);
console.log(`✔ Descriptive sub-parts found: ${descriptive.length}`);

// ── Print structured output ───────────────────────────────────────────────────
console.log('\n════════════════════════════════════════════════════════════════');
console.log('MCQ BANK (paste into getMcqBank → chemistry branch)');
console.log('════════════════════════════════════════════════════════════════');
for (const m of mcqs) {
  console.log(`\n  // ${m.questionNumber}`);
  console.log(`  {`);
  console.log(`    text: ${JSON.stringify(m.text)},`);
  console.log(`    options: [`);
  for (const o of m.options) {
    console.log(`      { id: '${o.id}', text: ${JSON.stringify(o.text)} },`);
  }
  console.log(`    ],`);
  console.log(`    correctOptionId: '',   // ← fill in correct answer`);
  console.log(`  },`);
}

console.log('\n════════════════════════════════════════════════════════════════');
console.log('DESCRIPTIVE TEMPLATE (paste into getSubjectTemplates → chemistry branch)');
console.log('════════════════════════════════════════════════════════════════');

// Group Q2/Q3 together, Q4/Q5 together, etc.
const pairs = {};
for (const q of descriptive) {
  const m = q.questionNumber.match(/^Q(\d+)/);
  if (!m) continue;
  const n = parseInt(m[1]);
  const pair = Math.floor(n / 2) - 1; // 0=Q2/3, 1=Q4/5, 2=Q6/7 ...
  const side = n % 2 === 0 ? 'qA' : 'qB'; // even→qA, odd→qB
  if (!pairs[pair]) pairs[pair] = { qA: [], qB: [] };
  pairs[pair][side].push(q);
}

for (const [pairIdx, pair] of Object.entries(pairs)) {
  const q1 = parseInt(pairIdx) * 2 + 2;
  const q2 = q1 + 1;
  console.log(`\n        // Pair ${pairIdx} — Q${q1}/Q${q2}`);
  console.log(`        {`);
  for (const side of ['qA', 'qB']) {
    const entries = pair[side] || [];
    const qLabel = side === 'qA' ? q1 : q2;
    console.log(`          ${side}: [  // Q${qLabel}`);
    for (const e of entries) {
      console.log(`            [${JSON.stringify(e.text)}, '${e.type}'],`);
    }
    console.log(`          ],`);
  }
  console.log(`        },`);
}

// Save JSON for easy copy-paste
const OUTPUT_JSON = path.join(__dirname, '_extracted_questions.json');
fs.writeFileSync(OUTPUT_JSON, JSON.stringify({ mcqs, descriptive }, null, 2), 'utf8');
console.log(`\n\nFull JSON saved → ${OUTPUT_JSON}`);

// Cleanup temp PDF
fs.unlinkSync(TMP_PDF);
