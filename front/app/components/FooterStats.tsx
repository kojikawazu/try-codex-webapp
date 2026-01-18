import type { FilterType, SortType } from "../types";

type FooterStatsProps = {
  total: number;
  active: number;
  filter: FilterType;
  sort: SortType;
  storageStatus: "local" | "memory";
};

const FILTER_LABEL: Record<FilterType, string> = {
  all: "すべて",
  active: "未完了",
  completed: "完了",
};

const SORT_LABEL: Record<SortType, string> = {
  createdAt: "作成日",
  dueDate: "期限",
  priority: "優先度",
};

export default function FooterStats({
  total,
  active,
  filter,
  sort,
  storageStatus,
}: FooterStatsProps) {
  return (
    <div
      data-testid="footer-stats"
      className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 text-sm text-[var(--accent-2)] shadow-[0_18px_50px_rgba(19,16,12,0.06)] md:flex-row md:items-center md:justify-between"
    >
      <span>
        合計 {total} 件 / 未完了 {active} 件 / 表示: {FILTER_LABEL[filter]}
      </span>
      <span>
        ソート: {SORT_LABEL[sort]} / 保存: {storageStatus === "local" ? "LocalStorage" : "メモリ"}
      </span>
    </div>
  );
}
