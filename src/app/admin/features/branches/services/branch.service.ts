import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Branch, BranchForm } from '../interfaces/branch.interfaces';

const MOCK_BRANCHES: Branch[] = [
  {
    id: 'fe',
    name: 'First Year Engineering',
    shortName: 'FE',
    description: 'Common first year for all engineering branches under SPPU, covering foundational mathematics, sciences, and core engineering subjects.',
  },
  {
    id: 'ce',
    name: 'Computer Engineering',
    shortName: 'CE',
    description: 'Covers software development, algorithms, operating systems, networks, databases, and computer architecture.',
  },
  {
    id: 'it',
    name: 'Information Technology',
    shortName: 'IT',
    description: 'Focuses on information systems, networking, web technologies, and applied computing.',
  },
  {
    id: 'entc',
    name: 'Electronics and Telecommunication Engineering',
    shortName: 'ENTC',
    description: 'Specialises in electronics, communication systems, signal processing, and embedded technologies.',
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    shortName: 'ME',
    description: 'Covers design, manufacturing, thermodynamics, fluid mechanics, and production engineering.',
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    shortName: 'CIVIL',
    description: 'Focuses on structural analysis, construction materials, geotechnics, and infrastructure design.',
  },
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    shortName: 'EE',
    description: 'Covers power systems, control systems, electrical machines, and power electronics.',
  },
  {
    id: 'ai-ds',
    name: 'Artificial Intelligence and Data Science',
    shortName: 'AIDS',
    description: 'Emerging branch covering machine learning, deep learning, data analytics, and AI applications.',
  },
];

@Injectable({ providedIn: 'root' })
export class BranchService {
  private branches: Branch[] = [...MOCK_BRANCHES];

  getAll(): Observable<Branch[]> {
    return of([...this.branches]).pipe(delay(100));
  }

  create(form: BranchForm): Observable<Branch> {
    const branch: Branch = { id: crypto.randomUUID(), ...form };
    this.branches = [...this.branches, branch];
    return of(branch).pipe(delay(100));
  }

  update(branch: Branch): Observable<Branch> {
    this.branches = this.branches.map(b => b.id === branch.id ? branch : b);
    return of(branch).pipe(delay(100));
  }

  delete(id: string): Observable<void> {
    this.branches = this.branches.filter(b => b.id !== id);
    return of(void 0).pipe(delay(100));
  }
}
