import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  DiagramBlock,
  EditorBlock,
  HeaderBlock,
  ListBlock,
  ListItem,
  ListSubpoint,
  SqlCodeBlock,
  SubHeaderBlock,
  TableBlock,
  TextBlock,
} from '../../interfaces/answer.interfaces';

@Component({
  selector: 'app-block-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './block-item.component.html',
  styleUrl: './block-item.component.scss',
})
export class BlockItemComponent {
  readonly block = input.required<EditorBlock>();
  readonly blockChange = output<EditorBlock>();

  // ── Type narrowing helpers for the template ────────────────────────────────
  asHeader(b: EditorBlock): HeaderBlock {
    return b as HeaderBlock;
  }
  asSubHeader(b: EditorBlock): SubHeaderBlock {
    return b as SubHeaderBlock;
  }
  asText(b: EditorBlock): TextBlock {
    return b as TextBlock;
  }
  asSqlCode(b: EditorBlock): SqlCodeBlock {
    return b as SqlCodeBlock;
  }
  asList(b: EditorBlock): ListBlock {
    return b as ListBlock;
  }
  asTable(b: EditorBlock): TableBlock {
    return b as TableBlock;
  }
  asDiagram(b: EditorBlock): DiagramBlock {
    return b as DiagramBlock;
  }

  private emit(): void {
    this.blockChange.emit({ ...this.block() });
  }

  // ── Simple text-style blocks ────────────────────────────────────────────────
  onDataChange(value: string): void {
    const b = this.block() as HeaderBlock | SubHeaderBlock | TextBlock | SqlCodeBlock;
    b.data = value;
    this.emit();
  }

  // ── List editing ────────────────────────────────────────────────────────────
  onItemTextChange(item: ListItem, value: string): void {
    item.text = value;
    this.emit();
  }

  addItem(): void {
    const list = this.asList(this.block());
    list.dataObject.items = [
      ...list.dataObject.items,
      { text: '', subpointsObject: { subpoints: [] } },
    ];
    this.emit();
  }

  removeItem(index: number): void {
    const list = this.asList(this.block());
    list.dataObject.items = list.dataObject.items.filter((_, i) => i !== index);
    this.emit();
  }

  addSubpoint(item: ListItem): void {
    if (!item.subpointsObject) item.subpointsObject = { subpoints: [] };
    item.subpointsObject.subpoints = [...item.subpointsObject.subpoints, { text: '' }];
    this.emit();
  }

  onSubpointTextChange(sub: ListSubpoint, value: string): void {
    sub.text = value;
    this.emit();
  }

  removeSubpoint(item: ListItem, index: number): void {
    if (!item.subpointsObject) return;
    item.subpointsObject.subpoints = item.subpointsObject.subpoints.filter((_, i) => i !== index);
    this.emit();
  }

  // ── Table editing ───────────────────────────────────────────────────────────
  onHeaderChange(table: TableBlock, index: number, value: string): void {
    const oldKey = table.dataObject.headers[index];
    table.dataObject.headers[index] = value;
    table.dataObject.rows = table.dataObject.rows.map(row => {
      const next: Record<string, string> = { ...row };
      if (oldKey !== value) {
        next[value] = next[oldKey] ?? '';
        delete next[oldKey];
      }
      return next;
    });
    this.emit();
  }

  onCellChange(row: Record<string, string>, header: string, value: string): void {
    row[header] = value;
    this.emit();
  }

  cell(row: Record<string, string>, header: string): string {
    return row[header] ?? '';
  }

  addColumn(): void {
    const table = this.asTable(this.block());
    const name = `Column ${table.dataObject.headers.length + 1}`;
    table.dataObject.headers = [...table.dataObject.headers, name];
    table.dataObject.rows = table.dataObject.rows.map(r => ({ ...r, [name]: '' }));
    this.emit();
  }

  removeColumn(index: number): void {
    const table = this.asTable(this.block());
    const key = table.dataObject.headers[index];
    table.dataObject.headers = table.dataObject.headers.filter((_, i) => i !== index);
    table.dataObject.rows = table.dataObject.rows.map(r => {
      const next: Record<string, string> = { ...r };
      delete next[key];
      return next;
    });
    this.emit();
  }

  addRow(): void {
    const table = this.asTable(this.block());
    const row: Record<string, string> = {};
    table.dataObject.headers.forEach(h => (row[h] = ''));
    table.dataObject.rows = [...table.dataObject.rows, row];
    this.emit();
  }

  removeRow(index: number): void {
    const table = this.asTable(this.block());
    table.dataObject.rows = table.dataObject.rows.filter((_, i) => i !== index);
    this.emit();
  }

  // ── Diagram editing ─────────────────────────────────────────────────────────
  onDiagramUrlChange(value: string): void {
    this.asDiagram(this.block()).data.url = value;
    this.emit();
  }

  onDiagramDescChange(value: string): void {
    this.asDiagram(this.block()).data.description = value;
    this.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.asDiagram(this.block()).data.url = String(reader.result);
      this.emit();
    };
    reader.readAsDataURL(file);
  }
}
