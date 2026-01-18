import TaskCard from "./TaskCard";
import type { Task, TaskUpdate } from "../types";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, update: TaskUpdate) => void;
  onDelete: (id: string) => void;
};

export default function TaskList({
  tasks,
  onToggle,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div
        data-testid="task-empty-state"
        className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)]/60 px-6 py-12 text-center text-sm text-[var(--accent-2)]"
      >
        まだタスクがありません。左のフォームから追加してください。
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
