export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type Priority = 'high' | 'medium' | 'low';

export type SortOption = 'priority-asc' | 'priority-desc' | 'created-desc' | 'due-asc' | 'manual';


export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp of last update (Required now)
  dueDate?: number; // timestamp for deadline
  assignee?: string; // Optional assignee
  isFavorite?: boolean; // favorite status
  tags?: string[]; // tags for the task
  order?: number;
}

export type TasksState = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskOrder: (id: string, newOrder: number) => void;
  deleteTask: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearAllTasks: () => void;
  hasSeenTutorial: boolean;
  completeTutorial: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  resetTutorial: () => void;
};

