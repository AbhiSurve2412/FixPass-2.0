import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  @Input() variant: 'light' | 'dark' = 'light';
  @Input() showWordmark = true;

  @HostBinding('class') get hostClass(): string {
    return `logo logo--${this.variant}`;
  }

  private static counter = 0;
  readonly gradientId = `fp-grad-${++LogoComponent.counter}`;
}
