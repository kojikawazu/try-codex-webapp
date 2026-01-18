# E2Eテスト導入手順（Playwright）

## 前提
- Node.js が利用可能
- `front/` 配下で実行

## インストール
```bash
cd front
npm install
npx playwright install
```

## 実行
```bash
npm run test:e2e
```

## UIモード
```bash
npm run test:e2e:ui
```

## 注意点
- テストは LocalStorage をクリアして開始します。
- 既存で `npm run dev` が動いている場合は再利用されます。
- 初回実行時はブラウザのダウンロードが発生します。
