# 設計書（v0）

## 全体アーキテクチャ
- Next.js（App Router）を採用。
- UIはクライアントコンポーネント中心に構成。
- 状態管理は React hooks（useState / useMemo / useEffect）で完結。
- 永続化は LocalStorage を使用（利用不可時はメモリ保持）。

## 画面構成
- 1ページ構成（/）。
- レイアウトは「ヘッダー / サマリー / 入力フォーム / 一覧 / フッター」。

## コンポーネント構成
- `TaskManager`: 画面全体の状態管理、永続化、フィルタ/ソート。
- `TaskForm`: 新規タスク入力。
- `TaskFilters`: フィルタ/ソートUI。
- `TaskList`: リストの器と空状態。
- `TaskCard`: タスク表示とインライン編集。
- `SummaryCards`: 合計/未完了/完了のサマリー。
- `FooterStats`: 件数・フィルタ/ソート・保存状態。

## データ設計
- `Task`
  - id: string
  - title: string
  - description?: string
  - dueDate?: string (YYYY-MM-DD)
  - priority?: "low" | "medium" | "high"
  - completed: boolean
  - createdAt: string (ISO)

## 状態管理
- `tasks`: Task[]
- `filter`: "all" | "active" | "completed"
- `sort`: "createdAt" | "dueDate" | "priority"
- `storageStatus`: "local" | "memory"

## 永続化
- LocalStorage キー: `task-manager:v1`
- 初回ロード時に読み込み。
- 変更時は常に上書き保存。
- LocalStorage 利用不可時はメモリ保持し、ステータスに反映。

## フィルタ/ソート
- フィルタ: all / active / completed。
- ソート:
  - createdAt: 作成日時の新しい順
  - dueDate: 期限ありを優先し、同一条件は作成日時順
  - priority: high > medium > low > 未設定、同一条件は作成日時順

## バリデーション
- タイトル必須、最大80文字。
- 説明は任意、最大400文字。

## インライン編集
- TaskCard内で編集モードに切り替え。
- 保存時にバリデーションを実施。
- キャンセル時は元の値に戻す。

## UIガイドライン
- カード主体のレイアウト。
- 明確な余白とタイポグラフィ階層。
- アクセントカラーは温かみのあるオレンジ。

## 今後の拡張候補
- LocalStorageのスキーマバージョニング
- 期限切れの視覚的強調
- 検索・タグ・繰り返しタスク
