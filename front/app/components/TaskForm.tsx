import { useState } from "react";
import type { NewTaskInput, Priority } from "../types";

type TaskFormProps = {
  onAdd: (input: NewTaskInput) => void;
};

const PRIORITY_OPTIONS: Array<{ label: string; value?: Priority }> = [
  { label: "未設定", value: undefined },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    onAdd({
      title: trimmedTitle,
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority: priority || undefined,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setError("");
  };

  return (
    <div className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_60px_rgba(19,16,12,0.08)]">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-2)]">
          New Task
        </p>
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">
          タスクを追加
        </h2>
        <p className="text-sm text-[var(--accent-2)]">
          タイトルと優先度だけでもOK。まずは出して整理する。
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit} data-testid="task-form">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            タイトル
          </label>
          <input
            data-testid="task-title-input"
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            placeholder="例: UIの要件をまとめる"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            説明
          </label>
          <textarea
            data-testid="task-description-input"
            className="min-h-[110px] w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            placeholder="状況や補足を簡潔に"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              期限
            </label>
            <input
              type="date"
              data-testid="task-due-input"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              優先度
            </label>
            <select
              data-testid="task-priority-select"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as Priority | "")
              }
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.label} value={option.value ?? ""}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error ? (
          <p
            data-testid="task-form-error"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
          >
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          data-testid="task-add-button"
          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(245,107,42,0.3)] transition hover:translate-y-[-1px]"
        >
          タスクを追加
        </button>
      </form>
    </div>
  );
}
