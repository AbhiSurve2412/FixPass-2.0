/**
 * Quick verification: run the same parsing logic against the extracted PDF text
 * to confirm the parser produces the correct questions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const textFile = path.join(__dirname, '_tmp_paper_text.txt');

if (!fs.existsSync(textFile)) {
  console.error('Run extract-pdf-questions.mjs first to generate _tmp_paper_text.txt');
  process.exit(1);
}

const rawText = fs.readFileSync(textFile, 'utf8');
const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 1);

// ── same regex as the Angular service ──
const Q_HEADER  = /^Q\s*\.?\s*(?:No\.?\s*)?(\d{1,2})\s*[\).]?\s*(.*)/i;
const OR_ONLY   = /^OR\s*$/i;
const PAGE_NUM  = /^\[\d{4}\]-\d{4}\s+\d+\s*$/;
const ROMAN_Q   = /^(i{1,3}|iv|v|vi{1,3}|ix|x)\s*[\).]\s*(.+)/i;
const OPT_PAIR  = /^([abcd])\)\s*(.+?)\s{2,}([abcd])\)\s*(.+)/i;
const OPT_SINGLE = /^([abcd])\)\s*(.+)/i;
const SUB_START = /^([a-c])\s*[\).]\s*(.+)/i;
const MARKS_END = /\[(\d+)\]\s*$/;
const ROMAN_SUB = /^(i{1,3}|iv|v|vi{1,3}|ix|x)\s*[\).]\s*(.+)/i;

// ── Split into Q-blocks ──
const blocks = [];
let cur = null;

for (const line of lines) {
  if (PAGE_NUM.test(line)) continue;
  const qm = Q_HEADER.exec(line);
  if (qm) {
    if (cur) blocks.push(cur);
    cur = { qNum: parseInt(qm[1]), body: [] };
    const rest = qm[2].trim();
    if (rest) cur.body.push(rest);
    continue;
  }
  if (OR_ONLY.test(line)) { if (cur) blocks.push(cur); cur = null; continue; }
  if (cur) cur.body.push(line);
}
if (cur) blocks.push(cur);

// ── Parse MCQs (Q1) ──
function parseMcq(lines) {
  const results = [];
  let i = 0;
  while (i < lines.length) {
    const rm = ROMAN_Q.exec(lines[i]);
    if (!rm) { i++; continue; }
    let qText = rm[2].replace(MARKS_END, '').trim();
    const opts = { a:'', b:'', c:'', d:'' };
    i++;
    while (i < lines.length) {
      const next = lines[i];
      if (ROMAN_Q.test(next)) break;
      if (/^p\.t\.o\.?$/i.test(next)) { i++; continue; }
      const pair = OPT_PAIR.exec(next);
      if (pair) { opts[pair[1].toLowerCase()] = pair[2].trim(); opts[pair[3].toLowerCase()] = pair[4].trim(); i++; continue; }
      const single = OPT_SINGLE.exec(next);
      if (single) { opts[single[1].toLowerCase()] = single[2].replace(MARKS_END,'').trim(); i++; continue; }
      if (!opts.a && !opts.b && !opts.c && !opts.d) qText += ' ' + next.replace(MARKS_END,'').trim();
      i++;
    }
    results.push({ qNum: `Q1${String.fromCharCode(97+results.length)}`, text: qText, opts });
  }
  return results;
}

// ── Parse descriptive (Q2-Q11) ──
function parseDesc(qNum, lines) {
  const parts = [];
  let i = 0;
  while (i < lines.length) {
    const sm = SUB_START.exec(lines[i]);
    if (!sm) { i++; continue; }
    const label = sm[1].toLowerCase();
    let textParts = [sm[2].replace(MARKS_END,'').trim()];
    const mm = MARKS_END.exec(sm[2]);
    let marks = mm ? parseInt(mm[1]) : 0;
    i++;
    while (i < lines.length) {
      const next = lines[i];
      if (SUB_START.test(next)) break;
      if (/^Q\s*\.?\s*\d/i.test(next)) break;
      if (ROMAN_SUB.test(next)) { textParts.push(next.replace(MARKS_END,'').trim()); i++; continue; }
      if (!marks) { const m2 = MARKS_END.exec(next); if (m2) marks = parseInt(m2[1]); }
      const clean = next.replace(MARKS_END,'').replace(/^\[\d{4}\]-\d{4}.*$/,'').trim();
      if (clean) textParts.push(clean);
      i++;
    }
    const text = textParts.join(' ').replace(/\s+/g,' ').trim();
    parts.push({ qNum: `Q${qNum}${label}`, text, marks: marks||(label==='a'?6:3) });
  }
  return parts;
}

// ── Run ──
console.log('\n══ Q1 MCQs ═══════════════════════════════════════\n');
const q1Block = blocks.find(b => b.qNum === 1);
const mcqs = q1Block ? parseMcq(q1Block.body) : [];
console.log(`Found ${mcqs.length} MCQs (expected 10)\n`);
for (const m of mcqs) {
  console.log(`${m.qNum}: ${m.text.slice(0,80)}…`);
  console.log(`  a) ${m.opts.a || '—'}   b) ${m.opts.b || '—'}`);
  console.log(`  c) ${m.opts.c || '—'}   d) ${m.opts.d || '—'}`);
}

console.log('\n══ Q2-Q11 Descriptive ═════════════════════════════\n');
const descBlocks = blocks.filter(b => b.qNum >= 2 && b.qNum <= 11);
const descs = descBlocks.flatMap(b => parseDesc(b.qNum, b.body));
console.log(`Found ${descs.length} sub-parts (expected 30)\n`);
for (const d of descs) {
  console.log(`${d.qNum} [${d.marks}m]: ${d.text.slice(0,90)}…`);
}
