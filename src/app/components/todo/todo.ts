import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
  SimpleChanges,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { Todo } from '../../types/todo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.html',
  styleUrls: ['./todo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnChanges {
  @Output() delete = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();
  @Output() rename = new EventEmitter<string>();
  @Output() prioritize = new EventEmitter<void>();
  @Output() priorityChange = new EventEmitter<'Low' | 'Medium' | 'High'>();

  @Input() todo!: Todo;

  @ViewChild('titleField')
  set titleField(field: ElementRef) {
    if (field) {
      field.nativeElement.focus();
    }
  }

  editing = false;
  title = '';
  dropdownOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    const todoChange = changes['todo'];

    if (todoChange) {
      this.title = todoChange.currentValue.title;
    }
  }

  edit() {
    this.editing = true;
    this.title = this.todo.title;
  }

  save() {
    if (!this.editing) {
      return;
    }

    this.editing = false;
    console.log('[TodoComponent] rename emit', this.todo?.id, this.title);
    this.rename.emit(this.title);
  }

  onToggle() {
    console.log('[TodoComponent] toggle emit', this.todo?.id);
    this.toggle.emit();
  }

  onDelete() {
    console.log('[TodoComponent] delete emit', this.todo?.id);
    this.delete.emit();
  }

  constructor(private host: ElementRef, private cdr: ChangeDetectorRef) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    console.log('[TodoComponent] dropdown toggled', this.todo?.id, this.dropdownOpen);
    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const el = this.host.nativeElement as HTMLElement;
    if (!el.contains(event.target as Node) && this.dropdownOpen) {
      this.dropdownOpen = false;
      this.cdr.markForCheck();
    }
  }

  setPriority(p: 'Low' | 'Medium' | 'High') {
    console.log('[TodoComponent] priorityChange emit', this.todo?.id, p);
    this.priorityChange.emit(p);
    this.dropdownOpen = false;
  }
}
