import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'none' | 'priority';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.html',
  styleUrls: ['./filter.scss'],
})
export class Filter {
  @Output() filterChange = new EventEmitter<TodoFilter>();
  @Output() sortChange = new EventEmitter<TodoSort>();

  active: TodoFilter = 'all';
  sorted: TodoSort = 'none';

  setFilter(f: TodoFilter) {
    this.active = f;
    this.filterChange.emit(f);
  }

  toggleSort() {
    this.sorted = this.sorted === 'none' ? 'priority' : 'none';
    this.sortChange.emit(this.sorted);
  }
}
