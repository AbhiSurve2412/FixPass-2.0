import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoadmapPhase } from '../../models/home.models';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [SectionHeaderComponent],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapComponent {
  readonly phases: RoadmapPhase[] = [
    {
      phase: 1,
      status: 'live',
      title: 'Study Material',
      features: [
        'Previous Year Papers',
        'Unit-wise Solved Questions',
        'Revision Notes',
        'Video Solutions',
        'Smart Analysis',
      ],
    },
    {
      phase: 2,
      status: 'coming-soon',
      title: 'Placement Material',
      features: [
        'DSA Practice',
        'Interview Experiences',
        'Aptitude & Reasoning',
      ],
    },
    {
      phase: 3,
      status: 'coming-soon',
      title: 'Jobs',
      features: [
        'Job Openings',
        'Internship Listings',
        'Job Alerts',
      ],
    },
    {
      phase: 4,
      status: 'coming-soon',
      title: 'Discussion Hub',
      features: [
        'Ask Questions',
        'Community Support',
        'AI Answers',
      ],
    },
    {
      phase: 5,
      status: 'coming-soon',
      title: 'Career Tools & Premium Plus',
      features: [
        'Resume Builder',
        'ATS Score Checker',
        'Cover Letter Generator',
      ],
    },
  ];

  trackByPhase(_: number, phase: RoadmapPhase): number {
    return phase.phase;
  }

  trackByFeature(index: number): number {
    return index;
  }
}
