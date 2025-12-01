export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
}

export type Priority = 'Low' | 'Medium' | 'High';
