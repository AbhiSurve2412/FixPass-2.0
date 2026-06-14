import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as katex from 'katex';
import { AnswerContent } from '../../interfaces/answer.interfaces';

@Component({
  selector: 'app-answer-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './answer-preview.component.html',
  styleUrl: './answer-preview.component.scss',
})
export class AnswerPreviewComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly content = input<AnswerContent | null>(null);
  readonly generating = input<boolean>(false);

  // Detect if a string contains LaTeX math syntax
  isMath(data: string): boolean {
    return /\\[a-zA-Z{]|\\frac|\\int|\\sum|\\sqrt|\\alpha|\\beta|\\gamma|\\delta|\\theta|\\lambda|\\mu|\\pi|\\sigma|\\omega|\^|\$/.test(data);
  }

  // Render a math block (display mode for full-line formulas)
  renderMath(data: string): SafeHtml {
    try {
      const html = katex.renderToString(data.trim(), {
        throwOnError: false,
        displayMode: true,
        output: 'html',
      });
      return this.sanitizer.bypassSecurityTrustHtml(html);
    } catch {
      return data;
    }
  }

  // Render text that may contain inline math ($...$) or display math ($$...$$)
  renderText(text: string): SafeHtml {
    if (!text.includes('$') && !this.isMath(text)) return text;
    try {
      const html = text
        .replace(/\$\$([^$]+)\$\$/g, (_, math) =>
          katex.renderToString(math, { throwOnError: false, displayMode: true, output: 'html' }))
        .replace(/\$([^$\n]+)\$/g, (_, math) =>
          katex.renderToString(math, { throwOnError: false, displayMode: false, output: 'html' }));
      return this.sanitizer.bypassSecurityTrustHtml(html);
    } catch {
      return text;
    }
  }

  hasMathInText(text: string): boolean {
    return text.includes('$') || this.isMath(text);
  }
}
