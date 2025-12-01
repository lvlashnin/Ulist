import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from './types/todo';
import { TodosService } from './services/todos';
import { MessageService } from './services/message';
import { TodoComponent } from './components/todo/todo';
import { TodoForm } from './components/todo-form/todo-form';
import { Filter } from './components/filter/filter';
import { Priority } from './types/todo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoComponent, TodoForm, Filter],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent implements OnInit {
  private _todos: Todo[] = [];
  activeTodos: Todo[] = [];
  viewTodos: Todo[] = [];
  currentFilter: 'all' | 'active' | 'completed' = 'all';
  currentSort: 'none' | 'priority' = 'none';
  errorMessage = '';

  get todos() {
    return this._todos;
  }

  set todos(todos: Todo[]) {
    if (todos === this._todos) {
      return;
    }

    this._todos = todos;
    this.activeTodos = this._todos.filter((todo) => !todo.completed);
    this.applyFilterAndSort();
  }

  constructor(
    private todosService: TodosService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.todosService.todos$.subscribe((todos) => {
      this.todos = todos;
    });

    this.todosService.todos$.subscribe((todos) => {
      this.todos = todos;
      this.cd.markForCheck();
    });

    this.todosService.loadTodos().subscribe({
      next: () => {
        this.applyFilterAndSort();
      },
      error: () => this.messageService.showMessage('Unable to load todos'),
    });
  }

  applyFilterAndSort() {
    let list = [...this._todos];

    if (this.currentFilter === 'active') {
      list = list.filter((t) => !t.completed);
    } else if (this.currentFilter === 'completed') {
      list = list.filter((t) => t.completed);
    }

    if (this.currentSort === 'priority') {
      const order = { High: 0, Medium: 1, Low: 2 } as Record<string, number>;
      list.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
    }

    this.viewTodos = list;
  }

  onFilterChange(filter: 'all' | 'active' | 'completed') {
    this.currentFilter = filter;
    this.applyFilterAndSort();
  }

  onSortChange(sort: 'none' | 'priority') {
    this.currentSort = sort;
    this.applyFilterAndSort();
  }

  trackById(i: number, todo: Todo) {
    return todo.id;
  }

  addTodo(newTitle: string) {
    this.todosService.createTodo(newTitle).subscribe({
      error: () => this.messageService.showMessage('Unable to add a todo'),
    });
    console.log('[AppComponent] addTodo', newTitle);
  }

  toggleTodo(todo: Todo) {
    this.todosService.updateTodo({ ...todo, completed: !todo.completed }).subscribe({
      error: () => this.messageService.showMessage('Unable to toggle a todo'),
    });
    console.log('[AppComponent] toggleTodo', todo.id);
  }

  renameTodo(todo: Todo, title: string) {
    this.todosService.updateTodo({ ...todo, title }).subscribe({
      error: () => this.messageService.showMessage('Unable to rename a todo'),
    });
    console.log('[AppComponent] renameTodo', todo.id, title);
  }

  deleteTodo(todo: Todo) {
    this.todosService.deleteTodo(todo).subscribe({
      error: () => this.messageService.showMessage('Unable to delete a todo'),
    });
  }

  updatePriority(todo: Todo, priority: Priority) {
    this.todosService.updateTodo({ ...todo, priority }).subscribe({
      error: () => this.messageService.showMessage('Unable to update priority'),
    });
  }
}

export const App = AppComponent;
