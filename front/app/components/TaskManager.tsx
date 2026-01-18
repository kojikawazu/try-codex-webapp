"use client";

import { useEffect, useMemo, useState } from "react";
import FooterStats from "./FooterStats";
import SummaryCards from "./SummaryCards";
import TaskFilters from "./TaskFilters";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import type {
  FilterType,
  NewTaskInput,
  SortType,
  Task,
  TaskUpdate,
} from "../types";

const STORAGE_KEY = "task-manager:v1";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const isStorageAvailable = () => {
  try {
    const testKey = "__task_manager_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const compareByCreatedAt = (a: Task, b: Task) =>
  b.createdAt.localeCompare(a.createdAt);

const compareByDueDate = (a: Task, b: Task) => {
  if (a.dueDate && b.dueDate) {
    return a.dueDate.localeCompare(b.dueDate);
  }
  if (a.dueDate) return -1;
  if (b.dueDate) return 1;
  return compareByCreatedAt(a, b);
};

const PRIORITY_SCORE: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const compareByPriority = (a: Task, b: Task) => {
  const scoreA = a.priority ? PRIORITY_SCORE[a.priority] ?? 0 : 0;
  const scoreB = b.priority ? PRIORITY_SCORE[b.priority] ?? 0 : 0;
  if (scoreA !== scoreB) {
    return scoreB - scoreA;
  }
  return compareByCreatedAt(a, b);
};

const getTodayLabel = () =>
  new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("createdAt");
  const [storageStatus, setStorageStatus] = useState<"local" | "memory">(
    "memory"
  );

  useEffect(() => {
    const canUseStorage = isStorageAvailable();
    setStorageStatus(canUseStorage ? "local" : "memory");

    if (!canUseStorage) return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Task[];
      setTasks(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (storageStatus !== "local") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, storageStatus]);

  const filteredTasks = useMemo(() => {
    const base = tasks.filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "active") return !task.completed;
      return true;
    });

    const sorted = [...base];
    if (sort === "createdAt") {
      sorted.sort(compareByCreatedAt);
    } else if (sort === "dueDate") {
      sorted.sort(compareByDueDate);
    } else {
      sorted.sort(compareByPriority);
    }

    return sorted;
  }, [tasks, filter, sort]);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = totalCount - completedCount;

  const handleAddTask = (input: NewTaskInput) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: createId(),
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      priority: input.priority,
      completed: false,
      createdAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleUpdate = (id: string, update: TaskUpdate) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...update } : task))
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-[var(--accent-2)] opacity-20 blur-3xl" />
        <div className="absolute right-[-10%] top-24 h-72 w-72 rounded-full bg-[var(--accent-3)] opacity-30 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(27,26,23,0.06) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      <main
        data-testid="task-manager"
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:px-10"
      >
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1 text-xs uppercase tracking-[0.24em] text-[var(--accent-2)]">
              Local First / Focus Mode
            </span>
            <h1 className="text-[clamp(2.4rem,4vw,3.6rem)] font-semibold leading-tight text-[var(--foreground)]">
              Task Manager
              <span className="block text-[clamp(1rem,2vw,1.2rem)] font-medium text-[var(--accent-2)]">
                仕事の流れを、静かに整える。
              </span>
            </h1>
          </div>
          <div className="flex flex-col gap-3 text-sm text-[var(--accent-2)]">
            <span className="text-xs uppercase tracking-[0.18em]">Today</span>
            <span className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-base font-semibold text-[var(--foreground)]">
              {getTodayLabel()}
            </span>
          </div>
        </header>

        <SummaryCards
          total={totalCount}
          active={activeCount}
          completed={completedCount}
        />

        <section className="grid gap-8 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <TaskForm onAdd={handleAddTask} />

          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_60px_rgba(19,16,12,0.08)] md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-2)]">
                  Filters
                </p>
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                  タスク一覧
                </h2>
              </div>
              <TaskFilters
                filter={filter}
                sort={sort}
                onFilterChange={setFilter}
                onSortChange={setSort}
              />
            </div>

            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />

            <FooterStats
              total={totalCount}
              active={activeCount}
              filter={filter}
              sort={sort}
              storageStatus={storageStatus}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
