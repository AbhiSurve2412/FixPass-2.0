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

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private questions: Question[] = [];

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
