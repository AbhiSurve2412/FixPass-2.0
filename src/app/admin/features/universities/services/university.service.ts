import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { University, UniversityForm } from '../interfaces/university.interfaces';

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_UNIVERSITIES: University[] = [
  {
    id: 'sppu',
    name: 'Savitribai Phule Pune University',
    description:
      'One of the premier universities in Maharashtra, established in 1949, offering a wide range of undergraduate and postgraduate programmes in science, technology, and humanities.',
  },
  {
    id: 'mu',
    name: 'Mumbai University',
    description:
      'University of Mumbai, established in 1857, is one of the oldest and largest universities in India, catering to a vast network of affiliated colleges across the Mumbai metropolitan region.',
  },
  {
    id: 'batu',
    name: 'Dr. Babasaheb Ambedkar Technological University',
    description:
      'BATU, established in 1989 at Lonere, is a specialised technological university in Maharashtra, focused exclusively on engineering, technology, and applied sciences.',
  },
];

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class UniversityService {
  private universities: University[] = [...MOCK_UNIVERSITIES];

  getAll(): Observable<University[]> {
    return of([...this.universities]).pipe(delay(100));
  }

  create(form: UniversityForm): Observable<University> {
    const university: University = { id: crypto.randomUUID(), ...form };
    this.universities = [...this.universities, university];
    return of(university).pipe(delay(100));
  }

  update(university: University): Observable<University> {
    this.universities = this.universities.map((u) =>
      u.id === university.id ? university : u,
    );
    return of(university).pipe(delay(100));
  }

  delete(id: string): Observable<void> {
    this.universities = this.universities.filter((u) => u.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
