import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { BlockType, EditorBlock } from '../../interfaces/answer.interfaces';
import { BlockItemComponent } from '../block-item/block-item.component';

interface BlockTypeOption {
  type: BlockType;
  label: string;
}

@Component({
  selector: 'app-block-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockItemComponent],
  templateUrl: './block-editor.component.html',
  styleUrl: './block-editor.component.scss',
})
export class BlockEditorComponent {
  readonly blocks = input<EditorBlock[]>([]);
  readonly blocksChange = output<EditorBlock[]>();

  readonly pickerIndex = signal<number | null>(null);

  readonly blockTypes: BlockTypeOption[] = [
    { type: 'header', label: 'Header' },
    { type: 'subHeader', label: 'Sub Header' },
    { type: 'text', label: 'Text' },
    { type: 'Olist', label: 'Ordered List' },
    { type: 'Ulist', label: 'Unordered List' },
    { type: 'table', label: 'Table' },
    { type: 'diagram', label: 'Diagram' },
    { type: 'sqlCode', label: 'SQL Code' },
  ];

  togglePicker(index: number): void {
    this.pickerIndex.set(this.pickerIndex() === index ? null : index);
  }

  private buildBlock(type: BlockType): EditorBlock {
    const _id = crypto.randomUUID();
    switch (type) {
      case 'header':
        return { type: 'header', data: '', _id };
      case 'subHeader':
        return { type: 'subHeader', data: '', _id };
      case 'text':
      case 'content':
        return { type: 'text', data: '', _id };
      case 'sqlCode':
        return { type: 'sqlCode', data: '', _id };
      case 'Olist':
        return {
          type: 'Olist',
          dataObject: { items: [{ text: '', subpointsObject: { subpoints: [] } }] },
          _id,
        };
      case 'Ulist':
        return {
          type: 'Ulist',
          dataObject: { items: [{ text: '', subpointsObject: { subpoints: [] } }] },
          _id,
        };
      case 'table':
        return {
          type: 'table',
          dataObject: {
            headers: ['Column 1', 'Column 2'],
            rows: [{ 'Column 1': '', 'Column 2': '' }],
          },
          _id,
        };
      case 'diagram':
        return { type: 'diagram', data: { url: '', description: '' }, _id };
    }
  }

  addBlock(type: BlockType, atIndex: number): void {
    const block = this.buildBlock(type);
    const next = [...this.blocks()];
    next.splice(atIndex, 0, block);
    this.pickerIndex.set(null);
    this.blocksChange.emit(next);
  }

  onBlockChange(updated: EditorBlock): void {
    const next = this.blocks().map(b => (b._id === updated._id ? updated : b));
    this.blocksChange.emit(next);
  }

  moveUp(index: number): void {
    if (index <= 0) return;
    const next = [...this.blocks()];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    this.blocksChange.emit(next);
  }

  moveDown(index: number): void {
    const next = [...this.blocks()];
    if (index >= next.length - 1) return;
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    this.blocksChange.emit(next);
  }

  duplicate(index: number): void {
    const next = [...this.blocks()];
    const copy: EditorBlock = {
      ...structuredClone(next[index]),
      _id: crypto.randomUUID(),
    };
    next.splice(index + 1, 0, copy);
    this.blocksChange.emit(next);
  }

  remove(index: number): void {
    const next = this.blocks().filter((_, i) => i !== index);
    this.blocksChange.emit(next);
  }

  toggleCollapse(block: EditorBlock): void {
    const next = this.blocks().map(b =>
      b._id === block._id ? { ...b, _collapsed: !b._collapsed } : b,
    );
    this.blocksChange.emit(next);
  }

  blockLabel(type: BlockType): string {
    return this.blockTypes.find(t => t.type === type)?.label ?? type;
  }

  trackByBlock(_: number, b: EditorBlock): string {
    return b._id;
  }
}
