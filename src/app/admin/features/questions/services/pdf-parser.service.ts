// SPPU 2024 FE paper layout:
//   Q1   — 10 compulsory MCQs (roman i–x, options a–d two-per-line)
//   Q2/3 — Unit 1 OR pair  (a[6] + b[3] + c[3])
//   Q4/5 — Unit 2 OR pair  …  Q10/11 — Unit 5 OR pair

import { Injectable } from '@angular/core';

import { Difficulty } from '../../../shared/interfaces/admin-shared.interfaces';
import { ExtractedQuestion, QuestionOption, QuestionType } from '../interfaces/question.interfaces';

interface TextItem { str: string; transform: number[] }
type QBlock = { qNum: number; body: string[] };

@Injectable({ providedIn: 'root' })
export class PdfParserService {

  async parseFile(file: File): Promise<ExtractedQuestion[]> {
    const lines = await this.extractLines(file);
    return this.parseSppuLines(lines);
  }

  private async extractLines(file: File): Promise<string[]> {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const data = await file.arrayBuffer();
    const pdf  = await pdfjsLib.getDocument({ data }).promise;
    const allLines: string[] = [];

    for (let p = 1; p <= pdf.numPages; p++) {
      const page    = await pdf.getPage(p);
      const content = await page.getTextContent();

      const lineMap = new Map<number, Array<{ x: number; text: string }>>();
      for (const raw of content.items) {
        const item = raw as TextItem;
        if (!item.str?.trim()) continue;
        const y = Math.round(item.transform[5] / 4) * 4;
        if (!lineMap.has(y)) lineMap.set(y, []);
        lineMap.get(y)!.push({ x: item.transform[4], text: item.str });
      }

      const pageLines = Array.from(lineMap.entries())
        .sort(([ya], [yb]) => yb - ya)
        .map(([, items]) =>
          items.sort((a, b) => a.x - b.x).map(i => i.text).join(' ').replace(/\s+/g, ' ').trim()
        )
        .filter(l => l.length > 1);

      allLines.push(...pageLines);
    }

    return allLines;
  }

  private parseSppuLines(lines: string[]): ExtractedQuestion[] {
    const Q_HEADER = /^Q\s*\.?\s*(?:No\.?\s*)?(\d{1,2})\s*[\).]?\s*(.*)/i;
    const OR_ONLY  = /^OR\s*$/i;
    const PAGE_NUM = /^\[\d{4}\]-\d{4}\s+\d+\s*$/;

    const blocks: QBlock[] = [];
    let cur: QBlock | null = null;

    for (const line of lines) {
      if (PAGE_NUM.test(line)) continue;

      const qm = Q_HEADER.exec(line);
      if (qm) {
        const rest = qm[2].trim();
        // "Q.No.10 or Q.No.11." in the instructions section matches Q_HEADER — skip it
        if (/^or\s+Q/i.test(rest)) { cur?.body.push(line); continue; }
        if (cur) blocks.push(cur);
        cur = { qNum: parseInt(qm[1], 10), body: rest ? [rest] : [] };
        continue;
      }

      if (OR_ONLY.test(line)) { if (cur) blocks.push(cur); cur = null; continue; }

      cur?.body.push(line);
    }
    if (cur) blocks.push(cur);
    if (blocks.length === 0) return [];

    const result: ExtractedQuestion[] = [];
    for (const block of blocks) {
      if (block.qNum === 1) {
        result.push(...this.parseMcqBlock(block.body));
      } else if (block.qNum >= 2 && block.qNum <= 11) {
        result.push(...this.parseDescriptiveBlock(block.qNum, block.body));
      }
    }
    return result;
  }

  private parseOptionLine(line: string): Record<string, string> {
    const result: Record<string, string> = {};
    const re = /([abcd])\)\s*(.+?)(?=\s+[abcd]\)|$)/gi;
    for (const m of line.matchAll(re)) {
      result[m[1].toLowerCase()] = m[2].trim();
    }
    return result;
  }

  private parseMcqBlock(lines: string[]): ExtractedQuestion[] {
    const ROMAN_Q = /^(i{1,3}|iv|v|vi{1,3}|ix|x)\s*[\).]\s*(.+)/i;
    const OPT_LINE = /^[abcd]\)\s*/i;
    const MARKS    = /\[(\d+)\]\s*$/;
    const results: ExtractedQuestion[] = [];
    let i = 0;

    while (i < lines.length) {
      const rm = ROMAN_Q.exec(lines[i]);
      if (!rm) { i++; continue; }

      let qText = rm[2].replace(MARKS, '').trim();
      const opts: Record<string, string> = { a: '', b: '', c: '', d: '' };
      i++;

      while (i < lines.length) {
        const next = lines[i];
        if (ROMAN_Q.test(next)) break;
        if (/^p\.t\.o\.?$/i.test(next)) { i++; continue; }
        if (OPT_LINE.test(next)) { Object.assign(opts, this.parseOptionLine(next)); i++; continue; }
        if (!opts['a'] && !opts['b'] && !opts['c'] && !opts['d']) {
          qText += ' ' + next.replace(MARKS, '').trim();
        }
        i++;
      }

      const options: QuestionOption[] = [
        { id: 'A', text: opts['a'] },
        { id: 'B', text: opts['b'] },
        { id: 'C', text: opts['c'] },
        { id: 'D', text: opts['d'] },
      ];
      const hasOpts = options.some(o => o.text.trim());

      results.push({
        id: crypto.randomUUID(),
        text: qText,
        estimatedMarks: 1,
        questionNumber: `Q1${String.fromCharCode(97 + results.length)}`,
        needsReview: !hasOpts,
        confidence: hasOpts ? 0.90 + Math.random() * 0.08 : 0.50,
        unitId: '',
        difficulty: 'Easy' as Difficulty,
        type: 'mcq' as QuestionType,
        isImportant: false,
        options,
        correctOptionId: '',
        imageUrls: [],
        tableHtml: '',
      });
    }

    return results;
  }

  private parseDescriptiveBlock(qNum: number, lines: string[]): ExtractedQuestion[] {
    const SUB_START  = /^([a-c])\s*[\).]\s*(.+)/i;
    const MARKS_END  = /\[(\d+)\]\s*$/;
    const ROMAN_ITEM = /^(i{1,3}|iv|v|vi{1,3}|ix|x)\s*[\).]\s*(.+)/i;

    const parts: { label: string; text: string; marks: number }[] = [];
    let i = 0;

    while (i < lines.length) {
      const sm = SUB_START.exec(lines[i]);
      if (!sm) { i++; continue; }

      const label      = sm[1].toLowerCase();
      const textParts  = [sm[2].replace(MARKS_END, '').trim()];
      let marks        = +(MARKS_END.exec(sm[2])?.[1] ?? 0);
      const romanItems: { text: string; marks: number }[] = [];
      i++;

      while (i < lines.length) {
        const next = lines[i];
        if (SUB_START.test(next) || /^Q\s*\.?\s*\d/i.test(next)) break;

        const ri = ROMAN_ITEM.exec(next);
        if (ri) {
          romanItems.push({
            text:  ri[2].replace(MARKS_END, '').trim(),
            marks: +(MARKS_END.exec(ri[2])?.[1] ?? 3),
          });
          i++;
          continue;
        }

        if (!marks) marks = +(MARKS_END.exec(next)?.[1] ?? 0);
        const clean = next.replace(MARKS_END, '').replace(/^\[\d{4}\]-\d{4}.*$/, '').trim();
        if (clean) textParts.push(clean);
        i++;
      }

      const text = textParts.join(' ').replace(/\s+/g, ' ').trim();

      if (romanItems.length >= 2) {
        // b) i) … ii) … expands to separate sub-parts b and c
        parts.push({ label, text: romanItems[0].text, marks: romanItems[0].marks });
        parts.push({ label: String.fromCharCode(label.charCodeAt(0) + 1), text: romanItems[1].text, marks: romanItems[1].marks });
      } else if (romanItems.length === 1) {
        parts.push({ label, text: `${text} ${romanItems[0].text}`.trim(), marks: marks || 3 });
      } else {
        parts.push({ label, text, marks: marks || (label === 'a' ? 6 : 3) });
      }
    }

    return parts.map(p => {
      const type    = this.inferType(p.text, p.marks);
      const flagged = p.text.length < 8;
      return {
        id: crypto.randomUUID(),
        text: p.text,
        estimatedMarks: p.marks,
        questionNumber: `Q${qNum}${p.label}`,
        needsReview: flagged,
        confidence: flagged ? 0.45 : 0.80 + Math.random() * 0.15,
        unitId: '',
        difficulty: (p.marks >= 6 ? 'Medium' : 'Easy') as Difficulty,
        type,
        isImportant: p.marks >= 6,
        options: [],
        correctOptionId: '',
        imageUrls: [],
        tableHtml: '',
      };
    });
  }

  private inferType(text: string, marks: number): QuestionType {
    const t = text.toLowerCase();
    if (/calculat|find the|determin|compute|\d+\s*(?:ml|gm|g|kg|mol|litre)/.test(t)) return 'numerical';
    if (/^define\b|^what is meant\b|^give the (?:meaning|definition)/.test(t) && marks <= 3) return 'definition';
    if (/short note|write a note|list (any|two|three|four|five)|briefly (?:explain|describe)|give (any|two|three) (?:characteristics|properties|advantages|applications)/.test(t) && marks <= 3) return 'short-note';
    return 'long-answer';
  }
}
