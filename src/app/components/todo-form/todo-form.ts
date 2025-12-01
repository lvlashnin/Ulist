import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrls: ['./todo-form.scss'],
})
export class TodoForm {
  @Output() save = new EventEmitter<string>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const title = (this.form.value.title || '').trim();
    if (!title) return;
    this.save.emit(title);
    this.form.reset();
  }
}
