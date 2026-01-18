export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  completed: boolean;
  createdAt: string;
};

export type FilterType = "all" | "active" | "completed";
export type SortType = "createdAt" | "dueDate" | "priority";

export type NewTaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
};

export type TaskUpdate = NewTaskInput;
