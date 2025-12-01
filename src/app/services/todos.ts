import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, withLatestFrom, tap } from 'rxjs';
import { Todo } from '../types/todo';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private api = `${environment.apiUrl}`;
  private todos$$ = new BehaviorSubject<Todo[]>([]);

  todos$ = this.todos$$.asObservable();

  constructor(private http: HttpClient) {}

  loadTodos() {
    return this.http.get<Todo[]>(`${this.api}/todos`).pipe(
      tap((todos) => {
        this.todos$$.next(todos);
      })
    );
  }

  createTodo(title: string) {
    const current = this.todos$$.getValue();
    const prev = [...current];
    const tempId = -Date.now();
    const tempTodo: Todo = {
      id: tempId as any,
      title,
      completed: false,
      priority: 'Low',
    } as Todo;

    this.todos$$.next([...current, tempTodo]);

    return this.http
      .post<Todo>(`${this.api}/todos`, {
        title,
        completed: false,
        priority: 'Low',
      })
      .pipe(
        withLatestFrom(this.todos$$),
        tap({
          next: ([createdTodo, todos]) => {
            this.todos$$.next(todos.map((t) => (t.id === tempId ? createdTodo : t)));
          },
          error: () => {
            this.todos$$.next(prev);
          },
        })
      );
  }

  updateTodo({ id, ...data }: Todo) {
    const current = this.todos$$.getValue();
    const prev = [...current];
    this.todos$$.next(
      current.map((todo) => (todo.id === id ? ({ ...todo, ...data } as Todo) : todo))
    );

    const updatedPayload: Todo = { id, ...data } as Todo;

    return this.http.put<Todo>(`${this.api}/todos/${id}`, updatedPayload).pipe(
      withLatestFrom(this.todos$$),
      tap({
        next: ([updatedTodo]) => {
          const now = this.todos$$.getValue();
          this.todos$$.next(now.map((t) => (t.id === id ? updatedTodo : t)));
        },
        error: () => {
          this.todos$$.next(prev);
        },
      })
    );
  }

  deleteTodo({ id }: Todo) {
    const current = this.todos$$.getValue();
    const prev = [...current];
    this.todos$$.next(current.filter((todo) => todo.id !== id));

    return this.http.delete<Todo>(`${this.api}/todos/${id}`).pipe(
      withLatestFrom(this.todos$$),
      tap({
        error: () => {
          this.todos$$.next(prev);
        },
      })
    );
  }
}

export { TodosService as Todos };
