import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { College, CollegeForm } from '../interfaces/college.interfaces';

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_COLLEGES: College[] = [
  {
    id: 'pccoe',
    name: "Pimpri Chinchwad College of Engineering",
    universityId: 'sppu',
    universityName: 'Savitribai Phule Pune University',
    description:
      'PCCOE is a premier engineering college affiliated to SPPU, located in Pune, known for its strong academic curriculum and vibrant campus life.',
  },
  {
    id: 'pict',
    name: 'Pune Institute of Computer Technology',
    universityId: 'sppu',
    universityName: 'Savitribai Phule Pune University',
    description:
      'PICT is a highly ranked autonomous engineering college in Pune, affiliated to SPPU, specialising in computer science and related disciplines.',
  },
  {
    id: 'dyp-akurdi',
    name: 'DY Patil College of Engineering, Akurdi',
    universityId: 'sppu',
    universityName: 'Savitribai Phule Pune University',
    description:
      'DY Patil Akurdi is a well-established engineering college affiliated to SPPU, offering a broad spectrum of engineering programmes.',
  },
  {
    id: 'mit-pune',
    name: 'MIT College of Engineering, Pune',
    universityId: 'sppu',
    universityName: 'Savitribai Phule Pune University',
    description:
      'MIT Pune is one of the oldest and most prestigious engineering colleges in Maharashtra, affiliated to SPPU, with a legacy spanning several decades.',
  },
  {
    id: 'vjti',
    name: 'Veermata Jijabai Technological Institute',
    universityId: 'mu',
    universityName: 'Mumbai University',
    description:
      'VJTI, established in 1887, is one of the oldest and most reputed technical institutes in India, affiliated to Mumbai University.',
  },
  {
    id: 'coet',
    name: 'College of Engineering and Technology, Lonere',
    universityId: 'batu',
    universityName: 'Dr. Babasaheb Ambedkar Technological University',
    description:
      'COET Lonere is a constituent college of BATU, offering engineering programmes in a focused technological learning environment.',
  },
];

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class CollegeService {
  private colleges: College[] = [...MOCK_COLLEGES];

  getAll(): Observable<College[]> {
    return of([...this.colleges]).pipe(delay(100));
  }

  create(form: CollegeForm): Observable<College> {
    const college: College = { id: crypto.randomUUID(), universityName: '', ...form };
    this.colleges = [...this.colleges, college];
    return of(college).pipe(delay(100));
  }

  update(college: College): Observable<College> {
    this.colleges = this.colleges.map((c) =>
      c.id === college.id ? college : c,
    );
    return of(college).pipe(delay(100));
  }

  delete(id: string): Observable<void> {
    this.colleges = this.colleges.filter((c) => c.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
