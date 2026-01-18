import type { FilterType, SortType } from "../types";

type TaskFiltersProps = {
  filter: FilterType;
  sort: SortType;
  onFilterChange: (value: FilterType) => void;
  onSortChange: (value: SortType) => void;
};

const FILTERS: Array<{ label: string; value: FilterType }> = [
  { label: "すべて", value: "all" },
  { label: "未完了", value: "active" },
  { label: "完了", value: "completed" },
];

const SORTS: Array<{ label: string; value: SortType }> = [
  { label: "作成日", value: "createdAt" },
  { label: "期限", value: "dueDate" },
  { label: "優先度", value: "priority" },
];

export default function TaskFilters({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onFilterChange(item.value)}
            data-testid={`filter-${item.value}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === item.value
                ? "bg-[var(--foreground)] text-white"
                : "text-[var(--accent-2)] hover:text-[var(--foreground)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value as SortType)}
        data-testid="sort-select"
        className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-[var(--foreground)]"
      >
        {SORTS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
