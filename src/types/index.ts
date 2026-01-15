export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: number; // timestamp
  updatedAt?: number; // timestamp of last update
  dueDate?: number; // timestamp for deadline
  isFavorite?: boolean; // favorite status
  tags?: string[]; // tags for the task
}

export type TasksState = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearAllTasks: () => void;
};
