import { useCallback, useEffect, useState } from "react";
import type { Priority, Task, TaskUpdate } from "../types";

type TaskCardProps = {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, update: TaskUpdate) => void;
  onDelete: (id: string) => void;
};

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const PRIORITY_CLASS: Record<Priority, string> = {
  high: "bg-[var(--accent)] text-white",
  medium: "bg-[var(--accent-3)] text-[#5b3b00]",
  low: "bg-[var(--surface-muted)] text-[var(--accent-2)]",
};

export default function TaskCard({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [priority, setPriority] = useState<Priority | "">(
    task.priority ?? ""
  );
  const [error, setError] = useState("");

  const resetDraft = useCallback(() => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setDueDate(task.dueDate ?? "");
    setPriority(task.priority ?? "");
    setError("");
  }, [task]);

  useEffect(() => {
    if (!isEditing) {
      resetDraft();
    }
  }, [isEditing, resetDraft]);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("タイトルは必須です。");
      return;
    }
    if (trimmedTitle.length > 80) {
      setError("タイトルは80文字以内にしてください。");
      return;
    }
    if (description.trim().length > 400) {
      setError("説明は400文字以内にしてください。");
      return;
    }

    onUpdate(task.id, {
      title: trimmedTitle,
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority: priority || undefined,
    });
    setIsEditing(false);
  };

  return (
    <div
      data-testid="task-card"
      data-task-id={task.id}
      className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(19,16,12,0.07)] md:flex-row md:items-center md:justify-between"
    >
      <div className="flex flex-1 items-start gap-4">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? "未完了に戻す" : "完了にする"}
          data-testid="task-toggle"
          className={`mt-1 h-5 w-5 rounded-full border-2 transition ${
            task.completed
              ? "border-[var(--accent-2)] bg-[var(--accent-2)]"
              : "border-[var(--border)] bg-white"
          }`}
        />
        <div className="space-y-2">
          {isEditing ? (
            <div className="space-y-3">
              <input
                data-testid="task-edit-title"
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <textarea
                data-testid="task-edit-description"
                className="min-h-[88px] w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="date"
                  data-testid="task-edit-due"
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
                <select
                  data-testid="task-edit-priority"
                  className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as Priority | "")
                  }
                >
                  <option value="">未設定</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              {error ? (
                <p
                  data-testid="task-edit-error"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700"
                >
                  {error}
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <h3
                  className={`text-lg font-semibold ${
                    task.completed
                      ? "text-[var(--accent-2)] line-through opacity-70"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {task.title}
                </h3>
                {task.priority ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      PRIORITY_CLASS[task.priority]
                    }`}
                  >
                    {PRIORITY_LABEL[task.priority]}
                  </span>
                ) : (
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--accent-2)]">
                    未設定
                  </span>
                )}
              </div>
              {task.description ? (
                <p className="text-sm text-[var(--accent-2)]">
                  {task.description}
                </p>
              ) : null}
              <div className="flex items-center gap-3 text-xs text-[var(--accent-2)]">
                <span className="rounded-full border border-[var(--border)] px-3 py-1">
                  {task.dueDate ? `期限 ${task.dueDate}` : "期限なし"}
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">
                  インライン編集
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 md:flex-col md:items-end">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              data-testid="task-save"
              className="rounded-full border border-transparent bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:translate-y-[-1px]"
            >
              保存
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                resetDraft();
              }}
              data-testid="task-cancel"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--accent-2)] transition hover:border-[var(--accent-2)] hover:text-[var(--foreground)]"
            >
              キャンセル
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              data-testid="task-edit"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--accent-2)] transition hover:border-[var(--accent-2)] hover:text-[var(--foreground)]"
            >
              編集
            </button>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              data-testid="task-delete"
              className="rounded-full border border-transparent bg-[var(--surface-muted)] px-4 py-2 text-xs font-medium text-[var(--accent-2)] transition hover:bg-[var(--accent-3)] hover:text-[#5b3b00]"
            >
              削除
            </button>
          </>
        )}
      </div>
    </div>
  );
}
