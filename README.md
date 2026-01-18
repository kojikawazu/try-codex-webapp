# Task Manager (Next.js)

ローカルファーストな個人向けタスク管理アプリ。素早い入力と確認、クリーンで
モダンな見た目に重点を置く。

## 目的
- Codexの動作確認・検証に使う（継続的に試す/保守する前提）。
- 日々のタスクを数秒で登録・確認できるようにする。
- PC/モバイル双方で読みやすく、シンプルなUIにする。
- MVPはローカル完結（認証なし、外部サービスなし）。

## 機能（MVP）
- タスク作成（タイトル必須、説明/期限/優先度は任意）
- 一覧表示（完了状態と主要メタ情報をカードで表示）
- 完了切り替え・内容編集
- 削除
- 完了/未完了フィルタ、期限/優先度ソート
- ローカル保存（LocalStorage）

## 技術スタック
- Next.js（App Router）
- TypeScript
- Tailwind CSS
- ESLint + Prettier

## データモデル（案）
- Task
  - id: string
  - title: string
  - description?: string
  - dueDate?: string（ISO）
  - priority?: "low" | "medium" | "high"
  - completed: boolean
  - createdAt: string（ISO）

## 画面
- 1ページ構成
  - ヘッダー: アプリ名、フィルタ/ソート
  - メイン: 入力フォーム + 一覧
  - 一覧: カードレイアウト

## 非機能要件
- レスポンシブ（モバイル/デスクトップ）
- 初期表示は概ね1秒以内を目標
- 余白・カード・タイポグラフィの統一感あるモダンUI

## 要件資料
- `docs/01-requirements.md`

## 開発
### セットアップ
1. 依存関係をインストール
2. 開発サーバー起動

### スクリプト
- `dev`: 開発サーバー起動
- `build`: 本番ビルド
- `start`: 本番サーバー起動
- `lint`: ESLint 実行
- `test:e2e`: Playwright E2E 実行
- `test:e2e:ui`: Playwright UI モード

## リポジトリ補足
- ローカル完結のMVP（認証なし）
- 外部サービス非利用
